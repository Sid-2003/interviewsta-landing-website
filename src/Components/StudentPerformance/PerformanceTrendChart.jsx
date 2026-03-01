import React from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function PerformanceTrendChart({ trend, title = 'Performance trend', height = 280 }) {
  if (!trend?.length) {
    return (
      <div className="rounded-2xl bg-gray-50 border border-gray-100 p-8 text-center" style={{ height }}>
        <p className="text-gray-500 font-medium">No trend data yet</p>
        <p className="text-gray-400 text-sm mt-1">Complete more interviews to see your performance over time</p>
      </div>
    );
  }

  const chartData = trend.map(({ date, score }, index) => ({
    index,
    date: date ? new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' }) : '',
    score: Number(score),
    fullDate: date,
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6"
    >
      <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="index"
            type="number"
            domain={['dataMin', 'dataMax']}
            tickFormatter={(tickValue) => chartData[tickValue]?.date ?? ''}
            tick={{ fontSize: 11 }}
            stroke="#9ca3af"
          />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#9ca3af" />
          <Tooltip
            contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
            formatter={(value) => [`${value}%`, 'Score']}
            labelFormatter={(_, payload) => payload[0]?.payload?.fullDate ? new Date(payload[0].payload.fullDate).toLocaleDateString() : ''}
            cursor={{ stroke: '#8b5cf6', strokeWidth: 1, strokeDasharray: '3 3' }}
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#8b5cf6"
            strokeWidth={2}
            fill="url(#trendGradient)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
