import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, BookOpen, Zap, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LearningProgressSection = () => {
  const navigate = useNavigate();

  const learningData = {
    activeCourse: {
      name: 'Arrays',
      progress: 75,
      currentTopic: 'Find Max Element',
      topicsCompleted: 18,
      totalTopics: 24
    },
    completedCourses: [
      {
        id: 1,
        name: 'System Design Basics',
        completedDate: '2024-12-15',
        totalTopics: 20
      },
      {
        id: 2,
        name: 'JavaScript Fundamentals',
        completedDate: '2024-11-30',
        totalTopics: 15
      }
    ],
    currentTopicDetails: {
      name: 'Find Max Element',
      description: 'Learn how to find the maximum element in an array using different approaches',
      difficulty: 'Beginner',
      estimatedTime: '30 minutes',
      completed: false,
      subtopics: [
        { name: 'Brute Force Approach', completed: true },
        { name: 'Optimized Solution', completed: true },
        { name: 'Practice Problems', completed: false }
      ]
    },
    analysisMetrics: {
      averageScore: 82,
      accuracyRate: 89,
      problemsSolved: 24,
      timeSpentHours: 12.5,
      learningStreak: 15
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Section Title */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2 mb-1">
          <span>Your Learning Journey</span>
        </h2>
        <p className="text-sm text-gray-600">Track your progress and analyze your learning patterns</p>
      </div>

      <motion.div variants={itemVariants} className="grid lg:grid-cols-2 gap-6">
        {/* Active Course & Current Topic */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
              <Zap className="h-5 w-5 text-blue-600" />
              <span>Currently Learning</span>
            </h3>
            <button
              onClick={() => navigate('/learning')}
              className="text-blue-600 hover:text-blue-700 text-sm font-semibold hover:underline transition-colors"
            >
              View All
            </button>
          </div>

          <div className="space-y-4">
            {/* Active Course */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{learningData.activeCourse.name}</h4>
                <span className="px-2 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Progress</span>
                <span className="font-bold text-purple-600">{learningData.activeCourse.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-500"
                  style={{ width: `${learningData.activeCourse.progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-600">
                  {learningData.activeCourse.topicsCompleted} of {learningData.activeCourse.totalTopics} topics completed
                </p>
                <button
                  onClick={() => navigate('/learning/arrays')}
                  className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 text-xs font-semibold hover:underline transition-colors"
                >
                  <span>Go to Section</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Current Topic */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-xs font-medium text-gray-600 mb-1">Current Topic</p>
              <h4 className="font-semibold text-gray-900 mb-3">{learningData.currentTopicDetails.name}</h4>
              <div className="space-y-2 mb-4">
                {learningData.currentTopicDetails.subtopics.map((subtopic, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-sm">
                    <CheckCircle2
                      className={`h-4 w-4 ${subtopic.completed ? 'text-green-600' : 'text-gray-300'}`}
                    />
                    <span className={subtopic.completed ? 'text-gray-700 font-medium' : 'text-gray-500'}>
                      {subtopic.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Progress Bar for Current Topic */}
              <div className="mb-4 pt-3 border-t border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600">Topic Progress</span>
                  <span className="text-xs font-bold text-blue-600">67%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                    style={{ width: '67%' }}
                  />
                </div>
              </div>

              <p className="text-xs text-blue-600 font-medium">
                {learningData.currentTopicDetails.estimatedTime} • {learningData.currentTopicDetails.difficulty}
              </p>
            </div>
          </div>
        </div>

        {/* Completed Courses & Analysis */}
        <div className="space-y-6">
          {/* Completed Courses */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span>Completed</span>
            </h3>
            <div className="space-y-3">
              {learningData.completedCourses.map((course) => (
                <div key={course.id} className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{course.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {course.totalTopics} topics • Completed {course.completedDate}
                      </p>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analysis Metrics */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl shadow-sm border border-orange-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <span>Your Analytics</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Avg Score</p>
                <p className="text-2xl font-bold text-orange-600">{learningData.analysisMetrics.averageScore}%</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Accuracy</p>
                <p className="text-2xl font-bold text-green-600">{learningData.analysisMetrics.accuracyRate}%</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Problems Solved</p>
                <p className="text-2xl font-bold text-blue-600">{learningData.analysisMetrics.problemsSolved}</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Learning Streak</p>
                <p className="text-2xl font-bold text-purple-600">{learningData.analysisMetrics.learningStreak}🔥</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-orange-200">
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className="text-gray-700">
                  Total study time: <strong>{learningData.analysisMetrics.timeSpentHours} hours</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LearningProgressSection;
