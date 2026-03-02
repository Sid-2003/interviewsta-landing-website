import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, Users, Plus, Trash2, Edit2, ArrowLeft, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './TeacherTimeSlots.css';
import TeacherInterviewTypeCard from './TeacherInterviewTypeCard';
import TeacherInterviewConfig from './TeacherInterviewConfig';

import api from "../../service/api";
const TeacherTimeSlots = ({ classId }) => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [formStep, setFormStep] = useState(0); // 0: Interview Type, 1: Config, 2: Details
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduled_date: '',
    start_time: '',
    interview_type: 'Technical Interview',
    category: '',
    difficulty: 'Medium',
  });

  const apiBaseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000/api/';

  const interviewTypes = [
    {
      id: 26,
      title: 'Technical Interview',
      description: 'In-depth technical skills assessment covering algorithms, data structures, and problem-solving with live coding challenges and system design discussions.',
      duration: 45,
      difficulty: 'Medium',
      topics: ['Coding Problems', 'Algorithm Design', 'Code Optimization'],
    },
    {
      id: 27,
      title: 'Behavioral Interview',
      description: 'Behavioral assessment focusing on soft skills, cultural fit, communication abilities, career motivations, and alignment with company values.',
      duration: 30,
      difficulty: 'Easy',
      topics: ['Behavioral Questions', 'Cultural Fit', 'Career Goals'],
    },
    {
      id: 28,
      title: 'Specialised Interview',
      description: 'Practice expressing yourself through natural conversation about your hobbies and interests in a relaxed, supportive environment.',
      duration: 15,
      difficulty: 'Easy',
      topics: ['Public Speaking', 'Debate', 'Photography', 'Music', 'Content Creation', 'Case Study'],
    },
  ];

  useEffect(() => {
    fetchTimeSlots();
  }, [classId]);

  const fetchTimeSlots = async () => {
    try {
      setLoading(true);

      const response = await api.get(`time-slots/?class_obj=${classId}`);

      const slots = Array.isArray(response.data) ? response.data : response.data.results || [];
      console.log('Fetched slots:', slots);
      console.log('ClassId:', classId);
      setTimeSlots(slots);
      setError(null);
    } catch (err) {
      console.error('Error fetching time slots:', err);
      console.error('Error details:', err.response?.data);
      setError(err.response?.data?.error || 'Failed to load time slots');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.scheduled_date || !formData.start_time || !formData.interview_type || !formData.category) {
      setError('Please fill in all required fields');
      console.error('Validation failed:', { 
        title: formData.title, 
        date: formData.scheduled_date, 
        time: formData.start_time, 
        type: formData.interview_type,
        category: formData.category
      });
      return;
    }

    // For Specialised Interview, set difficulty to Easy
    const difficulty = formData.interview_type === 'Specialised Interview' ? 'Easy' : formData.difficulty;

    try {
      // Calculate end time as 1 hour after start time
      const [hours, minutes] = formData.start_time.split(':');
      const startDate = new Date(`2000-01-01T${formData.start_time}`);
      startDate.setHours(startDate.getHours() + 1);
      const endTime = startDate.toTimeString().slice(0, 5);

      const payload = {
        title: formData.title,
        description: formData.description,
        scheduled_date: formData.scheduled_date,
        start_time: formData.start_time,
        end_time: endTime,
        class_obj: parseInt(classId),
        interview_type: formData.interview_type,
        category: formData.category,
        difficulty: difficulty,
      };

      console.log('Sending payload:', payload);

      if (editingSlot) {
        await api.put(`time-slots/${editingSlot.id}/`, payload);
      } else {
        await api.post('time-slots/', payload);
      }

      fetchTimeSlots();
      setShowForm(false);
      setEditingSlot(null);
      setFormStep(0);
      setFormData({
        title: '',
        description: '',
        scheduled_date: '',
        start_time: '',
        interview_type: 'Technical Interview',
        category: '',
        difficulty: 'Medium',
      });
    } catch (err) {
      console.error('Error saving time slot:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.error || err.response?.data?.category?.[0] || 'Failed to save time slot');
    }
  };

  const handleEdit = (slot) => {
    setEditingSlot(slot);
    setFormData({
      title: slot.title,
      description: slot.description,
      scheduled_date: slot.scheduled_date,
      start_time: slot.start_time,
      interview_type: slot.interview_type,
      category: slot.category || '',
      difficulty: slot.difficulty || 'Medium',
    });
    setFormStep(0);
    setShowForm(true);
  };

  const handleDelete = async (slotId) => {
    if (!window.confirm('Are you sure you want to delete this time slot?')) return;

    try {
      await api.delete(`time-slots/${slotId}/`);

      fetchTimeSlots();
    } catch (err) {
      console.error('Error deleting time slot:', err);
      setError('Failed to delete time slot');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSlot(null);
    setFormStep(0);
    setFormData({
      title: '',
      description: '',
      scheduled_date: '',
      start_time: '',
      interview_type: 'Technical Interview',
      category: '',
      difficulty: 'Medium',
    });
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600"></div>
          </div>
          <p className="text-gray-700 font-semibold text-lg">Loading time slots...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
              <Calendar className="text-purple-600" size={24} />
            </div>
            Schedule Interview
          </h2>
          <p className="text-gray-600 text-sm mt-2">Schedule and manage interview sessions for your class</p>
        </div>
        {!showForm && (
          <button 
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            onClick={() => {
              setError(null);
              setShowForm(true);
            }}
          >
            <Plus size={20} /> Create Schedule
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="text-red-600" size={20} />
          </div>
          <div className="flex-1">
            <p className="text-red-700 font-semibold">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-red-600 hover:text-red-700 font-bold text-xl">✕</button>
        </div>
      )}

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white rounded-3xl shadow-lg border border-purple-100 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="flex items-center gap-4 relative">
              {formStep > 0 && (
                <button
                  type="button"
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition backdrop-blur-sm"
                  onClick={() => {
                    setError(null);
                    setFormStep(formStep - 1);
                  }}
                >
                  <ArrowLeft size={20} className="text-white" />
                </button>
              )}
              <h3 className="text-2xl font-bold text-white">{editingSlot ? 'Edit Interview Schedule' : 'Create New Interview Schedule'}</h3>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {/* Step 0: Interview Type Selection */}
            <AnimatePresence mode="wait">
              {formStep === 0 && (
                <motion.div
                  key="step-0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 className="text-xl font-bold text-gray-900 mb-6">Select Interview Type</h4>
                  <div className="interview-types-grid">
                    {interviewTypes.map((type) => (
                      <TeacherInterviewTypeCard
                        key={type.id}
                        type={type}
                        isSelected={formData.interview_type === type.title}
                        onSelect={() => {
                          setFormData(prev => ({ ...prev, interview_type: type.title, category: '' }));
                        }}
                      />
                    ))}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-md hover:shadow-lg mt-6"
                    onClick={() => {
                      setError(null);
                      setFormStep(1);
                    }}
                  >
                    Next: Configure Interview
                  </motion.button>
                </motion.div>
              )}

              {/* Step 1: Category & Difficulty Selection */}
              {formStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TeacherInterviewConfig
                    interviewType={formData.interview_type}
                    selectedCategory={formData.category}
                    selectedDifficulty={formData.difficulty}
                    onCategoryChange={(category) =>
                      setFormData(prev => ({ ...prev, category }))
                    }
                    onDifficultyChange={(difficulty) =>
                      setFormData(prev => ({ ...prev, difficulty }))
                    }
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-md hover:shadow-lg mt-6"
                    onClick={() => {
                      if (!formData.category) {
                        setError('Please select a category before continuing');
                        return;
                      }
                      setError(null);
                      setFormStep(2);
                    }}
                  >
                    Next: Set Time & Details
                  </motion.button>
                </motion.div>
              )}

              {/* Step 2: Time & Details */}
              {formStep === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 className="text-xl font-bold text-gray-900 mb-6">Schedule Time Slot</h4>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">Title *</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="e.g., Technical Interview Round 1"
                        className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 font-medium"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Date *</label>
                        <input
                          type="date"
                          name="scheduled_date"
                          value={formData.scheduled_date}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 font-medium"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Start Time * (1 hour duration)</label>
                        <input
                          type="time"
                          name="start_time"
                          value={formData.start_time}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 font-medium"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Add any additional details..."
                        rows="3"
                        className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 resize-none"
                      ></textarea>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-md hover:shadow-lg"
                    >
                      {editingSlot ? 'Update Slot' : 'Create Slot'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      className="px-8 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-xl font-bold text-lg transition-all"
                      onClick={handleCancel}
                    >
                      Cancel
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      )}

      {timeSlots.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl shadow-lg border border-purple-100">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-6">
            <Calendar className="text-purple-600" size={48} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No interview schedules yet</h3>
          <p className="text-gray-600">Create your first interview schedule for your students</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {timeSlots.map((slot, idx) => (
            <motion.div
              key={slot.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md hover:border-purple-200 transition-all"
            >
              {/* Header: Title + Status */}
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-lg font-semibold text-gray-900">{slot.title}</h4>
                <span 
                  className="px-2.5 py-1 rounded-md text-xs font-medium capitalize"
                  style={{ 
                    backgroundColor: getStatusColor(slot.status) + '20',
                    color: getStatusColor(slot.status)
                  }}
                >
                  {slot.status}
                </span>
              </div>

              {/* Interview Type Badge */}
              <div className="mb-3">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                  {slot.interview_type}
                </span>
              </div>

              {/* Date & Time */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} className="text-gray-400" />
                  <span>
                    {new Date(slot.scheduled_date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={16} className="text-gray-400" />
                  <span>{slot.start_time} - {slot.end_time}</span>
                </div>
              </div>

              {/* Category & Difficulty */}
              <div className="flex items-center gap-2 mb-3">
                {slot.category && (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                    {slot.category}
                  </span>
                )}
                {slot.difficulty && (
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    slot.difficulty.toLowerCase() === 'easy' ? 'bg-green-50 text-green-700 border border-green-200' :
                    slot.difficulty.toLowerCase() === 'medium' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                    'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {slot.difficulty}
                  </span>
                )}
              </div>

              {/* Description */}
              {slot.description && (
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <p className="text-sm text-gray-600 line-clamp-2">{slot.description}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button 
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                  onClick={() => handleEdit(slot)}
                >
                  <Edit2 size={14} /> Edit
                </button>
                <button 
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium transition-colors"
                  onClick={() => handleDelete(slot.id)}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherTimeSlots;
