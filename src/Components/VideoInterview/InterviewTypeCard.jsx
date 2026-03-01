import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MessageSquare, CheckCircle } from 'lucide-react';

const InterviewTypeCard = ({ type, isSelected, onSelect, onStart }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: isSelected ? -4 : -2 }}
      onClick={onSelect}
      className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'border-blue-600 bg-blue-50 shadow-lg'
          : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
      }`}
    >
      {/* Radio Indicator */}
      <div className="absolute top-4 right-4">
        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            isSelected
              ? 'border-blue-600 bg-blue-600'
              : 'border-gray-300 bg-white'
          }`}
        >
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-3 h-3 rounded-full bg-white"
            />
          )}
        </div>
      </div>

      <div className="pr-8">
        <h3
          className={`text-xl font-semibold mb-2 ${
            isSelected ? 'text-blue-900' : 'text-gray-900'
          }`}
        >
          {type.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {type.description}
        </p>

        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{type.duration} min</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageSquare className="h-4 w-4" />
            <span>Dynamic questions</span>
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              type.difficulty === 'Easy'
                ? 'bg-green-100 text-green-800'
                : type.difficulty === 'Medium'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {type.difficulty}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {type.topics?.slice(0, 3).map((topic, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          onStart();
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
          isSelected
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <span>Start Interview</span>
        {isSelected && (
          <motion.div
            initial={{ x: -5, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            →
          </motion.div>
        )}
      </motion.button>
    </motion.div>
  );
};

export default InterviewTypeCard;

