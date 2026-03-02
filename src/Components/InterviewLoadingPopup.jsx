import React from 'react';
import { Sparkles, Brain, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STAGES = [
  { id: 0, progressThreshold: 10, message: 'Setting up your interview...', icon: Loader2 },
  { id: 1, progressThreshold: 50, message: 'Glee is ready and assigned to you', icon: Brain },
  { id: 2, progressThreshold: 80, message: 'Glee has your first response ready', icon: Sparkles },
  { id: 3, progressThreshold: 100, message: 'Ready!', icon: CheckCircle },
];

const InterviewLoadingPopup = ({ progress, setSetUpComplete }) => {
  const activeStageIndex = STAGES.findIndex(s => progress < s.progressThreshold);
  const activeStage = activeStageIndex === -1 ? STAGES.length - 1 : activeStageIndex;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gray-50 z-[60] overflow-y-auto"
      >
        <div className="min-h-screen flex items-center justify-center p-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-50" />
            <div
              className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-20 blur-3xl"
            />
            <div
              className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 blur-3xl"
            />

            <div className="relative z-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Preparing Your Interview
                </h2>
              </div>

              <>
                <div className="space-y-4">
                  {STAGES.map((stage, index) => {
                    const isCompleted = progress >= stage.progressThreshold;
                    const isCurrent = activeStage >= 0 && index === activeStage && !isCompleted;

                    return (
                      <motion.div
                        key={stage.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08 }}
                        className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 ${
                          isCompleted
                            ? 'bg-green-50 border-2 border-green-200'
                            : isCurrent
                            ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200'
                            : 'bg-gray-50 border-2 border-gray-200'
                        }`}
                      >
                        <div className="flex-shrink-0">
                          {isCompleted ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                            >
                              <CheckCircle className="w-8 h-8 text-green-600" />
                            </motion.div>
                          ) : isCurrent ? (
                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                          ) : (
                            <div className="w-8 h-8 rounded-full border-2 border-gray-300 bg-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p
                            className={`font-medium transition-colors duration-300 ${
                              isCompleted
                                ? 'text-green-900'
                                : isCurrent
                                ? 'text-blue-900'
                                : 'text-gray-400'
                            }`}
                          >
                            {stage.message}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm font-medium text-blue-600">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      animate={{ width: `${Math.min(progress, 100)}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                    />
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100"
                >
                  <p className="text-xs text-blue-800 text-center">
                    <span className="font-semibold">Pro tip:</span> Take a deep breath and relax.
                    Glee is designed to help you practice, not judge you!
                  </p>
                </motion.div>
              </>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InterviewLoadingPopup;
