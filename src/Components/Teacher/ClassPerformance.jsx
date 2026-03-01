import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Clock, Award, AlertCircle, Trophy, Target } from 'lucide-react';
import axios from 'axios';

import api from "../../service/api";
const ClassPerformance = ({ classId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClassPerformance();
  }, [classId]);

  const fetchClassPerformance = async () => {
    try {
      setLoading(true);
            const response = await api.get(`teacher/class/${classId}/performance/`);
      setData(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load class performance data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600"></div>
        </div>
        <p className="text-gray-700 font-semibold text-lg">Loading performance data...</p>
      </div>
    </div>
  );

  if (error) return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-50 border border-red-200 rounded-2xl p-8 flex items-start gap-6"
    >
      <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center flex-shrink-0">
        <AlertCircle className="text-red-600" size={32} />
      </div>
      <div>
        <h3 className="text-red-900 font-bold text-2xl">{error}</h3>
        <p className="text-red-700 text-base mt-2">Please try refreshing the page</p>
      </div>
    </motion.div>
  );

  if (!data) return null;

  const { class_metrics, student_rankings } = data;

  // Prepare data for charts - Initialize all score ranges from 0-100
  const scoreDistribution = [
    { range: '0-10', count: 0 },
    { range: '10-20', count: 0 },
    { range: '20-30', count: 0 },
    { range: '30-40', count: 0 },
    { range: '40-50', count: 0 },
    { range: '50-60', count: 0 },
    { range: '60-70', count: 0 },
    { range: '70-80', count: 0 },
    { range: '80-90', count: 0 },
    { range: '90-100', count: 0 },
  ];

  // Count students in each range
  student_rankings.forEach(student => {
    const scoreRange = Math.floor(student.overall_score / 10);
    const index = scoreRange >= 10 ? 9 : scoreRange; // Cap at 90-100 range
    scoreDistribution[index].count += 1;
  });

  const skillComparison = student_rankings.slice(0, 10).map(student => ({
    name: student.student_name.split(' ')[0] || 'Student',
    technical: student.technical_score,
    communication: student.communication_score,
    hr: student.hr_score,
  }));

  // Weekly performance data (sample data - can be replaced with actual API data)
  const weeklyPerformanceData = [
    { day: 'Mon', hours: 18.5, avgScore: class_metrics.class_average_score * 0.95 },
    { day: 'Tue', hours: 22, avgScore: class_metrics.class_average_score * 0.98 },
    { day: 'Wed', hours: 20.5, avgScore: class_metrics.class_average_score * 0.96 },
    { day: 'Thu', hours: 24, avgScore: class_metrics.class_average_score * 1.02 },
    { day: 'Fri', hours: 19.5, avgScore: class_metrics.class_average_score * 0.99 },
    { day: 'Sat', hours: 12, avgScore: class_metrics.class_average_score * 1.05 },
    { day: 'Sun', hours: 8, avgScore: class_metrics.class_average_score * 1.01 },
  ];

  const MetricCard = ({ label, value, icon: Icon, color, bgColor }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${bgColor} rounded-2xl p-6 border border-white/20 relative overflow-hidden group`}
    >
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500" />
      <div className="absolute bottom-0 left-0 w-2 h-2 bg-white/20 rounded-full" />
      
      <div className="flex items-center justify-between mb-4 relative">
        <p className="text-sm font-bold text-white/90 uppercase tracking-wide">{label}</p>
        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
          <Icon className="text-white" size={24} />
        </div>
      </div>
      <p className="text-5xl font-bold text-white relative">{value}</p>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Metrics Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <MetricCard
          label="Average Score"
          value={`${class_metrics.class_average_score}%`}
          icon={TrendingUp}
          color="from-purple-500 to-pink-500"
          bgColor="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600"
        />
        <MetricCard
          label="Total Students"
          value={class_metrics.total_students}
          icon={Users}
          color="from-blue-500 to-cyan-500"
          bgColor="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600"
        />
        <MetricCard
          label="Total Sessions"
          value={class_metrics.total_class_sessions}
          icon={Award}
          color="from-green-500 to-emerald-500"
          bgColor="bg-gradient-to-br from-green-600 via-green-700 to-emerald-600"
        />
        <MetricCard
          label="Total Hours"
          value={`${class_metrics.total_class_hours}h`}
          icon={Clock}
          color="from-orange-500 to-red-500"
          bgColor="bg-gradient-to-br from-orange-600 via-orange-700 to-pink-600"
        />
      </motion.div>

      {/* Weekly Performance Trend */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl shadow-lg p-8 border border-purple-100 relative overflow-hidden group"
      >
        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/30 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
        
        <div className="mb-8 relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <TrendingUp className="text-blue-600" size={20} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Weekly Performance Trend</h3>
          </div>
          <p className="text-gray-600 text-sm mt-2">Class performance over the week</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={weeklyPerformanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" fontSize={12} fontWeight={600} stroke="#6b7280" />
            <YAxis fontSize={12} fontWeight={600} stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '2px solid #3b82f6',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            />
            <Legend wrapperStyle={{ fontWeight: 600 }} />
            <Area 
              type="monotone" 
              dataKey="hours" 
              stroke="#3b82f6" 
              fill="#3b82f6" 
              fillOpacity={0.2}
              name="Hours"
            />
            <Area 
              type="monotone" 
              dataKey="avgScore" 
              stroke="#10b981" 
              fill="#10b981" 
              fillOpacity={0.2}
              name="Avg Score"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Score Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-lg p-8 border border-purple-100 relative overflow-hidden group"
        >
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100/30 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
          
          <div className="mb-8 relative">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <Target className="text-purple-600" size={20} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Score Distribution</h3>
            </div>
            <p className="text-gray-600 text-sm mt-2">How many students in each score range</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scoreDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="range" fontSize={12} fontWeight={600} />
              <YAxis fontSize={12} fontWeight={600} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '2px solid #a855f7',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
              <Bar dataKey="count" fill="url(#purpleGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Skill Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-3xl shadow-lg p-8 border border-purple-100 relative overflow-hidden group"
        >
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-100/30 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
          
          <div className="mb-8 relative">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <TrendingUp className="text-blue-600" size={20} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Top Students Skills</h3>
            </div>
            <p className="text-gray-600 text-sm mt-2">Top 10 performers across skill domains</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skillComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" fontSize={11} fontWeight={600} />
              <YAxis fontSize={12} fontWeight={600} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '2px solid #a855f7',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
              <Legend wrapperStyle={{ fontWeight: 600 }} />
              <Bar dataKey="technical" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="communication" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="hr" fill="#ec4899" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Student Rankings Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl shadow-lg border border-purple-100 overflow-hidden"
      >
        <div className="p-8">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center">
                <Trophy className="text-yellow-600" size={32} />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900">Student Rankings</h3>
                <p className="text-gray-600 text-sm mt-1">{student_rankings.length} students ranked by overall performance</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <tr className="text-left">
                  <th className="px-6 py-5 font-bold text-gray-900">Rank</th>
                  <th className="px-6 py-5 font-bold text-gray-900">Student Name</th>
                  <th className="px-6 py-5 font-bold text-gray-900">Overall Score</th>
                  <th className="px-6 py-5 font-bold text-gray-900">Technical</th>
                  <th className="px-6 py-5 font-bold text-gray-900">Communication</th>
                  <th className="px-6 py-5 font-bold text-gray-900">HR Skills</th>
                  <th className="px-6 py-5 font-bold text-gray-900">Sessions</th>
                  <th className="px-6 py-5 font-bold text-gray-900">Hours</th>
                </tr>
              </thead>
              <tbody>
                {student_rankings.map((student, idx) => (
                  <motion.tr
                    key={student.student_id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className={`border-b border-purple-100 hover:bg-purple-50 transition ${
                      student.overall_score === 0 ? 'opacity-60' : ''
                    }`}
                  >
                    <td className="px-6 py-5">
                      {student.rank <= 3 ? (
                        <motion.span
                          whileHover={{ scale: 1.1 }}
                          className={`inline-flex items-center justify-center w-11 h-11 rounded-xl text-white text-center font-bold text-lg shadow-lg ${
                            student.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-yellow-500/50' :
                            student.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500 shadow-gray-400/50' :
                            'bg-gradient-to-br from-orange-400 to-orange-600 shadow-orange-600/50'
                          }`}
                        >
                          {student.rank}
                        </motion.span>
                      ) : (
                        <span className="font-bold text-gray-900">{student.rank}</span>
                      )}
                    </td>
                    <td className="px-6 py-5 font-bold text-purple-600 hover:underline cursor-pointer">
                      {student.student_name}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-purple-100 rounded-full h-3">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${student.overall_score}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full"
                          />
                        </div>
                        <span className="font-bold text-gray-900 min-w-fit">{student.overall_score}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-block px-4 py-2 rounded-xl text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                        {student.technical_score}%
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-block px-4 py-2 rounded-xl text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
                        {student.communication_score}%
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-block px-4 py-2 rounded-xl text-xs font-bold bg-pink-100 text-pink-700 border border-pink-200">
                        {student.hr_score}%
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center font-bold text-gray-900">{student.total_sessions}</td>
                    <td className="px-6 py-5 text-center font-bold text-gray-900">{student.total_hours}h</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ClassPerformance;

