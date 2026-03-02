import React from 'react';
import { motion } from 'framer-motion';

const TeacherInterviewConfig = ({ 
  interviewType, 
  selectedCategory, 
  selectedDifficulty, 
  onCategoryChange, 
  onDifficultyChange 
}) => {
  const categoryMap = {
    'Technical Interview': [
      'Coding Problems',
      'Algorithm Design',
      'Code Optimization'
    ],
    'Behavioral Interview': [
      'Behavioral Questions',
      'Cultural Fit',
      'Career Goals'
    ],
    'Specialised Interview': [
      'Public Speaking',
      'Debate',
      'Photography',
      'Music',
      'Content Creation',
      'Case Study'
    ]
  };

  const categories = categoryMap[interviewType] || [];
  const showDifficulty = interviewType !== 'Specialised Interview';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg border border-gray-200 p-6 mb-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Configure {interviewType}
      </h3>

      {/* Category Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Category
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {categories.map((category) => (
            <motion.button
              key={category}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onCategoryChange(category)}
              className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                selectedCategory === category
                  ? 'border-blue-600 bg-blue-50 text-blue-900'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Difficulty Selection - Only for Technical and Behavioral */}
      {showDifficulty && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Difficulty Level
          </label>
          <div className="flex gap-3">
            {['Easy', 'Medium', 'Hard'].map((level) => (
              <motion.button
                key={level}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onDifficultyChange(level)}
                className={`px-4 py-2 rounded-lg border-2 transition-all font-medium text-sm ${
                  selectedDifficulty === level
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : `border-gray-200 bg-white text-gray-700 hover:border-gray-300 ${
                        level === 'Easy'
                          ? 'hover:bg-green-50'
                          : level === 'Medium'
                          ? 'hover:bg-yellow-50'
                          : 'hover:bg-red-50'
                      }`
                }`}
              >
                <span
                  className={`inline-block mr-2 w-2 h-2 rounded-full ${
                    level === 'Easy'
                      ? 'bg-green-500'
                      : level === 'Medium'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                />
                {level}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {interviewType === 'Specialised Interview' && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            ℹ️ Specialised Interviews are set to Easy difficulty by default.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default TeacherInterviewConfig;
