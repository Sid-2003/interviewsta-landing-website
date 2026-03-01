import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  CameraOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Bot,
  User,
  Clock,
  Download,
  Copy,
  Square,
  Code,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle
} from 'lucide-react';


const VideoInterviewWalkthrough = ({
  setOnTakeTour,
  setInterviewStarted
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [speakerEnabled, setSpeakerEnabled] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const messagesEndRef = useRef(null);

  const sampleMessages = [
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm Glee, your AI interviewer. Let's start by having you tell me a bit about yourself and your background.",
      timestamp: new Date(),
      duration: null
    },
    {
      id: 2,
      type: 'user',
      content: "Hi Glee! I'm a software engineer with 5 years of experience in full-stack development. I've worked primarily with React, Node.js, and Python.",
      timestamp: new Date(),
      duration: 15
    },
    {
      id: 3,
      type: 'ai',
      content: "That's great! Can you tell me about a challenging technical problem you've recently solved?",
      timestamp: new Date(),
      duration: null
    }
  ];

  const steps = [
    {
      id: 'header',
      title: 'Interview Header',
      description: 'Track your interview session with live recording indicator, session timer, and quick actions.',
      target: 'header',
      details: [
        'Red dot shows interview is live and recording',
        'Session timer tracks total interview duration',
        'Export and copy transcript buttons available',
        'End interview button stops recording and generates report'
      ]
    },
    {
      id: 'user-video',
      title: 'Your Video Feed',
      description: 'This is where you see yourself during the interview.',
      target: 'user-video',
      details: [
        'Your webcam feed displays here',
        'Position yourself with good lighting',
        'Maintain eye contact with the camera',
        'Camera can be toggled on/off during interview'
      ]
    },
    {
      id: 'ai-video',
      title: 'AI Interviewer - Glee',
      description: 'Meet Glee, your AI interviewer who conducts natural conversations.',
      target: 'ai-video',
      details: [
        'Glee appears in a professional interface',
        'Visual indicator shows when AI is speaking or typing',
        'AI adapts questions based on your responses',
        'Provides realistic interview experience'
      ]
    },
    {
      id: 'controls',
      title: 'Media Controls',
      description: 'Control your camera, microphone, speaker, and pause the interview.',
      target: 'controls',
      details: [
        'Toggle camera on/off',
        'Mute/unmute microphone',
        'Control speaker volume',
        'Pause/resume interview session'
      ]
    },
    {
      id: 'conversation',
      title: 'Interview Conversation',
      description: 'All interview dialogue appears here in real-time.',
      target: 'conversation',
      details: [
        'See AI questions as they are asked',
        'Your responses appear after speaking',
        'Full transcript is maintained',
        'Timestamps and duration tracked for each response'
      ]
    },
    {
      id: 'code-editor',
      title: 'Code Editor (Technical Interviews)',
      description: 'For technical interviews, toggle the code editor to write and share code.',
      target: 'code-editor',
      details: [
        'Write code during technical questions',
        'Multiple programming languages supported',
        'Syntax highlighting included',
        'Share code solutions with AI interviewer'
      ]
    }
  ];

  const currentStepData = steps[currentStep];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getHighlightClass = (target) => {
    if (currentStepData.target === target) {
      return 'ring-4 ring-blue-500 ring-opacity-75 relative z-20';
    }
    return currentStepData.target === 'full' ? '' : 'opacity-40';
  };

  return (
    <div className="h-screen bg-gray-50 overflow-hidden flex flex-col relative">
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => setOnTakeTour(false)}
          className="bg-white text-gray-700 px-4 py-2 rounded-lg shadow-lg hover:bg-gray-50 border border-gray-200 transition-colors flex items-center space-x-2"
        >
          <X className="h-4 w-4" />
          <span>Exit Walkthrough</span>
        </button>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 flex-1 flex flex-col py-2">
        <div
          className={`bg-white rounded-xl shadow-sm border border-gray-100 p-3 mb-3 flex-shrink-0 transition-all ${getHighlightClass(
            'header'
          )}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-900">
                  Live Interview
                </span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span className="font-mono text-sm">{formatTime(942)}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Download className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Copy className="h-4 w-4" />
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2">
                <Square className="h-4 w-4" />
                <span>End Interview</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-3 flex-1 min-h-0">
          <div className="flex flex-col space-y-2 overflow-clip">
            <div
              className={`bg-white rounded-xl shadow-sm border border-gray-100 p-2 flex-shrink-0 transition-all ${getHighlightClass(
                'user-video'
              )}`}
            >
              <h3 className="text-sm font-medium text-gray-700 mb-2">You</h3>
              <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center relative">
                <div className="text-white text-center">
                  <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="h-12 w-12 opacity-50" />
                  </div>
                  <p className="text-sm opacity-75">Camera Feed</p>
                </div>

                {!cameraEnabled && (
                  <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
                    <CameraOff className="h-8 w-8 text-white opacity-50" />
                  </div>
                )}
              </div>
            </div>

            <div
              className={`bg-white rounded-xl shadow-sm border border-gray-100 p-2 flex-shrink-0 transition-all ${getHighlightClass(
                'ai-video'
              )}`}
            >
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Glee - AI Interviewer
              </h3>
              <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg aspect-video flex items-center justify-center relative">
                <div className="text-white text-center">
                  <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
                    <Bot className="h-12 w-12" />
                  </div>
                  <p className="text-sm opacity-90">Speaking...</p>
                </div>

                <div className="absolute top-3 right-3">
                  <div className="w-3 h-3 rounded-full animate-pulse bg-green-400"></div>
                </div>
              </div>
            </div>

            <div
              className={`bg-white rounded-xl shadow-sm border border-gray-100 p-3 flex-shrink-0 transition-all ${getHighlightClass(
                'controls'
              )}`}
            >
              <div className="flex items-center justify-center space-x-3">
                <button
                  onClick={() => setCameraEnabled(!cameraEnabled)}
                  className={`p-2 rounded-full ${
                    cameraEnabled
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  {cameraEnabled ? (
                    <Camera className="h-4 w-4" />
                  ) : (
                    <CameraOff className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => setMicEnabled(!micEnabled)}
                  className={`p-2 rounded-full ${
                    micEnabled
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  {micEnabled ? (
                    <Mic className="h-4 w-4" />
                  ) : (
                    <MicOff className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => setSpeakerEnabled(!speakerEnabled)}
                  className={`p-2 rounded-full ${
                    speakerEnabled
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  {speakerEnabled ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-2 rounded-full bg-yellow-100 text-yellow-600"
                >
                  {isPaused ? (
                    <Play className="h-4 w-4" />
                  ) : (
                    <Pause className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 min-h-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full flex flex-col overflow-clip">
              <div
                className={`p-3 border-b border-gray-100 flex-shrink-0 transition-all ${getHighlightClass(
                  'code-editor'
                )}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Interview Conversation
                    </h3>
                    <p className="text-sm text-gray-600">
                      All responses are being recorded and analyzed
                    </p>
                  </div>
                  <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                    <Code className="h-4 w-4" />
                    <span>Code Editor</span>
                  </button>
                </div>
              </div>

              <div
                className={`flex-1 overflow-y-auto p-3 space-y-3 min-h-0 overflow-clip transition-all ${getHighlightClass(
                  'conversation'
                )}`}
              >
                {sampleMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`flex items-start space-x-3 max-w-[80%] ${
                        message.type === 'user'
                          ? 'flex-row-reverse space-x-reverse'
                          : ''
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.type === 'user'
                            ? 'bg-blue-600'
                            : 'bg-gradient-to-br from-blue-500 to-purple-600'
                        }`}
                      >
                        {message.type === 'user' ? (
                          <User className="h-4 w-4 text-white" />
                        ) : (
                          <Bot className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">
                          {message.content}
                        </p>
                        <div
                          className={`flex items-center justify-between mt-2 text-xs ${
                            message.type === 'user'
                              ? 'text-blue-100'
                              : 'text-gray-500'
                          }`}
                        >
                          <span>
                            {message.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          {message.duration && (
                            <span className="ml-2">{message.duration}s</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-30">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                      {currentStep + 1}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {currentStepData.title}
                    </h2>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {currentStepData.description}
                  </p>

                  <div className="space-y-2">
                    {currentStepData.details.map((detail, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700">{detail}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="ml-6 text-sm text-gray-500">
                  Step {currentStep + 1} of {steps.length}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentStep === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </button>

                  {currentStep < steps.length - 1 ? (
                    <button
                      onClick={nextStep}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      <span>Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {setOnTakeTour(false); setInterviewStarted(true);}}
                      className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-colors"
                    >
                      <Play className="h-4 w-4" />
                      <span>Start Your Interview</span>
                    </button>
                  )}
                </div>

                <div className="flex-1 max-w-md ml-6">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>
                      {Math.round(((currentStep + 1) / steps.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-blue-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${((currentStep + 1) / steps.length) * 100}%`
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default VideoInterviewWalkthrough;
