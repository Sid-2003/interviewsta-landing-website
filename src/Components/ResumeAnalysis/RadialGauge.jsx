import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const RadialGauge = ({ score, label, subLabel, color = '#3b82f6', size = 120 }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  useEffect(() => {
    const duration = 1500;
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

  const currentOffset = circumference - (animatedScore / 100) * circumference;

  return (
    <motion.div 
      className="text-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative mx-auto" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
          viewBox="0 0 100 100"
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: currentOffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="hover:opacity-90 transition-opacity"
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            className="text-2xl font-bold text-gray-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {Math.round(animatedScore)}
          </motion.span>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mt-3">{label}</h3>
      {subLabel && (
        <p className="text-gray-600 text-sm mt-1">{subLabel}</p>
      )}
    </motion.div>
  );
};

export default RadialGauge;

