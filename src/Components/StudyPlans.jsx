import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  Target, 
  CheckCircle, 
  PlayCircle,
  Plus,
  Calendar,
  TrendingUp,
  Award,
  ChevronRight,
  Star
} from 'lucide-react';
// import type { StudyPlan } from '../types';

const StudyPlans = () => {
  const [activeTab, setActiveTab] = useState('my-plans');

  const myPlans = [
    {
      id: '1',
      title: 'Frontend Development Mastery',
      progress: 65,
      estimatedTime: '4 weeks',
      topics: ['React', 'JavaScript ES6+', 'CSS Grid/Flexbox', 'TypeScript', 'Testing'],
      difficulty: 'intermediate'
    },
    {
      id: '2',
      title: 'Behavioral Interview Excellence',
      progress: 40,
      estimatedTime: '2 weeks',
      topics: ['STAR Method', 'Leadership Stories', 'Conflict Resolution', 'Team Collaboration'],
      difficulty: 'beginner'
    },
    {
      id: '3',
      title: 'System Design Fundamentals',
      progress: 25,
      estimatedTime: '6 weeks',
      topics: ['Scalability', 'Database Design', 'Caching', 'Load Balancing', 'Microservices'],
      difficulty: 'advanced'
    }
  ];

  const recommendedPlans = [
    {
      title: 'Data Structures & Algorithms',
      description: 'Master fundamental CS concepts for technical interviews',
      duration: '8 weeks',
      difficulty: 'intermediate',
      rating: 4.8,
      students: 15420,
      topics: ['Arrays', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming']
    },
    {
      title: 'Product Manager Interview Prep',
      description: 'Complete preparation for PM roles at top tech companies',
      duration: '5 weeks',
      difficulty: 'advanced',
      rating: 4.9,
      students: 8340,
      topics: ['Product Strategy', 'Metrics', 'A/B Testing', 'User Research', 'Roadmapping']
    },
    {
      title: 'Full-Stack Development',
      description: 'End-to-end web development skills for modern applications',
      duration: '12 weeks',
      difficulty: 'intermediate',
      rating: 4.7,
      students: 23100,
      topics: ['React', 'Node.js', 'Databases', 'APIs', 'DevOps']
    }
  ];

  const learningStats = [
    { label: 'Study Streak', value: '12 days', icon: Calendar },
    { label: 'Topics Mastered', value: '28', icon: Target },
    { label: 'Total Study Time', value: '47h', icon: Clock },
    { label: 'Certificates Earned', value: '5', icon: Award }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Study Plans</h1>
          <p className="text-gray-600 mt-2">Personalized learning paths to achieve your career goals</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {learningStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'my-plans', label: 'My Plans', count: myPlans.length },
                { id: 'recommended', label: 'Recommended', count: recommendedPlans.length },
                { id: 'create', label: 'Create Custom' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  {tab.count && (
                    <span className="ml-2 bg-gray-100 text-gray-900 px-2 py-1 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'my-plans' && (
              <div className="space-y-6">
                {myPlans.map((plan) => (
                  <div key={plan.id} className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{plan.estimatedTime}</span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            plan.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                            plan.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {plan.difficulty}
                          </span>
                        </div>
                        
                        {/* Progress */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{plan.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${plan.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Topics */}
                        <div className="flex flex-wrap gap-2">
                          {plan.topics.map((topic, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-6">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                          <PlayCircle className="h-4 w-4" />
                          <span>Continue</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                <button className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group">
                  <Plus className="h-8 w-8 text-gray-400 group-hover:text-blue-600 mx-auto mb-2" />
                  <p className="text-gray-600 group-hover:text-blue-700 font-medium">Create New Study Plan</p>
                </button>
              </div>
            )}

            {activeTab === 'recommended' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedPlans.map((plan, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{plan.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{plan.duration}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          plan.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                          plan.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {plan.difficulty}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>{plan.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{plan.students.toLocaleString()} students</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {plan.topics.slice(0, 3).map((topic, topicIndex) => (
                          <span key={topicIndex} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {topic}
                          </span>
                        ))}
                        {plan.topics.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            +{plan.topics.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2">
                      <span>Start Learning</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'create' && (
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <Target className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Custom Study Plan</h2>
                  <p className="text-gray-600">Design a personalized learning path tailored to your goals</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Plan Title</label>
                    <input
                      type="text"
                      placeholder="e.g., Senior Software Engineer Preparation"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Role</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Select a target role</option>
                      <option>Software Engineer</option>
                      <option>Product Manager</option>
                      <option>Data Scientist</option>
                      <option>Engineering Manager</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time Commitment</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['1-2 hours/week', '3-5 hours/week', '6+ hours/week'].map((time, index) => (
                        <button
                          key={index}
                          className="p-3 border border-gray-300 rounded-lg text-sm hover:border-blue-300 hover:bg-blue-50 transition-colors"
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Areas to Focus On</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        'Technical Skills',
                        'Behavioral Questions',
                        'System Design',
                        'Leadership',
                        'Communication',
                        'Problem Solving'
                      ].map((area, index) => (
                        <label key={index} className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                          <span className="text-sm text-gray-700">{area}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200">
                    Create Study Plan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPlans;