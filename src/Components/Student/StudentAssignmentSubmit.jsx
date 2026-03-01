import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, X, FileText, AlertCircle, CheckCircle2, Calendar, Clock, Link as LinkIcon, Send, Download } from 'lucide-react';
import axios from 'axios';

import api from "../../service/api";
const StudentAssignmentSubmit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [file, setFile] = useState(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);

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
      
      // Find user's submission
      const userSubmission = submissionsRes.data.results?.find(
        sub => sub.student === state.auth.user?.email
      ) || submissionsRes.data.find(sub => sub.student === state.auth.user?.email);
      
      setSubmission(userSubmission);
      setError('');
    } catch (err) {
      setError('Failed to load assignment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (file) => {
    const maxSize = 50 * 1024 * 1024; // 50MB
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'image/jpeg',
      'image/png'
    ];

    if (file.size > maxSize) {
      setError('File is too large (max 50MB)');
      return;
    }
    if (!allowedTypes.includes(file.type)) {
      setError('File type not supported');
      return;
    }
    setFile(file);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file && !linkUrl.trim()) {
      setError('Please provide a file or link');
      return;
    }

    if (assignment.submission_type === 'document' && !file) {
      setError('Please upload a document');
      return;
    }

    if (assignment.submission_type === 'link' && !linkUrl.trim()) {
      setError('Please provide a link');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
            

      const submitData = new FormData();
      submitData.append('assignment', parseInt(id, 10));
      if (file) {
        submitData.append('submission_document', file);
      }
      if (linkUrl.trim()) {
        submitData.append('submission_link', linkUrl.trim());
      }
      submitData.append('status', 'submitted');

      if (submission) {
        // Update existing submission
        await api.patch(`assignment-submissions/${submission.id}/`,
          submitData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      } else {
        // Create new submission
        await api.post('assignment-submissions/',
          submitData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      }

      setSuccess('Assignment submitted successfully!');
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit assignment');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
            <div className="absolute top-0 left-0 animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
          </div>
          <p className="text-gray-600 font-medium">Loading assignment...</p>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="text-red-600 mx-auto mb-4" size={48} />
          <p className="text-gray-900 font-semibold">Assignment not found</p>
        </div>
      </div>
    );
  }

  const isOverdue = assignment.deadline && new Date(assignment.deadline) < new Date();
  const canSubmit = !isOverdue || assignment.allow_late_submission;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8">
      <div className="w-full px-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-8 font-semibold transition-all duration-300 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition" />
          Back to Class
        </motion.button>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-start gap-3"
          >
            <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={20} />
            <p className="text-red-900 font-semibold">{error}</p>
          </motion.div>
        )}

        {/* Success Alert */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-start gap-3"
          >
            <CheckCircle2 className="text-green-600 flex-shrink-0 mt-1" size={20} />
            <p className="text-green-900 font-semibold">{success}</p>
          </motion.div>
        )}

        {/* Assignment Details */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-lg border border-purple-100 p-8 mb-6 hover:shadow-xl transition-shadow duration-300"
        >
          <div className="relative mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">{assignment.title}</h1>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-200 rounded-full opacity-20 blur-2xl"></div>
          </div>
          
          {assignment.description && (
            <p className="text-gray-700 leading-relaxed mb-6">{assignment.description}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {assignment.deadline && (
              <div className="flex items-center gap-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                <div className="bg-white rounded-lg p-2 shadow-sm">
                  <Calendar className="text-purple-600" size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Deadline</p>
                  <p className={`text-sm font-bold ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                    {new Date(assignment.deadline).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-600">
                    {new Date(assignment.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
              <div className="bg-white rounded-lg p-2 shadow-sm">
                <FileText className="text-orange-600" size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Submission Type</p>
                <p className="text-sm font-bold text-gray-900 capitalize">{assignment.submission_type}</p>
              </div>
            </div>
          </div>

          {assignment.instructions && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6">
              <h3 className="font-bold text-purple-900 mb-3 text-lg">📋 Instructions</h3>
              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{assignment.instructions}</p>
            </div>
          )}

          {/* Resource Files */}
          {assignment.resource_files && assignment.resource_files.length > 0 && (
            <div className="mt-6">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">📎 Resource Files</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {assignment.resource_files.map((resource, idx) => (
                  <a
                    key={idx}
                    href={resource.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-xl transition-all duration-300 border border-green-200 hover:border-green-300 hover:shadow-md group"
                  >
                    <div className="bg-white rounded-lg p-2 shadow-sm group-hover:shadow-md transition-shadow">
                      <Download className="text-green-600" size={20} />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      Resource {idx + 1}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Submission Status */}
        {submission && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-3xl p-8 mb-6 shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-3 shadow-md">
                <CheckCircle2 className="text-white flex-shrink-0" size={28} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-green-900 text-2xl mb-2">✅ Successfully Submitted</h3>
                <p className="text-green-800 text-sm mb-4">
                  Submitted on: {new Date(submission.submitted_at).toLocaleString()}
                </p>
                {submission.grade && (
                  <div className="bg-white rounded-2xl p-5 border border-green-200 shadow-sm">
                    <p className="font-bold text-lg text-gray-900 mb-2">Grade: <span className="text-green-600">{submission.grade}</span></p>
                    {submission.feedback && (
                      <div className="mt-3 pt-3 border-t border-green-100">
                        <p className="text-sm font-semibold text-gray-700 mb-1">Feedback:</p>
                        <p className="text-gray-600 leading-relaxed">{submission.feedback}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Submission Form */}
        {canSubmit && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-lg border border-purple-100 p-8 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-3 shadow-md">
                <Send className="text-white" size={24} />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {submission ? 'Resubmit Assignment' : 'Submit Assignment'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* File Upload */}
              {(assignment.submission_type === 'document' || assignment.submission_type === 'both') && (
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">
                    📄 Upload Document {assignment.submission_type === 'document' && <span className="text-red-500">*</span>}
                  </label>
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`relative border-3 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                      dragActive
                        ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg'
                        : 'border-gray-300 bg-gradient-to-br from-gray-50 to-slate-50 hover:border-purple-400 hover:shadow-md'
                    }`}
                  >
                    <input
                      type="file"
                      onChange={handleFileInput}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-4 w-fit mx-auto mb-4 shadow-md">
                      <Upload className="text-white" size={36} />
                    </div>
                    <p className="text-lg font-semibold text-gray-700 mb-1">
                      {file ? file.name : 'Click or drag file here'}
                    </p>
                    <p className="text-xs text-gray-500">Max 50MB • PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, PNG</p>
                  </div>
                  {file && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 flex items-center gap-3 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4"
                    >
                      <div className="bg-white rounded-lg p-2 shadow-sm">
                        <FileText className="text-purple-600" size={22} />
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-semibold text-gray-900 block">{file.name}</span>
                        <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="ml-auto bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 rounded-lg p-2 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Link Input */}
              {(assignment.submission_type === 'link' || assignment.submission_type === 'both') && (
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-3">
                    🔗 Submission Link {assignment.submission_type === 'link' && <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-2">
                      <LinkIcon className="text-white" size={18} />
                    </div>
                    <input
                      type="url"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      className="w-full pl-16 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 bg-gradient-to-br from-gray-50 to-slate-50"
                      placeholder="https://example.com/your-work"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 bg-gradient-to-br from-gray-100 to-slate-100 hover:from-gray-200 hover:to-slate-200 text-gray-900 py-4 rounded-xl font-bold transition-all duration-300 shadow-md hover:shadow-lg border border-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transform hover:-translate-y-0.5"
                >
                  {submitting ? (
                    <>
                      <div className="relative">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <div className="absolute top-0 left-0 animate-spin rounded-full h-5 w-5 border-b-2 border-pink-300" style={{ animationDirection: 'reverse' }}></div>
                      </div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send size={22} />
                      <span>Submit Assignment</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Overdue Message */}
        {isOverdue && !assignment.allow_late_submission && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-300 rounded-3xl p-8 text-center shadow-lg"
          >
            <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-full p-4 w-fit mx-auto mb-4 shadow-md">
              <AlertCircle className="text-white mx-auto" size={48} />
            </div>
            <h3 className="font-bold text-red-900 text-2xl mb-3">⏰ Submission Closed</h3>
            <p className="text-red-800 text-lg">
              This assignment deadline has passed and late submissions are not allowed.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StudentAssignmentSubmit;
