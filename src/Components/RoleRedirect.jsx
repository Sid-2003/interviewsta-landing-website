import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useVideoInterview } from '../Contexts/VideoInterviewContext';

const RoleRedirect = () => {
  const { state } = useVideoInterview();
  const { user, loading } = state.auth;
  const role = localStorage.getItem('role') || 'student';

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on role
  if (role === 'teacher') {
    return <Navigate to="/teacher/classes" replace />;
  } else if (role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  } else {
    return <Navigate to="/manage" replace />;
  }
};

export default RoleRedirect;

