import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const KeywordVisualizations = ({ keywords }) => {
  const [hoveredBubble, setHoveredBubble] = useState(null);

  // Prepare data for donut chart
  const foundCount = keywords?.found?.length || 0;
  const missingCount = keywords?.missing?.length || 0;
  const suggestedCount = (keywords?.jobSpecific?.length || keywords?.suggested?.length) || 0;
  
  const donutData = [
    { name: 'Found', value: foundCount, color: '#10b981' },
    { name: 'Missing', value: missingCount, color: '#f97316' },
    { name: 'Suggested', value: suggestedCount, color: '#8b5cf6' }
  ].filter(item => item.value > 0);

  const totalKeywords = foundCount + missingCount + suggestedCount;

  // Prepare bubble cloud data
  const bubbleData = [
    ...((keywords?.found || []).map(kw => ({ keyword: kw, type: 'found', size: 40 }))),
    ...((keywords?.missing || []).map(kw => ({ keyword: kw, type: 'missing', size: 50 }))),
    ...((keywords?.jobSpecific || keywords?.suggested || []).map(kw => ({ keyword: kw, type: 'suggested', size: 45 })))
  ];

  const getBubbleColor = (type) => {
    switch (type) {
      case 'found': return '#10b981';
      case 'missing': return '#f97316';
      case 'suggested': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getBubbleBgColor = (type) => {
    switch (type) {
      case 'found': return 'bg-green-100';
      case 'missing': return 'bg-orange-100';
      case 'suggested': return 'bg-purple-100';
      default: return 'bg-gray-100';
    }
  };

  const getBubbleTextColor = (type) => {
    switch (type) {
      case 'found': return 'text-green-800';
      case 'missing': return 'text-orange-800';
      case 'suggested': return 'text-purple-800';
      default: return 'text-gray-800';
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold" style={{ color: data.color }}>
            {data.name}
          </p>
          <p className="text-sm text-gray-600">{data.value} keywords</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Donut Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-50 rounded-lg p-4"
      >
        <h4 className="text-sm font-medium text-gray-900 mb-4 text-center">
          Keyword Coverage
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={donutData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              className="hover:opacity-90 transition-opacity"
            >
              {donutData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
            />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-2xl font-bold fill-gray-900"
            >
              {totalKeywords}
            </text>
            <text
              x="50%"
              y="58%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs fill-gray-600"
            >
              Total
            </text>
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Bubble Cloud */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-4">
          Keyword Overview
        </h4>
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {bubbleData.map((bubble, index) => (
              <motion.div
                key={`${bubble.keyword}-${index}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                whileHover={{ scale: 1.1, zIndex: 10 }}
                onHoverStart={() => setHoveredBubble(index)}
                onHoverEnd={() => setHoveredBubble(null)}
                className={`${getBubbleBgColor(bubble.type)} ${getBubbleTextColor(bubble.type)} px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-all ${
                  hoveredBubble === index ? `ring-2 ring-offset-2 ${bubble.type === 'found' ? 'ring-green-500' : bubble.type === 'missing' ? 'ring-orange-500' : 'ring-purple-500'}` : ''
                }`}
                title={`${bubble.keyword} - ${bubble.type === 'found' ? 'Found in resume' : bubble.type === 'missing' ? 'Missing from resume' : 'Suggested to add'}`}
              >
                {bubble.keyword}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Keyword Score */}
      {(keywords?.score !== undefined) && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">
            Keyword Optimization Score
          </h4>
          <div className="flex items-center space-x-4">
            <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${keywords.score || 0}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
            <span className="font-semibold text-gray-900 w-12 text-right">
              {keywords.score || 0}%
            </span>
          </div>
          <p className="text-gray-600 text-sm mt-2">
            {(keywords.score || 0) >= 80
              ? "Excellent keyword optimization!"
              : (keywords.score || 0) >= 60
              ? "Good keyword usage, room for improvement"
              : "Needs significant keyword optimization"}
          </p>
        </div>
      )}
    </div>
  );
};

export default KeywordVisualizations;

