import React, { useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  FileText, 
  Users, 
  Code, 
  Target,
  ChevronDown,
  CheckCircle,
  TrendingUp,
  ArrowRight,
  MessageSquare,
  Brain,
  Lightbulb,
  BarChart3,
  PieChart,
  Activity,
  AlertCircle,
  XCircle,
  Volume2,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

const FramerFeedback = () => {
  const [selectedType, setSelectedType] = useState('');
  const [showTemplate, setShowTemplate] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const interviewTypes = [
    {
      id: 'general',
      name: 'General Interview',
      icon: Target,
      color: 'from-blue-500 to-purple-600',
      description: 'Balanced assessment across all skills',
      categories: ['Communication', 'Technical Skills', 'Cultural Fit'],
      focusAreas: 12,
      sampleScore: 78
    },
    {
      id: 'hr',
      name: 'HR Interview',
      icon: Users,
      color: 'from-green-500 to-teal-600',
      description: 'Focus on communication and cultural fit',
      categories: ['Communication', 'Cultural Fit'],
      focusAreas: 8,
      sampleScore: 85
    },
    {
      id: 'technical',
      name: 'Technical Interview',
      icon: Code,
      color: 'from-orange-500 to-red-600',
      description: 'Deep dive into technical skills',
      categories: ['Technical Skills', 'Problem Solving'],
      focusAreas: 10,
      sampleScore: 72
    }
  ];

  const handleTypeSelection = (typeId) => {
    setSelectedType(typeId);
    setTimeout(() => setShowTemplate(true), 150);
    setIsDropdownOpen(false);
  };

  const selectedTypeData = interviewTypes.find(type => type.id === selectedType);

  const getTemplateData = (type) => {
    switch (type) {
      case 'general':
        return {
          overallScore: 78,
          categories: [
            { name: 'Communication Skills', score: 85, feedback: 'Excellent verbal communication and clear articulation of ideas.' },
            { name: 'Technical Knowledge', score: 75, feedback: 'Good technical foundation with room for improvement in advanced concepts.' },
            { name: 'Cultural Fit', score: 80, feedback: 'Strong alignment with company values and team dynamics.' }
          ],
          strengths: [
            'Clear and confident communication',
            'Strong problem-solving approach',
            'Good understanding of industry trends',
            'Positive attitude and enthusiasm'
          ],
          improvements: [
            'Deepen knowledge in advanced technical concepts',
            'Practice more complex problem-solving scenarios',
            'Improve time management during technical discussions'
          ],
          recommendations: [
            'Review advanced JavaScript concepts',
            'Practice system design problems',
            'Work on presentation skills'
          ]
        };
      case 'hr':
        return {
          overallScore: 85,
          categories: [
            { name: 'Communication Skills', score: 90, feedback: 'Outstanding communication with clear, professional responses.' },
            { name: 'Cultural Fit', score: 80, feedback: 'Good alignment with company culture and values.' }
          ],
          strengths: [
            'Exceptional interpersonal skills',
            'Strong emotional intelligence',
            'Clear career goals and motivation',
            'Good understanding of company culture'
          ],
          improvements: [
            'Provide more specific examples in behavioral questions',
            'Show more knowledge about company initiatives',
            'Demonstrate leadership potential more clearly'
          ],
          recommendations: [
            'Research company values more deeply',
            'Prepare more STAR method examples',
            'Practice leadership scenario questions'
          ]
        };
      case 'technical':
        return {
          overallScore: 72,
          categories: [
            { name: 'Technical Skills', score: 70, feedback: 'Solid technical foundation with some gaps in advanced topics.' },
            { name: 'Problem Solving', score: 75, feedback: 'Good analytical thinking with room for optimization.' }
          ],
          strengths: [
            'Strong coding fundamentals',
            'Good debugging approach',
            'Clear explanation of technical concepts',
            'Systematic problem-solving method'
          ],
          improvements: [
            'Improve algorithm optimization techniques',
            'Practice more complex data structure problems',
            'Enhance system design knowledge',
            'Work on code efficiency and best practices'
          ],
          recommendations: [
            'Study advanced algorithms and data structures',
            'Practice coding challenges daily',
            'Learn system design patterns',
            'Review code optimization techniques'
          ]
        };
      default:
        return null;
    }
  };

  const templateData = selectedType ? getTemplateData(selectedType) : null;

  const getEnhancedTemplateData = (type) => {
    switch (type) {
      case 'general':
        return {
          transcript: [
            {
              id: 1,
              speaker: 'Interviewer',
              text: "Tell me about yourself and your background in software development.",
              timestamp: '00:30'
            },
            {
              id: 2,
              speaker: 'Candidate',
              text: "I'm a full-stack developer with 5 years of experience. I've worked primarily with React and Node.js, building scalable web applications. In my current role at TechCorp, I lead a team of 3 developers and we've successfully delivered 12 major projects.",
              timestamp: '00:45',
              score: 'correct',
              feedback: 'Excellent response! Clear structure, specific experience mentioned, and quantified achievements.'
            },
            {
              id: 3,
              speaker: 'Interviewer',
              text: "What's your biggest weakness?",
              timestamp: '02:15'
            },
            {
              id: 4,
              speaker: 'Candidate',
              text: "I'm a perfectionist and sometimes spend too much time on details.",
              timestamp: '02:20',
              score: 'partial',
              feedback: 'Generic answer. Better to mention a real weakness and how you\'re actively working to improve it.'
            },
            {
              id: 5,
              speaker: 'Interviewer',
              text: "Describe a challenging project you worked on.",
              timestamp: '04:30'
            },
            {
              id: 6,
              speaker: 'Candidate',
              text: "Well, there was this project... it was difficult.",
              timestamp: '04:45',
              score: 'incorrect',
              feedback: 'Too vague. Use the STAR method: Situation, Task, Action, Result. Provide specific details and quantifiable outcomes.'
            }
          ],
          detailedAnalysis: {
            communicationSkills: {
              score: 85,
              breakdown: {
                clarity: 90,
                confidence: 85,
                structure: 80,
                engagement: 85
              },
              insights: [
                'Strong opening responses with clear structure',
                'Good use of specific examples and metrics',
                'Confident delivery throughout most of the interview',
                'Some responses lacked depth in storytelling'
              ]
            },
            technicalKnowledge: {
              score: 75,
              breakdown: {
                fundamentals: 80,
                frameworks: 85,
                problemSolving: 70,
                bestPractices: 65
              },
              insights: [
                'Solid understanding of React and Node.js',
                'Good grasp of modern development practices',
                'Could improve system design knowledge',
                'Need to demonstrate more complex problem-solving'
              ]
            },
            culturalFit: {
              score: 80,
              breakdown: {
                teamwork: 85,
                leadership: 80,
                adaptability: 75,
                values: 80
              },
              insights: [
                'Shows strong leadership potential',
                'Good examples of team collaboration',
                'Demonstrates company value alignment',
                'Could show more adaptability examples'
              ]
            }
          },
          performanceMetrics: {
            responseTime: { average: 12, ideal: 15, score: 85 },
            wordCount: { average: 45, ideal: 50, score: 90 },
            fillerWords: { count: 8, ideal: 5, score: 70 },
            eyeContact: { percentage: 78, ideal: 80, score: 75 }
          }
        };
      case 'hr':
        return {
          transcript: [
            {
              id: 1,
              speaker: 'Interviewer',
              text: "Why do you want to work for our company?",
              timestamp: '00:15'
            },
            {
              id: 2,
              speaker: 'Candidate',
              text: "I've researched your company extensively and I'm impressed by your commitment to innovation and employee development. Your recent expansion into AI aligns perfectly with my career goals, and I believe my background in machine learning would contribute significantly to your team.",
              timestamp: '00:30',
              score: 'correct',
              feedback: 'Outstanding! Shows research, connects personal goals with company direction, and demonstrates value proposition.'
            },
            {
              id: 3,
              speaker: 'Interviewer',
              text: "Tell me about a time you had to deal with a difficult colleague.",
              timestamp: '02:45'
            },
            {
              id: 4,
              speaker: 'Candidate',
              text: "I had a colleague who was always negative and it affected team morale. I tried talking to them but it didn't help much.",
              timestamp: '03:00',
              score: 'partial',
              feedback: 'Good start but incomplete. Use STAR method and focus on your actions and the positive outcome you achieved.'
            }
          ],
          detailedAnalysis: {
            communicationSkills: {
              score: 90,
              breakdown: {
                articulation: 95,
                listening: 85,
                empathy: 90,
                persuasion: 88
              },
              insights: [
                'Exceptional verbal communication skills',
                'Shows strong emotional intelligence',
                'Active listening demonstrated throughout',
                'Persuasive and engaging speaking style'
              ]
            },
            culturalFit: {
              score: 80,
              breakdown: {
                values: 85,
                teamwork: 80,
                growth: 75,
                initiative: 80
              },
              insights: [
                'Strong alignment with company values',
                'Good examples of collaborative work',
                'Shows commitment to personal growth',
                'Demonstrates proactive approach'
              ]
            }
          },
          performanceMetrics: {
            enthusiasm: { score: 92, benchmark: 85 },
            preparation: { score: 88, benchmark: 80 },
            professionalism: { score: 90, benchmark: 85 },
            questions: { count: 5, ideal: 3, score: 95 }
          }
        };
      case 'technical':
        return {
          transcript: [
            {
              id: 1,
              speaker: 'Interviewer',
              text: "Can you explain the difference between let, const, and var in JavaScript?",
              timestamp: '00:20'
            },
            {
              id: 2,
              speaker: 'Candidate',
              text: "Sure! var has function scope and is hoisted, let has block scope and is also hoisted but in a temporal dead zone, and const is like let but for constants that can't be reassigned. However, objects and arrays declared with const can still be mutated.",
              timestamp: '00:35',
              score: 'correct',
              feedback: 'Excellent technical explanation! Covers all key differences including hoisting, scope, and mutability nuances.'
            },
            {
              id: 3,
              speaker: 'Interviewer',
              text: "How would you optimize a React component that re-renders frequently?",
              timestamp: '03:15'
            },
            {
              id: 4,
              speaker: 'Candidate',
              text: "I would use React.memo to prevent unnecessary re-renders.",
              timestamp: '03:25',
              score: 'partial',
              feedback: 'Good start but incomplete. Also mention useMemo, useCallback, proper state structure, and component splitting strategies.'
            },
            {
              id: 5,
              speaker: 'Interviewer',
              text: "Write a function to reverse a string.",
              timestamp: '05:40'
            },
            {
              id: 6,
              speaker: 'Candidate',
              text: "function reverse(str) { return str.reverse(); }",
              timestamp: '05:50',
              score: 'incorrect',
              feedback: 'Incorrect! Strings don\'t have a reverse() method. Use str.split(\'\').reverse().join(\'\') or a for loop.'
            }
          ],
          detailedAnalysis: {
            technicalSkills: {
              score: 70,
              breakdown: {
                javascript: 75,
                react: 70,
                algorithms: 60,
                systemDesign: 65
              },
              insights: [
                'Strong JavaScript fundamentals',
                'Good React knowledge but needs depth',
                'Algorithm skills need improvement',
                'Basic system design understanding'
              ]
            },
            problemSolving: {
              score: 75,
              breakdown: {
                approach: 80,
                optimization: 70,
                debugging: 75,
                testing: 70
              },
              insights: [
                'Good problem-solving methodology',
                'Needs to consider edge cases more',
                'Decent debugging approach',
                'Should mention testing strategies'
              ]
            }
          },
          performanceMetrics: {
            codingSpeed: { wpm: 45, ideal: 40, score: 85 },
            accuracy: { percentage: 72, ideal: 80, score: 70 },
            explanation: { clarity: 75, ideal: 80, score: 75 },
            optimization: { score: 65, benchmark: 70 }
          }
        };
      default:
        return null;
    }
  };

  const enhancedData = selectedType ? getEnhancedTemplateData(selectedType) : null;

  const getScoreColor = (score) => {
    switch (score) {
      case 'correct': return 'text-green-600 bg-green-50 border-green-200';
      case 'partial': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'incorrect': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getScoreIcon = (score) => {
    switch (score) {
      case 'correct': return <CheckCircle className="h-4 w-4" />;
      case 'partial': return <AlertCircle className="h-4 w-4" />;
      case 'incorrect': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const AnimatedProgressBar = ({ value, maxValue = 100, delay = 0, color = "bg-blue-600" }) => {
    return (
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <motion.div
          className={`${color} h-2 rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${(value / maxValue) * 100}%` }}
          transition={{ 
            duration: 1.2,
            delay: delay,
            ease: [0.25, 0.1, 0.25, 1]
          }}
        />
      </div>
    );
  };

  const AnimatedScore = ({ score, delay = 0 }) => {
    return (
      <motion.span
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 0.6,
          delay: delay,
          type: "spring",
          stiffness: 200
        }}
        className="text-2xl font-bold text-blue-600"
      >
        {score}%
      </motion.span>
    );
  };

  const AnimatedCircularProgress = ({ score, delay = 0 }) => {
    return (
      <div className="w-24 h-24 mx-auto mb-4 relative">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            stroke="#3b82f6"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${score * 2.51} 251`}
            initial={{ strokeDasharray: "0 251" }}
            animate={{ strokeDasharray: `${score * 2.51} 251` }}
            transition={{ 
              duration: 2,
              delay: delay,
              ease: "easeInOut"
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.6,
              delay: delay + 0.5,
              type: "spring",
              stiffness: 300
            }}
            className="text-2xl font-bold text-gray-900"
          >
            {score}
          </motion.span>
        </div>
      </div>
    );
  };

  const renderPerformanceChart = (data, title) => {
    const maxValue = Math.max(...Object.values(data).map((item) => item.score || item));
    
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          <span>{title}</span>
        </h4>
        <div className="space-y-3">
          {Object.entries(data).map(([key, value], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center justify-between"
            >
              <span className="text-sm text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
              <div className="flex items-center space-x-3 flex-1 ml-4">
                <AnimatedProgressBar
                  value={value.score || value}
                  maxValue={maxValue}
                  delay={index * 0.1 + 0.2}
                />
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 + 0.5 }}
                  className="text-sm font-medium text-gray-900 w-8"
                >
                  {value.score || value}
                </motion.span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.4 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        // type: "spring",
        stiffness: 100
      }
    },
    hover: {
      y: -5,
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Feedback Templates</h1>
          <p className="text-gray-600 mt-2">Select an interview type to view detailed feedback templates</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!showTemplate ? (
            <motion.div
              key="selection"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="max-w-4xl mx-auto"
            >
              {/* Interview Type Cards */}
              <motion.div 
                variants={itemVariants}
                className="grid md:grid-cols-3 gap-6 mb-8"
              >
                {interviewTypes.map((type, index) => (
                  <motion.div
                    key={type.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    whileTap="tap"
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleTypeSelection(type.id)}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 cursor-pointer group"
                  >
                    <motion.div
                      className={`w-12 h-12 bg-gradient-to-r ${type.color} rounded-xl flex items-center justify-center mb-4`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <type.icon className="h-6 w-6 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{type.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{type.description}</p>
                    
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex justify-between">
                        <span>Categories:</span>
                        <span className="font-medium">{type.categories.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Focus Areas:</span>
                        <span className="font-medium">{type.focusAreas}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sample Score:</span>
                        <span className="font-medium text-blue-600">{type.sampleScore}%</span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                      <span>View Template</span>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ 
                          repeat: Infinity,
                          duration: 1.5,
                          ease: "easeInOut"
                        }}
                      >
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Alternative Dropdown Selection */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-8"
              >
                <div className="text-center mb-6">
                  <motion.div
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Interview Type</h2>
                  <p className="text-gray-600">Choose from the dropdown below to view the feedback template</p>
                </div>

                <div className="max-w-md mx-auto">
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between"
                    >
                      <span className={selectedType ? 'text-gray-900' : 'text-gray-500'}>
                        {selectedType 
                          ? interviewTypes.find(t => t.id === selectedType)?.name 
                          : 'Select interview type...'
                        }
                      </span>
                      <motion.div
                        animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      </motion.div>
                    </motion.button>

                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden"
                        >
                          {interviewTypes.map((type, index) => (
                            <motion.button
                              key={type.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ backgroundColor: "#f9fafb" }}
                              onClick={() => handleTypeSelection(type.id)}
                              className="w-full px-4 py-3 text-left flex items-center space-x-3 first:rounded-t-lg last:rounded-b-lg"
                            >
                              <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className={`w-8 h-8 bg-gradient-to-r ${type.color} rounded-lg flex items-center justify-center`}
                              >
                                <type.icon className="h-4 w-4 text-white" />
                              </motion.div>
                              <div>
                                <div className="font-medium text-gray-900">{type.name}</div>
                                <div className="text-sm text-gray-500">{type.description}</div>
                              </div>
                              {selectedType === type.id && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="ml-auto"
                                >
                                  <CheckCircle className="h-5 w-5 text-blue-600" />
                                </motion.div>
                              )}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            /* Template Display */
            <motion.div
              key="template"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              {/* Back Button and Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                <motion.button
                  whileHover={{ x: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowTemplate(false)}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
                >
                  <ArrowRight className="h-4 w-4 rotate-180" />
                  <span>Back to Selection</span>
                </motion.button>
                
                {selectedTypeData && (
                  <div className="flex items-center space-x-4">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        duration: 0.6,
                        type: "spring",
                        stiffness: 200
                      }}
                      className={`w-12 h-12 bg-gradient-to-r ${selectedTypeData.color} rounded-xl flex items-center justify-center`}
                    >
                      <selectedTypeData.icon className="h-6 w-6 text-white" />
                    </motion.div>
                    <div>
                      <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="text-2xl font-bold text-gray-900"
                      >
                        {selectedTypeData.name} Template
                      </motion.h2>
                      <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="text-gray-600"
                      >
                        {selectedTypeData.description}
                      </motion.p>
                    </div>
                  </div>
                )}
              </motion.div>

              {templateData && (
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Main Content */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="lg:col-span-2 space-y-8"
                  >
                    {/* Overall Score */}
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ 
                        duration: 0.6,
                        type: "spring",
                        stiffness: 150
                      }}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                    >
                      <div className="text-center">
                        <AnimatedCircularProgress score={templateData.overallScore} delay={0.5} />
                        <h3 className="text-xl font-semibold text-gray-900">Overall Score</h3>
                        <p className="text-gray-600">Based on interview performance</p>
                      </div>
                    </motion.div>

                    {/* Category Breakdown */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
                      <div className="space-y-4">
                        {templateData.categories.map((category, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 + 0.6 }}
                            className="border border-gray-200 rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{category.name}</h4>
                              <AnimatedScore score={category.score} delay={index * 0.1 + 0.8} />
                            </div>
                            <AnimatedProgressBar
                              value={category.score}
                              delay={index * 0.1 + 0.9}
                            />
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.4, delay: index * 0.1 + 1.2 }}
                              className="text-gray-600 text-sm mt-3"
                            >
                              {category.feedback}
                            </motion.p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Interview Transcript */}
                    {enhancedData?.transcript && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ 
                              repeat: Infinity,
                              duration: 2,
                              ease: "easeInOut"
                            }}
                          >
                            <Volume2 className="h-5 w-5 text-blue-600" />
                          </motion.div>
                          <span>Interview Transcript Analysis</span>
                        </h3>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          {enhancedData.transcript.map((entry, index) => (
                            <motion.div
                              key={entry.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                              whileHover={{ x: 5 }}
                              className="border-l-4 border-gray-200 pl-4"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <span className={`font-medium ${
                                    entry.speaker === 'Interviewer' ? 'text-purple-600' : 'text-blue-600'
                                  }`}>
                                    {entry.speaker}
                                  </span>
                                  <span className="text-xs text-gray-500">{entry.timestamp}</span>
                                </div>
                                {entry.score && (
                                  <motion.div
                                    initial={{ scale: 0, rotate: 180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ 
                                      duration: 0.4,
                                      delay: index * 0.1 + 0.2,
                                      type: "spring"
                                    }}
                                    className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getScoreColor(entry.score)}`}
                                  >
                                    {getScoreIcon(entry.score)}
                                    <span className="capitalize">{entry.score}</span>
                                  </motion.div>
                                )}
                              </div>
                              <p className="text-gray-700 mb-2">{entry.text}</p>
                              {entry.feedback && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
                                  className="bg-gray-50 rounded-lg p-3 mt-2"
                                >
                                  <p className="text-sm text-gray-600">
                                    <strong>Feedback:</strong> {entry.feedback}
                                  </p>
                                </motion.div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Detailed Performance Analysis */}
                    {enhancedData?.detailedAnalysis && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.0 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                          <Activity className="h-5 w-5 text-blue-600" />
                          <span>Detailed Performance Analysis</span>
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          {Object.entries(enhancedData.detailedAnalysis).map(([category, data], index) => (
                            <motion.div
                              key={category}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ 
                                duration: 0.5, 
                                delay: index * 0.2 + 1.2,
                                type: "spring",
                                stiffness: 150
                              }}
                              whileHover={{ scale: 1.02 }}
                              className="border border-gray-200 rounded-lg p-4"
                            >
                              <h4 className="font-semibold text-gray-900 mb-3 capitalize">
                                {category.replace(/([A-Z])/g, ' $1')}
                              </h4>
                              <div className="mb-4">
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                  <span>Overall Score</span>
                                  <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.4, delay: index * 0.2 + 1.5 }}
                                  >
                                    {data.score}%
                                  </motion.span>
                                </div>
                                <AnimatedProgressBar
                                  value={data.score}
                                  delay={index * 0.2 + 1.6}
                                />
                              </div>
                              {data.breakdown && (
                                <div className="space-y-2 mb-4">
                                  {Object.entries(data.breakdown).map(([skill, score], skillIndex) => (
                                    <motion.div
                                      key={skill}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ duration: 0.3, delay: index * 0.2 + skillIndex * 0.05 + 1.8 }}
                                      className="flex justify-between text-xs"
                                    >
                                      <span className="text-gray-600 capitalize">{skill}</span>
                                      <span className="font-medium">{score}%</span>
                                    </motion.div>
                                  ))}
                                </div>
                              )}
                              <div className="space-y-1">
                                {data.insights.map((insight, insightIndex) => (
                                  <motion.div
                                    key={insightIndex}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.2 + insightIndex * 0.05 + 2.0 }}
                                    className="flex items-start space-x-2"
                                  >
                                    <motion.div
                                      animate={{ scale: [0.8, 1.2, 0.8] }}
                                      transition={{ 
                                        repeat: Infinity,
                                        duration: 2,
                                        delay: insightIndex * 0.2,
                                        ease: "easeInOut"
                                      }}
                                      className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"
                                    />
                                    <p className="text-xs text-gray-600">{insight}</p>
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Performance Metrics Charts */}
                    {enhancedData?.performanceMetrics && (
                      <div className="space-y-6">
                        <motion.h3
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 1.4 }}
                          className="text-lg font-semibold text-gray-900 flex items-center space-x-2"
                        >
                          <PieChart className="h-5 w-5 text-blue-600" />
                          <span>Performance Metrics</span>
                        </motion.h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          {renderPerformanceChart(enhancedData.performanceMetrics, "Key Metrics")}
                          
                          {/* Comparison Chart */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                          >
                            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                              <TrendingUp className="h-5 w-5 text-green-600" />
                              <span>Performance vs Benchmark</span>
                            </h4>
                            <div className="space-y-4">
                              {Object.entries(enhancedData.performanceMetrics).map(([metric, data], index) => (
                                <motion.div
                                  key={metric}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
                                  className="space-y-2"
                                >
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-700 capitalize">{metric.replace(/([A-Z])/g, ' $1')}</span>
                                    <motion.span
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ 
                                        duration: 0.4,
                                        delay: index * 0.1 + 0.6,
                                        type: "spring",
                                        stiffness: 200
                                      }}
                                      className={`font-medium ${
                                        (data.score || data.percentage || data.average) >= (data.benchmark || data.ideal || 80) 
                                          ? 'text-green-600' : 'text-orange-600'
                                      }`}
                                    >
                                      {data.score || data.percentage || data.average}
                                      {data.percentage ? '%' : ''}
                                    </motion.span>
                                  </div>
                                  <div className="flex space-x-2">
                                    <AnimatedProgressBar
                                      value={Math.min((data.score || data.percentage || data.average), 100)}
                                      delay={index * 0.1 + 0.8}
                                    />
                                    <motion.span
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ duration: 0.3, delay: index * 0.1 + 1.0 }}
                                      className="text-xs text-gray-500"
                                    >
                                      Target: {data.benchmark || data.ideal || 80}
                                    </motion.span>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    )}

                    {/* Detailed Analysis */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Strengths */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 1.6 }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span>Strengths</span>
                        </h3>
                        <div className="space-y-3">
                          {templateData.strengths.map((strength, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: index * 0.1 + 1.8 }}
                              whileHover={{ x: 5 }}
                              className="flex items-start space-x-2"
                            >
                              <motion.div
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ 
                                  repeat: Infinity,
                                  duration: 2,
                                  delay: index * 0.2,
                                  ease: "easeInOut"
                                }}
                                className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"
                              />
                              <p className="text-gray-600 text-sm">{strength}</p>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>

                      {/* Areas for Improvement */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 1.8 }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                          <TrendingUp className="h-5 w-5 text-blue-500" />
                          <span>Areas for Improvement</span>
                        </h3>
                        <div className="space-y-3">
                          {templateData.improvements.map((improvement, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: index * 0.1 + 2.0 }}
                              whileHover={{ x: -5 }}
                              className="flex items-start space-x-2"
                            >
                              <motion.div
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ 
                                  repeat: Infinity,
                                  duration: 2,
                                  delay: index * 0.2,
                                  ease: "easeInOut"
                                }}
                                className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"
                              />
                              <p className="text-gray-600 text-sm">{improvement}</p>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Sidebar */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="space-y-6"
                  >
                    {/* Transcript Summary */}
                    {enhancedData?.transcript && (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Analysis</h3>
                        <div className="space-y-3">
                          {(() => {
                            const responses = enhancedData.transcript.filter(entry => entry.score);
                            const correct = responses.filter(r => r.score === 'correct').length;
                            const partial = responses.filter(r => r.score === 'partial').length;
                            const incorrect = responses.filter(r => r.score === 'incorrect').length;
                            
                            return (
                              <>
                                <motion.div
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.4, delay: 0.6 }}
                                  className="flex items-center justify-between"
                                >
                                  <div className="flex items-center space-x-2">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span className="text-gray-700">Excellent</span>
                                  </div>
                                  <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ 
                                      duration: 0.3,
                                      delay: 0.8,
                                      type: "spring",
                                      stiffness: 200
                                    }}
                                    className="font-semibold text-green-600"
                                  >
                                    {correct}
                                  </motion.span>
                                </motion.div>
                                <motion.div
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.4, delay: 0.7 }}
                                  className="flex items-center justify-between"
                                >
                                  <div className="flex items-center space-x-2">
                                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                                    <span className="text-gray-700">Needs Work</span>
                                  </div>
                                  <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ 
                                      duration: 0.3,
                                      delay: 0.9,
                                      type: "spring",
                                      stiffness: 200
                                    }}
                                    className="font-semibold text-yellow-600"
                                  >
                                    {partial}
                                  </motion.span>
                                </motion.div>
                                <motion.div
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.4, delay: 0.8 }}
                                  className="flex items-center justify-between"
                                >
                                  <div className="flex items-center space-x-2">
                                    <XCircle className="h-4 w-4 text-red-500" />
                                    <span className="text-gray-700">Incorrect</span>
                                  </div>
                                  <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ 
                                      duration: 0.3,
                                      delay: 1.0,
                                      type: "spring",
                                      stiffness: 200
                                    }}
                                    className="font-semibold text-red-600"
                                  >
                                    {incorrect}
                                  </motion.span>
                                </motion.div>
                              </>
                            );
                          })()}
                        </div>
                      </motion.div>
                    )}

                    {/* Recommendations */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                        <Lightbulb className="h-5 w-5 text-yellow-500" />
                        <span>Recommendations</span>
                      </h3>
                      <div className="space-y-3">
                        {templateData.recommendations.map((recommendation, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 + 1.0 }}
                            whileHover={{ y: -2 }}
                            className="flex items-start space-x-2"
                          >
                            <motion.div
                              animate={{ rotate: [0, 45, 0] }}
                              transition={{ 
                                repeat: Infinity,
                                duration: 3,
                                delay: index * 0.3,
                                ease: "easeInOut"
                              }}
                              className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"
                            />
                            <p className="text-gray-600 text-sm">{recommendation}</p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FramerFeedback;