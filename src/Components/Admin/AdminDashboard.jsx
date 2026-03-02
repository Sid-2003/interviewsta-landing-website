import React, { useState, useEffect } from 'react';
import {
  TrendingUp, Users, Award, Target, BarChart3,
  CheckCircle, AlertCircle, FileText, Video, RefreshCw
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts';
import api from '../../service/api';

const TIER_COLORS = {
  Free:         '#6b7280',
  Pro:          '#3b82f6',
  'Pro Plus':   '#8b5cf6',
  Organisation: '#f59e0b',
  Developer:    '#10b981',
};

const TYPE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const StatCard = ({ title, value, icon: Icon, bg, iconColor, sub }) => (
  <div className="bg-white rounded-xl p-5 border border-gray-200">
    <div className="flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <p className="text-gray-500 text-xs font-medium truncate">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center flex-shrink-0 ml-3`}>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>
    </div>
  </div>
);

const SkeletonCard = () => (
  <div className="bg-white rounded-xl p-5 border border-gray-200 animate-pulse">
    <div className="h-4 bg-gray-100 rounded w-1/2 mb-3" />
    <div className="h-7 bg-gray-100 rounded w-1/3" />
  </div>
);

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await api.get('billing/admin/dashboard/');
      setData(res);
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <div className="h-7 bg-gray-100 rounded w-48 animate-pulse mb-2" />
            <div className="h-4 bg-gray-100 rounded w-64 animate-pulse" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
          <div className="h-72 bg-gray-50 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white py-8 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
          <p className="text-gray-700 font-medium">{error}</p>
          <button onClick={fetchDashboard} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { overview, users_by_tier, interview_type_breakdown, monthly_trend, top_performers, bottom_performers } = data;

  const statCards = [
    { title: 'Total Users',      value: overview.total_users,      icon: Users,    bg: 'bg-blue-50',   iconColor: 'text-blue-600' },
    { title: 'Avg Interview Score', value: `${overview.avg_score}%`, icon: Award,  bg: 'bg-green-50',  iconColor: 'text-green-600', sub: 'across all sessions' },
    { title: 'Interviews Done',  value: overview.total_interviews,  icon: Video,   bg: 'bg-purple-50', iconColor: 'text-purple-600' },
    { title: 'Resume Analyses',  value: overview.total_resumes,     icon: FileText, bg: 'bg-orange-50', iconColor: 'text-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1 text-sm">Live platform overview</p>
          </div>
          <button
            onClick={fetchDashboard}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((s) => <StatCard key={s.title} {...s} />)}
        </div>

        {/* Row 1: Users by Tier + Interview Type Breakdown */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">

          {/* Users by tier — bar chart */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              Users by Credit Tier
            </h3>
            {users_by_tier.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={users_by_tier} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="tier_name" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: 13 }}
                    formatter={(v) => [v, 'Users']}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={60}>
                    {users_by_tier.map((entry) => (
                      <Cell key={entry.tier_name} fill={TIER_COLORS[entry.tier_name] || '#6b7280'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Interview type breakdown — pie chart */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-purple-600" />
              Interview Type Breakdown
            </h3>
            {interview_type_breakdown.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No interviews yet.</p>
            ) : (
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="55%" height={200}>
                  <PieChart>
                    <Pie
                      data={interview_type_breakdown}
                      dataKey="count"
                      nameKey="type"
                      cx="50%" cy="50%"
                      outerRadius={80}
                      innerRadius={45}
                    >
                      {interview_type_breakdown.map((entry, i) => (
                        <Cell key={entry.type} fill={TYPE_COLORS[i % TYPE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: 13 }}
                      formatter={(v, n) => [v, n]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2">
                  {interview_type_breakdown.map((entry, i) => (
                    <div key={entry.type} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: TYPE_COLORS[i % TYPE_COLORS.length] }} />
                        <span className="text-gray-600 truncate">{entry.type}</span>
                      </div>
                      <span className="font-semibold text-gray-900 ml-2">{entry.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Monthly trend */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
          <h3 className="text-base font-semibold text-gray-900 mb-1 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            Monthly Interview Activity (last 6 months)
          </h3>
          <p className="text-xs text-gray-400 mb-4">Sessions completed and average score per month</p>
          {monthly_trend.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No sessions in the last 6 months.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={monthly_trend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" stroke="#9ca3af" tick={{ fontSize: 12 }} allowDecimals={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" tick={{ fontSize: 12 }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: 13 }}
                />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="sessions" stroke="#3b82f6" strokeWidth={2.5} name="Sessions" dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line yAxisId="right" type="monotone" dataKey="avg_score" stroke="#10b981" strokeWidth={2.5} name="Avg Score (%)" dot={{ r: 4 }} activeDot={{ r: 6 }} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top & Bottom performers */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Top performers */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Award className="h-5 w-5 text-yellow-500" />
              <h3 className="font-semibold text-gray-900">Top Performers</h3>
            </div>
            {top_performers.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No data yet.</p>
            ) : (
              <div className="space-y-3">
                {top_performers.map((s, i) => (
                  <div key={s.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-700 font-bold text-sm">
                        #{i + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{s.name}</p>
                        <p className="text-xs text-gray-400">{s.email} · {s.sessions} sessions</p>
                      </div>
                    </div>
                    <span className="font-bold text-green-600 text-sm">{s.avg_score}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom performers */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <h3 className="font-semibold text-gray-900">Need Attention</h3>
            </div>
            {bottom_performers.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No data yet.</p>
            ) : (
              <div className="space-y-3">
                {bottom_performers.map((s, i) => (
                  <div key={s.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{s.name}</p>
                        <p className="text-xs text-gray-400">{s.email} · {s.sessions} sessions</p>
                      </div>
                    </div>
                    <span className="font-bold text-red-500 text-sm">{s.avg_score}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
