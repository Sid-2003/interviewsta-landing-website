import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip as RechartsTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';

/**
 * Renders a radar chart + score bars for a set of categories.
 * Props:
 *   title: string
 *   subtitle: string
 *   gradientFrom / gradientTo: Tailwind color classes for header gradient
 *   borderColor: Tailwind border class
 *   bgFrom / bgVia / bgTo: Tailwind bg gradient classes for card
 *   glowFrom / glowTo: Tailwind classes for glow bg
 *   radarStroke / radarFill: hex colors for radar chart
 *   radarGrid: hex color for polar grid
 *   radarTick: hex color for tick labels
 *   categories: [{ name, score, feedback }]  (used for bar list on the right)
 *   radarCategories: [{ category, score }]  (used for radar chart; if null, derived from categories)
 */
const ScoreBreakdown = ({
  title = 'Category Breakdown',
  subtitle = 'Performance across different skill categories',
  gradientFrom = 'from-orange-600',
  gradientTo = 'to-yellow-600',
  borderColor = 'border-orange-200/60',
  bgFrom = 'from-white',
  bgVia = 'via-orange-50/40',
  bgTo = 'to-amber-50/30',
  glowFrom = 'from-orange-500/10',
  glowVia = 'via-amber-500/10',
  glowTo = 'to-yellow-500/10',
  radarStroke = '#f97316',
  radarFill = '#f97316',
  radarGrid = '#fbbf24',
  radarTick = '#92400e',
  categories = [],
}) => {
  if (!categories || categories.length === 0) return null;

  const radarData = categories.map(c => ({ category: c.name, score: c.score || 0, fullName: c.name }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{payload[0].payload.fullName || payload[0].payload.category}</p>
          <p className="text-sm text-gray-600">Score: {payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  const getColor = (score) => {
    if (score >= 80) return { bg: 'from-green-500 to-emerald-500', text: 'text-green-700', border: 'border-green-200' };
    if (score >= 60) return { bg: 'from-yellow-500 to-amber-500', text: 'text-yellow-700', border: 'border-yellow-200' };
    return { bg: 'from-red-500 to-rose-500', text: 'text-red-700', border: 'border-red-200' };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="relative"
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${glowFrom} ${glowVia} ${glowTo} rounded-[2.5rem] blur-3xl -z-10`} />
      <div className={`bg-gradient-to-br ${bgFrom} ${bgVia} ${bgTo} rounded-[2.5rem] shadow-2xl border-2 ${borderColor} p-10 relative overflow-hidden backdrop-blur-sm`}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-gray-200/20 to-gray-100/20 rounded-full blur-3xl" />

        {/* Header */}
        <div className="relative mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="relative group">
              <div className={`absolute inset-0 bg-gradient-to-br ${radarStroke === '#f97316' ? 'from-orange-500 to-amber-500' : 'from-indigo-500 to-purple-500'} rounded-2xl blur-xl opacity-60`} />
              <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform`}
                style={{ background: `linear-gradient(135deg, ${radarStroke}, ${radarFill})` }}>
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

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: Radar Chart */}
          <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 border-2 border-white/30 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={360}>
              <RadarChart data={radarData}>
                <PolarGrid stroke={radarGrid} strokeDasharray="3 3" strokeOpacity={0.4} />
                <PolarAngleAxis dataKey="category" tick={{ fontSize: 12, fill: radarTick, fontWeight: 600 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke={radarStroke}
                  fill={radarFill}
                  fillOpacity={0.6}
                  strokeWidth={3}
                />
                <RechartsTooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Right: Score Bars */}
          <div className="space-y-4">
            {categories.map((item, index) => {
              const colors = getColor(item.score || 0);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.08 }}
                  className="group relative"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                  <div className={`relative bg-white/90 backdrop-blur-md rounded-2xl p-5 border-2 ${colors.border}/50 shadow-lg transform group-hover:scale-105 transition-all duration-300`}>
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <div className="min-w-0 flex-1">
                        <h5 className="font-bold text-gray-900 text-sm break-words">{item.name}</h5>
                        {item.feedback && <p className="text-xs text-gray-500 mt-0.5 break-words">{item.feedback}</p>}
                      </div>
                      <div className={`flex-shrink-0 text-2xl font-extrabold bg-gradient-to-br ${colors.bg} bg-clip-text text-transparent`}>
                        {item.score || 0}%
                      </div>
                    </div>
                    <div className="relative h-3 bg-gray-200/60 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.score || 0}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.08 }}
                        className={`h-full bg-gradient-to-r ${colors.bg} rounded-full shadow-md`}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ScoreBreakdown;
