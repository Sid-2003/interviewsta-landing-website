import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SkillsTrackerCard = ({ skills = [], skillCategories = [], selectedSkillFilter, onFilterChange, onAddSkill }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();
  const hasSkills = skills.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Skills Progress Tracker</h3>
        <div className="flex items-center space-x-3">
          {hasSkills ? (
            <select 
              value={selectedSkillFilter}
              onChange={(e) => onFilterChange(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Skills</option>
              {skillCategories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          ) : (
            <button
              onClick={() => navigate('/video-interview')}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:shadow-md transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Add your first skill</span>
            </button>
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {!hasSkills ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-10 w-10 text-blue-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Start Tracking Your Skills</h4>
            <p className="text-gray-600 text-sm mb-6 max-w-sm mx-auto">
              Complete interviews and tests to automatically track your skill progress and see detailed analytics
            </p>
            <button
              onClick={() => navigate('/video-interview')}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:shadow-md transition-all mx-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Start Your First Interview</span>
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-medium text-gray-900">{skill.skill}</h4>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{skill.interviews} interviews</span>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{skill.current}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
                    <motion.div 
                      className={`absolute top-0 left-0 h-3 rounded-full transition-all duration-1000 ${
                        skill.color === 'blue' ? 'bg-blue-600' :
                        skill.color === 'purple' ? 'bg-purple-600' :
                        skill.color === 'green' ? 'bg-green-600' :
                        skill.color === 'orange' ? 'bg-orange-600' :
                        skill.color === 'indigo' ? 'bg-indigo-600' :
                        skill.color === 'red' ? 'bg-red-600' :
                        skill.color === 'cyan' ? 'bg-cyan-600' :
                        'bg-pink-600'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.current}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SkillsTrackerCard;

