import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  BarChart3,
  PieChart,
  Users,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PurpleDropdown from '../Common/PurpleDropdown';
import api from "../../service/api";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

const StudentsPerformance = () => {
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState('best');
  const [searchQuery, setSearchQuery] = useState('');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudentsData();
  }, []);

  const fetchStudentsData = async () => {
    try {
      setLoading(true);
            
      
      const response = await api.get('teacher/dashboard-stats/');
      
      // Transform backend data into student format
      const studentsData = (response.data.students || []).map(student => ({
        id: student.id,
        name: student.name,
        email: student.email,
        score: Math.round(student.avg_score * 10), // Convert to percentage
        attempts: student.session_count || 0,
        sessions: student.session_count || 0,
        hours: (student.session_count || 0) * 1.5, // Estimate 1.5 hours per session
        lastActive: '1 day ago', // Can be updated with actual data if available
        technical_sessions: student.technical_sessions || 0,
        hr_sessions: student.hr_sessions || 0,
      }));
      
      setStudents(studentsData);
      setError('');
    } catch (err) {
      setError('Failed to load students data');
      console.error('Error fetching students:', err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  // Filter and sort students first
  const filteredAndSortedStudents = students
    .filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           student.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = scoreFilter === 'all' ||
                           (scoreFilter === 'high' && student.score >= 80) ||
                           (scoreFilter === 'medium' && student.score >= 70 && student.score < 80) ||
                           (scoreFilter === 'low' && student.score < 70);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortOrder === 'best') {
        return b.score - a.score;
      } else {
        return a.score - b.score;
      }
    });

  // Chart data (calculated after filteredAndSortedStudents)
  const scoreDistribution = [
    { range: '90-100', count: filteredAndSortedStudents.filter(s => s.score >= 90).length, fill: '#10b981' },
    { range: '80-89', count: filteredAndSortedStudents.filter(s => s.score >= 80 && s.score < 90).length, fill: '#3b82f6' },
    { range: '70-79', count: filteredAndSortedStudents.filter(s => s.score >= 70 && s.score < 80).length, fill: '#f59e0b' },
    { range: '60-69', count: filteredAndSortedStudents.filter(s => s.score >= 60 && s.score < 70).length, fill: '#ef4444' },
    { range: '<60', count: filteredAndSortedStudents.filter(s => s.score < 60).length, fill: '#dc2626' },
  ].filter(item => item.count > 0); // Only show ranges that have students

  const topPerformersChart = filteredAndSortedStudents.slice(0, 5).map(s => ({
    name: s.name.split(' ')[0],
    score: s.score
  }));

  const avgScore = filteredAndSortedStudents.length > 0 
    ? Math.round(filteredAndSortedStudents.reduce((sum, s) => sum + s.score, 0) / filteredAndSortedStudents.length) 
    : 0;
  const totalHours = filteredAndSortedStudents.reduce((sum, s) => sum + s.hours, 0);
  const totalSessions = filteredAndSortedStudents.reduce((sum, s) => sum + s.sessions, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading students data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Students Performance</h1>
          <p className="text-gray-600 mt-1.5 text-sm">Track and analyze your students' progress</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={20} />
            <div>
              <h3 className="text-red-900 font-semibold">{error}</h3>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-600 mb-1">Average Score</p>
            <p className="text-2xl font-bold text-gray-900">{avgScore}%</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-600 mb-1">Total Students</p>
            <p className="text-2xl font-bold text-gray-900">{filteredAndSortedStudents.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-600 mb-1">Total Hours</p>
            <p className="text-2xl font-bold text-gray-900">{totalHours.toFixed(1)}h</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-600 mb-1">Total Sessions</p>
            <p className="text-2xl font-bold text-gray-900">{totalSessions}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span>Top Performers</span>
            </h3>
            {topPerformersChart.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={topPerformersChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px' 
                    }}
                  />
                  <Bar dataKey="score" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg">
                No data available
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <PieChart className="h-5 w-5 text-purple-600" />
              <span>Score Distribution</span>
            </h3>
            {scoreDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <RechartsPieChart>
                  <Pie
                    data={scoreDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ range, percent }) => `${range}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {scoreDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px' 
                    }}
                    formatter={(value, name, props) => [`${value} students`, props.payload.range]}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg">
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Score Filter */}
            <PurpleDropdown
              value={scoreFilter}
              onChange={(value) => setScoreFilter(value)}
              placeholder="Filter by score"
              options={[
                { value: 'all', label: 'All Scores' },
                { value: 'high', label: 'High (80+)' },
                { value: 'medium', label: 'Medium (70-79)' },
                { value: 'low', label: 'Low (<70)' }
              ]}
              className="w-full md:w-auto"
            />

            {/* Sort Toggle */}
            <button
              onClick={() => setSortOrder(sortOrder === 'best' ? 'worst' : 'best')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2 transition-colors"
            >
              <ArrowUpDown className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {sortOrder === 'best' ? 'Best → Worst' : 'Worst → Best'}
              </span>
            </button>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Students Performance
            </h2>
            <span className="text-sm text-gray-500">{filteredAndSortedStudents.length} students</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="py-3 px-6 text-left">Student</th>
                  <th className="py-3 px-6 text-left">Score</th>
                  <th className="py-3 px-6 text-left">Attempts</th>
                  <th className="py-3 px-6 text-left">Sessions</th>
                  <th className="py-3 px-6 text-left">Hours</th>
                  <th className="py-3 px-6 text-left">Last Active</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedStudents.map((student) => (
                  <tr 
                    key={student.id} 
                    className="border-b hover:bg-blue-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/teacher/student/${student.id}`)}
                  >
                    <td className="py-3 px-6">
                      <div>
                        <div className="font-medium text-blue-600 hover:underline">{student.name}</div>
                        <div className="text-gray-500 text-xs">{student.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(student.score)}`}>
                        {student.score}%
                      </span>
                    </td>
                    <td className="py-3 px-6 text-gray-700">{student.attempts}</td>
                    <td className="py-3 px-6 text-gray-700">{student.sessions}</td>
                    <td className="py-3 px-6 text-gray-700">{student.hours.toFixed(1)}h</td>
                    <td className="py-3 px-6 text-gray-700">{student.lastActive}</td>
                    <td className="py-3 px-6 text-center" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => navigate(`/teacher/student/${student.id}`)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors" 
                        aria-label="View student"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredAndSortedStudents.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-6 text-center text-gray-500">
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentsPerformance;

