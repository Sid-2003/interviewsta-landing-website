import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TYPE_LABELS = {
  technical: 'Technical',
  hr: 'HR',
  case_study: 'Case Study',
  communication: 'Communication',
  debate: 'Debate',
};

const COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#06b6d4', '#f43f5e'];

export default function PerformanceByTypeBreakdown({ byType }) {
  const data = byType
    ? Object.entries(byType).map(([key, val], i) => ({
        name: TYPE_LABELS[key] || key,
        type: key,
        avg: val.avg_score,
        count: val.count,
        fill: COLORS[i % COLORS.length],
      }))
    : [];

  if (!data.length || data.every((d) => d.count === 0)) {
    return (
      <div className="rounded-2xl bg-gray-50 border border-gray-100 p-8 text-center">
        <p className="text-gray-500 font-medium">No breakdown yet</p>
        <p className="text-gray-400 text-sm mt-1">Your average per interview type will appear here</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6"
    >
      <h3 className="text-lg font-bold text-gray-900 mb-4">Average score by type</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="name" width={75} tick={{ fontSize: 12, fontWeight: 600 }} />
          <Tooltip
            contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
            formatter={(value, name, props) => [`${value}% avg · ${props.payload.count} sessions`, 'Score']}
          />
          <Bar dataKey="avg" fill="#8b5cf6" radius={[0, 6, 6, 0]} name="Average" />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
