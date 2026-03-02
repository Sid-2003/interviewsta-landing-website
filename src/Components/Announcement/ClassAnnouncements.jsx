import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import './ClassAnnouncements.css';

const ClassAnnouncements = ({ classId, isTeacher }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000/api/';

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  // Fetch announcements
  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      const response = await axios.get(
        `${API_BASE_URL}announcements/?class_obj=${classId}`,
        {
          },
        }
      );
      setAnnouncements(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching announcements:', err);
      setError('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  // Fetch announcements on component mount or classId change
  useEffect(() => {
    if (classId) {
      fetchAnnouncements();
    }
  }, [classId]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Create announcement
  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      setIsSubmitting(true);
      const token = getAuthToken();
      await axios.post(
        `${API_BASE_URL}/announcements/`,
        {
          class_obj: classId,
          title: formData.title,
          content: formData.content,
        },
        {
          },
        }
      );

      setFormData({ title: '', content: '' });
      setShowForm(false);
      setError(null);
      await fetchAnnouncements();
    } catch (err) {
      console.error('Error creating announcement:', err);
      setError(err.response?.data?.detail || 'Failed to create announcement');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete announcement
  const handleDeleteAnnouncement = async (announcementId) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) {
      return;
    }

    try {
      const token = getAuthToken();
      await axios.delete(
        `${API_BASE_URL}/announcements/${announcementId}/`,
        {
          },
        }
      );
      await fetchAnnouncements();
      setError(null);
    } catch (err) {
      console.error('Error deleting announcement:', err);
      setError('Failed to delete announcement');
    }
  };

  if (loading) {
    return <div className="announcements-container loading">Loading announcements...</div>;
  }

  return (
    <div className="announcements-container">
      {error && <div className="announcements-error">{error}</div>}

      {isTeacher && (
        <div className="announcements-header">
          <button
            className="btn-new-announcement"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : '+ New Announcement'}
          </button>
        </div>
      )}

      {showForm && isTeacher && (
        <form className="announcement-form" onSubmit={handleCreateAnnouncement}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter announcement title"
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Enter announcement content"
              rows="4"
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            className="btn-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Posting...' : 'Post Announcement'}
          </button>
        </form>
      )}

      <div className="announcements-list">
        {announcements.length === 0 ? (
          <div className="no-announcements">
            No announcements yet
          </div>
        ) : (
          announcements.map(announcement => (
            <div key={announcement.id} className="announcement-card">
              <div className="announcement-header-card">
                <div>
                  <h3 className="announcement-title">{announcement.title}</h3>
                  <p className="announcement-meta">
                    {announcement.teacher_name} • {formatDistanceToNow(new Date(announcement.created_at), { addSuffix: true })}
                  </p>
                </div>
                {isTeacher && (
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteAnnouncement(announcement.id)}
                    title="Delete announcement"
                  >
                    ✕
                  </button>
                )}
              </div>
              <p className="announcement-content">{announcement.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClassAnnouncements;
