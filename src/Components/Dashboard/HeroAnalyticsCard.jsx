import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Target, TrendingUp } from 'lucide-react';

const RadialProgress = ({ score, size = 80, strokeWidth = 8, color = '#3b82f6' }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;
  const gradientId = `gradient-${color.replace('#', '')}-${size}`;

  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const stepValue = score / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += stepValue;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Glow effect */}
      <div 
        className="absolute inset-0 rounded-full blur-md opacity-30"
        style={{ 
          background: `radial-gradient(circle, ${color}40, transparent 70%)`,
          transform: 'scale(1.2)'
        }}
      />
      <svg
        className="transform -rotate-90 relative z-10"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
          className="opacity-30"
        />
        {/* Progress circle with gradient */}
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.8" />
          </linearGradient>
        </defs>
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="drop-shadow-lg"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <span className="text-xl font-bold text-gray-900">{Math.round(animatedScore)}%</span>
      </div>
    </div>
  );
};

export const ResumeScoreCard = ({ avgScore = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="relative group overflow-hidden"
    >
      {/* Glowing background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-rose-500/10 rounded-t-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
      
      <div className="bg-white rounded-t-3xl shadow-xl border-2 border-purple-100/50 hover:border-purple-300/50 p-6 hover:shadow-2xl transition-all duration-300 backdrop-blur-sm relative overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-purple-100/20 to-pink-100/20 rounded-full blur-3xl" />
        
        <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
                <h3 className="text-base font-bold text-gray-900">Resume Score</h3>
                <p className="text-xs text-gray-600">Average analysis</p>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
            <RadialProgress score={avgScore} size={90} color="#8b5cf6" />
        <div className="flex-1">
              <div className="flex items-baseline space-x-2 mb-2">
                <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{Math.round(avgScore)}</span>
            <span className="text-sm text-gray-500">/ 100</span>
          </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 shadow-inner">
            <motion.div
                  className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 h-2.5 rounded-full shadow-lg"
              initial={{ width: 0 }}
              animate={{ width: `${avgScore}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const SkillsProgressCard = ({ skills = [] }) => {
  const avgSkillScore = skills.length > 0
    ? Math.round(skills.reduce((sum, s) => sum + (s.current || 0), 0) / skills.length)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="relative group overflow-hidden"
    >
      {/* Glowing background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-teal-500/10 rounded-t-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
      
      <div className="bg-white rounded-t-3xl shadow-xl border-2 border-blue-100/50 hover:border-blue-300/50 p-6 hover:shadow-2xl transition-all duration-300 backdrop-blur-sm relative overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-100/20 to-cyan-100/20 rounded-full blur-3xl" />
        
        <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                <Target className="h-6 w-6 text-white" />
          </div>
          <div>
                <h3 className="text-base font-bold text-gray-900">Skills Progress</h3>
                <p className="text-xs text-gray-600">{skills.length} skills tracked</p>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
            <RadialProgress score={avgSkillScore} size={90} color="#3b82f6" />
        <div className="flex-1">
              <div className="flex items-baseline space-x-2 mb-2">
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{avgSkillScore}</span>
            <span className="text-sm text-gray-500">avg score</span>
          </div>
          {skills.length > 0 ? (
                <div className="space-y-2">
              {skills.slice(0, 2).map((skill, idx) => (
                    <div key={idx} className="w-full bg-gray-200 rounded-full h-2 shadow-inner">
                  <motion.div
                        className={`h-2 rounded-full shadow-md ${
                          skill.color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                          skill.color === 'green' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                          skill.color === 'purple' ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                          'bg-gradient-to-r from-gray-500 to-gray-600'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.current || 0}%` }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400">Start practicing to track skills</p>
          )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const StudyPlanCard = ({ studyPlans = [] }) => {
  const avgProgress = studyPlans.length > 0
    ? Math.round(studyPlans.reduce((sum, p) => sum + (p.progress || 0), 0) / studyPlans.length)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="relative group overflow-hidden"
    >
      {/* Glowing background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 rounded-t-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
      
      <div className="bg-white rounded-t-3xl shadow-xl border-2 border-green-100/50 hover:border-green-300/50 p-6 hover:shadow-2xl transition-all duration-300 backdrop-blur-sm relative overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-green-100/20 to-emerald-100/20 rounded-full blur-3xl" />
        
      {studyPlans.length === 0 && (
          <div className="absolute inset-0 bg-gray-50/80 backdrop-blur-sm flex items-center justify-center z-20 rounded-3xl">
          <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-gray-300 to-gray-400 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <p className="text-sm text-gray-600 font-semibold">Unlock Soon</p>
          </div>
        </div>
      )}
        <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
                <h3 className="text-base font-bold text-gray-900">Study Plans</h3>
                <p className="text-xs text-gray-600">{studyPlans.length || 0} active plans</p>
          </div>
        </div>
      </div>
      {studyPlans.length > 0 ? (
        <div className="flex items-center space-x-4">
              <RadialProgress score={avgProgress} size={90} color="#10b981" />
          <div className="flex-1">
                <div className="flex items-baseline space-x-2 mb-2">
                  <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{avgProgress}%</span>
              <span className="text-sm text-gray-500">complete</span>
            </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 shadow-inner">
              <motion.div
                    className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 h-2.5 rounded-full shadow-lg"
                initial={{ width: 0 }}
                animate={{ width: `${avgProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center py-4">
          <p className="text-sm text-gray-400">Coming soon</p>
        </div>
      )}
        </div>
      </div>
    </motion.div>
  );
};

