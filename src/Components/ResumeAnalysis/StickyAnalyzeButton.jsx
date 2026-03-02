import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';

const StickyAnalyzeButton = ({ 
  onClick, 
  disabled, 
  isAnalyzing,
  hasResume, 
  hasJobDescription 
}) => {
  const canAnalyze = hasResume || hasJobDescription;
  const isDisabled = disabled || !canAnalyze || isAnalyzing;

  return (
    <AnimatePresence>
      {!isAnalyzing && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 px-4 py-4"
        >
          <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                canAnalyze ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <Sparkles className={`h-6 w-6 ${
                  canAnalyze ? 'text-blue-600' : 'text-gray-400'
                }`} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Ready to analyze?</p>
                <p className="text-lg font-semibold text-gray-900">
                  {hasResume && hasJobDescription
                    ? 'Get targeted analysis comparing your resume to the job'
                    : hasResume
                    ? 'Analyze your resume quality'
                    : 'Analyze job description requirements'}
                </p>
              </div>
            </div>
            <motion.button
              onClick={onClick}
              disabled={isDisabled}
              whileHover={!isDisabled ? { scale: 1.02 } : {}}
              whileTap={!isDisabled ? { scale: 0.98 } : {}}
              className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
                canAnalyze && !isDisabled
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Sparkles className="h-5 w-5" />
              <span>Analyze Resume vs Job Description</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyAnalyzeButton;

