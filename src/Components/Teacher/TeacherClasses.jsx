import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Copy, Trash2, Eye, AlertCircle, BookOpen, Sparkles, ArrowRight, TrendingUp, Calendar, Award, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

import api from "../../service/api";
const TeacherClasses = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
            const response = await api.get('classes/teacher/');
      setClasses(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load classes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
            const response = await api.post('classes/',
        formData
      );
      setClasses([...classes, response.data]);
      setFormData({ name: '', description: '' });
      setShowModal(false);
    } catch (err) {
      setError('Failed to create class');
      console.error(err);
    }
  };

  const handleDeleteClass = async (classId) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
                await api.delete(`classes/${classId}/`);
        setClasses(classes.filter(c => c.id !== classId));
      } catch (err) {
        setError('Failed to delete class');
      }
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading your classes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Header Section - Inspired by Learning Analytics */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30"
            >
              <BookOpen className="h-7 w-7 text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">My Classes</h1>
              <p className="text-gray-600 mt-1">Manage, organize, and monitor your teaching classes</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards - Similar to Learning Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full -mr-8 -mt-8" />
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <BookOpen className="text-purple-600" size={24} />
                </div>
                <div className="w-3 h-3 rounded-full bg-purple-500" />
              </div>
              <p className="text-gray-600 text-sm font-medium mb-1">Total Classes</p>
              <p className="text-3xl font-bold text-gray-900">{classes.length}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -mr-8 -mt-8" />
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Users className="text-blue-600" size={24} />
                </div>
                <div className="w-3 h-3 rounded-full bg-blue-500" />
              </div>
              <p className="text-gray-600 text-sm font-medium mb-1">Total Students</p>
              <p className="text-3xl font-bold text-gray-900">{classes.reduce((sum, cls) => sum + (cls.student_count || 0), 0)}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-pink-500/10 to-transparent rounded-full -mr-8 -mt-8" />
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center">
                  <Award className="text-pink-600" size={24} />
                </div>
                <div className="w-3 h-3 rounded-full bg-pink-500" />
              </div>
              <p className="text-gray-600 text-sm font-medium mb-1">Active Classes</p>
              <p className="text-3xl font-bold text-gray-900">{classes.filter(c => c.student_count > 0).length}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 shadow-lg relative overflow-hidden cursor-pointer group hover:shadow-xl transition"
            onClick={() => setShowModal(true)}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-12 -mt-12" />
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition">
                  <Plus className="text-white" size={24} />
                </div>
                <ArrowRight className="text-white/80 group-hover:translate-x-1 transition" size={20} />
              </div>
              <p className="text-white/90 text-sm font-medium mb-1">Create New</p>
              <p className="text-2xl font-bold text-white">Add Class</p>
            </div>
          </motion.div>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8 flex items-start gap-3"
          >
            <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={20} />
            <div>
              <h3 className="text-red-900 font-semibold">{error}</h3>
            </div>
          </motion.div>
        )}

        {/* Classes Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {classes.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-white rounded-3xl shadow-md border border-gray-100"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-32 h-32 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center"
              >
                <BookOpen size={64} className="text-purple-500" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No classes yet</h3>
              <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">Create your first class to get started and begin teaching students!</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl transition shadow-lg hover:shadow-xl font-semibold text-lg"
              >
                <Plus size={24} />
                Create Your First Class
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map((cls, idx) => (
                <motion.div
                  key={cls.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1, ease: 'easeOut' }}
                  className="group bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/teacher/class/${cls.id}`)}
                >
                  {/* Gradient Header - Similar to Learning Categories */}
                  <div className="relative h-40 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 overflow-hidden">
                    {/* Animated background elements */}
                    <div className="absolute inset-0">
                      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-500" />
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16 group-hover:scale-150 transition-transform duration-500" />
                      <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white/5 rounded-full -ml-12 -mt-12" />
                    </div>
                    
                    {/* Icon */}
                    <div className="absolute top-4 left-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                        <BookOpen className="text-white" size={28} />
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur-sm text-white border border-white/30">
                        Active
                      </span>
                    </div>

                    {/* Class Name */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-bold text-white mb-1 line-clamp-2">{cls.name}</h3>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Description */}
                    {cls.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{cls.description}</p>
                    )}

                    {/* Join Code */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 mb-4 border border-purple-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-purple-600 font-bold mb-1 uppercase tracking-wider">Join Code</p>
                          <code className="text-2xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                            {cls.join_code}
                          </code>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(cls.join_code);
                          }}
                          className={`p-3 rounded-xl transition ${
                            copiedCode === cls.join_code
                              ? 'bg-green-100 text-green-600'
                              : 'bg-white text-purple-600 hover:bg-purple-100 shadow-sm'
                          }`}
                        >
                          {copiedCode === cls.join_code ? <CheckCircle size={20} /> : <Copy size={20} />}
                        </motion.button>
                      </div>
                    </div>

                    {/* Stats Grid - Inspired by Practice Problems */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{cls.student_count}</div>
                        <div className="text-xs text-gray-600 font-medium">Students</div>
                      </div>
                      <div className="text-center border-x border-gray-200">
                        <div className="text-2xl font-bold text-pink-600">{cls.session_count || 0}</div>
                        <div className="text-xs text-gray-600 font-medium">Sessions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{cls.assignment_count || 0}</div>
                        <div className="text-xs text-gray-600 font-medium">Assignments</div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/teacher/class/${cls.id}`);
                      }}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition shadow-md hover:shadow-lg group-hover:shadow-purple-500/30"
                    >
                      <span>View Class</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
                    </motion.button>

                    {/* Delete Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClass(cls.id);
                      }}
                      className="w-full mt-2 bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition"
                    >
                      <Trash2 size={16} />
                      <span>Delete Class</span>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Create Class Modal */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-gray-100"
          >
            {/* Header with gradient */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Plus className="text-white" size={28} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Create New Class</h2>
                  <p className="text-gray-600 text-sm mt-1">Set up a new class for your students</p>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleCreateClass} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Class Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 hover:bg-white transition font-medium"
                  placeholder="e.g., DSA Batch 2025"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Description <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 hover:bg-white transition resize-none font-medium"
                  placeholder="Describe this class and its objectives..."
                  rows="4"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 py-4 rounded-2xl font-bold transition"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-2xl font-bold transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Create Class
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default TeacherClasses;
