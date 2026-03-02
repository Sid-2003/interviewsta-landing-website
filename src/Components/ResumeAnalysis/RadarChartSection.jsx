import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

const RadarChartSection = ({ sections }) => {
  const radarData = sections.map((section) => ({
    category: section.name.length > 15 ? section.name.substring(0, 12) + '...' : section.name,
    fullName: section.name,
    score: section.score,
    status: section.status
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{payload[0].payload.fullName}</p>
          <p className="text-sm text-gray-600">Score: {payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Radar Chart */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-50 rounded-lg p-4"
      >
        <h4 className="text-sm font-medium text-gray-700 mb-4 text-center">Overall Shape</h4>
        <ResponsiveContainer width="100%" height={250}>
          <RadarChart data={radarData} className="hover:opacity-90 transition-opacity">
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis 
              dataKey="category" 
              tick={{ fontSize: 11, fill: '#6b7280' }}
            />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Score"
              dataKey="score"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
              strokeWidth={2}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Mini Progress Bars */}
      <div className="space-y-4">
        {sections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    section.status === "excellent"
                      ? "bg-green-500"
                      : section.status === "good"
                      ? "bg-blue-500"
                      : "bg-yellow-500"
                  } group-hover:scale-125 transition-transform`}
                />
                <span className="text-sm text-gray-900">{section.name}</span>
              </div>
              <span className="text-sm font-medium text-gray-900 w-12 text-right">
                {section.score}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <motion.div
                className={`h-1.5 rounded-full ${
                  section.status === "excellent"
                    ? "bg-green-500"
                    : section.status === "good"
                    ? "bg-blue-500"
                    : "bg-yellow-500"
                } group-hover:shadow-md transition-shadow`}
                initial={{ width: 0 }}
                animate={{ width: `${section.score}%` }}
                transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RadarChartSection;

