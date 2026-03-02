import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  BookOpen, 
  CheckCircle2, 
  Clock,
  Target,
  TrendingUp,
  Code,
  Layers
} from 'lucide-react';

const ArraysLearningHub = () => {
  const navigate = useNavigate();
  // Load completion status from localStorage
  const loadCompletionStatus = () => {
    const saved = localStorage.getItem('arrays-completion-status');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing completion status:', e);
      }
    }
    return {
      'core-patterns': false,
      'prefix-suffix': false,
      'kadane-family': false,
      'two-pointers': false,
      'sorting-based': false,
      'rearrangement': false,
      'matrix-patterns': false
    };
  };

  const [completionStatus, setCompletionStatus] = useState(loadCompletionStatus);

  // Reload completion status when component mounts or when returning from concept page
  useEffect(() => {
    const saved = localStorage.getItem('arrays-completion-status');
    if (saved) {
      try {
        const status = JSON.parse(saved);
        setCompletionStatus(status);
      } catch (e) {
        console.error('Error parsing completion status:', e);
      }
    }
  }, []);

  const concepts = [
    {
      id: 'core-patterns',
      title: 'Core Patterns',
      description: 'Fundamental array operations, traversals, and basic manipulation techniques',
      problemsCount: 25,
      difficulty: 'Beginner',
      icon: Layers
    },
    {
      id: 'prefix-suffix',
      title: 'Prefix / Suffix Techniques',
      description: 'Master prefix sums, suffix arrays, and cumulative techniques for efficient problem solving',
      problemsCount: 18,
      difficulty: 'Intermediate',
      icon: TrendingUp
    },
    {
      id: 'kadane-family',
      title: 'Kadane Family',
      description: 'Maximum subarray problems, Kadane\'s algorithm variations, and optimization techniques',
      problemsCount: 15,
      difficulty: 'Intermediate',
      icon: Target
    },
    {
      id: 'two-pointers',
      title: 'Two Pointers / Sliding Window',
      description: 'Efficient algorithms using two pointers and sliding window techniques for array problems',
      problemsCount: 32,
      difficulty: 'Intermediate',
      icon: Code
    },
    {
      id: 'sorting-based',
      title: 'Sorting-based Techniques',
      description: 'Problems solved using sorting, custom comparators, and order-based approaches',
      problemsCount: 22,
      difficulty: 'Intermediate',
      icon: BookOpen
    },
    {
      id: 'rearrangement',
      title: 'Rearrangement & Partitioning',
      description: 'Array rearrangement, partitioning algorithms, and in-place transformations',
      problemsCount: 20,
      difficulty: 'Advanced',
      icon: Layers
    },
    {
      id: 'matrix-patterns',
      title: 'Matrix Patterns',
      description: '2D array problems, matrix traversals, and multi-dimensional array techniques',
      problemsCount: 28,
      difficulty: 'Advanced',
      icon: Code
    }
  ];

  const allConceptsCompleted = Object.values(completionStatus).every(status => status === true);
  const completedCount = Object.values(completionStatus).filter(status => status === true).length;
  const totalConcepts = concepts.length;
  const progressPercentage = (completedCount / totalConcepts) * 100;

  const handleConceptClick = (conceptId) => {
    navigate(`/learning/arrays/${conceptId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <button
              onClick={() => navigate('/learning')}
              className="text-gray-600 hover:text-purple-600 transition-colors"
            >
              ← Back to Learning
            </button>
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <Layers className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Arrays</h1>
              <p className="text-gray-600 mt-1">Master array manipulation and problem-solving techniques</p>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Learning Progress</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {completedCount} of {totalConcepts} concepts completed
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">{Math.round(progressPercentage)}%</div>
                <div className="text-xs text-gray-500">Complete</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Concept Cards */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Concept Groups</h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {concepts.map((concept, index) => {
              const isCompleted = completionStatus[concept.id];
              
              return (
                <motion.div
                  key={concept.id}
                  variants={cardVariants}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleConceptClick(concept.id)}
                  className="group relative bg-white border-2 border-gray-200 rounded-xl p-6 cursor-pointer hover:border-purple-500 hover:shadow-lg transition-all duration-200"
                >
                  {/* Completion Badge */}
                  {isCompleted && (
                    <div className="absolute top-4 right-4">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-md">
                        <CheckCircle2 className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {concept.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-2">
                    {concept.description}
                  </p>

                  {/* Metadata */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Practice Problems</span>
                      <span className="font-semibold text-gray-900">{concept.problemsCount} problems</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Difficulty</span>
                      <span className={`font-semibold px-2 py-0.5 rounded ${
                        concept.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                        concept.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {concept.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm font-medium text-gray-700">
                      {isCompleted ? 'Review' : 'Start Learning'}
                    </span>
                    <ArrowRight className="h-4 w-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
                  </div>

                  {/* Hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-200 pointer-events-none" />
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Interview Unlock Section */}
        {allConceptsCompleted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg p-8 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">🎉 All Concepts Completed!</h3>
                <p className="text-purple-100 mb-4">
                  You've mastered all array concepts. Ready to test your skills?
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/video-interview')}
                  className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Take Arrays Technical Interview
                </motion.button>
              </div>
              <Target className="h-16 w-16 text-white/20" />
            </div>
          </motion.div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-gray-400" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Complete All Concepts</h3>
                <p className="text-sm text-gray-600">
                  Finish all {totalConcepts} concept groups to unlock the Arrays Technical Interview
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArraysLearningHub;

