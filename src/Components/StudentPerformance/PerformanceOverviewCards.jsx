import React from 'react';
import { motion } from 'framer-motion';
import { Code, Users, Brain, Mic, MessageSquare, Award } from 'lucide-react';

const TYPE_CONFIG = {
  technical: {
    label: 'Technical',
    sublabel: 'Coding / Company / Subject',
    icon: Code,
    bg: 'from-violet-500 to-purple-600',
    light: 'bg-violet-50',
    border: 'border-violet-200',
    text: 'text-violet-700',
  },
  hr: {
    label: 'HR',
    sublabel: 'Behavioral & fit',
    icon: Users,
    bg: 'from-emerald-500 to-teal-600',
    light: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
  },
  case_study: {
    label: 'Case Study',
    sublabel: 'Analytical & business',
    icon: Brain,
    bg: 'from-amber-500 to-orange-600',
    light: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
  },
  communication: {
    label: 'Communication',
    sublabel: 'Speaking & comprehension',
    icon: Mic,
    bg: 'from-cyan-500 to-blue-600',
    light: 'bg-cyan-50',
    border: 'border-cyan-200',
    text: 'text-cyan-700',
  },
  debate: {
    label: 'Debate',
    sublabel: 'Argumentation & persuasion',
    icon: MessageSquare,
    bg: 'from-rose-500 to-pink-600',
    light: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-700',
  },
};

export default function PerformanceOverviewCards({ byType, overall }) {
  const totalSessions = overall?.total_sessions ?? 0;
  const overallAvg = overall?.overall_avg ?? 0;

  return (
    <div className="space-y-6">
      {/* Overall card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white shadow-xl border border-slate-700"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Overall Performance</h3>
              <p className="text-slate-300 text-sm">Across all interview types</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-extrabold">{overallAvg}%</div>
            <div className="text-slate-400 text-sm">{totalSessions} total sessions</div>
          </div>
        </div>
      </motion.div>

      {/* Per-type cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {Object.entries(TYPE_CONFIG).map(([key, config], index) => {
          const data = byType?.[key] || { count: 0, avg_score: 0 };
          const Icon = config.icon;
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-2xl ${config.light} border-2 ${config.border} p-5 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.bg} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className={`font-bold ${config.text}`}>{config.label}</h4>
                  <p className="text-xs text-gray-500">{config.sublabel}</p>
                </div>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-extrabold text-gray-900">{data.avg_score}%</span>
                <span className="text-sm text-gray-600">{data.count} sessions</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
