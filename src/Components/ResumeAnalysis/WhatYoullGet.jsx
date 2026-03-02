import React from 'react';
import { Target, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const WhatYoullGet = () => {
  const outcomes = [
    {
      icon: Target,
      title: 'Job Match Score',
      example: '78%',
      description: 'See how well your resume aligns with the job requirements',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      boxBg: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      icon: TrendingUp,
      title: 'Missing Skills',
      example: 'REST APIs, Git, Jest',
      description: 'Identify skills mentioned in the job but missing from your resume',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      boxBg: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
    {
      icon: Sparkles,
      title: 'Improvement Tips',
      example: '• Use stronger action verbs\n• Add quantifiable achievements\n• Optimize keywords',
      description: 'Get specific, actionable recommendations to improve your resume',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      boxBg: 'bg-green-50',
      textColor: 'text-green-700',
    },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-100">
      <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
        What You'll Get
      </h3>
      <p className="text-gray-600 text-sm text-center mb-8">
        Comprehensive AI-powered insights to optimize your resume
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        {outcomes.map((outcome, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
          >
            <div className={`w-12 h-12 ${outcome.iconBg} rounded-lg flex items-center justify-center mb-4 mx-auto`}>
              <outcome.icon className={`h-6 w-6 ${outcome.iconColor}`} />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2 text-center">
              {outcome.title}
            </h4>
            <div className={`${outcome.boxBg} rounded-lg p-3 mb-3`}>
              <p className={`${outcome.textColor} text-sm font-medium whitespace-pre-line text-center`}>
                {outcome.example}
              </p>
            </div>
            <p className="text-gray-600 text-xs text-center">
              {outcome.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WhatYoullGet;
