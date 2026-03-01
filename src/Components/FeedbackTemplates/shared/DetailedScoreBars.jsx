import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  Tooltip as RechartsTooltip,
} from 'recharts';

/**
 * Two-column bar chart breakdown for detailed scores.
 * Props:
 *   title: string
 *   subtitle: string
 *   leftTitle: string
 *   rightTitle: string
 *   leftScore: number
 *   rightScore: number
 *   leftBreakdown: { [label]: number }
 *   rightBreakdown: { [label]: number }
 *   leftColor: hex
 *   rightColor: hex
 *   gradientFrom / gradientTo: Tailwind gradient classes
 */
const BreakdownChart = ({ title, score, breakdown, primaryColor, gradientId }) => {
  if (!breakdown) return null;
  const entries = Object.entries(breakdown);
  const chartData = entries.map(([skill, value]) => ({
    skill,
    current: value,
    target: 80,
    average: 65,
    percentile: Math.min(value + 10, 95),
  }));
  const chartHeight = entries.length * 80 + 50;

  const tooltipContent = ({ active, payload }) => {
    if (active && payload && payload.length && payload[0]) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 p-4 rounded-2xl shadow-2xl border-2 border-gray-200">
          <p className="font-bold text-gray-900 mb-3 text-sm border-b pb-2">{data.skill}</p>
          <div className="space-y-2">
            {payload.map((entry, idx) => (
              <div key={idx} className="flex items-center justify-between gap-4">
                <span className="text-xs font-semibold text-gray-600 capitalize">{entry.dataKey === 'current' ? 'Your Score' : entry.dataKey === 'target' ? 'Target' : 'Average'}:</span>
                <span className="text-sm font-bold" style={{ color: entry.fill }}>{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border-2 border-gray-200/40 shadow-xl">
      <div className="mb-4">
        <h4 className="text-xl font-bold text-gray-800">{title}</h4>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-3xl font-extrabold" style={{ color: primaryColor }}>{Math.trunc(score || 0)}%</span>
          <span className="text-gray-600 font-semibold">Overall</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 30, left: 130, bottom: 10 }}>
          <defs>
            <linearGradient id={`${gradientId}Current`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={primaryColor} stopOpacity={1} />
              <stop offset="100%" stopColor={primaryColor} stopOpacity={0.7} />
            </linearGradient>
            <linearGradient id={`${gradientId}Target`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
              <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id={`${gradientId}Average`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#e5e7eb" stopOpacity={1} />
              <stop offset="100%" stopColor="#d1d5db" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.4} />
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fontWeight: 600 }} />
          <YAxis dataKey="skill" type="category" width={120} tick={{ fontSize: 11, fontWeight: 600 }} />
          <Legend wrapperStyle={{ fontWeight: 700, fontSize: '12px' }} iconType="circle" />
          <RechartsTooltip content={tooltipContent} />
          <Bar dataKey="average" fill={`url(#${gradientId}Average)`} radius={[0, 8, 8, 0]} name="Average" />
          <Bar dataKey="target" fill={`url(#${gradientId}Target)`} radius={[0, 8, 8, 0]} name="Target" />
          <Bar dataKey="current" fill={`url(#${gradientId}Current)`} radius={[0, 8, 8, 0]} name="Your Score" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const DetailedScoreBars = ({
  title = 'Detailed Performance Analysis',
  subtitle = 'Comprehensive breakdown of your skills',
  gradientFrom = 'from-indigo-600',
  gradientTo = 'to-pink-600',
  borderColor = 'border-indigo-200/60',
  bgFrom = 'from-white',
  bgVia = 'via-indigo-50/40',
  bgTo = 'to-purple-50/30',
  glowFrom = 'from-indigo-500/10',
  glowVia = 'via-purple-500/10',
  glowTo = 'to-pink-500/10',
  leftTitle = 'Skill Group 1',
  rightTitle = 'Skill Group 2',
  leftScore = 0,
  rightScore = 0,
  leftBreakdown = {},
  rightBreakdown = {},
  leftColor = '#3b82f6',
  rightColor = '#8b5cf6',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="relative"
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${glowFrom} ${glowVia} ${glowTo} rounded-[2.5rem] blur-3xl -z-10`} />
      <div className={`bg-gradient-to-br ${bgFrom} ${bgVia} ${bgTo} rounded-[2.5rem] shadow-2xl border-2 ${borderColor} p-10 relative overflow-hidden backdrop-blur-sm`}>

        {/* Header */}
        <div className="relative mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl blur-xl opacity-60" />
              <div className="relative w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                <BarChart3 className="text-white" size={28} />
              </div>
            </div>
            <div>
              <h3 className={`text-3xl font-extrabold bg-gradient-to-r ${gradientFrom} ${gradientTo} bg-clip-text text-transparent`}>
                {title}
              </h3>
              <p className="text-gray-700 text-base mt-1 font-semibold">{subtitle}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
          <BreakdownChart
            title={leftTitle}
            score={leftScore}
            breakdown={leftBreakdown}
            primaryColor={leftColor}
            gradientId="left"
          />
          <BreakdownChart
            title={rightTitle}
            score={rightScore}
            breakdown={rightBreakdown}
            primaryColor={rightColor}
            gradientId="right"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default DetailedScoreBars;
