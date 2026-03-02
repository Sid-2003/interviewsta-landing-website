import React from 'react';
import { motion } from 'framer-motion';

const MultiRingDonut = ({ jobAlignment }) => {
  const rings = [
    { key: 'requiredSkills', label: 'Required Skills', color: '#8b5cf6', order: 0 },
    { key: 'preferredSkills', label: 'Preferred Skills', color: '#a855f7', order: 1 },
    { key: 'experience', label: 'Experience', color: '#c084fc', order: 2 },
    { key: 'education', label: 'Education', color: '#d8b4fe', order: 3 },
    { key: 'overall', label: 'Overall', color: '#9333ea', order: 4 }
  ].filter(ring => jobAlignment[ring.key] !== undefined);

  const maxRadius = 50;
  const strokeWidth = 8;
  const gap = 6;

  const getRadius = (order) => {
    return maxRadius - (order * (strokeWidth + gap));
  };

  const getCircumference = (radius) => {
    return 2 * Math.PI * radius;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-50 rounded-lg p-6"
    >
      <h4 className="text-sm font-medium text-gray-900 mb-6 text-center">
        Job Alignment Breakdown
      </h4>
      <div className="relative mx-auto" style={{ width: 240, height: 240 }}>
        <svg
          className="transform -rotate-90"
          width={240}
          height={240}
          viewBox="0 0 120 120"
        >
          {rings.map((ring, index) => {
            const score = jobAlignment[ring.key];
            const radius = getRadius(ring.order);
            const circumference = getCircumference(radius);
            const offset = circumference - (score / 100) * circumference;

            return (
              <g key={ring.key}>
                {/* Background circle */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke="#e5e7eb"
                  strokeWidth={strokeWidth}
                  fill="none"
                />
                {/* Progress circle */}
                <motion.circle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke={ring.color}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 1.5, delay: index * 0.1, ease: "easeOut" }}
                  className="hover:opacity-90 transition-opacity"
                />
              </g>
            );
          })}
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">
            {Math.round(jobAlignment.overall || 0)}%
          </span>
          <span className="text-xs text-gray-600 mt-1">Overall</span>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-6 space-y-2">
        {rings.map((ring, index) => (
          <motion.div
            key={ring.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: ring.color }}
              />
              <span className="text-sm text-gray-700 capitalize">
                {ring.label.replace(/([A-Z])/g, " $1").trim()}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {jobAlignment[ring.key]}%
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default MultiRingDonut;

