import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mic, 
  Camera, 
  Settings,
  CheckCircle,
  X,
  Volume2,
  Headphones
} from 'lucide-react';
import { useVideoInterview } from '../Contexts/VideoInterviewContext';

const SystemCheck = ({ setShowSystemTest, setShowSetupModal }) => {  
  const [cameraPermission, setCameraPermission] = useState('pending');
  const [micPermission, setMicPermission] = useState('pending');
  const [audioLevel, setAudioLevel] = useState(0);
  const [isTesting, setIsTesting] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [micReady, setMicReady] = useState(false);
  const [testComplete, setTestComplete] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const isTestingRef = useRef(false);

  const { state, dispatch } = useVideoInterview();
  const Navigate = useNavigate();

  // Cleanup on unmount
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    
    return () => {
      document.body.classList.remove("overflow-hidden");
      cleanup();
    };
  }, []);

  // Handle video element when stream is available
  useEffect(() => {
    if (streamRef.current && videoRef.current && !cameraReady) {
      const video = videoRef.current;
      const stream = streamRef.current;
      
      // Only set if not already set
      if (video.srcObject !== stream) {
        video.srcObject = stream;
      }
      
      // Set up event listeners
      const handlePlaying = () => {
        setCameraReady(true);
        console.log('Camera preview is playing');
      };
      
      const handleLoadedMetadata = () => {
        console.log('Video metadata loaded');
        // Try to play if not already playing
        if (video.paused) {
          video.play().catch(err => {
            console.error("Error playing video:", err);
          });
        }
      };
      
      const handleError = (err) => {
        console.error("Video error:", err);
        setCameraPermission('denied');
      };
      
      video.addEventListener('playing', handlePlaying);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('error', handleError);
      
      // Try to play
      if (video.paused) {
        video.play().catch(err => {
          console.error("Error playing video:", err);
        });
      }
      
      // Cleanup listeners
      return () => {
        video.removeEventListener('playing', handlePlaying);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('error', handleError);
      };
    }
  }, [streamRef.current, cameraReady]);

  // Automatically show completion when both devices are ready
  useEffect(() => {
    if (cameraReady && micReady && isTesting && !testComplete) {
      setTestComplete(true);
    }
  }, [cameraReady, micReady, isTesting, testComplete]);

  const cleanup = () => {
    isTestingRef.current = false;
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const requestPermissions = async () => {
    try {
      setIsTesting(true);
      isTestingRef.current = true;
      setCameraReady(false);
      setMicReady(false);
      setTestComplete(false);
      setAudioLevel(0);

      // Request camera and microphone
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      streamRef.current = mediaStream;
      setCameraPermission('granted');
      setMicPermission('granted');

      // Set up camera preview
      if (videoRef.current) {
        const video = videoRef.current;
        video.srcObject = mediaStream;
        
        // Use event listeners to detect when video is actually playing
        const handleLoadedMetadata = () => {
          console.log('Video metadata loaded');
        };
        
        const handlePlaying = () => {
          setCameraReady(true);
          console.log('Camera preview started and playing');
          video.removeEventListener('playing', handlePlaying);
          video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        };
        
        const handleError = (err) => {
          console.error("Error playing video:", err);
          setCameraPermission('denied');
          video.removeEventListener('error', handleError);
        };
        
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('playing', handlePlaying);
        video.addEventListener('error', handleError);
        
        // Try to play
        video.play()
          .catch(err => {
            console.error("Error playing video:", err);
            setCameraPermission('denied');
          });
      }

      // Set up audio monitoring
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = audioContext;

        // Resume audio context if suspended
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }

        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.3;
        analyserRef.current = analyser;

        const microphone = audioContext.createMediaStreamSource(mediaStream);
        microphone.connect(analyser);

        // Start audio level monitoring
        const timeDataArray = new Uint8Array(analyser.fftSize);
        
        const updateAudioLevel = () => {
          if (!analyserRef.current || !isTestingRef.current) {
            return;
          }

          analyserRef.current.getByteTimeDomainData(timeDataArray);

          // Calculate RMS for volume
          let sumSquares = 0;
          for (let i = 0; i < timeDataArray.length; i++) {
            const normalized = (timeDataArray[i] - 128) / 128;
            sumSquares += normalized * normalized;
          }
          const rms = Math.sqrt(sumSquares / timeDataArray.length);
          const normalizedLevel = Math.min(100, (rms / 0.1) * 100);
          
          setAudioLevel(normalizedLevel);

          // Mark mic as ready if audio is detected
          if (normalizedLevel > 2) {
            setMicReady(true);
          }

          // Continue monitoring
          if (isTestingRef.current) {
            animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
          }
        };

        updateAudioLevel();
      } catch (audioError) {
        console.error("Audio setup error:", audioError);
        setMicPermission('denied');
      }

    } catch (error) {
      console.error("Error requesting permissions:", error);
      setCameraPermission('denied');
      setMicPermission('denied');
      setIsTesting(false);
      isTestingRef.current = false;

      if (error.name === 'NotAllowedError') {
        alert('Please allow camera and microphone access to continue.');
      } else if (error.name === 'NotFoundError') {
        alert('Camera or microphone not found. Please check your devices.');
      } else {
        alert('Error accessing camera or microphone: ' + error.message);
      }
    }
  };

  const handleTestAgain = () => {
    cleanup();
    setIsTesting(false);
    setCameraReady(false);
    setMicReady(false);
    setTestComplete(false);
    setAudioLevel(0);
    setCameraPermission('pending');
    setMicPermission('pending');
  };

  const completeSystemTest = async () => {
    cleanup();
    setButtonPressed(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // HR/Technical with ShowResume go to popup-template page
    if (state.interviewType === 'ShowResume') {
      Navigate('/popup-template'); 
    } else if (state.session === 'Case Study Interview') {
      // Only Case Study Interview shows PopupForm modal
      setShowSystemTest(false);
      setShowSetupModal(true);
    } else {
      // For Coding Interview and other NoResume interviews, go directly to interview interface
      Navigate('/interview-interface');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 body-color">
      <div className="bg-white rounded-xl p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-4 relative">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Settings className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">System Check</h2>
          <p className="text-gray-600 text-sm">Let's make sure everything is working properly</p>
          <X 
            className="absolute right-2 text-gray-600 top-2 w-4 h-4 cursor-pointer hover:text-gray-800"
            onClick={() => {
              cleanup();
              setShowSystemTest(false);
            }}
          />
        </div>

        {/* Single Step - All Testing */}
        <div className="space-y-4">
          {/* Access Status Indicators - Top Row */}
          {isTesting && (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Camera className={`h-5 w-5 ${
                    cameraPermission === 'granted' ? 'text-green-600' :
                    cameraPermission === 'denied' ? 'text-red-600' : 'text-gray-600'
                  }`} />
                  <span className="text-gray-900">Camera Access</span>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  cameraPermission === 'granted' ? 'bg-green-500' :
                  cameraPermission === 'denied' ? 'bg-red-500' : 'bg-gray-300'
                }`}></div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Mic className={`h-5 w-5 ${
                    micPermission === 'granted' ? 'text-green-600' :
                    micPermission === 'denied' ? 'text-red-600' : 'text-gray-600'
                  }`} />
                  <span className="text-gray-900">Microphone Access</span>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  micPermission === 'granted' ? 'bg-green-500' :
                  micPermission === 'denied' ? 'bg-red-500' : 'bg-gray-300'
                }`}></div>
              </div>
            </div>
          )}

          {/* Camera Preview and Audio Test - Side by Side */}
          {isTesting && (cameraPermission === 'granted' || micPermission === 'granted') && (
            <div className="grid grid-cols-[1.5fr_1fr] gap-4">
              {/* Camera Preview - Left Column */}
              {cameraPermission === 'granted' && (
                <div className="space-y-2 flex flex-col">
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <Camera className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-900 font-medium">Camera Preview</span>
                    {cameraReady && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <div className="relative bg-gray-900 rounded-lg overflow-hidden flex-1" style={{ aspectRatio: '4/3', minHeight: 0 }}>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    {!cameraReady && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                        <div className="text-white text-xs">Loading camera...</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Audio Level Test - Right Column (Vertical Meter) */}
              {micPermission === 'granted' && (
                <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-2 mb-2 flex-shrink-0">
                    <Volume2 className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-900 font-medium">Audio Level Test</span>
                    {micReady && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  
                  {/* Vertical Audio Meter - Matches camera preview height */}
                  <div className="flex-1 p-3 bg-blue-50 rounded-lg flex flex-col items-center justify-center space-y-3 min-h-0">
                    {/* Vertical Audio Meter */}
                    <div className="relative w-12 h-full bg-gray-200 rounded-full overflow-hidden flex flex-col justify-end">
                      {/* Audio level fill */}
                      <div 
                        className="w-full transition-all duration-75 ease-out rounded-full"
                        style={{
                          height: `${Math.max(5, Math.min(100, audioLevel))}%`,
                          background: audioLevel > 50 
                            ? 'linear-gradient(to top, #10b981, #34d399)' 
                            : audioLevel > 25 
                            ? 'linear-gradient(to top, #3b82f6, #60a5fa)' 
                            : 'linear-gradient(to top, #60a5fa, #93c5fd)',
                          minHeight: '4px'
                        }}
                      />
                      
                      {/* Level markers */}
                      <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none">
                        <div className="w-full border-t border-gray-400 opacity-30"></div>
                        <div className="w-full border-t border-gray-400 opacity-30"></div>
                        <div className="w-full border-t border-gray-400 opacity-30"></div>
                      </div>
                    </div>
                    
                    {/* Audio level percentage */}
                    <div className="text-sm font-semibold text-blue-700 flex-shrink-0">
                      {Math.round(audioLevel)}%
                    </div>
                    
                    {/* Headphones indicator */}
                    <div className="flex items-center space-x-1.5 text-xs text-blue-600 mt-1 flex-shrink-0">
                      <Headphones className="h-3.5 w-3.5" />
                      <span>Use headphones for best experience</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Test Complete Message */}
          {testComplete && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-green-800 mb-2">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">System Check Complete!</span>
              </div>
              <p className="text-green-700 text-sm">
                Your camera and microphone are working properly. You can proceed with the interview.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {!isTesting ? (
              <button
                onClick={requestPermissions}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Start System Check
              </button>
            ) : (
              <div className="space-y-2">
                {!testComplete ? (
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-3">
                      {cameraReady && micReady 
                        ? "✓ Testing complete!" 
                        : cameraReady 
                        ? "✓ Camera ready. Speak to test microphone..." 
                        : micReady 
                        ? "✓ Microphone ready. Waiting for camera..." 
                        : "Testing your devices..."}
                    </div>
                    <button
                      onClick={handleTestAgain}
                      className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Test Again
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-3">
                    <button
                      onClick={handleTestAgain}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Test Again
                    </button>
                    <button
                      onClick={completeSystemTest}
                      disabled={buttonPressed}
                      className={`flex-1 bg-blue-600 ${buttonPressed ? "animate-pulse cursor-not-allowed" : ""} text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors`}
                    >
                      {buttonPressed ? "Loading..." : "Continue"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemCheck;
