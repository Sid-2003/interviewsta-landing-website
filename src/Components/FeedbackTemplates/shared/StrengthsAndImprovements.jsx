import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Target, MessageSquare } from 'lucide-react';

const StrengthsAndImprovements = ({ strengths = [], improvements = [], recommendations = [] }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 rounded-[2.5rem] blur-3xl -z-10" />
      <div className="bg-gradient-to-br from-white via-green-50/40 to-emerald-50/30 rounded-[2.5rem] shadow-2xl border-2 border-green-200/60 p-10 relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-300/20 to-emerald-300/20 rounded-full blur-3xl" />

        {/* Header */}
        <div className="relative mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl blur-xl opacity-60" />
              <div className="relative w-14 h-14 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <CheckCircle className="text-white" size={28} />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-extrabold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Feedback Summary
              </h3>
              <p className="text-gray-700 text-base mt-1 font-semibold">Your strengths, improvements, and recommendations</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
          {/* Strengths */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border-2 border-green-200/40 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                <CheckCircle className="text-white" size={20} />
              </div>
              <h4 className="text-lg font-bold text-green-700">Strengths</h4>
            </div>
            <ul className="space-y-3">
              {strengths.filter(s => s && s.trim()).map((strength, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700 text-sm leading-relaxed">{strength.trim()}</span>
                </li>
              ))}
              {strengths.filter(s => s && s.trim()).length === 0 && (
                <li className="text-gray-500 text-sm">No strengths data available</li>
              )}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border-2 border-orange-200/40 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Target className="text-white" size={20} />
              </div>
              <h4 className="text-lg font-bold text-orange-700">Areas for Improvement</h4>
            </div>
            <ul className="space-y-3">
              {improvements.filter(s => s && s.trim()).map((improvement, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700 text-sm leading-relaxed">{improvement.trim()}</span>
                </li>
              ))}
              {improvements.filter(s => s && s.trim()).length === 0 && (
                <li className="text-gray-500 text-sm">No improvement data available</li>
              )}
            </ul>
          </div>

          {/* Recommendations */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border-2 border-blue-200/40 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <MessageSquare className="text-white" size={20} />
              </div>
              <h4 className="text-lg font-bold text-blue-700">Recommendations</h4>
            </div>
            <ul className="space-y-3">
              {recommendations.filter(s => s && s.trim()).map((rec, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700 text-sm leading-relaxed">{rec.trim()}</span>
                </li>
              ))}
              {recommendations.filter(s => s && s.trim()).length === 0 && (
                <li className="text-gray-500 text-sm">No recommendations available</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StrengthsAndImprovements;
