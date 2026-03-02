import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';

const StickyActionBar = ({ selectedInterview, onStart, onClear, hideWhenSystemCheck }) => {
  if (!selectedInterview || hideWhenSystemCheck) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 px-2 sm:px-4 py-3 md:py-4"
      >
        <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 min-w-0">
            <div className="w-10 md:w-12 h-10 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Play className="h-5 md:h-6 w-5 md:w-6 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-gray-500">Ready to start?</p>
              <p className="text-sm md:text-lg font-semibold text-gray-900 truncate">{selectedInterview.title}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0 w-full sm:w-auto">
            <button
              onClick={onClear}
              className="flex-1 sm:flex-none px-3 md:px-4 py-2 text-gray-600 hover:text-gray-900 text-xs md:text-sm font-medium"
            >
              Change Selection
            </button>
            <button
              onClick={onStart}
              className="flex-1 sm:flex-none flex items-center justify-center sm:justify-start space-x-1.5 md:space-x-2 px-3 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg md:rounded-lg font-semibold text-xs md:text-sm hover:shadow-lg transition-all duration-200 whitespace-nowrap"
            >
              <Play className="h-4 w-4" />
              <span>Start Interview →</span>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StickyActionBar;

