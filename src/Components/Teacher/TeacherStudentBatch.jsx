import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import './TeacherStudentBatch.css';

import api from "../../service/api";
const TeacherStudentBatch = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [sortBy, setSortBy] = useState('score');
  const [sortOrder, setSortOrder] = useState('desc');

  const apiBaseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000/api/';

  useEffect(() => {
    fetchStudentBatch();
  }, []);

  const fetchStudentBatch = async () => {
    try {
      setLoading(true);
      const auth = getAuth();
            if (!token) {
        setError('Authentication failed. Please log in again.');
        return;
      }

      const response = await api.get('teacher/students-batch/');

      setStudents(response.data.students || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching student batch:', err);
      setError(err.response?.data?.error || 'Failed to load student batch');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort students
  const filteredStudents = students
    .filter(student =>
      student.name.toLowerCase().includes(filterText.toLowerCase()) ||
      student.email.toLowerCase().includes(filterText.toLowerCase())
    )
    .sort((a, b) => {
      let compareValue = 0;
      
      if (sortBy === 'score') {
        compareValue = a.avg_score - b.avg_score;
      } else if (sortBy === 'sessions') {
        compareValue = a.session_count - b.session_count;
      } else if (sortBy === 'name') {
        compareValue = a.name.localeCompare(b.name);
      }

      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

  // Prepare chart data
  const chartData = students.slice(0, 10).map(student => ({
    name: student.name.split(' ')[0], // First name only
    score: student.avg_score,
    sessions: student.session_count,
    technical: student.technical_sessions,
    hr: student.hr_sessions,
  }));

  if (loading) {
    return (
      <div className="student-batch-container loading">
        <div className="spinner"></div>
        <p>Loading student data...</p>
      </div>
    );
  }

  return (
    <div className="student-batch-container">
      <div className="batch-header">
        <h1>Student Performance Batch</h1>
        <p className="batch-subtitle">Monitor and analyze all student metrics</p>
      </div>

      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={fetchStudentBatch} className="retry-btn">Retry</button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card">
          <div className="card-icon">👥</div>
          <div className="card-content">
            <h3>Total Students</h3>
            <p className="card-value">{students.length}</p>
          </div>
        </div>
        
        <div className="card">
          <div className="card-icon">📊</div>
          <div className="card-content">
            <h3>Avg Score</h3>
            <p className="card-value">
              {students.length > 0 
                ? (students.reduce((sum, s) => sum + s.avg_score, 0) / students.length).toFixed(1)
                : 0}
            </p>
          </div>
        </div>
        
        <div className="card">
          <div className="card-icon">🎯</div>
          <div className="card-content">
            <h3>Total Sessions</h3>
            <p className="card-value">
              {students.reduce((sum, s) => sum + s.session_count, 0)}
            </p>
          </div>
        </div>
        
        <div className="card">
          <div className="card-icon">⭐</div>
          <div className="card-content">
            <h3>Top Performer</h3>
            <p className="card-value">
              {students.length > 0 
                ? (Math.max(...students.map(s => s.avg_score))).toFixed(1)
                : 0}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      {chartData.length > 0 && (
        <div className="charts-section">
          <div className="chart-container">
            <h3>Top 10 Students - Average Scores</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#3b82f6" name="Avg Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h3>Interview Distribution (Top 10 Students)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="technical" fill="#10b981" name="Technical" />
                <Bar dataKey="hr" fill="#f59e0b" name="HR" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="sort-group">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="score">Sort by Score</option>
            <option value="sessions">Sort by Sessions</option>
            <option value="name">Sort by Name</option>
          </select>

          <button 
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="sort-order-btn"
            title={`Current: ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="table-section">
        <h2>Student Details</h2>
        {filteredStudents.length === 0 ? (
          <div className="no-data">
            <p>No students found matching your criteria.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="students-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Avg Score</th>
                  <th>Total Sessions</th>
                  <th>Technical</th>
                  <th>HR</th>
                  <th>Classes</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr key={student.id} className={index < 3 ? `rank-${index + 1}` : ''}>
                    <td>
                      <span className="rank-badge">
                        {filteredStudents.indexOf(student) + 1}
                      </span>
                    </td>
                    <td 
                      className="name-cell"
                      onClick={() => navigate(`/teacher/student/${student.id}`)}
                      style={{ cursor: 'pointer', color: '#0066cc' }}
                    >
                      {student.name}
                    </td>
                    <td className="email-cell">{student.email}</td>
                    <td>
                      <span className="score-badge" style={{
                        backgroundColor: student.avg_score >= 75 ? '#10b981' : 
                                       student.avg_score >= 50 ? '#f59e0b' : '#ef4444'
                      }}>
                        {student.avg_score.toFixed(1)}
                      </span>
                    </td>
                    <td className="center">{student.session_count}</td>
                    <td className="center">{student.technical_sessions}</td>
                    <td className="center">{student.hr_sessions}</td>
                    <td className="classes-cell">
                      <span className="class-tag">
                        {student.classes[0] || 'N/A'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherStudentBatch;
