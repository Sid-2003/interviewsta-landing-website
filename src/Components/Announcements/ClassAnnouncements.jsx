import React, { useState, useEffect } from 'react';
import { Trash2, Send, AlertCircle, Loader, Bell } from 'lucide-react';
import axios from 'axios';

import api from "../../service/api";
const ClassAnnouncements = ({ classId, isTeacher = false }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  useEffect(() => {
    fetchAnnouncements();
  }, [classId]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
            
      
      const response = await api.get(`announcements/?class_obj=${classId}`);
      
      setAnnouncements(response.data.results || response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching announcements:', err);
      setError('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Please fill in both title and content');
      return;
    }

    try {
      setSubmitting(true);
            
      
      const payload = {
        class_obj: classId,
        title: formData.title,
        content: formData.content
      };

      const response = await api.post('announcements/', payload);

      setAnnouncements([response.data, ...announcements]);
      setFormData({ title: '', content: '' });
      setShowForm(false);
      setSuccess('Announcement posted successfully!');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error creating announcement:', err);
      setError(err.response?.data?.detail || 'Failed to create announcement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) {
      return;
    }

    try {
            
      
      await api.delete(`announcements/${announcementId}/`);

      setAnnouncements(announcements.filter(a => a.id !== announcementId));
      setSuccess('Announcement deleted successfully!');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting announcement:', err);
      setError('Failed to delete announcement');
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 border border-purple-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
              <Bell className="text-purple-600" size={24} />
            </div>
            Announcements
          </h2>
          <p className="text-gray-600 text-sm mt-2">Stay updated with class announcements</p>
        </div>
        {isTeacher && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <Send size={18} />
            {showForm ? 'Cancel' : 'Post Announcement'}
          </button>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="text-red-600" size={20} />
          </div>
          <div>
            <h3 className="text-red-900 font-bold text-lg">Error</h3>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
            <div className="w-5 h-5 bg-green-600 rounded-full"></div>
          </div>
          <div>
            <p className="text-green-700 font-semibold">{success}</p>
          </div>
        </div>
      )}

      {/* Create Announcement Form */}
      {isTeacher && showForm && (
        <form onSubmit={handleCreateAnnouncement} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 mb-8 border border-purple-200">
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-bold text-gray-900 mb-2">
              Announcement Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter announcement title"
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 font-medium"
              maxLength={200}
            />
            <p className="text-xs text-purple-600 font-medium mt-2">{formData.title.length}/200</p>
          </div>

          <div className="mb-8">
            <label htmlFor="content" className="block text-sm font-bold text-gray-900 mb-2">
              Announcement Content *
            </label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write your announcement here..."
              rows="4"
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 resize-none"
              maxLength={2000}
            />
            <p className="text-xs text-purple-600 font-medium mt-2">{formData.content.length}/2000</p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            {submitting ? (
              <>
                <Loader size={18} className="animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Send size={18} />
                Post Announcement
              </>
            )}
          </button>
        </form>
      )}

      {/* Announcements List */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-4">
              <Loader size={32} className="text-purple-600 animate-spin" />
            </div>
            <p className="text-gray-600 font-medium">Loading announcements...</p>
          </div>
        </div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-6">
            <Bell className="text-purple-600" size={48} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No announcements yet</h3>
          <p className="text-gray-600">
            {isTeacher ? 'Create your first announcement to keep students informed!' : 'Check back later for updates'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement, idx) => (
            <div
              key={announcement.id}
              className="bg-gradient-to-br from-white to-purple-50/30 border border-purple-100 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-200/20 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
              
              {/* Announcement Header */}
              <div className="flex justify-between items-start mb-4 relative">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{announcement.title}</h3>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg font-semibold">
                      {announcement.teacher_name || 'Unknown'}
                    </span>
                    <span className="text-gray-500 font-medium">
                      {new Date(announcement.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
                {isTeacher && (
                  <button
                    onClick={() => handleDeleteAnnouncement(announcement.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 p-3 rounded-xl transition-all relative z-10"
                    title="Delete announcement"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>

              {/* Announcement Content */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 mt-4 border border-purple-100 relative">
                <p className="text-gray-700 whitespace-pre-wrap break-words leading-relaxed">
                  {announcement.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassAnnouncements;
