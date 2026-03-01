import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, TrendingUp, TrendingDown, Award, Target, Zap, MessageSquare } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import axios from 'axios';
import './TeacherStudentDetail.css';

import api from "../../service/api";
const TeacherStudentDetail = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedInterview, setExpandedInterview] = useState(null);

  useEffect(() => {
    fetchStudentPerformance();
  }, [studentId]);

  const fetchStudentPerformance = async () => {
    try {
      setLoading(true);
            
      
      const response = await api.get(`teacher/student/${studentId}/performance/`);
      setStudentData(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load student performance data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600"></div>
          </div>
          <p className="text-gray-700 font-semibold text-lg">Loading student performance data...</p>
        </div>
      </div>
    );
  }

  if (error || !studentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6 font-semibold transition"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
          <div className="flex items-start gap-6">
            <div className="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="text-red-600" size={28} />
            </div>
            <div>
              <h3 className="text-red-900 font-bold text-xl">{error}</h3>
              <p className="text-red-700 mt-1">Please try refreshing the page</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { student, summary, technical_analysis, hr_analysis, case_study_analysis, communication_analysis, debate_analysis, all_interviews } = studentData;

  // Prepare technical trend data
  const technicalTrendData = technical_analysis.interviews.map((interview, idx) => ({
    interview: `Interview ${idx + 1}`,
    score: interview.scores.language || 0,
    language: interview.scores.language || 0,
    algorithms: interview.scores.algorithms || 0,
  })).slice(-6); // Last 6 interviews

  // Prepare HR trend data
  const hrTrendData = hr_analysis.interviews.map((interview, idx) => ({
    interview: `Interview ${idx + 1}`,
    communication: interview.scores.clarity || 0,
    cultural_fit: interview.scores.values || 0,
  })).slice(-6); // Last 6 interviews

  // Prepare radar data for Big5
  const big5Data = hr_analysis.big5_profile ? [
    { skill: 'Openness', value: Math.round((hr_analysis.big5_profile.openness || 0) * 100) },
    { skill: 'Conscientiousness', value: Math.round((hr_analysis.big5_profile.conscientiousness || 0) * 100) },
    { skill: 'Extraversion', value: Math.round((hr_analysis.big5_profile.extraversion || 0) * 100) },
    { skill: 'Agreeableness', value: Math.round((hr_analysis.big5_profile.agreeableness || 0) * 100) },
    { skill: 'Neuroticism', value: Math.round((hr_analysis.big5_profile.neuroticism || 0) * 100) },
  ] : [];

  // Prepare technical skills comparison data
  const technicalSkillsData = [
    { skill: 'Language', value: technical_analysis.scores.language || 0 },
    { skill: 'Framework', value: technical_analysis.scores.framework || 0 },
    { skill: 'Algorithms', value: technical_analysis.scores.algorithms || 0 },
    { skill: 'Data Structures', value: technical_analysis.scores.data_structures || 0 },
  ];

  // Prepare problem-solving data
  const problemSolvingData = [
    { skill: 'Approach', value: technical_analysis.scores.approach || 0 },
    { skill: 'Optimization', value: technical_analysis.scores.optimization || 0 },
    { skill: 'Debugging', value: technical_analysis.scores.debugging || 0 },
    { skill: 'Syntax', value: technical_analysis.scores.syntax || 0 },
  ];

  // Prepare HR skills data
  const hrSkillsData = [
    { skill: 'Clarity', value: hr_analysis.scores.clarity || 0 },
    { skill: 'Confidence', value: hr_analysis.scores.confidence || 0 },
    { skill: 'Structure', value: hr_analysis.scores.structure || 0 },
    { skill: 'Engagement', value: hr_analysis.scores.engagement || 0 },
  ];

  // Prepare cultural fit data
  const culturalFitData = [
    { skill: 'Values', value: hr_analysis.scores.values || 0 },
    { skill: 'Teamwork', value: hr_analysis.scores.teamwork || 0 },
    { skill: 'Initiative', value: hr_analysis.scores.initiative || 0 },
    { skill: 'Growth', value: hr_analysis.scores.growth || 0 },
  ];

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-green-600 bg-green-100';
    if (score >= 50) return 'text-amber-600 bg-amber-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreBadge = (score) => {
    if (score >= 75) return '🟢 Excellent';
    if (score >= 50) return '🟡 Good';
    return '🔴 Needs Improvement';
  };

  const getInterviewTypeColor = (type) => {
    const colors = {
      'Technical Interview': 'from-purple-100 to-pink-100 text-purple-700 border-purple-200',
      'HR Interview': 'from-orange-100 to-pink-100 text-orange-700 border-orange-200',
      'Case Study': 'from-yellow-100 to-amber-100 text-yellow-700 border-yellow-200',
      'Communication': 'from-green-100 to-emerald-100 text-green-700 border-green-200',
      'Debate': 'from-pink-100 to-rose-100 text-pink-700 border-pink-200',
    };
    return colors[type] || 'from-gray-100 to-gray-200 text-gray-700 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-8">
      <div className="w-full">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6 font-semibold transition"
        >
          <ArrowLeft size={20} />
          Back to Students
        </button>

        {/* Student Profile Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 border border-purple-100 relative overflow-hidden">
          {/* Decorative gradient */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100/30 to-transparent rounded-full -mr-32 -mt-32" />
          
          <div className="flex justify-between items-start mb-6 relative">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-3">{student.name}</h1>
              <p className="text-gray-600 text-lg mb-3">{student.email}</p>
              <div className="flex flex-wrap gap-2 text-sm">
                {student.classes.map((className, idx) => (
                  <span key={idx} className="bg-purple-100 text-purple-700 px-4 py-2 rounded-xl font-semibold border border-purple-200">
                    {className}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className={`text-6xl font-bold px-8 py-4 rounded-2xl ${getScoreColor(summary.average_overall_score)}`}>
                {summary.average_overall_score}
              </div>
              <p className="text-gray-600 mt-3 font-semibold">Overall Average Score</p>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 rounded-2xl shadow-lg p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500" />
            <p className="text-blue-100 text-xs font-bold mb-2 relative">Total Interviews</p>
            <p className="text-4xl font-bold text-white relative">{summary.total_interviews}</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded-2xl shadow-lg p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500" />
            <p className="text-purple-100 text-xs font-bold mb-2 relative">Technical</p>
            <p className="text-4xl font-bold text-white relative">{summary.average_scores.technical}</p>
            <p className="text-purple-200 text-xs mt-1 relative">{summary.interview_breakdown.technical} sessions</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-600 rounded-2xl shadow-lg p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500" />
            <p className="text-green-100 text-xs font-bold mb-2 relative">Communication</p>
            <p className="text-4xl font-bold text-white relative">{summary.average_scores.communication}</p>
            <p className="text-green-200 text-xs mt-1 relative">{summary.interview_breakdown.communication} sessions</p>
          </div>
          
          <div className="bg-gradient-to-br from-orange-600 via-orange-700 to-pink-600 rounded-2xl shadow-lg p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500" />
            <p className="text-orange-100 text-xs font-bold mb-2 relative">HR Skills</p>
            <p className="text-4xl font-bold text-white relative">{summary.average_scores.hr}</p>
            <p className="text-orange-200 text-xs mt-1 relative">{summary.interview_breakdown.hr} sessions</p>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-600 via-yellow-700 to-amber-600 rounded-2xl shadow-lg p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500" />
            <p className="text-yellow-100 text-xs font-bold mb-2 relative">Case Study</p>
            <p className="text-4xl font-bold text-white relative">{summary.average_scores.case_study}</p>
            <p className="text-yellow-200 text-xs mt-1 relative">{summary.interview_breakdown.case_study} sessions</p>
          </div>
          
          <div className="bg-gradient-to-br from-pink-600 via-pink-700 to-rose-600 rounded-2xl shadow-lg p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500" />
            <p className="text-pink-100 text-xs font-bold mb-2 relative">Debate</p>
            <p className="text-4xl font-bold text-white relative">{summary.average_scores.debate}</p>
            <p className="text-pink-200 text-xs mt-1 relative">{summary.interview_breakdown.debate} sessions</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8 flex-wrap bg-white rounded-2xl shadow-lg p-3 border border-purple-100">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'technical', label: 'Technical' },
            { id: 'hr', label: 'HR & Soft Skills' },
            { id: 'case_study', label: 'Case Study' },
            { id: 'communication', label: 'Communication' },
            { id: 'debate', label: 'Debate' },
            { id: 'history', label: 'All Interviews' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl font-bold transition-all text-sm ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-purple-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Summary Stats Overview */}
            <div className="bg-white rounded-3xl shadow-lg p-8 border border-purple-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-100/20 to-transparent rounded-full -mr-20 -mt-20" />
              
              <h2 className="text-3xl font-bold text-gray-900 mb-8 relative flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <Target className="text-purple-600" size={24} />
                </div>
                Performance Summary
              </h2>
              
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                        <Zap className="text-purple-600" size={20} />
                      </div>
                      Technical Skills
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-bold text-gray-700">Overall Technical</span>
                          <span className="text-sm font-bold text-purple-600">{technical_analysis.average_score}/100</span>
                        </div>
                        <div className="w-full bg-purple-100 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${(technical_analysis.average_score / 100) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                        <MessageSquare className="text-green-600" size={20} />
                      </div>
                      Communication Skills
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-bold text-gray-700">Overall Communication</span>
                          <span className="text-sm font-bold text-green-600">{summary.average_scores.communication}/100</span>
                        </div>
                        <div className="w-full bg-green-100 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${(summary.average_scores.communication / 100) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                        <Award className="text-orange-600" size={20} />
                      </div>
                      HR & Cultural Fit
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-bold text-gray-700">Overall HR Skills</span>
                          <span className="text-sm font-bold text-orange-600">{summary.average_scores.hr}/100</span>
                        </div>
                        <div className="w-full bg-orange-100 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-orange-500 to-pink-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${(summary.average_scores.hr / 100) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                        <Target className="text-yellow-600" size={20} />
                      </div>
                      Case Study Skills
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-bold text-gray-700">Overall Case Study</span>
                          <span className="text-sm font-bold text-yellow-600">{summary.average_scores.case_study}/100</span>
                        </div>
                        <div className="w-full bg-yellow-100 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-yellow-500 to-amber-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${(summary.average_scores.case_study / 100) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
                        <Zap className="text-pink-600" size={20} />
                      </div>
                      Debate Skills
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-bold text-gray-700">Overall Debate</span>
                          <span className="text-sm font-bold text-pink-600">{summary.average_scores.debate}/100</span>
                        </div>
                        <div className="w-full bg-pink-100 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-pink-500 to-rose-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${(summary.average_scores.debate / 100) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Insights - Full Width Below */}
                <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Key Insights</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm font-bold text-gray-700 mb-3">Strongest Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {summary.average_scores.technical >= 70 && (
                          <span className="bg-purple-200 text-purple-800 px-4 py-2 rounded-xl text-sm font-bold border border-purple-300">
                            Technical Proficiency
                          </span>
                        )}
                        {summary.average_scores.communication >= 70 && (
                          <span className="bg-green-200 text-green-800 px-4 py-2 rounded-xl text-sm font-bold border border-green-300">
                            Communication
                          </span>
                        )}
                        {summary.average_scores.hr >= 70 && (
                          <span className="bg-orange-200 text-orange-800 px-4 py-2 rounded-xl text-sm font-bold border border-orange-300">
                            HR & Cultural Fit
                          </span>
                        )}
                        {summary.average_scores.case_study >= 70 && (
                          <span className="bg-yellow-200 text-yellow-800 px-4 py-2 rounded-xl text-sm font-bold border border-yellow-300">
                            Case Study Analysis
                          </span>
                        )}
                        {summary.average_scores.debate >= 70 && (
                          <span className="bg-pink-200 text-pink-800 px-4 py-2 rounded-xl text-sm font-bold border border-pink-300">
                            Debate & Argumentation
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-bold text-gray-700 mb-3">Areas to Focus</p>
                      <div className="flex flex-wrap gap-2">
                        {summary.average_scores.technical < 60 && summary.average_scores.technical > 0 && (
                          <span className="bg-red-200 text-red-800 px-4 py-2 rounded-xl text-sm font-bold border border-red-300">
                            Technical Foundation
                          </span>
                        )}
                        {summary.average_scores.communication < 60 && summary.average_scores.communication > 0 && (
                          <span className="bg-red-200 text-red-800 px-4 py-2 rounded-xl text-sm font-bold border border-red-300">
                            Communication Skills
                          </span>
                        )}
                        {summary.average_scores.hr < 60 && summary.average_scores.hr > 0 && (
                          <span className="bg-amber-200 text-amber-800 px-4 py-2 rounded-xl text-sm font-bold border border-amber-300">
                            HR & Soft Skills
                          </span>
                        )}
                        {summary.average_scores.case_study < 60 && summary.average_scores.case_study > 0 && (
                          <span className="bg-amber-200 text-amber-800 px-4 py-2 rounded-xl text-sm font-bold border border-amber-300">
                            Case Study Skills
                          </span>
                        )}
                        {summary.average_scores.debate < 60 && summary.average_scores.debate > 0 && (
                          <span className="bg-amber-200 text-amber-800 px-4 py-2 rounded-xl text-sm font-bold border border-amber-300">
                            Debate Skills
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-bold text-gray-700 mb-3">Progress Trend</p>
                      <div className="flex items-center gap-3">
                        {summary.total_interviews > 1 && (
                          <>
                            {all_interviews.length > 1 && all_interviews[0].overall_score > all_interviews[all_interviews.length - 1].overall_score ? (
                              <>
                                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                                  <TrendingUp className="text-green-600" size={24} />
                                </div>
                                <div>
                                  <span className="text-green-700 font-bold text-lg block">Improving</span>
                                  <span className="text-green-600 text-sm">Keep up the great work!</span>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                                  <TrendingDown className="text-red-600" size={24} />
                                </div>
                                <div>
                                  <span className="text-red-700 font-bold text-lg block">Needs Attention</span>
                                  <span className="text-red-600 text-sm">Focus on improvement areas</span>
                                </div>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Technical Performance Tab */}
        {activeTab === 'technical' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Technical Scores Bar Chart */}
              <div className="bg-white rounded-3xl shadow-lg p-8 border border-purple-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100/20 to-transparent rounded-full -mr-16 -mt-16" />
                <h3 className="text-2xl font-bold text-gray-900 mb-6 relative flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                    <Zap className="text-purple-600" size={20} />
                  </div>
                  Knowledge Base
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={technicalSkillsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="skill" angle={-45} textAnchor="end" height={80} style={{ fontSize: 12, fontWeight: 600 }} />
                    <YAxis domain={[0, 100]} style={{ fontSize: 12, fontWeight: 600 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '2px solid #a855f7', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="value" fill="url(#purpleGradient)" radius={[8, 8, 0, 0]} />
                    <defs>
                      <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Problem Solving Bar Chart */}
              <div className="bg-white rounded-3xl shadow-lg p-8 border border-purple-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/20 to-transparent rounded-full -mr-16 -mt-16" />
                <h3 className="text-2xl font-bold text-gray-900 mb-6 relative flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Target className="text-blue-600" size={20} />
                  </div>
                  Problem Solving
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={problemSolvingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="skill" angle={-45} textAnchor="end" height={80} style={{ fontSize: 12, fontWeight: 600 }} />
                    <YAxis domain={[0, 100]} style={{ fontSize: 12, fontWeight: 600 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '2px solid #3b82f6', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="value" fill="url(#blueGradient)" radius={[8, 8, 0, 0]} />
                    <defs>
                      <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Technical Trend */}
            {technicalTrendData.length > 0 && (
              <div className="bg-white rounded-3xl shadow-lg p-8 border border-purple-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-100/20 to-transparent rounded-full -mr-20 -mt-20" />
                <h3 className="text-2xl font-bold text-gray-900 mb-6 relative flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <TrendingUp className="text-purple-600" size={20} />
                  </div>
                  Technical Skills Trend
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={technicalTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="interview" style={{ fontSize: 12, fontWeight: 600 }} />
                    <YAxis domain={[0, 100]} style={{ fontSize: 12, fontWeight: 600 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '2px solid #a855f7', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                    <Legend wrapperStyle={{ fontWeight: 600 }} />
                    <Line type="monotone" dataKey="language" stroke="#a855f7" strokeWidth={3} dot={{ r: 6, fill: '#a855f7' }} />
                    <Line type="monotone" dataKey="algorithms" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6, fill: '#3b82f6' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {/* HR & Soft Skills Tab */}
        {activeTab === 'hr' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Communication Skills */}
              <div className="bg-white rounded-3xl shadow-lg p-8 border border-purple-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100/20 to-transparent rounded-full -mr-16 -mt-16" />
                <h3 className="text-2xl font-bold text-gray-900 mb-6 relative flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                    <Target className="text-green-600" size={20} />
                  </div>
                  Communication Skills
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={hrSkillsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="skill" angle={-45} textAnchor="end" height={80} style={{ fontSize: 12, fontWeight: 600 }} />
                    <YAxis domain={[0, 100]} style={{ fontSize: 12, fontWeight: 600 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '2px solid #10b981', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="value" fill="url(#greenGradient)" radius={[8, 8, 0, 0]} />
                    <defs>
                      <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Cultural Fit */}
              <div className="bg-white rounded-3xl shadow-lg p-8 border border-purple-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100/20 to-transparent rounded-full -mr-16 -mt-16" />
                <h3 className="text-2xl font-bold text-gray-900 mb-6 relative flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                    <Award className="text-orange-600" size={20} />
                  </div>
                  Cultural Fit
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={culturalFitData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="skill" angle={-45} textAnchor="end" height={80} style={{ fontSize: 12, fontWeight: 600 }} />
                    <YAxis domain={[0, 100]} style={{ fontSize: 12, fontWeight: 600 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '2px solid #f59e0b', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="value" fill="url(#orangeGradient)" radius={[8, 8, 0, 0]} />
                    <defs>
                      <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Big 5 Personality Profile */}
            {big5Data.length > 0 && (
              <div className="bg-white rounded-3xl shadow-lg p-8 border border-purple-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-100/20 to-transparent rounded-full -mr-20 -mt-20" />
                <h3 className="text-2xl font-bold text-gray-900 mb-6 relative flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <Award className="text-purple-600" size={20} />
                  </div>
                  Personality Profile (Big 5)
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={big5Data}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="skill" style={{ fontSize: 12, fontWeight: 600 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} style={{ fontSize: 11, fontWeight: 600 }} />
                    <Radar name="Score" dataKey="value" stroke="#a855f7" fill="#a855f7" fillOpacity={0.6} strokeWidth={2} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '2px solid #a855f7', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* HR Trend */}
            {hrTrendData.length > 0 && (
              <div className="bg-white rounded-3xl shadow-lg p-8 border border-purple-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-100/20 to-transparent rounded-full -mr-20 -mt-20" />
                <h3 className="text-2xl font-bold text-gray-900 mb-6 relative flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                    <TrendingUp className="text-green-600" size={20} />
                  </div>
                  HR Skills Trend
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={hrTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="interview" style={{ fontSize: 12, fontWeight: 600 }} />
                    <YAxis domain={[0, 10]} style={{ fontSize: 12, fontWeight: 600 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '2px solid #10b981', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                    <Legend wrapperStyle={{ fontWeight: 600 }} />
                    <Line type="monotone" dataKey="communication" stroke="#10b981" strokeWidth={3} dot={{ r: 6, fill: '#10b981' }} />
                    <Line type="monotone" dataKey="cultural_fit" stroke="#f59e0b" strokeWidth={3} dot={{ r: 6, fill: '#f59e0b' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {/* Case Study Tab */}
        {activeTab === 'case_study' && (
          <div className="space-y-8">
            {summary.interview_breakdown.case_study === 0 ? (
              <div className="bg-white rounded-3xl shadow-lg p-12 text-center border border-purple-100">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-yellow-100 to-amber-100 flex items-center justify-center mx-auto mb-6">
                  <Target className="text-yellow-600" size={48} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Case Study Interviews Yet</h3>
                <p className="text-gray-600">Case study interview data will appear here once sessions are completed</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Case Study Skills Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Analytical Skills */}
                  <div className="bg-white rounded-3xl shadow-lg p-8 border border-purple-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-100/20 to-transparent rounded-full -mr-16 -mt-16" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 relative flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                        <Target className="text-yellow-600" size={20} />
                      </div>
                      Analytical Skills
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={[
                        { skill: 'Problem Understanding', value: case_study_analysis.scores.problem_understanding || 0 },
                        { skill: 'Hypothesis', value: case_study_analysis.scores.hypothesis || 0 },
                        { skill: 'Analysis', value: case_study_analysis.scores.analysis || 0 },
                        { skill: 'Synthesis', value: case_study_analysis.scores.synthesis || 0 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="skill" angle={-45} textAnchor="end" height={100} style={{ fontSize: 11, fontWeight: 600 }} />
                        <YAxis domain={[0, 100]} style={{ fontSize: 12, fontWeight: 600 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: '2px solid #f59e0b', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                        <Bar dataKey="value" fill="url(#yellowGradient)" radius={[8, 8, 0, 0]} />
                        <defs>
                          <linearGradient id="yellowGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#d97706" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Business Impact Skills */}
                  <div className="bg-white rounded-3xl shadow-lg p-8 border border-purple-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-100/20 to-transparent rounded-full -mr-16 -mt-16" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 relative flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                        <Award className="text-amber-600" size={20} />
                      </div>
                      Business Impact
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={[
                        { skill: 'Business Judgment', value: case_study_analysis.scores.business_judgment || 0 },
                        { skill: 'Creativity', value: case_study_analysis.scores.creativity || 0 },
                        { skill: 'Decision Making', value: case_study_analysis.scores.decision_making || 0 },
                        { skill: 'Impact Orientation', value: case_study_analysis.scores.impact_orientation || 0 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="skill" angle={-45} textAnchor="end" height={100} style={{ fontSize: 11, fontWeight: 600 }} />
                        <YAxis domain={[0, 100]} style={{ fontSize: 12, fontWeight: 600 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: '2px solid #d97706', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                        <Bar dataKey="value" fill="url(#amberGradient)" radius={[8, 8, 0, 0]} />
                        <defs>
                          <linearGradient id="amberGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#d97706" />
                            <stop offset="100%" stopColor="#b45309" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Case Study Trend */}
                {case_study_analysis.interviews.length > 0 && (
                  <div className="bg-white rounded-3xl shadow-lg p-8 border border-purple-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-yellow-100/20 to-transparent rounded-full -mr-20 -mt-20" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 relative flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-100 to-amber-100 flex items-center justify-center">
                        <TrendingUp className="text-yellow-600" size={20} />
                      </div>
                      Case Study Performance Trend
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={case_study_analysis.interviews.slice(-6).map((interview, idx) => ({
                        interview: `Session ${idx + 1}`,
                        analytical: ((interview.scores.problem_understanding + interview.scores.hypothesis + interview.scores.analysis + interview.scores.synthesis) / 4) || 0,
                        business: ((interview.scores.business_judgment + interview.scores.creativity + interview.scores.decision_making + interview.scores.impact_orientation) / 4) || 0,
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="interview" style={{ fontSize: 12, fontWeight: 600 }} />
                        <YAxis domain={[0, 100]} style={{ fontSize: 12, fontWeight: 600 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: '2px solid #f59e0b', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                        <Legend wrapperStyle={{ fontWeight: 600 }} />
                        <Line type="monotone" dataKey="analytical" stroke="#f59e0b" strokeWidth={3} dot={{ r: 6, fill: '#f59e0b' }} name="Analytical" />
                        <Line type="monotone" dataKey="business" stroke="#d97706" strokeWidth={3} dot={{ r: 6, fill: '#d97706' }} name="Business Impact" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Communication Tab */}
        {activeTab === 'communication' && (
          <div className="space-y-8">
            {summary.interview_breakdown.communication === 0 ? (
              <div className="bg-white rounded-3xl shadow-lg p-12 text-center border border-purple-100">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="text-green-600" size={48} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Communication Interviews Yet</h3>
                <p className="text-gray-600">Communication interview data will appear here once sessions are completed</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Communication Skills Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Speaking Skills */}
                  <div className="bg-white rounded-3xl shadow-lg p-8 border border-purple-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100/20 to-transparent rounded-full -mr-16 -mt-16" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 relative flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                        <MessageSquare className="text-green-600" size={20} />
                      </div>
                      Speaking Skills
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={[
                        { skill: 'Fluency', value: communication_analysis.scores.fluency || 0 },
                        { skill: 'Pronunciation', value: communication_analysis.scores.pronunciation || 0 },
                        { skill: 'Vocabulary', value: communication_analysis.scores.vocabulary_range || 0 },
                        { skill: 'Sentence Structure', value: communication_analysis.scores.sentence_construction || 0 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="skill" angle={-45} textAnchor="end" height={100} style={{ fontSize: 11, fontWeight: 600 }} />
                        <YAxis domain={[0, 100]} style={{ fontSize: 12, fontWeight: 600 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: '2px solid #10b981', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                        <Bar dataKey="value" fill="url(#greenGradient)" radius={[8, 8, 0, 0]} />
                        <defs>
                          <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#059669" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Comprehension Skills */}
                  <div className="bg-white rounded-3xl shadow-lg p-8 border border-purple-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100/20 to-transparent rounded-full -mr-16 -mt-16" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 relative flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <Target className="text-emerald-600" size={20} />
                      </div>
                      Comprehension Skills
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={[
                        { skill: 'Listening', value: communication_analysis.scores.listening_comprehension || 0 },
                        { skill: 'Reading', value: communication_analysis.scores.reading_comprehension || 0 },
                        { skill: 'Context', value: communication_analysis.scores.contextual_understanding || 0 },
                        { skill: 'Relevance', value: communication_analysis.scores.response_relevance || 0 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="skill" angle={-45} textAnchor="end" height={100} style={{ fontSize: 11, fontWeight: 600 }} />
                        <YAxis domain={[0, 100]} style={{ fontSize: 12, fontWeight: 600 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: '2px solid #059669', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                        <Bar dataKey="value" fill="url(#emeraldGradient)" radius={[8, 8, 0, 0]} />
                        <defs>
                          <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#059669" />
                            <stop offset="100%" stopColor="#047857" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Communication Trend */}
                {communication_analysis.interviews.length > 0 && (
                  <div className="bg-white rounded-3xl shadow-lg p-8 border border-purple-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-100/20 to-transparent rounded-full -mr-20 -mt-20" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 relative flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                        <TrendingUp className="text-green-600" size={20} />
                      </div>
                      Communication Performance Trend
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={communication_analysis.interviews.slice(-6).map((interview, idx) => ({
                        interview: `Session ${idx + 1}`,
                        speaking: ((interview.scores.fluency + interview.scores.pronunciation + interview.scores.vocabulary_range + interview.scores.sentence_construction) / 4) || 0,
                        comprehension: ((interview.scores.listening_comprehension + interview.scores.reading_comprehension + interview.scores.contextual_understanding + interview.scores.response_relevance) / 4) || 0,
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="interview" style={{ fontSize: 12, fontWeight: 600 }} />
                        <YAxis domain={[0, 100]} style={{ fontSize: 12, fontWeight: 600 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: '2px solid #10b981', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                        <Legend wrapperStyle={{ fontWeight: 600 }} />
                        <Line type="monotone" dataKey="speaking" stroke="#10b981" strokeWidth={3} dot={{ r: 6, fill: '#10b981' }} name="Speaking" />
                        <Line type="monotone" dataKey="comprehension" stroke="#059669" strokeWidth={3} dot={{ r: 6, fill: '#059669' }} name="Comprehension" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Debate Tab */}
        {activeTab === 'debate' && (
          <div className="space-y-8">
            {summary.interview_breakdown.debate === 0 ? (
              <div className="bg-white rounded-3xl shadow-lg p-12 text-center border border-purple-100">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center mx-auto mb-6">
                  <Zap className="text-pink-600" size={48} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Debate Interviews Yet</h3>
                <p className="text-gray-600">Debate interview data will appear here once sessions are completed</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Debate Skills Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Argumentation Skills */}
                  <div className="bg-white rounded-3xl shadow-lg p-8 border border-purple-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-100/20 to-transparent rounded-full -mr-16 -mt-16" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 relative flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
                        <Zap className="text-pink-600" size={20} />
                      </div>
                      Argumentation Skills
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={[
                        { skill: 'Argument Structure', value: debate_analysis.scores.argument_structure || 0 },
                        { skill: 'Evidence Usage', value: debate_analysis.scores.evidence_usage || 0 },
                        { skill: 'Logical Reasoning', value: debate_analysis.scores.logical_reasoning || 0 },
                        { skill: 'Counter Arguments', value: debate_analysis.scores.counterargument_handling || 0 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="skill" angle={-45} textAnchor="end" height={100} style={{ fontSize: 11, fontWeight: 600 }} />
                        <YAxis domain={[0, 100]} style={{ fontSize: 12, fontWeight: 600 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: '2px solid #ec4899', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                        <Bar dataKey="value" fill="url(#pinkGradient)" radius={[8, 8, 0, 0]} />
                        <defs>
                          <linearGradient id="pinkGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ec4899" />
                            <stop offset="100%" stopColor="#db2777" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Persuasion Skills */}
                  <div className="bg-white rounded-3xl shadow-lg p-8 border border-purple-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-100/20 to-transparent rounded-full -mr-16 -mt-16" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 relative flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                        <Award className="text-rose-600" size={20} />
                      </div>
                      Persuasion Skills
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={[
                        { skill: 'Persuasiveness', value: debate_analysis.scores.persuasiveness || 0 },
                        { skill: 'Rhetorical Skills', value: debate_analysis.scores.rhetorical_skills || 0 },
                        { skill: 'Audience Awareness', value: debate_analysis.scores.audience_awareness || 0 },
                        { skill: 'Conclusion Strength', value: debate_analysis.scores.conclusion_strength || 0 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="skill" angle={-45} textAnchor="end" height={100} style={{ fontSize: 11, fontWeight: 600 }} />
                        <YAxis domain={[0, 100]} style={{ fontSize: 12, fontWeight: 600 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: '2px solid #f43f5e', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                        <Bar dataKey="value" fill="url(#roseGradient)" radius={[8, 8, 0, 0]} />
                        <defs>
                          <linearGradient id="roseGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f43f5e" />
                            <stop offset="100%" stopColor="#e11d48" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Debate Trend */}
                {debate_analysis.interviews.length > 0 && (
                  <div className="bg-white rounded-3xl shadow-lg p-8 border border-purple-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-pink-100/20 to-transparent rounded-full -mr-20 -mt-20" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 relative flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center">
                        <TrendingUp className="text-pink-600" size={20} />
                      </div>
                      Debate Performance Trend
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={debate_analysis.interviews.slice(-6).map((interview, idx) => ({
                        interview: `Session ${idx + 1}`,
                        argumentation: ((interview.scores.argument_structure + interview.scores.evidence_usage + interview.scores.logical_reasoning + interview.scores.counterargument_handling) / 4) || 0,
                        persuasion: ((interview.scores.persuasiveness + interview.scores.rhetorical_skills + interview.scores.audience_awareness + interview.scores.conclusion_strength) / 4) || 0,
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="interview" style={{ fontSize: 12, fontWeight: 600 }} />
                        <YAxis domain={[0, 100]} style={{ fontSize: 12, fontWeight: 600 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: '2px solid #ec4899', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                        <Legend wrapperStyle={{ fontWeight: 600 }} />
                        <Line type="monotone" dataKey="argumentation" stroke="#ec4899" strokeWidth={3} dot={{ r: 6, fill: '#ec4899' }} name="Argumentation" />
                        <Line type="monotone" dataKey="persuasion" stroke="#f43f5e" strokeWidth={3} dot={{ r: 6, fill: '#f43f5e' }} name="Persuasion" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Interview History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            {all_interviews.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl shadow-lg border border-purple-100">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-6">
                  <Award className="text-purple-600" size={48} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No interviews yet</h3>
                <p className="text-gray-600">Interview history will appear here once sessions are completed</p>
              </div>
            ) : (
              all_interviews.map((interview, idx) => {
                // Get detailed feedback from technical/hr analysis
                const techInterview = technical_analysis.interviews.find(t => t.session_id === interview.session_id);
                const hrInterview = hr_analysis.interviews.find(h => h.session_id === interview.session_id);
                
                return (
                  <div
                    key={interview.id}
                    className="bg-white rounded-3xl shadow-lg border border-purple-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <div
                      className="p-8 cursor-pointer hover:bg-purple-50/30 transition"
                      onClick={() => setExpandedInterview(expandedInterview === interview.id ? null : interview.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3 flex-wrap">
                            <span className="text-base font-bold bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-4 py-2 rounded-xl border border-blue-200">
                              #{all_interviews.length - idx}
                            </span>
                            <span className={`text-base font-bold bg-gradient-to-r px-4 py-2 rounded-xl border ${getInterviewTypeColor(interview.interview_type)}`}>
                              {interview.interview_type}
                            </span>
                            {interview.duration && (
                              <span className="text-sm text-gray-600 font-semibold">Duration: {interview.duration}</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 font-medium">
                            {new Date(interview.created_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {new Date(interview.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className={`text-right ${getScoreColor(interview.overall_score)} px-6 py-4 rounded-2xl`}>
                          <div className="text-5xl font-bold">{interview.overall_score}</div>
                          <div className="text-xs font-bold mt-1">{getScoreBadge(interview.overall_score)}</div>
                        </div>
                      </div>

                      {expandedInterview === interview.id && (
                        <div className="mt-8 pt-8 border-t-2 border-purple-100 space-y-8">
                          {/* Main Scores */}
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {interview.technical_skills > 0 && (
                              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-2xl border border-purple-200">
                                <p className="text-xs text-purple-700 font-bold mb-2 uppercase tracking-wide">Technical</p>
                                <p className="text-3xl font-bold text-purple-600">{interview.technical_skills}</p>
                              </div>
                            )}
                            {interview.communication_skills > 0 && (
                              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-2xl border border-green-200">
                                <p className="text-xs text-green-700 font-bold mb-2 uppercase tracking-wide">Communication</p>
                                <p className="text-3xl font-bold text-green-600">{interview.communication_skills}</p>
                              </div>
                            )}
                            {interview.hr_skills > 0 && (
                              <div className="bg-gradient-to-br from-orange-50 to-pink-50 p-5 rounded-2xl border border-orange-200">
                                <p className="text-xs text-orange-700 font-bold mb-2 uppercase tracking-wide">HR Skills</p>
                                <p className="text-3xl font-bold text-orange-600">{interview.hr_skills}</p>
                              </div>
                            )}
                            {interview.case_study_skills > 0 && (
                              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-5 rounded-2xl border border-yellow-200">
                                <p className="text-xs text-yellow-700 font-bold mb-2 uppercase tracking-wide">Case Study</p>
                                <p className="text-3xl font-bold text-yellow-600">{interview.case_study_skills}</p>
                              </div>
                            )}
                            {interview.debate_skills > 0 && (
                              <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-5 rounded-2xl border border-pink-200">
                                <p className="text-xs text-pink-700 font-bold mb-2 uppercase tracking-wide">Debate</p>
                                <p className="text-3xl font-bold text-pink-600">{interview.debate_skills}</p>
                              </div>
                            )}
                          </div>

                          {/* Detailed Technical Scores */}
                          {techInterview && techInterview.scores && (
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-purple-200">
                              <p className="font-bold text-gray-900 mb-6 text-xl flex items-center gap-2">
                                <span className="text-2xl">🧠</span> Detailed Technical Breakdown
                              </p>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {Object.entries(techInterview.scores).map(([skill, score]) => (
                                  <div key={skill} className="bg-white p-4 rounded-xl border-2 border-purple-200 hover:shadow-md transition">
                                    <p className="text-xs text-gray-600 mb-2 font-bold uppercase tracking-wide">{skill.replace('_', ' ')}</p>
                                    <div className="flex items-center justify-between">
                                      <p className="text-2xl font-bold text-purple-600">{score}</p>
                                      <div className="w-16 h-2 bg-purple-200 rounded-full overflow-hidden">
                                        <div 
                                          className="h-full bg-gradient-to-r from-purple-600 to-pink-600" 
                                          style={{ width: `${(score / 10) * 100}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Detailed HR Scores */}
                          {hrInterview && hrInterview.scores && (
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-200">
                              <p className="font-bold text-gray-900 mb-6 text-xl flex items-center gap-2">
                                <span className="text-2xl">💼</span> Detailed HR & Communication Breakdown
                              </p>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {Object.entries(hrInterview.scores).map(([skill, score]) => (
                                  <div key={skill} className="bg-white p-4 rounded-xl border-2 border-green-200 hover:shadow-md transition">
                                    <p className="text-xs text-gray-600 mb-2 font-bold uppercase tracking-wide">{skill.replace('_', ' ')}</p>
                                    <div className="flex items-center justify-between">
                                      <p className="text-2xl font-bold text-green-600">{score}</p>
                                      <div className="w-16 h-2 bg-green-200 rounded-full overflow-hidden">
                                        <div 
                                          className="h-full bg-gradient-to-r from-green-600 to-emerald-600" 
                                          style={{ width: `${(score / 10) * 100}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Detailed Case Study Scores */}
                          {interview.interview_type === 'Case Study' && case_study_analysis.interviews.find(cs => cs.session_id === interview.session_id) && (
                            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-2xl border-2 border-yellow-200">
                              <p className="font-bold text-gray-900 mb-6 text-xl flex items-center gap-2">
                                <span className="text-2xl">📊</span> Detailed Case Study Breakdown
                              </p>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {Object.entries(case_study_analysis.interviews.find(cs => cs.session_id === interview.session_id).scores).map(([skill, score]) => (
                                  <div key={skill} className="bg-white p-4 rounded-xl border-2 border-yellow-200 hover:shadow-md transition">
                                    <p className="text-xs text-gray-600 mb-2 font-bold uppercase tracking-wide">{skill.replace('_', ' ')}</p>
                                    <div className="flex items-center justify-between">
                                      <p className="text-2xl font-bold text-yellow-600">{score}</p>
                                      <div className="w-16 h-2 bg-yellow-200 rounded-full overflow-hidden">
                                        <div 
                                          className="h-full bg-gradient-to-r from-yellow-600 to-amber-600" 
                                          style={{ width: `${(score / 100) * 100}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Detailed Communication Scores */}
                          {interview.interview_type === 'Communication' && communication_analysis.interviews.find(cf => cf.session_id === interview.session_id) && (
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-200">
                              <p className="font-bold text-gray-900 mb-6 text-xl flex items-center gap-2">
                                <span className="text-2xl">💬</span> Detailed Communication Breakdown
                              </p>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {Object.entries(communication_analysis.interviews.find(cf => cf.session_id === interview.session_id).scores).map(([skill, score]) => (
                                  <div key={skill} className="bg-white p-4 rounded-xl border-2 border-green-200 hover:shadow-md transition">
                                    <p className="text-xs text-gray-600 mb-2 font-bold uppercase tracking-wide">{skill.replace('_', ' ')}</p>
                                    <div className="flex items-center justify-between">
                                      <p className="text-2xl font-bold text-green-600">{score}</p>
                                      <div className="w-16 h-2 bg-green-200 rounded-full overflow-hidden">
                                        <div 
                                          className="h-full bg-gradient-to-r from-green-600 to-emerald-600" 
                                          style={{ width: `${(score / 100) * 100}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Detailed Debate Scores */}
                          {interview.interview_type === 'Debate' && debate_analysis.interviews.find(df => df.session_id === interview.session_id) && (
                            <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-2xl border-2 border-pink-200">
                              <p className="font-bold text-gray-900 mb-6 text-xl flex items-center gap-2">
                                <span className="text-2xl">⚡</span> Detailed Debate Breakdown
                              </p>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {Object.entries(debate_analysis.interviews.find(df => df.session_id === interview.session_id).scores).map(([skill, score]) => (
                                  <div key={skill} className="bg-white p-4 rounded-xl border-2 border-pink-200 hover:shadow-md transition">
                                    <p className="text-xs text-gray-600 mb-2 font-bold uppercase tracking-wide">{skill.replace('_', ' ')}</p>
                                    <div className="flex items-center justify-between">
                                      <p className="text-2xl font-bold text-pink-600">{score}</p>
                                      <div className="w-16 h-2 bg-pink-200 rounded-full overflow-hidden">
                                        <div 
                                          className="h-full bg-gradient-to-r from-pink-600 to-rose-600" 
                                          style={{ width: `${(score / 100) * 100}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Feedback Section */}
                          <div className="space-y-6">
                            {interview.strengths && (
                              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-200">
                                <p className="font-bold text-gray-900 mb-3 text-lg flex items-center gap-2">
                                  <span className="text-xl">✨</span> Strengths
                                </p>
                                <p className="text-gray-700 leading-relaxed">{interview.strengths}</p>
                              </div>
                            )}

                            {interview.areas_of_improvement && (
                              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-2xl border-2 border-yellow-200">
                                <p className="font-bold text-gray-900 mb-3 text-lg flex items-center gap-2">
                                  <span className="text-xl">📈</span> Areas for Improvement
                                </p>
                                <p className="text-gray-700 leading-relaxed">{interview.areas_of_improvement}</p>
                              </div>
                            )}

                            {interview.recommendations && (
                              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border-2 border-blue-200">
                                <p className="font-bold text-gray-900 mb-3 text-lg flex items-center gap-2">
                                  <span className="text-xl">💡</span> Recommendations
                                </p>
                                <p className="text-gray-700 leading-relaxed">{interview.recommendations}</p>
                              </div>
                            )}

                            {interview.overall_feedback && (
                              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-purple-200">
                                <p className="font-bold text-gray-900 mb-3 text-lg flex items-center gap-2">
                                  <span className="text-xl">📝</span> Overall Feedback
                                </p>
                                <p className="text-gray-700 leading-relaxed">{interview.overall_feedback}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherStudentDetail;
