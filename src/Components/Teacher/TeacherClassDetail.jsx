import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Users, Calendar, BookOpen, AlertCircle, Bell, TrendingUp, Copy, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import ClassAnnouncements from '../Announcements/ClassAnnouncements';
import TeacherTimeSlots from './TeacherTimeSlots';
import ClassPerformance from './ClassPerformance';

import api from "../../service/api";
const TeacherClassDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'students');
  const [assignments, setAssignments] = useState([]);
  const [showAddStudents, setShowAddStudents] = useState(false);
  const [studentEmails, setStudentEmails] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    // If navigated from assignment creation, switch to assignments tab
    if (location.state?.activeTab === 'assignments') {
      setActiveTab('assignments');
      // Clear the state to prevent re-triggering on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const fetchData = async () => {
    try {
      setLoading(true);
            
      const [classRes, assignRes] = await Promise.all([
        api.get(`classes/${id}/`),
        api.get(`assignments/?class_assigned=${id}`)
      ]);
      console.log('Assignments response:', assignRes.data);
      setClassData(classRes.data);
      const assignmentsData = Array.isArray(assignRes.data) ? assignRes.data : (assignRes.data.results || []);
      console.log('Setting assignments:', assignmentsData);
      setAssignments(assignmentsData);
      setError('');
    } catch (err) {
      setError('Failed to load class details');
      console.error('Error fetching data:', err);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudents = async (e) => {
    e.preventDefault();
    try {
            
      const emails = studentEmails.split(',').map(e => e.trim()).filter(e => e);
      await api.post(`classes/${id}/add-students/`, { emails });
      setStudentEmails('');
      setShowAddStudents(false);
      fetchData();
    } catch (err) {
      setError('Failed to add students');
    }
  };

  const handleRemoveStudent = async (studentId) => {
    if (window.confirm('Remove this student from class?')) {
      try {
                
        await api.delete(`classes/${id}/students/${studentId}/`);
        fetchData();
      } catch (err) {
        setError('Failed to remove student');
      }
    }
  };

  const handleDeleteAssignment = async (assignId) => {
    if (window.confirm('Delete this assignment?')) {
      try {
                
        await api.delete(`assignments/${assignId}/`);
        fetchData();
      } catch (err) {
        setError('Failed to delete assignment');
      }
    }
  };

  const copyJoinCode = () => {
    navigator.clipboard.writeText(classData.join_code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading class details...</p>
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
          onClick={() => navigate('/teacher/classes')}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-8 font-semibold transition group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition" />
          Back to Classes
        </motion.button>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 flex items-start gap-3 backdrop-blur-sm"
          >
            <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={20} />
            <div>
              <h3 className="text-red-900 font-semibold">{error}</h3>
            </div>
          </motion.div>
        )}

        {classData && (
          <>
            {/* Class Header Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="mb-10"
            >
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Gradient Header - Purple Theme */}
                <div className="h-48 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 relative overflow-hidden">
                  {/* Animated decorative elements */}
                  <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
                    <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/5 rounded-full" />
                  </div>
                  
                  <div className="relative p-8 h-full flex flex-col justify-end">
                    <h1 className="text-5xl font-bold text-white mb-3">{classData.name}</h1>
                    {classData.description && (
                      <p className="text-purple-100 text-lg font-medium">{classData.description}</p>
                    )}
                  </div>
                </div>

                {/* Class Info Section - Stats Cards */}
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Students Count */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200/30 rounded-full -mr-10 -mt-10" />
                      <div className="relative">
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-12 h-12 rounded-xl bg-blue-200/50 flex items-center justify-center">
                            <Users className="text-blue-600" size={24} />
                          </div>
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                        </div>
                        <p className="text-sm font-bold text-blue-600 uppercase tracking-wide mb-1">Students</p>
                        <p className="text-4xl font-bold text-blue-900">{classData.student_count}</p>
                      </div>
                    </motion.div>

                    {/* Created Date */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200/30 rounded-full -mr-10 -mt-10" />
                      <div className="relative">
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-12 h-12 rounded-xl bg-purple-200/50 flex items-center justify-center">
                            <Calendar className="text-purple-600" size={24} />
                          </div>
                          <div className="w-2 h-2 rounded-full bg-purple-500" />
                        </div>
                        <p className="text-sm font-bold text-purple-600 uppercase tracking-wide mb-1">Created</p>
                        <p className="text-lg font-bold text-purple-900">
                          {new Date(classData.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </motion.div>

                    {/* Join Code */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 col-span-1 md:col-span-2 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/30 rounded-full -mr-16 -mt-16" />
                      <div className="relative">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-green-200/50 flex items-center justify-center">
                              <Copy className="text-green-600" size={24} />
                            </div>
                            <p className="text-sm font-bold text-green-600 uppercase tracking-wide">Join Code</p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={copyJoinCode}
                            className={`p-3 rounded-xl transition ${
                              copiedCode 
                                ? 'bg-green-600 text-white' 
                                : 'bg-white text-green-600 hover:bg-green-200/50 shadow-sm'
                            }`}
                          >
                            {copiedCode ? <CheckCircle size={20} /> : <Copy size={20} />}
                          </motion.button>
                        </div>
                        <code className="text-3xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-700">
                          {classData.join_code}
                        </code>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tab Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2, ease: 'easeOut' }}
              className="mb-8"
            >
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-2">
                <div className="flex gap-2 flex-wrap">
                  {[
                    { id: 'announcements', label: 'Announcements', icon: Bell },
                    { id: 'performance', label: 'Performance', icon: TrendingUp },
                    { id: 'students', label: 'Students', icon: Users },
                    { id: 'slots', label: 'Schedule Interview', icon: Calendar },
                    { id: 'assignments', label: 'Assignments', icon: BookOpen }
                  ].map(tab => (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <tab.icon size={18} />
                      {tab.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Tab Content */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15, ease: 'easeOut' }}
            >
              {activeTab === 'announcements' && (
                <ClassAnnouncements classId={id} isTeacher={true} />
              )}

              {activeTab === 'performance' && (
                <ClassPerformance classId={id} />
              )}

              {activeTab === 'students' && (
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900">Class Students</h2>
                        <p className="text-gray-600 text-sm mt-1">{classData.students.length} students enrolled</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowAddStudents(true)}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition shadow-lg hover:shadow-xl font-semibold"
                      >
                        <Plus size={18} />
                        Add Students
                      </motion.button>
                    </div>

                    {classData.students.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                          <Users size={48} className="text-purple-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No students yet</h3>
                        <p className="text-gray-600 text-lg mb-8">Add students to get started with this class</p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setShowAddStudents(true)}
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl transition font-semibold shadow-lg"
                        >
                          <Plus size={20} />
                          Add Your First Student
                        </motion.button>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="border-b-2 border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
                            <tr className="text-left">
                              <th className="px-6 py-4 font-bold text-gray-900">Name</th>
                              <th className="px-6 py-4 font-bold text-gray-900">Email</th>
                              <th className="px-6 py-4 font-bold text-gray-900">Joined</th>
                              <th className="px-6 py-4 font-bold text-gray-900">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {classData.students.map((student, idx) => (
                              <motion.tr
                                key={student.id}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.03 }}
                                className="border-b border-gray-200 hover:bg-blue-50 cursor-pointer transition group"
                                onClick={() => navigate(`/teacher/student/${student.student}`)}
                              >
                                <td className="px-6 py-4 font-medium text-blue-600 group-hover:underline">{student.student_name}</td>
                                <td className="px-6 py-4 text-gray-600">{student.student_email}</td>
                                <td className="px-6 py-4 text-gray-600">
                                  {new Date(student.joined_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleRemoveStudent(student.student)}
                                    className="text-red-600 hover:text-red-700 font-medium transition"
                                  >
                                    <Trash2 size={18} />
                                  </motion.button>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'slots' && (
                <TeacherTimeSlots classId={id} />
              )}

              {activeTab === 'assignments' && (
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900">Assignments</h2>
                        <p className="text-gray-600 text-sm mt-1">{assignments.length} assignments created</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(`/teacher/class/${id}/assign-interview`)}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition shadow-lg hover:shadow-xl font-semibold"
                      >
                        <Plus size={18} />
                        Create Assignment
                      </motion.button>
                    </div>

                    {assignments.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                          <BookOpen size={48} className="text-purple-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No assignments yet</h3>
                        <p className="text-gray-600 text-lg mb-8">Create assignments for your students</p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => navigate(`/teacher/class/${id}/assign-interview`)}
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl transition font-semibold shadow-lg"
                        >
                          <Plus size={20} />
                          Create First Assignment
                        </motion.button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {assignments.map((assign, idx) => (
                          <motion.div
                            key={assign.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1, duration: 0.4 }}
                            className="bg-gradient-to-br from-white to-purple-50/30 border border-purple-100 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
                          >
                            {/* Decorative gradient */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/20 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
                            
                            <div className="relative">
                              <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-xl text-gray-900 group-hover:text-purple-600 transition flex-1">
                                  {assign.title}
                                </h3>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleDeleteAssignment(assign.id)}
                                  className="text-red-500 hover:text-red-600 transition bg-red-50 hover:bg-red-100 p-2 rounded-lg"
                                >
                                  <Trash2 size={18} />
                                </motion.button>
                              </div>
                              
                              {assign.description && (
                                <p className="text-sm text-gray-600 mb-5 line-clamp-2">{assign.description}</p>
                              )}
                              
                              <div className="grid grid-cols-2 gap-4 mb-5">
                                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                                  <p className="text-xs text-purple-600 font-bold uppercase tracking-wide mb-1">Submissions</p>
                                  <p className="text-3xl font-bold text-purple-600">{assign.student_submission_count}</p>
                                </div>
                                {assign.deadline && (
                                  <div className="bg-pink-50 rounded-xl p-4 border border-pink-100">
                                    <p className="text-xs text-pink-600 font-bold uppercase tracking-wide mb-1">Due Date</p>
                                    <p className="text-sm font-bold text-pink-900">
                                      {new Date(assign.deadline).toLocaleDateString()}
                                    </p>
                                  </div>
                                )}
                              </div>
                              
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate(`/teacher/assignment/${assign.id}/submissions`)}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl font-semibold transition shadow-lg hover:shadow-xl"
                              >
                                View Submissions
                              </motion.button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>

      {/* Add Students Modal */}
      {showAddStudents && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-3xl max-w-md w-full mx-4 shadow-2xl border border-purple-100 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <div className="relative">
                <h2 className="text-3xl font-bold text-white mb-1">Add Students</h2>
                <p className="text-purple-100 text-sm">Invite multiple students to your class</p>
              </div>
            </div>
            
            <form onSubmit={handleAddStudents} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Student Emails (comma-separated)
                </label>
                <textarea
                  required
                  value={studentEmails}
                  onChange={(e) => setStudentEmails(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-purple-50/30 hover:bg-white transition resize-none font-medium"
                  placeholder="student1@example.com, student2@example.com"
                  rows="5"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setShowAddStudents(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-xl font-bold transition"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl font-bold transition shadow-lg hover:shadow-xl"
                >
                  Add Students
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default TeacherClassDetail;
