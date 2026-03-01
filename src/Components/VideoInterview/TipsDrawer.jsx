import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, X, Bot, CheckCircle } from 'lucide-react';

const TipsDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Icon Tab */}
      <motion.button
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: isOpen ? 320 : 0, opacity: 1 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-0 top-[30%] -translate-y-1/2 z-40 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-l-lg shadow-lg hover:shadow-xl transition-shadow flex items-center space-x-2"
        aria-label="Toggle Tips"
      >
        <Lightbulb className="h-5 w-5" />
        <span className="text-sm font-medium">Tips</span>
      </motion.button>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 z-30"
            />

            {/* Drawer Content */}
            <motion.div
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-40 overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    <h2 className="text-lg font-semibold text-gray-900">Interview Tips</h2>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Tips List */}
                <div className="space-y-4 mb-8">
                  {[
                    'Maintain eye contact with the camera',
                    'Speak clearly and at a steady pace',
                    'Take your time to think before responding',
                    'Ask clarifying questions when needed',
                    'Be specific with examples and stories',
                  ].map((tip, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{tip}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Natural Conversation Info */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                  <h3 className="text-md font-semibold text-gray-900 mb-3">
                    Natural Conversation
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    Our AI interviewer will have a natural conversation with you.
                    Respond naturally and the AI will adapt its questions based on
                    your responses.
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-blue-600">
                    <Bot className="h-4 w-4" />
                    <span className="font-medium">Powered by Advanced AI</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default TipsDrawer;

