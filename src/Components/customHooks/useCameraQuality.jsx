// import { useEffect, useRef } from "react";
// import { FaceDetection } from "@mediapipe/face_detection";

// export function useCameraQualityCheck({
//   webcamRef,
//   enabled,
//   setQualityWarning,
//   socketRef,
// }) {
//   const canvasRef = useRef(document.createElement("canvas"));
//   const samplesRef = useRef([]);
//   const faceDetectorRef = useRef(null);
//   const stoppedRef = useRef(false);

//   function getLighting(video, canvas) {
//     const ctx = canvas.getContext("2d");
//     canvas.width = 320;
//     canvas.height = 240;

//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//     const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

//     let sum = 0;
//     for (let i = 0; i < data.length; i += 4) {
//       sum += (data[i] + data[i + 1] + data[i + 2]) / 3;
//     }

//     const avg = sum / (data.length / 4);

//     if (avg < 50) return "dark";
//     if (avg > 200) return "bright";
//     return "ok";
//   }

//   function aggregate(samples) {
//     if (!samples.length) {
//       return {
//         face: "no_face",
//         lighting: "unknown",
//         confidence: 0,
//         timestamp: Date.now(),
//       };
//     }

//     const faceRatio =
//       samples.filter(s => s.face === "ok").length / samples.length;
//     const lightingRatio =
//       samples.filter(s => s.lighting === "ok").length / samples.length;

//     return {
//       face: faceRatio > 0.7 ? "ok" : "no_face",
//       lighting: lightingRatio > 0.7 ? "ok" : "bad",
//       confidence: Math.min(faceRatio, lightingRatio),
//       timestamp: Date.now(),
//     };
//   }

//   // ✅ Create detector ONCE
//   useEffect(() => {
//     if (!enabled || faceDetectorRef.current) return;

//     const detector = new FaceDetection({
//       locateFile: (file) =>
//         `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file.replace("simd", "")}`,
//     });

//     detector.setOptions({
//       model: "short",
//       minDetectionConfidence: 0.6,
//     });

//     detector.onResults((results) => {
//       if (stoppedRef.current || !webcamRef.current) return;

//       samplesRef.current.push({
//         face: results.detections?.length ? "ok" : "no_face",
//         lighting: getLighting(webcamRef.current, canvasRef.current),
//         ts: Date.now(),
//       });
//     });

//     faceDetectorRef.current = detector;

//     return () => {
//       detector.close(); // 🔥 CRITICAL
//       faceDetectorRef.current = null;
//     };
//   }, [enabled]);

//   // ✅ Sampling loop (no re-instantiation)
//   useEffect(() => {
//     if (!enabled || !webcamRef.current || !faceDetectorRef.current) return;

//     stoppedRef.current = false;

//     const interval = setInterval(() => {
//       faceDetectorRef.current?.send({ image: webcamRef.current });
//     }, 400);

//     const timeout = setTimeout(() => {
//       stoppedRef.current = true;
//       clearInterval(interval);

//       const verdict = aggregate(samplesRef.current);
//       samplesRef.current = [];

//       setQualityWarning(verdict);

//       if (socketRef?.current?.readyState === WebSocket.OPEN) {
//         socketRef.current.send(JSON.stringify({
//           type: "video_quality_sample",
//           data: verdict,
//         }));
//       }
//     }, 10_000);

//     return () => {
//       stoppedRef.current = true;
//       clearInterval(interval);
//       clearTimeout(timeout);
//     };
//   }, [enabled, webcamRef]);
// }


import { useEffect, useRef } from "react";
import {
  FaceLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

import { postVideoTelemetry } from "../../api/interviewService";

export function useCameraQualityCheck({
  webcamRef,
  enabled,
  setQualityWarning,
  sessionIdRef,
}) {
  const landmarkerRef = useRef(null);

  const blinkCountRef = useRef(0);
  const lastClosedRef = useRef(false);

  const lastSendTimeRef = useRef(0);
  const noFaceStartTimeRef = useRef(null);
  const faceVisibleStartTimeRef = useRef(null);
  const warningTimeoutRef = useRef(null);
  const clearTimeoutRef = useRef(null);

  // Rolling window for soft skills (60 seconds)
  const samplesWindowRef = useRef([]);
  const WINDOW_DURATION_MS = 60000;

  // Track head pose for movement analysis
  const previousHeadPosesRef = useRef([]);
  const MAX_POSE_HISTORY = 30; // Keep last 30 poses (~1 second at 30fps)

  async function initFaceLandmarker() {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    landmarkerRef.current = await FaceLandmarker.createFromOptions(
      vision,
      {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",
        },
        outputFaceBlendshapes: true,
        runningMode: "VIDEO",
        numFaces: 1,
      }
    );
  }

  function earFromLandmarks(lm, ids) {
    const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
    const [p1, p2, p3, p4, p5, p6] = ids.map((i) => lm[i]);

    const A = dist(p2, p6);
    const B = dist(p3, p5);
    const C = dist(p1, p4);

    return (A + B) / (2 * C);
  }

  // Remove old samples outside the 60s window
  function pruneSamplesWindow() {
    const now = Date.now();
    samplesWindowRef.current = samplesWindowRef.current.filter(
      sample => now - sample.timestamp < WINDOW_DURATION_MS
    );
  }

  // Compute soft skills from rolling window
  function computeSoftSkills() {
    pruneSamplesWindow();
    const samples = samplesWindowRef.current;
    
    if (samples.length === 0) {
      return {
        gaze: 50,
        confidence: 50,
        nervousness: 50,
        engagement: 50,
        distraction: 50,
      };
    }

    // Gaze: Based on head pose direction (0-100, higher = better eye contact)
    // Center head pose indicates good gaze
    const gazeScores = samples
      .filter(s => s.headPose)
      .map(s => {
        const x = Math.abs(s.headPose.x);
        const y = Math.abs(s.headPose.y);
        const deviation = Math.sqrt(x * x + y * y);
        // Normalize: 0 deviation = 100, 0.2 deviation = 0
        return Math.max(0, Math.min(100, 100 - (deviation * 500)));
      });
    const gaze = gazeScores.length > 0 
      ? gazeScores.reduce((a, b) => a + b, 0) / gazeScores.length 
      : 50;

    // Confidence: Based on eye open probability, stable head position, low blink rate
    const eyeOpenProbs = samples.filter(s => s.eyeOpenProbability !== undefined).map(s => s.eyeOpenProbability);
    const avgEyeOpen = eyeOpenProbs.length > 0 
      ? eyeOpenProbs.reduce((a, b) => a + b, 0) / eyeOpenProbs.length 
      : 0.5;
    
    // Head stability (lower variance = more stable = more confident)
    const headPoses = samples.filter(s => s.headPose).map(s => s.headPose);
    let headStability = 100;
    if (headPoses.length > 1) {
      const xVars = headPoses.map(p => p.x);
      const yVars = headPoses.map(p => p.y);
      const xVariance = calculateVariance(xVars);
      const yVariance = calculateVariance(yVars);
      const totalVariance = xVariance + yVariance;
      // Normalize: 0 variance = 100, high variance = lower score
      headStability = Math.max(0, 100 - (totalVariance * 1000));
    }

    // Blink rate (normalized: ~20 blinks/min = 100, very high = lower confidence)
    const timeSpan = samples.length > 1 
      ? samples[samples.length - 1].timestamp - samples[0].timestamp 
      : 1;
    const blinksPerMinute = timeSpan > 0 
      ? (samples[samples.length - 1]?.blinkRate || 0) / (timeSpan / 60000)
      : 20;
    const blinkRate = Math.round(blinksPerMinute); // Store raw blink rate per minute
    const blinkScore = Math.max(0, Math.min(100, 100 - Math.abs(blinksPerMinute - 20) * 2));

    const confidence = (avgEyeOpen * 40 + headStability * 0.3 + blinkScore * 0.3);

    // Nervousness: Higher blink rate, more head movement, lower eye open
    const nervousnessBlink = Math.min(100, blinksPerMinute * 3); // >33 blinks/min = 100
    const nervousnessMovement = 100 - headStability;
    const nervousnessEye = 100 - (avgEyeOpen * 100);
    const nervousness = (nervousnessBlink * 0.4 + nervousnessMovement * 0.3 + nervousnessEye * 0.3);

    // Engagement: Eye open probability, looking forward (good gaze), presence
    const engagementGaze = gaze;
    const engagementEye = avgEyeOpen * 100;
    const presence = samples.filter(s => s.framePresent).length / samples.length * 100;
    const engagement = (engagementGaze * 0.4 + engagementEye * 0.4 + presence * 0.2);

    // Distraction: Head movements away from center, looking away
    const distractionFromGaze = 100 - gaze;
    const distractionFromMovement = 100 - headStability;
    const distraction = (distractionFromGaze * 0.6 + distractionFromMovement * 0.4);

    return {
      gaze: Math.round(gaze),
      confidence: Math.round(confidence),
      nervousness: Math.round(nervousness),
      engagement: Math.round(engagement),
      distraction: Math.round(distraction),
      blinkRate,
      headStability: Math.round(headStability),
    };
  }

  // Compute Big-5 features from soft skills
  function computeBig5Features(softSkills) {
    return {
      gaze: softSkills.gaze,
      confidence: softSkills.confidence,
      nervousness: softSkills.nervousness,
      engagement: softSkills.engagement,
      distraction: softSkills.distraction,
      blinkRate: softSkills.blinkRate,
      headStability: softSkills.headStability,
    };
  }

  function calculateVariance(values) {
    if (values.length === 0) return 0;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squareDiffs = values.map(value => Math.pow(value - mean, 2));
    return squareDiffs.reduce((a, b) => a + b, 0) / values.length;
  }

  // Store final summary in localStorage
  function storeFinalSummary() {
    const softSkills = computeSoftSkills();
    const big5Features = computeBig5Features(softSkills);
    const summary = {
      timestamp: Date.now(),
      ...softSkills,
      duration: samplesWindowRef.current.length > 1
        ? samplesWindowRef.current[samplesWindowRef.current.length - 1].timestamp - 
          samplesWindowRef.current[0].timestamp
        : 0,
    };
    
    try {
      localStorage.setItem("soft_skill_summary", JSON.stringify(summary));
      localStorage.setItem("big5_features", JSON.stringify(big5Features));
      console.log('Stored soft skill summary:', summary);
      console.log('Stored Big-5 features:', big5Features);
    } catch (e) {
      console.error('Failed to store summaries:', e);
    }
  }

  useEffect(() => {
    if (!enabled) return;

    let raf;
    let initialized = false;

    (async () => {
      await initFaceLandmarker();
      initialized = true;

      const loop = () => {
        if (!initialized || !webcamRef.current || !landmarkerRef.current) {
          raf = requestAnimationFrame(loop);
          return;
        }

        const video = webcamRef.current;
        if (video.readyState < 2) {
          raf = requestAnimationFrame(loop);
          return;
        }

        const results = landmarkerRef.current.detectForVideo(
          video,
          performance.now()
        );

        const facePresent =
          results?.faceLandmarks && results.faceLandmarks.length > 0;

        if (!facePresent) {
          // Face not visible - track start time
          if (noFaceStartTimeRef.current === null) {
            noFaceStartTimeRef.current = Date.now();
          }
          
          // Clear any pending clear timeout
          if (clearTimeoutRef.current) {
            clearTimeoutRef.current = null;
          }
          
          // Check if 2 seconds have passed
          const timeSinceNoFace = Date.now() - noFaceStartTimeRef.current;
          if (timeSinceNoFace >= 2000 && !warningTimeoutRef.current) {
            // Set warning after 2 seconds
            setQualityWarning?.({
              framePresent: false,
              timestamp: Date.now(),
            });
            warningTimeoutRef.current = true; // Mark that warning is set
          }
          
          // Reset face visible tracking
          faceVisibleStartTimeRef.current = null;
          
          // Store no-face sample
          const noFaceSample = {
            framePresent: false,
            timestamp: Date.now(),
          };
          samplesWindowRef.current.push(noFaceSample);
          
          // Still send telemetry every 10 seconds
          maybeSend(noFaceSample);
          
          raf = requestAnimationFrame(loop);
          return;
        }
        
        // Face is present
        // Reset no face tracking
        noFaceStartTimeRef.current = null;
        warningTimeoutRef.current = null; // Reset warning flag so it can trigger again if face disappears
        
        // Track when face becomes visible
        if (faceVisibleStartTimeRef.current === null) {
          faceVisibleStartTimeRef.current = Date.now();
        }
        
        // Check if 1 second has passed with face visible
        const timeSinceFaceVisible = Date.now() - faceVisibleStartTimeRef.current;
        if (timeSinceFaceVisible >= 1000) {
          // Clear warning immediately after 1 second (only if not already cleared)
          if (clearTimeoutRef.current === null) {
            setQualityWarning?.({
              framePresent: true,
              timestamp: Date.now(),
            });
            clearTimeoutRef.current = true; // Mark that clear is done
          }
          faceVisibleStartTimeRef.current = null;
        }

        const lm = results.faceLandmarks[0];

        // EAR
        const leftEAR = earFromLandmarks(lm, [
          33, 160, 158, 133, 153, 144,
        ]);

        const rightEAR = earFromLandmarks(lm, [
          362, 385, 387, 263, 373, 380,
        ]);

        const ear = (leftEAR + rightEAR) / 2;

        const eyeOpenProbability = Math.min(
          Math.max((ear - 0.18) * 9.0, 0),
          1
        );

        // blinking
        const blinkThreshold = 0.22;

        if (ear < blinkThreshold && !lastClosedRef.current) {
          blinkCountRef.current += 1;
          lastClosedRef.current = true;
        }

        if (ear >= blinkThreshold) lastClosedRef.current = false;

        // head pose
        const nose = lm[1];
        const leftEye = lm[33];
        const rightEye = lm[263];
        const leftEar = lm[234];
        const rightEar = lm[454];

        const headPose = {
          x: nose.x - (leftEye.x + rightEye.x) / 2,
          y: nose.y - (leftEar.y + rightEar.y) / 2,
          z: rightEye.x - leftEye.x,
        };

        // Store sample in rolling window
        const sample = {
          framePresent: true,
          eyeOpenProbability,
          blinkRate: blinkCountRef.current,
          headPose,
          timestamp: Date.now(),
        };
        samplesWindowRef.current.push(sample);
        
        // Maintain head pose history for movement analysis
        previousHeadPosesRef.current.push(headPose);
        if (previousHeadPosesRef.current.length > MAX_POSE_HISTORY) {
          previousHeadPosesRef.current.shift();
        }

        // Send combined telemetry every 10 seconds
        maybeSend(sample);

        raf = requestAnimationFrame(loop);
      };

      raf = requestAnimationFrame(loop);
    })();

    function maybeSend(data) {
      const now = Date.now();

      // 10 seconds debounce
      if (now - lastSendTimeRef.current < 10000) return;

      lastSendTimeRef.current = now;

      // Compute soft skills from rolling window
      const softSkills = computeSoftSkills();

      // Compute Big-5 features
      const big5Features = computeBig5Features(softSkills);

      // Determine face status
      const faceDetected = data.framePresent;
      const face = faceDetected ? "ok" : "lost";

      // Build payload (flat object for FastAPI video-telemetry)
      const payload = {
        face,
        gaze: softSkills.gaze,
        confidence: softSkills.confidence,
        nervousness: softSkills.nervousness,
        engagement: softSkills.engagement,
        distraction: softSkills.distraction,
        big5_features: big5Features,
      };

      console.log("Sending behavioral telemetry:", payload);

      setQualityWarning?.(data);

      const sessionId = sessionIdRef?.current;
      if (sessionId) {
        postVideoTelemetry(sessionId, payload);
      }
    }

    return () => {
      cancelAnimationFrame(raf);
      warningTimeoutRef.current = null;
      clearTimeoutRef.current = null;
      noFaceStartTimeRef.current = null;
      faceVisibleStartTimeRef.current = null;
    };
  }, [enabled, webcamRef, sessionIdRef]);

  // Store final summary when interview ends (enabled becomes false)
  useEffect(() => {
    return () => {
      // This cleanup runs when enabled changes or component unmounts
      if (samplesWindowRef.current.length > 0) {
        storeFinalSummary();
      }
    };
  }, [enabled]);
}
