import React from 'react';
import { Sparkles, BookOpen, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InterviewDisclaimer = ({
  setInterviewStarted,
  interviewStarted,
  onContinue,
  setOnTakeTour,
}) => {
  if (interviewStarted) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-100 z-50 overflow-hidden"
      >
        <div className="h-screen flex flex-col">
          <div className="flex-1 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-6 space-y-5"
            >
              {/* Header */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-11 h-11 bg-blue-600 rounded-xl mb-3">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Ready to Begin?</h2>
                <p className="text-gray-500 text-sm mt-1">Quick tips for the best experience</p>
              </div>

              {/* Tips */}
              <div className="space-y-2.5">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">Stable Internet</h4>
                    <p className="text-xs text-gray-500">Ensures smooth audio & video</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">Quiet Environment</h4>
                    <p className="text-xs text-gray-500">Better AI transcription accuracy</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">Exit Anytime</h4>
                    <p className="text-xs text-gray-500">You're in full control</p>
                  </div>
                </div>
              </div>

              {/* AI Note */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                <p className="text-xs text-slate-600 text-center">
                  <span className="font-medium">Note:</span> This is an AI practice tool. Responses may vary and technical questions can have multiple valid solutions.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => { setOnTakeTour(true) }}
                  className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-all text-sm"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Take Tour</span>
                </button>

                <button
                  onClick={() => setInterviewStarted(true)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-all text-sm"
                >
                  <span>Start Interview</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InterviewDisclaimer;
