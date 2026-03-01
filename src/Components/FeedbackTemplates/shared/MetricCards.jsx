import React from 'react';
import { motion } from 'framer-motion';

/**
 * MetricCard - single stat card
 * Props: label, value, icon (React component), bgColor (Tailwind bg-gradient class)
 */
export const MetricCard = ({ label, value, icon: Icon, bgColor }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`${bgColor} rounded-3xl p-6 border border-white/20 relative overflow-hidden group shadow-lg`}
  >
    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500" />
    <div className="absolute bottom-0 left-0 w-2 h-2 bg-white/20 rounded-full" />
    <div className="flex items-center justify-between mb-4 relative">
      <p className="text-sm font-bold text-white/90 uppercase tracking-wide">{label}</p>
      <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
        {Icon && <Icon className="text-white" size={24} />}
      </div>
    </div>
    <p className="text-5xl font-bold text-white relative">{value}</p>
  </motion.div>
);

export default MetricCard;
