import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, TrendingUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ActiveCourseCard = () => {
  const navigate = useNavigate();

  const activeCourse = {
    title: 'Arrays',
    category: 'Data Structures & Algorithms',
    progress: 75,
    currentTopic: 'Find Max Element',
    topicsCompleted: 18,
    totalTopics: 24,
    estimatedTimeLeft: '3 weeks',
    status: 'In Progress'
  };

  const handleContinueLearning = () => {
    navigate('/learning/arrays');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 p-6 mb-8 overflow-hidden relative"
    >
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-3xl opacity-20 -mr-20 -mt-20" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{activeCourse.title}</h2>
              <p className="text-sm text-gray-600">{activeCourse.category}</p>
            </div>
          </div>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-full shadow-lg"
          >
            Active
          </motion.div>
        </div>

        {/* Current Topic */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 mb-6">
          <p className="text-xs font-medium text-gray-600 mb-1">Currently Learning</p>
          <p className="text-lg font-bold text-gray-900">{activeCourse.currentTopic}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Topics</p>
            <p className="text-xl font-bold text-purple-600">
              {activeCourse.topicsCompleted}/{activeCourse.totalTopics}
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Progress</p>
            <p className="text-xl font-bold text-purple-600">{activeCourse.progress}%</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Est. Time Left</p>
            <p className="text-sm font-bold text-purple-600">{activeCourse.estimatedTimeLeft}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Study Plan Progress</span>
            <span className="text-sm font-bold text-purple-600">{activeCourse.progress}%</span>
          </div>
          <div className="w-full bg-white/60 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${activeCourse.progress}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg"
            />
          </div>
        </div>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleContinueLearning}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transition-shadow"
        >
          <span>Continue Learning</span>
          <ArrowRight className="h-4 w-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ActiveCourseCard;
