import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import './StudentInterviewHistory.css';

import api from "../../service/api";
const StudentInterviewHistory = ({ studentId = null, isTeacherView = false }) => {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const apiBaseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000/api/';

  useEffect(() => {
    fetchInterviewHistory();
  }, [studentId]);

  const fetchInterviewHistory = async () => {
    try {
      setLoading(true);
      const auth = getAuth();
            if (!token) {
        setError('Authentication failed. Please log in again.');
        return;
      }

      let url = `${apiBaseUrl}/interview-history/`;
      if (studentId && isTeacherView) {
        url += `?student_id=${studentId}`;
      }

      const response = await api.get(url.replace(import.meta.env.VITE_BACKEND_URL, ''));

      setHistory(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching interview history:', err);
      setError(err.response?.data?.error || 'Failed to load interview history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="interview-history-container loading">
        <div className="spinner"></div>
        <p>Loading interview history...</p>
      </div>
    );
  }

  if (!history || history.history.length === 0) {
    return (
      <div className="interview-history-container">
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No Interview History</h3>
          <p>No interviews completed yet. Start your first interview to see results here.</p>
        </div>
      </div>
    );
  }

  const interviews = history.history;
  const progressData = interviews.map((interview, idx) => ({
    date: new Date(interview.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: interview.overall_score,
    interview: interview.interview_type,
  })).reverse();

  const skillsData = [
    { skill: 'Technical', score: history.skill_averages.technical },
    { skill: 'Communication', score: history.skill_averages.communication },
  ];

  return (
    <div className="interview-history-container">
      <div className="history-header">
        <h1>Interview History</h1>
        <p className="student-name">{history.student_name}</p>
      </div>

      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={fetchInterviewHistory} className="retry-btn">Retry</button>
        </div>
      )}

      {/* Summary Stats */}
      <div className="summary-stats">
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <p className="stat-label">Total Interviews</p>
            <p className="stat-value">{history.total_interviews}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <p className="stat-label">Average Score</p>
            <p className="stat-value">{history.average_score}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💼</div>
          <div className="stat-content">
            <p className="stat-label">Technical</p>
            <p className="stat-value">{history.interview_breakdown.technical}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <p className="stat-label">HR Interviews</p>
            <p className="stat-value">{history.interview_breakdown.hr}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-section">
        <div className="chart-container">
          <h3>Interview Progress Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="score" stroke="#3b82f6" name="Score" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Average Skills</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skillsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="skill" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill="#10b981" name="Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Interview List */}
      <div className="interview-list-section">
        <h2>All Interviews</h2>
        <div className="interview-list">
          {interviews.map((interview, index) => (
            <div key={interview.id} className="interview-card">
              <div 
                className="interview-header"
                onClick={() => setExpandedId(expandedId === interview.id ? null : interview.id)}
              >
                <div className="interview-info">
                  <div className="interview-number">#{interviews.length - index}</div>
                  <div className="interview-details">
                    <h3 className="interview-type">
                      {interview.interview_type === 'Technical Interview' ? '💼' : '👥'} {interview.interview_type}
                    </h3>
                    <p className="interview-date">
                      {new Date(interview.created_at).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <div className="interview-score">
                  <span className={`score-badge ${interview.overall_score >= 75 ? 'excellent' : interview.overall_score >= 50 ? 'good' : 'needs-improvement'}`}>
                    {interview.overall_score}
                  </span>
                  <span className="duration">{interview.duration}</span>
                </div>
              </div>

              {expandedId === interview.id && (
                <div className="interview-details-expanded">
                  {/* Skills Breakdown */}
                  <div className="details-section">
                    <h4>Skills Breakdown</h4>
                    <div className="skills-grid">
                      {interview.technical_skills > 0 && (
                        <div className="skill-item">
                          <span className="skill-name">Technical</span>
                          <div className="skill-bar">
                            <div className="skill-fill" style={{ width: `${interview.technical_skills}%` }}></div>
                          </div>
                          <span className="skill-score">{interview.technical_skills}/100</span>
                        </div>
                      )}
                      {interview.communication_skills > 0 && (
                        <div className="skill-item">
                          <span className="skill-name">Communication</span>
                          <div className="skill-bar">
                            <div className="skill-fill" style={{ width: `${interview.communication_skills}%` }}></div>
                          </div>
                          <span className="skill-score">{interview.communication_skills}/100</span>
                        </div>
                      )}
                      {interview.hr_skills > 0 && (
                        <div className="skill-item">
                          <span className="skill-name">HR Skills</span>
                          <div className="skill-bar">
                            <div className="skill-fill" style={{ width: `${interview.hr_skills}%` }}></div>
                          </div>
                          <span className="skill-score">{interview.hr_skills}/100</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Strengths */}
                  {interview.strengths && (
                    <div className="details-section">
                      <h4>✨ Strengths</h4>
                      <p className="feedback-text">{interview.strengths}</p>
                    </div>
                  )}

                  {/* Areas of Improvement */}
                  {interview.areas_of_improvement && (
                    <div className="details-section">
                      <h4>📈 Areas of Improvement</h4>
                      <p className="feedback-text">{interview.areas_of_improvement}</p>
                    </div>
                  )}

                  {/* Recommendations */}
                  {interview.recommendations && (
                    <div className="details-section">
                      <h4>💡 Recommendations</h4>
                      <p className="feedback-text">{interview.recommendations}</p>
                    </div>
                  )}

                  {/* Overall Feedback */}
                  {interview.overall_feedback && (
                    <div className="details-section">
                      <h4>📝 Overall Feedback</h4>
                      <p className="feedback-text">{interview.overall_feedback}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentInterviewHistory;
