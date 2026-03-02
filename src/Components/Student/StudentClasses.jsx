import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, Plus, AlertCircle, Calendar, FileText, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

import api from "../../service/api";
const StudentClasses = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
            const response = await api.get('classes/student/');
      setClasses(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load classes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClass = async (e) => {
    e.preventDefault();
    try {
            
      const response = await api.post('student-classes/join/', { join_code: joinCode });
      setJoinCode('');
      setShowJoinModal(false);
      fetchClasses();
    } catch (err) {
      setError('Invalid join code or already enrolled');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
          </div>
          <p className="text-gray-700 font-medium">Loading classes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Classes</h1>
          <p className="text-gray-600 mt-1.5 text-sm">Overview of your classes and performance</p>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3"
          >
            <AlertCircle className="text-red-600 flex-shrink-0" size={18} />
            <div className="flex-1">
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
            <button
              onClick={() => setError('')}
              className="text-red-600 hover:text-red-700 transition text-xl"
            >
              ✕
            </button>
          </motion.div>
        )}

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {classes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-16 bg-white rounded-3xl border border-purple-100 shadow-lg"
            >
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-6">
                <BookOpen size={40} className="text-purple-600" />
              </div>
              <p className="text-gray-900 font-bold text-xl mb-2">No classes yet</p>
              <p className="text-gray-500 mb-6">Join a class using the code provided by your teacher</p>
              <button
                onClick={() => setShowJoinModal(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition shadow-md hover:shadow-lg inline-flex items-center gap-2"
              >
                <Plus size={20} />
                Join Class
              </button>
            </motion.div>
          ) : (
            classes.map((cls, idx) => (
              <motion.div
                key={cls.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.3 }}
                className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all border border-purple-100 overflow-hidden relative group"
              >
                {/* Header with gradient */}
                <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 bg-white/20 rounded-full" />
                  
                  <div className="flex items-start justify-between mb-4 relative">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                      <BookOpen className="text-white" size={24} />
                    </div>
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-purple-700">
                      Active
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2 relative">{cls.name}</h3>
                  <p className="text-white/80 text-sm font-medium relative">
                    Taught by {cls.teacher_name}
                  </p>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 mx-auto mb-2">
                        <Users size={18} className="text-blue-600" />
                      </div>
                      <p className="text-2xl font-bold text-blue-600">{cls.student_count || 0}</p>
                      <p className="text-xs text-gray-500 font-medium">Students</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-green-100 mx-auto mb-2">
                        <Calendar size={18} className="text-green-600" />
                      </div>
                      <p className="text-2xl font-bold text-green-600">{cls.session_count || 0}</p>
                      <p className="text-xs text-gray-500 font-medium">Sessions</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-100 mx-auto mb-2">
                        <FileText size={18} className="text-orange-600" />
                      </div>
                      <p className="text-2xl font-bold text-orange-600">{cls.assignment_count || 0}</p>
                      <p className="text-xs text-gray-500 font-medium">Assignments</p>
                    </div>
                  </div>

                  {/* View Class Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/student/class/${cls.id}`)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    View Class
                    <ArrowRight size={18} />
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </div>
        
        {/* Floating Join Button (only shows when classes exist) */}
        {classes.length > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowJoinModal(true)}
            className="fixed bottom-8 right-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition flex items-center gap-2 font-semibold"
          >
            <Plus size={24} />
            <span className="pr-2">Join Class</span>
          </motion.button>
        )}
      </div>

      {/* Join Class Modal */}
      {showJoinModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowJoinModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Join a Class</h2>
            <p className="text-gray-600 text-sm mb-6">Enter the class code provided by your teacher</p>
            
            <form onSubmit={handleJoinClass}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Class Code
                </label>
                <input
                  type="text"
                  required
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center text-xl font-mono tracking-widest"
                  placeholder="ABC123"
                  maxLength="6"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2.5 rounded-xl font-semibold transition shadow-md hover:shadow-lg"
                >
                  Join Class
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default StudentClasses;
