import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Code, Bot, Volume2, VolumeX } from 'lucide-react';

const VideoSolutionPage = () => {
  const { concept, problemId } = useParams();
  const navigate = useNavigate();
  const [speakerEnabled, setSpeakerEnabled] = useState(true);
  const videoRef = useRef(null);
  const gleeVideoRef = useRef(null);

  // Static problem data (matching PracticePage)
  const problemData = {
    '1': {
      title: 'Find Maximum Element',
      difficulty: 'Easy',
      videoSolution: null
    },
    '2': {
      title: 'Reverse Array',
      difficulty: 'Easy',
      videoSolution: 'https://a8vokxu9qhmufeny.public.blob.vercel-storage.com/ReverseArrayTwoPointer.mp4'
    }
  };

  const problem = problemData[problemId] || problemData['1'];

  const toggleSpeaker = () => {
    setSpeakerEnabled(!speakerEnabled);
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4 flex-shrink-0 w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center space-x-2 md:space-x-4">
            <button
              onClick={() => navigate(`/learning/arrays/${concept}`)}
              className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors text-xs md:text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="font-medium">Back to Concept</span>
            </button>
            <div className="h-6 w-px bg-gray-300 hidden md:block" />
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-gray-900">Video Explanation</h1>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm text-gray-600">{problem.title}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  problem.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                  problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {problem.difficulty}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button - Hidden on mobile */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/learning/arrays/${concept}/practice/${problemId}`)}
            className="hidden md:flex md:items-center px-4 md:px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all space-x-2"
          >
            <Code className="h-4 w-4" />
            <span>Practice Problem</span>
          </motion.button>
        </div>
      </div>

      {/* Main Content - Responsive Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden gap-0">
        {/* Left: Solution Video - Full width on mobile, 70% on desktop */}
        <div className="flex-1 lg:w-[70%] lg:flex lg:flex-col lg:border-r lg:border-gray-200 bg-white overflow-hidden">
          {problem.videoSolution ? (
            <>
              {/* Minimal Video Header */}
              <div className="bg-white border-b border-purple-100 px-4 md:px-6 py-2 md:py-3 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                  <span className="text-xs md:text-sm font-medium text-purple-700">Solution Video</span>
                </div>
                <button
                  onClick={toggleSpeaker}
                  className={`p-1.5 rounded-lg transition-colors ${
                    speakerEnabled ? 'text-purple-600 hover:bg-purple-50' : 'text-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {speakerEnabled ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Video Player */}
              <div className="flex-1 bg-gray-900 flex items-center justify-center min-h-0">
                <video
                  ref={videoRef}
                  controls
                  autoPlay
                  muted={!speakerEnabled}
                  className="w-full h-full object-contain"
                  src={problem.videoSolution}
                >
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Video Info - Shown on all screens */}
              <div className="p-4 md:p-6 bg-gray-50 border-t border-gray-200 flex-shrink-0 overflow-y-auto">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{problem.title}</h3>
                  <p className="text-sm text-gray-600">
                    Follow along with this detailed explanation to understand the solution approach.
                  </p>
                </div>

                {/* Tips Section */}
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <h4 className="text-sm font-semibold text-purple-900 mb-2">💡 Learning Tips</h4>
                  <ul className="text-xs text-purple-800 space-y-1">
                    <li>• Pay attention to the problem-solving approach</li>
                    <li>• Note the time and space complexity mentioned</li>
                    <li>• Try to solve it yourself after watching</li>
                  </ul>
                </div>

                {/* Next Problem Preview - Mobile only */}
                <div className="lg:hidden bg-white rounded-xl shadow-sm border border-gray-200 p-4 mt-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Next Problem</h3>
                  {problemId === '1' ? (
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-gray-900 text-sm">Reverse Array</h4>
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                            Easy
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-3">
                          Reverse the elements of an array in-place.
                        </p>
                        <button
                          onClick={() => navigate(`/learning/arrays/${concept}/video/2`)}
                          className="w-full px-3 py-2 bg-purple-50 text-purple-700 rounded-lg font-medium text-xs hover:bg-purple-100 transition-colors"
                        >
                          Watch Explanation
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500">
                      Complete this problem to unlock more solutions.
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-600 mb-4">Video solution not available for this problem.</p>
                <button
                  onClick={() => navigate(`/learning/arrays/${concept}/practice/${problemId}`)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Go to Practice
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Glee Video & Additional Content - Hidden on mobile, visible on lg+ */}
        <div className="hidden lg:flex lg:w-[30%] bg-gray-50 flex-col overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Glee Video Feed - Minimal Design */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-4 flex-shrink-0">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">Glee AI</h3>
              </div>
              <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video shadow-inner flex items-center justify-center">
                <video
                  ref={gleeVideoRef}
                  src="/Video/WhatsApp Video 2025-01-14 at 11.34.08.mp4"
                  muted
                  loop
                  autoPlay
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Next Problem Preview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Next Problem</h3>
              {problemId === '1' ? (
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-gray-900">Reverse Array</h4>
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                        Easy
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-3">
                      Reverse the elements of an array in-place.
                    </p>
                    <button
                      onClick={() => navigate(`/learning/arrays/${concept}/video/2`)}
                      className="w-full px-3 py-2 bg-purple-50 text-purple-700 rounded-lg font-medium text-xs hover:bg-purple-100 transition-colors"
                    >
                      Watch Explanation
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-gray-500">
                  Complete this problem to unlock more solutions.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile: Practice Button at bottom */}
        <div className="lg:hidden border-t border-gray-200 bg-white p-3 flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/learning/arrays/${concept}/practice/${problemId}`)}
            className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            <Code className="h-4 w-4" />
            <span>Practice Problem</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default VideoSolutionPage;

