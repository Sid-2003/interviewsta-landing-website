import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, BookOpen, AlertCircle, Bell, X, Clock, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import ClassAnnouncements from '../Announcements/ClassAnnouncements';
import StudentTimeSlots from './StudentTimeSlots';

import api from "../../service/api";
const StudentClassDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('slots');
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
            
      const [classRes, assignRes] = await Promise.all([
        api.get(`classes/${id}/`),
        api.get(`assignments/?class_assigned=${id}`)
      ]);
      setClassData(classRes.data);
      setAssignments(assignRes.data.results || assignRes.data);
      setError('');
    } catch (err) {
      setError('Failed to load class details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
          </div>
          <p className="text-gray-700 font-medium">Loading class details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/student/classes')}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-8 font-semibold transition group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to My Classes
        </motion.button>

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
              className="text-red-600 hover:text-red-700 transition"
            >
              <X size={18} />
            </button>
          </motion.div>
        )}

        {classData && (
          <>
            {/* Class Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-lg p-8 mb-8 border border-purple-100 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100/30 to-pink-100/30 rounded-full -mr-32 -mt-32" />
              
              <div className="relative">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  {classData.name}
                </h1>
                <p className="text-lg text-gray-600 mb-4">Taught by {classData.teacher_name}</p>
                {classData.description && (
                  <p className="text-gray-600 mb-4">{classData.description}</p>
                )}
                <p className="text-sm text-gray-500">
                  Enrolled on {new Date(classData.created_at).toLocaleDateString()}
                </p>
              </div>
            </motion.div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 flex-wrap">
              {[
                { id: 'announcements', label: 'Announcements', icon: Bell },
                { id: 'slots', label: 'Scheduled Interviews', icon: Calendar },
                { id: 'assignments', label: 'Your Assignments', icon: BookOpen }
              ].map(tab => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-md'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </motion.button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'announcements' && (
              <ClassAnnouncements classId={id} isTeacher={false} />
            )}

            {activeTab === 'slots' && (
              <StudentTimeSlots classId={id} />
            )}

            {activeTab === 'assignments' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-lg p-8 border border-purple-100"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Assignments</h2>

                {assignments.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-4">
                      <FileText size={36} className="text-purple-600" />
                    </div>
                    <p className="text-gray-600 font-medium">No assignments yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {assignments.map((assign, idx) => (
                      <motion.div
                        key={assign.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-purple-200 transition group"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg group-hover:text-purple-600 transition">
                              {assign.title}
                            </h3>
                            {assign.description && (
                              <p className="text-gray-600 mt-2 text-sm">{assign.description}</p>
                            )}
                          </div>
                          <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-lg text-xs font-bold">
                            {assign.submission_type === 'document' ? 'Document' : assign.submission_type === 'link' ? 'Link' : 'Both'}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                          {assign.estimated_time_minutes > 0 && (
                            <span className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg font-medium">
                              <Clock size={14} />
                              {assign.estimated_time_minutes} min
                            </span>
                          )}
                          {assign.deadline && (
                            <span className="flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 rounded-lg font-medium">
                              <Calendar size={14} />
                              Due: {new Date(assign.deadline).toLocaleDateString()}
                            </span>
                          )}
                          {assign.student_submission_count !== undefined && (
                            <span className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-lg font-medium">
                              <FileText size={14} />
                              {assign.student_submission_count} submission(s)
                            </span>
                          )}
                        </div>

                        {assign.instructions && (
                          <div className="mb-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl text-sm text-gray-700 border border-purple-100">
                            <strong className="text-purple-700">Instructions:</strong> {assign.instructions}
                          </div>
                        )}

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => navigate(`/student/assignment/${assign.id}`)}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2.5 rounded-xl font-semibold transition shadow-md hover:shadow-lg"
                        >
                          View & Submit
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StudentClassDetail;
