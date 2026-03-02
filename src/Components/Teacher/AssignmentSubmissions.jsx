import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Users, CheckCircle2, Clock, XCircle, Download, FileText, Link as LinkIcon, Award, MessageSquare, Save, X, Calendar } from 'lucide-react';
import axios from 'axios';

import api from "../../service/api";
const AssignmentSubmissions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeInput, setGradeInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
            

      const [assignmentRes, submissionsRes] = await Promise.all([
        api.get(`assignments/${id}/`),
        api.get(`assignment-submissions/?assignment=${id}`)
      ]);

      setAssignment(assignmentRes.data);
      setSubmissions(submissionsRes.data.results || submissionsRes.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load submissions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGradeSubmission = async (submissionId) => {
    if (!gradeInput || gradeInput === '') {
      setError('Please enter a grade');
      return;
    }

    const grade = parseFloat(gradeInput);
    if (isNaN(grade) || grade < 0 || grade > 100) {
      setError('Grade must be between 0 and 100');
      return;
    }

    try {
      setSaving(true);
      setError('');
            

      const updateData = {
        grade: grade,
        feedback: feedbackInput,
        status: 'graded'
      };

      await api.patch(`assignment-submissions/${submissionId}/`,
        updateData
      );

      setSuccess('Grade saved successfully!');
      setSelectedSubmission(null);
      setGradeInput('');
      setFeedbackInput('');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save grade');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const openGradeModal = (submission) => {
    setSelectedSubmission(submission);
    setGradeInput(submission.grade || '');
    setFeedbackInput(submission.feedback || '');
    setError('');
  };

  const closeGradeModal = () => {
    setSelectedSubmission(null);
    setGradeInput('');
    setFeedbackInput('');
    setError('');
  };

  const filteredSubmissions = submissions.filter(sub => {
    if (filterStatus === 'all') return true;
    return sub.status === filterStatus;
  });

  const stats = {
    total: submissions.length,
    submitted: submissions.filter(s => s.status === 'submitted').length,
    graded: submissions.filter(s => s.status === 'graded').length,
    notStarted: submissions.filter(s => s.status === 'not_started').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 flex items-center justify-center">
            <Award className="text-white" size={40} />
          </div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600"></div>
          <p className="text-purple-700 font-semibold">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-purple-700 hover:text-purple-900 mb-8 font-bold transition group bg-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl border border-purple-100"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition" />
          Back to Class
        </motion.button>

        {/* Success Alert */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-5 mb-6 flex items-start gap-3 shadow-lg"
          >
            <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={24} />
            <p className="text-green-900 font-bold text-lg">{success}</p>
          </motion.div>
        )}

        {/* Assignment Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-white rounded-3xl shadow-xl border-2 border-purple-100 p-8 mb-8 overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-400/20 via-pink-400/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-400/20 via-purple-400/20 to-transparent rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 flex items-center justify-center">
                    <FileText className="text-white" size={24} />
                  </div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 bg-clip-text text-transparent">
                    {assignment?.title}
                  </h1>
                </div>
                {assignment?.description && (
                  <p className="text-gray-600 text-lg ml-15">{assignment.description}</p>
                )}
              </div>
            </div>
            {assignment?.deadline && (
              <div className="inline-flex items-center gap-2 text-purple-700 bg-purple-50 px-4 py-2 rounded-xl font-semibold">
                <Calendar size={18} />
                <span>Deadline: {new Date(assignment.deadline).toLocaleString()}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="group relative bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 rounded-3xl shadow-xl border border-blue-400/20 p-6 overflow-hidden hover:shadow-2xl transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Users className="text-white" size={24} />
                </div>
                <span className="text-5xl font-bold text-white">{stats.total}</span>
              </div>
              <p className="text-blue-100 font-semibold text-lg">Total Students</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="group relative bg-gradient-to-br from-green-600 via-green-700 to-emerald-600 rounded-3xl shadow-xl border border-green-400/20 p-6 overflow-hidden hover:shadow-2xl transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <CheckCircle2 className="text-white" size={24} />
                </div>
                <span className="text-5xl font-bold text-white">{stats.submitted}</span>
              </div>
              <p className="text-green-100 font-semibold text-lg">Submitted</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="group relative bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded-3xl shadow-xl border border-purple-400/20 p-6 overflow-hidden hover:shadow-2xl transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Award className="text-white" size={24} />
                </div>
                <span className="text-5xl font-bold text-white">{stats.graded}</span>
              </div>
              <p className="text-purple-100 font-semibold text-lg">Graded</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="group relative bg-gradient-to-br from-orange-600 via-orange-700 to-pink-600 rounded-3xl shadow-xl border border-orange-400/20 p-6 overflow-hidden hover:shadow-2xl transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Clock className="text-white" size={24} />
                </div>
                <span className="text-5xl font-bold text-white">{stats.notStarted}</span>
              </div>
              <p className="text-orange-100 font-semibold text-lg">Not Started</p>
            </div>
          </motion.div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-purple-100 p-2 mb-6 flex gap-2">
          {[
            { key: 'all', label: 'All Submissions' },
            { key: 'submitted', label: 'Submitted' },
            { key: 'graded', label: 'Graded' },
            { key: 'not_started', label: 'Not Started' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${
                filterStatus === tab.key
                  ? 'bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-purple-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Submissions List */}
        <div className="space-y-4">
          {filteredSubmissions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-3xl shadow-xl border-2 border-purple-100 p-16 text-center"
            >
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 flex items-center justify-center mx-auto mb-6">
                <Users className="text-white" size={48} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Submissions Yet</h3>
              <p className="text-gray-600 text-lg">No students have submitted this assignment yet.</p>
            </motion.div>
          ) : (
            filteredSubmissions.map((submission, index) => (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative bg-white rounded-3xl shadow-lg border-2 border-purple-100 p-6 hover:shadow-2xl hover:border-purple-200 transition-all duration-300 overflow-hidden"
              >
                {/* Decorative Element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 via-pink-400/10 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 flex items-center justify-center text-white font-bold">
                        {(submission.student_name || `Student ${submission.student}`).charAt(0).toUpperCase()}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {submission.student_name || `Student ${submission.student}`}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        submission.status === 'graded' 
                          ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700'
                          : submission.status === 'submitted'
                          ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {submission.status.replace('_', ' ')}
                      </span>
                    </div>

                    {submission.submitted_at && (
                      <div className="inline-flex items-center gap-2 text-sm text-gray-600 mb-3 bg-gray-50 px-3 py-2 rounded-lg">
                        <Clock size={16} />
                        <span className="font-semibold">Submitted: {new Date(submission.submitted_at).toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3 mb-4">
                      {submission.submission_document && (
                        <a
                          href={submission.submission_document}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 text-blue-700 rounded-xl transition border-2 border-blue-200 font-semibold shadow-sm hover:shadow-md"
                        >
                          <Download size={18} />
                          <span>Download Document</span>
                        </a>
                      )}
                      {submission.submission_link && (
                        <a
                          href={submission.submission_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 text-green-700 rounded-xl transition border-2 border-green-200 font-semibold shadow-sm hover:shadow-md"
                        >
                          <LinkIcon size={18} />
                          <span>View Link</span>
                        </a>
                      )}
                    </div>

                    {submission.grade !== null && submission.grade !== undefined && (
                      <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 border-2 border-purple-200 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 flex items-center justify-center">
                            <Award className="text-white" size={20} />
                          </div>
                          <span className="font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 bg-clip-text text-transparent text-2xl">
                            Grade: {submission.grade}/100
                          </span>
                        </div>
                        {submission.feedback && (
                          <div className="mt-3 bg-white rounded-xl p-3 border border-purple-100">
                            <p className="text-sm font-bold text-purple-900 mb-1">Feedback:</p>
                            <p className="text-sm text-gray-700">{submission.feedback}</p>
                          </div>
                        )}
                        {submission.graded_at && (
                          <p className="text-xs text-purple-700 mt-3 font-semibold">
                            Graded on: {new Date(submission.graded_at).toLocaleString()}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {submission.status === 'submitted' && (
                    <button
                      onClick={() => openGradeModal(submission)}
                      className="ml-4 bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 hover:from-purple-700 hover:via-purple-800 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                      <Award size={18} />
                      Grade
                    </button>
                  )}
                  {submission.status === 'graded' && (
                    <button
                      onClick={() => openGradeModal(submission)}
                      className="ml-4 bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 hover:from-blue-700 hover:via-blue-800 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                      <MessageSquare size={18} />
                      Edit Grade
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Grading Modal */}
      <AnimatePresence>
        {selectedSubmission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50"
            onClick={closeGradeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 text-white p-8 rounded-t-3xl flex items-center justify-between z-10 shadow-lg">
                <div>
                  <h2 className="text-3xl font-bold mb-1">Grade Submission</h2>
                  <p className="text-purple-100 font-semibold">
                    {selectedSubmission.student_name || `Student ${selectedSubmission.student}`}
                  </p>
                </div>
                <button
                  onClick={closeGradeModal}
                  className="text-white hover:bg-white/20 p-2 rounded-xl transition"
                >
                  <X size={28} />
                </button>
              </div>

              <div className="p-8">
                {/* Error Alert */}
                {error && (
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-4 mb-6 flex items-start gap-3 shadow-sm">
                    <XCircle className="text-red-600 flex-shrink-0 mt-0.5" size={24} />
                    <p className="text-red-900 font-bold">{error}</p>
                  </div>
                )}

                {/* Submission Info */}
                <div className="mb-6 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 rounded-2xl p-6 border-2 border-purple-100">
                  <h3 className="font-bold text-purple-900 mb-3 text-lg">Submission Details</h3>
                  {selectedSubmission.submitted_at && (
                    <p className="text-sm text-gray-700 mb-3 font-semibold">
                      Submitted: {new Date(selectedSubmission.submitted_at).toLocaleString()}
                    </p>
                  )}
                  <div className="flex gap-3">
                    {selectedSubmission.submission_document && (
                      <a
                        href={selectedSubmission.submission_document}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl transition font-bold shadow-md hover:shadow-lg"
                      >
                        <Download size={16} />
                        <span>View Document</span>
                      </a>
                    )}
                    {selectedSubmission.submission_link && (
                      <a
                        href={selectedSubmission.submission_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition font-bold shadow-md hover:shadow-lg"
                      >
                        <LinkIcon size={16} />
                        <span>View Link</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Grade Input */}
                <div className="mb-6">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
                    <Award className="text-purple-600" size={18} />
                    Grade (0-100) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={gradeInput}
                    onChange={(e) => setGradeInput(e.target.value)}
                    className="w-full px-5 py-4 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-purple-50/30 hover:bg-white transition font-bold text-lg"
                    placeholder="Enter grade"
                  />
                </div>

                {/* Feedback Input */}
                <div className="mb-6">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
                    <MessageSquare className="text-purple-600" size={18} />
                    Feedback (Optional)
                  </label>
                  <textarea
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    rows={6}
                    className="w-full px-5 py-4 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none bg-purple-50/30 hover:bg-white transition"
                    placeholder="Provide feedback for the student..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={closeGradeModal}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 py-4 rounded-xl font-bold transition shadow-md hover:shadow-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleGradeSubmission(selectedSubmission.id)}
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 hover:from-purple-700 hover:via-purple-800 hover:to-pink-700 text-white py-4 rounded-xl font-bold transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={22} />
                        Save Grade
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AssignmentSubmissions;
