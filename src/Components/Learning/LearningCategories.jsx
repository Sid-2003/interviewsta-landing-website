import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Code, 
  Database, 
  ArrowRight,
  BookOpen,
  Target,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';

const LearningCategories = () => {
  const navigate = useNavigate();

  const handleCardClick = (categoryId, cardName) => {
    // Navigate to Arrays learning hub
    if (categoryId === 'dsa' && cardName === 'Arrays') {
      navigate('/learning/arrays');
    }
    // Add more navigation logic for other cards as needed
  };

  const categories = [
    {
      id: 'dsa',
      title: 'Data Structures & Algorithms',
      icon: Database,
      description: 'Comprehensive coverage of fundamental algorithms and data structures',
      cards: [
        {
          name: 'Arrays',
          description: 'Array manipulation, two pointers, sliding window, and prefix sums',
          questionCount: 120,
          coverage: 'Basics, Patterns, Advanced',
          focusAreas: ['Two Pointers', 'Sliding Window', 'Prefix Sums']
        },
        {
          name: 'Strings',
          description: 'String algorithms, pattern matching, parsing, and text processing',
          questionCount: 95,
          coverage: 'Basics, Patterns, Advanced',
          focusAreas: ['Pattern Matching', 'Parsing', 'Text Processing']
        },
        {
          name: 'Recursion',
          description: 'Recursive thinking, backtracking, divide & conquer, and memoization',
          questionCount: 78,
          coverage: 'Basics, Patterns, Advanced',
          focusAreas: ['Backtracking', 'Divide & Conquer', 'Memoization']
        },
        {
          name: 'Trees',
          description: 'Binary trees, BST, tree traversals, and tree-based algorithms',
          questionCount: 105,
          coverage: 'Basics, Patterns, Advanced',
          focusAreas: ['BST', 'Traversals', 'Tree Algorithms']
        },
        {
          name: 'Graphs',
          description: 'Graph representations, BFS/DFS, shortest paths, and graph algorithms',
          questionCount: 88,
          coverage: 'Basics, Patterns, Advanced',
          focusAreas: ['BFS/DFS', 'Shortest Paths', 'Graph Algorithms']
        },
        {
          name: 'Dynamic Programming',
          description: 'DP patterns, optimization problems, and state transitions',
          questionCount: 65,
          coverage: 'Patterns, Advanced',
          focusAreas: ['DP Patterns', 'Optimization', 'State Transitions']
        }
      ]
    },
    {
      id: 'programming',
      title: 'Programming Languages',
      icon: Code,
      description: 'Master core programming languages from fundamentals to advanced concepts',
      cards: [
        {
          name: 'Java',
          description: 'Object-oriented programming, collections, multithreading, and JVM internals',
          topicsCount: 45,
          difficultyRange: 'Beginner → Advanced',
          focusAreas: ['OOP', 'Collections', 'Concurrency']
        },
        {
          name: 'JavaScript',
          description: 'Modern ES6+, async programming, DOM manipulation, and frameworks',
          topicsCount: 52,
          difficultyRange: 'Beginner → Advanced',
          focusAreas: ['ES6+', 'Async', 'Frameworks']
        },
        {
          name: 'Python',
          description: 'Data structures, algorithms, web development, and data science',
          topicsCount: 38,
          difficultyRange: 'Beginner → Advanced',
          focusAreas: ['DSA', 'Web Dev', 'Data Science']
        },
        {
          name: 'C++',
          description: 'Memory management, STL, templates, and performance optimization',
          topicsCount: 42,
          difficultyRange: 'Intermediate → Advanced',
          focusAreas: ['Memory', 'STL', 'Templates']
        },
        {
          name: 'Go',
          description: 'Concurrency, goroutines, channels, and system programming',
          topicsCount: 28,
          difficultyRange: 'Intermediate → Advanced',
          focusAreas: ['Concurrency', 'Goroutines', 'Channels']
        }
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        duration: 0.2
      }
    }
  };

  const categoryVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        staggerChildren: 0.02,
        duration: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.2,
        ease: 'easeOut'
      }
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Learning Categories</h2>
        <p className="text-sm text-gray-600">Explore comprehensive learning paths</p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {categories.map((category) => {
          const CategoryIcon = category.icon;
          return (
            <motion.div
              key={category.id}
              variants={categoryVariants}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              {/* Category Header */}
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="hidden md:flex w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 items-center justify-center shadow-md">
                    <CategoryIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
                    <p className="text-sm text-gray-600 mt-0.5">{category.description}</p>
                  </div>
                </div>
              </div>

              {/* Category Cards - Larger Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.cards.map((card, cardIndex) => (
                  <motion.div
                    key={cardIndex}
                    variants={cardVariants}
                    whileHover={{ scale: 1.01, y: -2 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    onClick={() => handleCardClick(category.id, card.name)}
                    className="group relative bg-white border-2 border-gray-200 rounded-xl p-5 cursor-pointer hover:border-purple-500 hover:shadow-lg transition-colors duration-150 will-change-transform"
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900 mb-1.5 group-hover:text-purple-600 transition-colors">
                          {card.name}
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                          {card.description}
                        </p>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-2.5 mb-4">
                      {category.id === 'programming' && (
                        <>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Topics</span>
                            <span className="font-semibold text-gray-900">{card.topicsCount} topics</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Level</span>
                            <span className="font-semibold text-purple-600">{card.difficultyRange}</span>
                          </div>
                        </>
                      )}
                      
                      {category.id === 'dsa' && (
                        <>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Questions</span>
                            <span className="font-semibold text-gray-900">{card.questionCount}+ questions</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Coverage</span>
                            <span className="font-semibold text-purple-600">{card.coverage}</span>
                          </div>
                        </>
                      )}

                    </div>

                    {/* Focus Areas */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {card.focusAreas?.slice(0, 3).map((area, areaIndex) => (
                        <span
                          key={areaIndex}
                          className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-medium"
                        >
                          {area}
                        </span>
                      ))}
                    </div>

                    {/* Action Hint */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-500">Explore topics</span>
                      <ArrowRight className="h-4 w-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
                    </div>

                    {/* Hover gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-200 pointer-events-none" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default LearningCategories;

