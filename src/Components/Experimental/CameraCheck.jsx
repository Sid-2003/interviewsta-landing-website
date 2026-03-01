import { useEffect, useRef, useState } from "react";
import { FaceDetection } from "@mediapipe/face_detection";
import { Camera } from "@mediapipe/camera_utils";

export default function CameraCheck() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [faceStatus, setFaceStatus] = useState("Detecting...");
  const [lightStatus, setLightStatus] = useState("Checking...");

  useEffect(() => {
    const faceDetection = new FaceDetection({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
    });

    faceDetection.setOptions({
      model: "short",
      minDetectionConfidence: 0.6,
    });

    faceDetection.onResults((results) => {
      if (!results.detections || results.detections.length === 0) {
        setFaceStatus("❌ No face detected");
        return;
      }

      const box = results.detections[0].boundingBox;
      const { xMin, width } = box;

      if (xMin < 0.1 || xMin + width > 0.9) {
        setFaceStatus("⚠️ Please center your face");
      } else {
        setFaceStatus("✅ Face in frame");
      }
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await faceDetection.send({ image: videoRef.current });
        checkLighting();
      },
      width: 640,
      height: 480,
    });

    camera.start();

    return () => camera.stop();
  }, []);

  const checkLighting = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = 640;
    canvas.height = 480;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    let brightnessSum = 0;
    for (let i = 0; i < data.length; i += 4) {
      brightnessSum += (data[i] + data[i + 1] + data[i + 2]) / 3;
    }

    const avgBrightness = brightnessSum / (data.length / 4);

    if (avgBrightness < 50) setLightStatus("❌ Too dark");
    else if (avgBrightness > 200) setLightStatus("⚠️ Too bright");
    else setLightStatus("✅ Lighting OK");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold text-orange-500">
        Camera Readiness Check
      </h1>

      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="rounded-lg border border-gray-700 w-[640px]"
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="flex gap-6 text-lg">
        <span>{faceStatus}</span>
        <span>{lightStatus}</span>
      </div>

      <p className="text-sm text-gray-400">
        Please ensure your face is centered and the room is well-lit
      </p>
    </div>
  );
}
