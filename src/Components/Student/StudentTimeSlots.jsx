import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, CheckCircle, AlertCircle, ArrowRight, Laptop, MessageCircle, Sparkles, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { useVideoInterview } from '../../Contexts/VideoInterviewContext';

import api from "../../service/api";
const StudentTimeSlots = ({ classId }) => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookedSlots, setBookedSlots] = useState(new Set());
  const [successMessage, setSuccessMessage] = useState(null);
  const [filterStatus, setFilterStatus] = useState('available');
  const navigate = useNavigate();
  const { dispatch } = useVideoInterview();

  const apiBaseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000/api/';

  useEffect(() => {
    fetchTimeSlots();
  }, [classId]);

  const fetchTimeSlots = async () => {
    try {
      setLoading(true);

      const response = await api.get(`time-slots/?class_obj=${classId}`);

      const slots = Array.isArray(response.data) ? response.data : response.data.results || [];
      setTimeSlots(slots.filter(slot => slot.class_obj === parseInt(classId)));
      setError(null);
    } catch (err) {
      console.error('Error fetching time slots:', err);
      setError(err.response?.data?.error || 'Failed to load time slots');
    } finally {
      setLoading(false);
    }
  };

  const handleBookSlot = async (slot) => {
    try {
      // Determine interview mode and setup dispatch based on interview type
      let interviewMode = '';
      let dispatchPayload = {};

      // Map interview types to modes
      if (slot.interview_type === 'Technical Interview') {
        interviewMode = 'Technical Interview';
        // For Technical Interview, start Arrays 1 (company-wise, subject-wise, or default)
        if (slot.category === 'company-wise') {
          dispatch({ type: "ShowResume" });
          dispatch({ type: "Reset" });
          dispatch({ type: "Set", payload: 'Coding Interview' });
          dispatch({ 
            type: "CompanyWise", 
            payload: {
              Company: slot.company || 'Arrays 1',
              interview_type_id: 3, // Arrays 1 type
              Difficulty: slot.difficulty || 'Medium',
              Tags: ['Arrays', 'Problem Solving']
            }
          });
        } else if (slot.category === 'subject-wise') {
          dispatch({ type: "NoResume" });
          dispatch({ type: "Reset" });
          dispatch({ type: "Set", payload: 'Coding Interview' });
          dispatch({ 
            type: "SubjectWise", 
            payload: {
              Subject: slot.subject || 'Arrays',
              interview_type_id: 7, // Arrays 1 subject-wise
              Difficulty: slot.difficulty || 'Medium',
              Tags: ['Arrays', 'Algorithms']
            }
          });
        } else {
          // Default to Arrays 1 for technical interviews
          dispatch({ type: "NoResume" });
          dispatch({ type: "Reset" });
          dispatch({ type: "Set", payload: 'Coding Interview' });
          dispatch({ 
            type: "Coding", 
            payload: { interview_type_id: 3 }
          });
        }
      } else if (slot.interview_type === 'Behavioral Interview' || slot.interview_type === 'HR Interview') {
        interviewMode = 'HR Interview';
        // For Behavioral/HR Interview
        dispatch({ type: "ShowResume" });
        dispatch({ type: "Reset" });
        dispatch({ type: "Set", payload: 'HR Interview' });
        dispatch({ 
          type: "HR", 
          payload: { interview_type_id: 27 }
        });
      } else if (slot.interview_type === 'Specialised Interview') {
        interviewMode = 'Hobby Interview';
        // For Specialised Interview, always start Case Study
        dispatch({ type: "NoResume" });
        dispatch({ type: "Reset" });
        dispatch({ type: "Set", payload: 'Hobby Interview' });
        
        // Set the selected hobby to Case Study
        const caseStudyHobby = {
          id: 'case-study',
          name: 'Case Study',
          description: 'Analyze real-world scenarios and develop your problem-solving and analytical thinking skills'
        };
        localStorage.setItem('selectedHobby', JSON.stringify(caseStudyHobby));
      }

      // Store the time slot details in localStorage
      const interviewConfig = {
        timeSlotId: slot.id,
        interviewType: slot.interview_type,
        category: slot.category,
        difficulty: slot.difficulty,
        slotTitle: slot.title,
        scheduledDate: slot.scheduled_date,
        startTime: slot.start_time,
        endTime: slot.end_time,
        interviewMode: interviewMode,
      };
      
      localStorage.setItem('timeSlotInterview', JSON.stringify(interviewConfig));
      
      // Navigate to video interview
      navigate('/video-interview');
      
    } catch (err) {
      console.error('Error starting interview:', err);
      setError('Failed to start interview');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return '#10b981';
      case 'booked': return '#f59e0b';
      case 'completed': return '#6b7280';
      case 'cancelled': return '#ef4444';
      default: return '#3b82f6';
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'available') return <CheckCircle size={16} />;
    if (status === 'booked') return <Clock size={16} />;
    if (status === 'completed') return <CheckCircle size={16} />;
    return <AlertCircle size={16} />;
  };

  const getInterviewIcon = (type) => {
    if (type === 'Technical Interview') return <Laptop size={18} className="text-blue-600" />;
    if (type === 'Behavioral Interview') return <MessageCircle size={18} className="text-purple-600" />;
    if (type === 'Specialised Interview') return <Sparkles size={18} className="text-pink-600" />;
    return <Calendar size={18} />;
  };

  const filteredSlots = timeSlots.filter(slot => {
    if (filterStatus === 'all') return true;
    return slot.status === filterStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
          </div>
          <p className="text-gray-700 font-medium">Loading scheduled interviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Scheduled Interviews
        </h2>
        <p className="text-gray-600">Choose a scheduled interview to start</p>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3"
        >
          <AlertCircle className="text-red-600 flex-shrink-0" size={18} />
          <p className="text-red-800 text-sm font-medium flex-1">{error}</p>
        </motion.div>
      )}

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3"
        >
          <CheckCircle className="text-green-600" size={20} />
          <p className="text-green-800 text-sm font-medium">{successMessage}</p>
        </motion.div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-3 flex-wrap">
        {['all', 'available', 'booked', 'completed'].map(status => {
          const count = timeSlots.filter(s => status === 'all' || s.status === status).length;
          return (
            <motion.button
              key={status}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition flex items-center gap-2 ${
                filterStatus === status
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
              onClick={() => setFilterStatus(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                filterStatus === status
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {count}
              </span>
            </motion.button>
          );
        })}
      </div>

      {filteredSlots.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-white rounded-3xl border border-purple-100"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-4">
            <Calendar size={36} className="text-purple-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            No {filterStatus === 'all' ? 'scheduled interviews' : filterStatus + ' interviews'}
          </h3>
          <p className="text-gray-600">
            {filterStatus === 'all'
              ? 'Check back later for scheduled interviews'
              : `No ${filterStatus} interviews at the moment`}
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSlots.map((slot, idx) => (
            <motion.div
              key={slot.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition overflow-hidden"
            >
              {/* Header */}
              <div className="p-5 border-b border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-gray-900 text-lg">{slot.title}</h3>
                  <span 
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium capitalize"
                    style={{ 
                      backgroundColor: getStatusColor(slot.status) + '20',
                      color: getStatusColor(slot.status)
                    }}
                  >
                    {getStatusIcon(slot.status)}
                    {slot.status}
                  </span>
                </div>

                {/* Date & Time */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} className="text-gray-400" />
                    <span>
                      {new Date(slot.scheduled_date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={16} className="text-gray-400" />
                    <span>{slot.start_time} - {slot.end_time}</span>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-5">
                <div className="flex flex-wrap gap-2 mb-4">
                  {slot.interview_type && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium border border-purple-100">
                      {getInterviewIcon(slot.interview_type)}
                      {slot.interview_type}
                    </span>
                  )}

                  {slot.category && (
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium border border-blue-100">
                      {slot.category}
                    </span>
                  )}

                  {slot.difficulty && (
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${
                      slot.difficulty.toLowerCase() === 'easy' ? 'bg-green-50 text-green-700 border-green-100' :
                      slot.difficulty.toLowerCase() === 'medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                      'bg-red-50 text-red-700 border-red-100'
                    }`}>
                      {slot.difficulty}
                    </span>
                  )}
                </div>

                {slot.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{slot.description}</p>
                )}

                {/* Action Button */}
                <div>
                  {slot.status === 'available' ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2.5 rounded-xl font-semibold transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      onClick={() => handleBookSlot(slot)}
                    >
                      <Play size={18} />
                      Start Interview
                    </motion.button>
                  ) : slot.status === 'booked' ? (
                    <div className="flex items-center justify-center gap-2 py-2.5 px-4 bg-orange-50 text-orange-700 rounded-xl font-medium">
                      <CheckCircle size={18} />
                      <span>You've booked this interview</span>
                    </div>
                  ) : slot.status === 'completed' ? (
                    <div className="flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-50 text-gray-700 rounded-xl font-medium">
                      <CheckCircle size={18} />
                      <span>Interview completed</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 py-2.5 px-4 bg-red-50 text-red-700 rounded-xl font-medium">
                      <AlertCircle size={18} />
                      <span>This interview has been cancelled</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentTimeSlots;
