import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

const ResponseAnalysis = ({ transcript = [] }) => {
  const responses = transcript.filter(entry => entry.score);
  if (responses.length === 0) return null;

  const correct = responses.filter(r => r.score === 'correct answer').length;
  const partial = responses.filter(r => r.score === 'cross-question answer' || r.score === 'partially-correct answer').length;
  const incorrect = responses.filter(r => r.score === 'incorrect answer').length;
  const total = responses.length;

  const responseTypes = [
    {
      label: 'Excellent',
      count: correct,
      percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
      icon: CheckCircle,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-300/50',
      textColor: 'text-green-700',
      iconBg: 'bg-green-500',
    },
    {
      label: 'Partial / Cross-Question',
      count: partial,
      percentage: total > 0 ? Math.round((partial / total) * 100) : 0,
      icon: AlertCircle,
      gradient: 'from-yellow-500 to-amber-500',
      bgGradient: 'from-yellow-50 to-amber-50',
      borderColor: 'border-yellow-300/50',
      textColor: 'text-yellow-700',
      iconBg: 'bg-yellow-500',
    },
    {
      label: 'Incorrect',
      count: incorrect,
      percentage: total > 0 ? Math.round((incorrect / total) * 100) : 0,
      icon: XCircle,
      gradient: 'from-red-500 to-rose-500',
      bgGradient: 'from-red-50 to-rose-50',
      borderColor: 'border-red-300/50',
      textColor: 'text-red-700',
      iconBg: 'bg-red-500',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-teal-500/10 rounded-[2.5rem] blur-3xl -z-10" />
      <div className="bg-gradient-to-br from-white via-blue-50/40 to-cyan-50/30 rounded-[2.5rem] shadow-2xl border-2 border-blue-200/60 p-10 relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-300/20 to-cyan-300/20 rounded-full blur-3xl" />

        <div className="relative mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl blur-xl opacity-60" />
              <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <BarChart3 className="text-white" size={28} />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
                Response Analysis
              </h3>
              <p className="text-gray-700 text-base mt-1 font-semibold">Breakdown of your interview responses</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {responseTypes.map((type, index) => {
            const Icon = type.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${type.gradient} rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
                <div className={`relative bg-gradient-to-br ${type.bgGradient} backdrop-blur-md rounded-3xl p-6 border-2 ${type.borderColor} shadow-xl transform group-hover:scale-105 transition-all duration-300`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${type.iconBg} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <Icon className="text-white" size={24} />
                    </div>
                    <div className="text-right">
                      <div className={`text-3xl font-extrabold ${type.textColor}`}>{type.count}</div>
                      <div className={`text-sm font-semibold ${type.textColor} opacity-80`}>responses</div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className={`text-lg font-bold ${type.textColor} mb-1`}>{type.label}</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-3 bg-white/50 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${type.percentage}%` }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                          className={`h-full bg-gradient-to-r ${type.gradient} rounded-full`}
                        />
                      </div>
                      <span className={`text-sm font-bold ${type.textColor}`}>{type.percentage}%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default ResponseAnalysis;
