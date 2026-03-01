import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  TrendingUp, 
  Clock, 
  Users, 
  Award,
  BarChart3,
  Calendar,
  Target,
  CheckCircle,
  TrendingDown,
  AlertCircle
} from 'lucide-react';
import api from "../../service/api";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
            const response = await api.get('teacher/dashboard-stats/');
      setDashboardData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Default/fallback data
  const weeklyStats = dashboardData ? {
    totalClasses: dashboardData.total_classes,
    totalStudents: dashboardData.total_students,
    avgScore: dashboardData.avg_score,
    totalSessions: dashboardData.total_sessions,
  } : {
    totalClasses: 0,
    totalStudents: 0,
    avgScore: 0,
    totalSessions: 0,
  };

  const allTimeStats = dashboardData ? {
    totalHours: dashboardData.total_sessions * 1.5, // Estimate: ~1.5 hours per session
    avgScore: Math.round(dashboardData.avg_score * 10) / 10,
    bestStudents: dashboardData.total_students,
    aboveBenchmark: Math.round((dashboardData.avg_score / 10) * 100),
  } : {
    totalHours: 0,
    avgScore: 0,
    bestStudents: 0,
    aboveBenchmark: 0,
  };

  const topStudents = dashboardData?.top_students || [];
  const interviewBreakdown = dashboardData?.interview_breakdown || { technical: 0, hr: 0, general: 0 };

  // Chart data
  const weeklyPerformanceData = [
    { day: 'Mon', hours: 18.5, avgScore: 75 },
    { day: 'Tue', hours: 22, avgScore: 78 },
    { day: 'Wed', hours: 20.5, avgScore: 76 },
    { day: 'Thu', hours: 24, avgScore: 80 },
    { day: 'Fri', hours: 19.5, avgScore: 77 },
    { day: 'Sat', hours: 12, avgScore: 82 },
    { day: 'Sun', hours: 8, avgScore: 79 },
  ];

  const monthlyTrendData = [
    { month: 'Jan', students: 45, avgScore: 72 },
    { month: 'Feb', students: 48, avgScore: 74 },
    { month: 'Mar', students: 52, avgScore: 75 },
    { month: 'Apr', students: 55, avgScore: 76 },
    { month: 'May', students: 58, avgScore: 77 },
    { month: 'Jun', students: 62, avgScore: 78 },
    { month: 'Jul', students: 65, avgScore: 79 },
    { month: 'Aug', students: 68, avgScore: 80 },
    { month: 'Sep', students: 70, avgScore: 81 },
    { month: 'Oct', students: 72, avgScore: 82 },
    { month: 'Nov', students: 74, avgScore: 82 },
    { month: 'Dec', students: 76, avgScore: 83 },
  ];

  const scoreDistributionData = [
    { range: '90-100', students: 12, fill: '#10b981' },
    { range: '80-89', students: 28, fill: '#3b82f6' },
    { range: '70-79', students: 35, fill: '#f59e0b' },
    { range: '60-69', students: 18, fill: '#ef4444' },
    { range: '<60', students: 7, fill: '#dc2626' },
  ];

  const interviewTypeData = [
    { name: 'Technical', value: interviewBreakdown.technical, fill: '#3b82f6' },
    { name: 'HR', value: interviewBreakdown.hr, fill: '#10b981' },
    { name: 'General', value: interviewBreakdown.general, fill: '#f59e0b' },
  ];

  const stats = [
    {
      title: 'Total Classes',
      value: weeklyStats.totalClasses,
      change: 'Active',
      trend: 'up',
      icon: Calendar,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Total Students',
      value: weeklyStats.totalStudents,
      change: '+' + weeklyStats.totalStudents,
      trend: 'up',
      icon: Users,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Average Score',
      value: `${weeklyStats.avgScore.toFixed(1)}%`,
      change: weeklyStats.avgScore > 70 ? 'Good' : 'Needs improvement',
      trend: 'up',
      icon: Award,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Total Sessions',
      value: weeklyStats.totalSessions,
      change: '+' + weeklyStats.totalSessions,
      trend: 'up',
      icon: BarChart3,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="text-gray-600 mt-1.5 text-sm">Overview of your classes and students' performance</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-red-900 font-medium">{error}</p>
              <button 
                onClick={fetchDashboardData}
                className="text-red-700 hover:text-red-900 text-sm mt-1 underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-gray-600 text-xs truncate">{stat.title}</p>
                  <p className="text-xl font-bold text-gray-900 mt-0.5 truncate">{stat.value}</p>
                  <div className="flex items-center space-x-1 mt-1.5">
                    <TrendingUp className="h-3 w-3 text-green-600 flex-shrink-0" />
                    <p className="text-xs text-green-600 truncate">{stat.change}</p>
                  </div>
                </div>
                <div className={`w-9 h-9 ${stat.bgColor} rounded-lg flex items-center justify-center flex-shrink-0 ml-2`}>
                  <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* All-Time vs Weekly Comparison */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Hours</span>
                <span className="font-semibold text-gray-900">{weeklyStats.totalHours}h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Score</span>
                <span className="font-semibold text-gray-900">{weeklyStats.avgScore}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Best Students</span>
                <span className="font-semibold text-gray-900">{weeklyStats.bestStudents}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Above Benchmark</span>
                <span className="font-semibold text-gray-900">{weeklyStats.aboveBenchmark}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">All Time</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Hours</span>
                <span className="font-semibold text-gray-900">{allTimeStats.totalHours.toLocaleString()}h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Score</span>
                <span className="font-semibold text-gray-900">{allTimeStats.avgScore}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Best Students</span>
                <span className="font-semibold text-gray-900">{allTimeStats.bestStudents}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Above Benchmark</span>
                <span className="font-semibold text-gray-900">{allTimeStats.aboveBenchmark}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Students */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Students</h3>
            <button
              onClick={() => navigate('/teacher/students')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All →
            </button>
          </div>
          {topStudents.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No students or session data yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topStudents.map((student, index) => (
                <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-xs text-gray-500">{student.session_count} sessions</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{student.avg_score}%</p>
                      <p className="text-xs text-gray-500">Average</p>
                    </div>
                    <Award className="h-5 w-5 text-yellow-500" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Interview Type Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span>Interview Types</span>
            </h3>
            {interviewTypeData.every(d => d.value === 0) ? (
              <div className="h-250 flex items-center justify-center text-gray-500">
                <p>No interview data available</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={interviewTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {interviewTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Classes Overview */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Classes</h3>
            {dashboardData?.class_stats && dashboardData.class_stats.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.class_stats.map((classItem) => (
                  <div key={classItem.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900">{classItem.name}</p>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {classItem.student_count} students
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{classItem.session_count} sessions</span>
                      <span>Avg: {classItem.avg_score.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No classes yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Weekly Performance Trend */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <span>Weekly Performance Trend</span>
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={weeklyPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px' 
                }}
              />
              <Legend />
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
        </div>

        {/* Score Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Target className="h-5 w-5 text-purple-600" />
            <span>Score Distribution</span>
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={scoreDistributionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="range" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px' 
                }}
              />
              <Bar dataKey="students" radius={[8, 8, 0, 0]}>
                {scoreDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span>Monthly Progress Trend</span>
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis yAxisId="left" stroke="#6b7280" />
              <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px' 
                }}
              />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="avgScore" 
                stroke="#3b82f6" 
                strokeWidth={3}
                name="Avg Score (%)"
                dot={{ fill: '#3b82f6', r: 5 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="students" 
                stroke="#10b981" 
                strokeWidth={3}
                name="Active Students"
                dot={{ fill: '#10b981', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/teacher/students-batch')}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:border-purple-300 text-left group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">Student Batch</h3>
                <p className="text-sm text-gray-500">View all student metrics</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/teacher/students')}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:border-blue-300 text-left group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">View Students</h3>
                <p className="text-sm text-gray-500">Manage and track student performance</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/teacher/schedule')}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:border-green-300 text-left group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">Manage Schedule</h3>
                <p className="text-sm text-gray-500">Add and manage interview slots</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;

