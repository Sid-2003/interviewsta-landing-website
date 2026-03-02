import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, X, FileText, AlertCircle, CheckCircle2, Calendar, Clock, Users, Zap } from 'lucide-react';
import axios from 'axios';

import api from "../../service/api";
const CreateAssignment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    deadline: '',
    estimatedTime: '',
    maxSubmissions: 1,
    allowLateSubmission: true,
    submissionType: 'document',
  });

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
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);
  };

  const addFiles = (newFiles) => {
    const validFiles = newFiles.filter(file => {
      const maxSize = 50 * 1024 * 1024;
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      
      if (file.size > maxSize) {
        setError(`File ${file.name} is too large (max 50MB)`);
        return false;
      }
      if (!allowedTypes.includes(file.type)) {
        setError(`File ${file.name} has unsupported format`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setFiles([...files, ...validFiles]);
      setError('');
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Assignment title is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
            

      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('instructions', formData.instructions);
      submitData.append('deadline', formData.deadline);
      submitData.append('estimated_time_minutes', formData.estimatedTime || 0);
      submitData.append('max_submissions', formData.maxSubmissions);
      submitData.append('allow_late_submission', formData.allowLateSubmission);
      submitData.append('submission_type', formData.submissionType);
      submitData.append('class_assigned', parseInt(id, 10));

      files.forEach((file) => {
        submitData.append('files', file);
      });

      const response = await api.post('assignments/', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Assignment created:', response.data);
      setSuccess('Assignment created successfully!');
      setTimeout(() => {
        navigate(`/teacher/class/${id}`, { state: { activeTab: 'assignments', refresh: true } });
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create assignment');
      console.error('Error creating assignment:', err, err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
          onClick={() => navigate(`/teacher/class/${id}`)}
          className="flex items-center gap-2 text-purple-700 hover:text-purple-900 mb-8 font-bold transition group bg-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl border border-purple-100"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition" />
          Back to Class
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-white rounded-3xl shadow-xl border-2 border-purple-100 p-8 mb-8 overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-400/20 via-pink-400/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-400/20 via-purple-400/20 to-transparent rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 flex items-center justify-center">
                <FileText className="text-white" size={28} />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 bg-clip-text text-transparent">
                Create Assignment
              </h1>
            </div>
            <p className="text-gray-600 text-lg ml-17">Design an assignment with documents and clear deadlines</p>
          </div>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-5 mb-8 flex items-start gap-3 shadow-lg"
          >
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={24} />
            <div>
              <h3 className="text-red-900 font-bold text-lg">{error}</h3>
            </div>
          </motion.div>
        )}

        {/* Success Alert */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-5 mb-8 flex items-start gap-3 shadow-lg"
          >
            <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={24} />
            <div>
              <h3 className="text-green-900 font-bold text-lg">{success}</h3>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-xl border-2 border-purple-100 p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 flex items-center justify-center">
                <FileText className="text-white" size={20} />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 bg-clip-text text-transparent">
                Assignment Details
              </h2>
            </div>

            {/* Title */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-900 mb-3">
                Assignment Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-5 py-4 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-purple-50/30 hover:bg-white transition font-semibold"
                placeholder="e.g., Data Structure Project, Resume Building"
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-900 mb-3">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-5 py-4 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-purple-50/30 hover:bg-white transition resize-none"
                placeholder="Brief overview of the assignment"
                rows="3"
              />
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                Detailed Instructions
              </label>
              <textarea
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                className="w-full px-5 py-4 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-purple-50/30 hover:bg-white transition resize-none"
                placeholder="Provide clear, detailed instructions..."
                rows="5"
              />
            </div>
          </motion.div>

          {/* Timeline & Settings Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-3xl shadow-xl border-2 border-purple-100 p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 flex items-center justify-center">
                <Clock className="text-white" size={20} />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 bg-clip-text text-transparent">
                Timeline & Settings
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Deadline */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
                  <Calendar size={16} />
                  Deadline
                </label>
                <input
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-5 py-4 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-purple-50/30 hover:bg-white transition font-semibold"
                />
              </div>

              {/* Estimated Time */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
                  <Clock size={16} />
                  Estimated Time (minutes)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.estimatedTime}
                  onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                  className="w-full px-5 py-4 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-purple-50/30 hover:bg-white transition font-semibold"
                  placeholder="e.g., 120"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Submission Type */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
                  <Zap size={16} />
                  Submission Type
                </label>
                <select
                  value={formData.submissionType}
                  onChange={(e) => setFormData({ ...formData, submissionType: e.target.value })}
                  className="w-full px-5 py-4 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-purple-50/30 hover:bg-white transition font-semibold"
                >
                  <option value="document">Document Upload</option>
                  <option value="link">Link Submission</option>
                  <option value="both">Both (Document & Link)</option>
                </select>
              </div>

              {/* Max Submissions */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
                  <Users size={16} />
                  Max Submissions per Student
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.maxSubmissions}
                  onChange={(e) => setFormData({ ...formData, maxSubmissions: parseInt(e.target.value) })}
                  className="w-full px-5 py-4 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-purple-50/30 hover:bg-white transition font-semibold"
                />
              </div>
            </div>

            {/* Late Submission Toggle */}
            <div className="mt-6 pt-6 border-t-2 border-purple-100">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allowLateSubmission}
                  onChange={(e) => setFormData({ ...formData, allowLateSubmission: e.target.checked })}
                  className="w-6 h-6 rounded border-2 border-purple-300 text-purple-600 cursor-pointer focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-sm font-bold text-gray-900">Allow late submissions</span>
              </label>
            </div>
          </motion.div>

          {/* File Upload Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-xl border-2 border-purple-100 p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 via-green-700 to-emerald-600 flex items-center justify-center">
                <Upload className="text-white" size={20} />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 via-green-700 to-emerald-600 bg-clip-text text-transparent">
                Attach Resources (Optional)
              </h2>
            </div>

            {/* Drag & Drop Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
                dragActive
                  ? 'border-purple-500 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50'
                  : 'border-purple-300 bg-purple-50/30 hover:border-purple-400 hover:bg-purple-50'
              }`}
            >
              <input
                type="file"
                multiple
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="pointer-events-none">
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 flex items-center justify-center">
                    <Upload className="text-white" size={40} />
                  </div>
                </div>
                <p className="text-xl font-bold text-gray-900 mb-2">
                  Drag files here or click to browse
                </p>
                <p className="text-sm text-gray-600 font-semibold">
                  PDF, Word, Excel, Text documents up to 50MB
                </p>
              </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Attached Files ({files.length})</h3>
                <div className="space-y-3">
                  {files.map((file, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="group flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 rounded-2xl border-2 border-purple-200 hover:border-purple-300 hover:shadow-md transition-all"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded-xl flex items-center justify-center">
                        <FileText className="text-white" size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 truncate">{file.name}</p>
                        <p className="text-xs text-gray-600 font-semibold">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="flex-shrink-0 p-2 hover:bg-red-100 rounded-xl text-red-600 transition"
                      >
                        <X size={20} />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex gap-4 pb-8"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => navigate(`/teacher/class/${id}`)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 py-4 rounded-xl font-bold transition shadow-md hover:shadow-lg"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 hover:from-purple-700 hover:via-purple-800 hover:to-pink-700 text-white py-4 rounded-xl font-bold transition shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle2 size={22} />
                  Create Assignment
                </>
              )}
            </motion.button>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default CreateAssignment;
