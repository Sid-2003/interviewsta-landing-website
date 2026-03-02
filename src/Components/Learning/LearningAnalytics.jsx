import React from 'react';
import { BarChart3, BookOpen, Target, TrendingUp, Award, Clock, CheckCircle2 } from 'lucide-react';

const LearningAnalytics = () => {
  const stats = [
    {
      id: 1,
      title: 'Topics Completed',
      value: 12,
      icon: CheckCircle2,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      id: 2,
      title: 'Courses in Progress',
      value: 3,
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      id: 3,
      title: 'Topics Mastered',
      value: 8,
      icon: Target,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      id: 4,
      title: 'Learning Streak',
      value: '7 days',
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Learning Analytics</h2>
          <p className="text-gray-600">Track your overall progress</p>
        </div>
        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className="bg-white rounded-2xl shadow-md border border-gray-200 hover:border-purple-300 transition-colors duration-150 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${stat.color}`} />
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>

                {/* Progress indicator for streak */}
                {stat.id === 4 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      {[...Array(7)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < 7 ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Gradient accent */}
              <div className={`h-1 bg-gradient-to-r ${stat.color}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LearningAnalytics;

