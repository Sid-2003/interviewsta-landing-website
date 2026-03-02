import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StickyInsightBar = ({ overallScore, matchScore, missingKeywordsCount, keywordsScore, isVisible }) => {
  if (!isVisible) return null;

  const MiniGauge = ({ score, color, size = 40 }) => {
    const radius = size * 0.35;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="3"
            fill="none"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-gray-900">{Math.round(score)}</span>
        </div>
      </div>
    );
  };

  const MiniDonut = ({ value, max, color }) => {
    const percentage = (value / max) * 100;
    const radius = 15;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-10 h-10">
        <svg className="transform -rotate-90 w-10 h-10" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r={radius} stroke="#e5e7eb" strokeWidth="4" fill="none" />
          <motion.circle
            cx="20"
            cy="20"
            r={radius}
            stroke={color}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-gray-900">{value}</span>
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-md z-50 px-4 py-3"
        >
          <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <MiniGauge score={overallScore} color="#3b82f6" />
                <div>
                  <p className="text-xs text-gray-500">Overall</p>
                  <p className="text-sm font-semibold text-gray-900">{overallScore}%</p>
                </div>
              </div>

              {matchScore && (
                <div className="flex items-center space-x-2">
                  <MiniGauge score={matchScore} color="#8b5cf6" />
                  <div>
                    <p className="text-xs text-gray-500">Job Match</p>
                    <p className="text-sm font-semibold text-gray-900">{matchScore}%</p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <MiniDonut value={missingKeywordsCount} max={20} color="#f97316" />
                <div>
                  <p className="text-xs text-gray-500">Missing</p>
                  <p className="text-sm font-semibold text-gray-900">{missingKeywordsCount} keywords</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 flex items-center justify-center">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${keywordsScore}%` }}
                      transition={{ duration: 1.5 }}
                    />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Keywords</p>
                  <p className="text-sm font-semibold text-gray-900">{keywordsScore}%</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyInsightBar;

