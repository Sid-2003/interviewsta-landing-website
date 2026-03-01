import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useVideoInterview } from '../Contexts/VideoInterviewContext';
import { Loader2 } from 'lucide-react';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { googleLogin, githubLogin } = useVideoInterview();
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const errorParam = searchParams.get('error');

      // Check for OAuth errors
      if (errorParam) {
        setError(`Authentication failed: ${errorParam}`);
        setProcessing(false);
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      // Check if we have the authorization code
      if (!code) {
        setError('No authorization code received');
        setProcessing(false);
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      // Get role from localStorage if user was signing up
      const role = localStorage.getItem('signup_role') || 'student';
      localStorage.removeItem('signup_role'); // Clean up

      try {
        let result;
        
        console.log('OAuth Callback - Provider:', state, 'Code:', code?.substring(0, 20) + '...', 'Role:', role);
        
        if (state === 'google') {
          result = await googleLogin(code, role);
          console.log('Google login result:', result);
        } else if (state === 'github') {
          result = await githubLogin(code, role);
          console.log('GitHub login result:', result);
        } else {
          console.error('Invalid OAuth provider state:', state);
          setError('Invalid OAuth provider');
          setProcessing(false);
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        if (result && result.success) {
          const hasPhone = result.user?.phone && String(result.user.phone).trim() !== '';
          const hasCountry = result.user?.country && String(result.user.country).trim() !== '';
          if (!hasPhone || !hasCountry) {
            navigate('/complete-profile', { replace: true });
          } else {
            const userRole = result.role;
            if (userRole === 'teacher') {
              navigate('/teacher/classes', { replace: true });
            } else if (userRole === 'admin') {
              navigate('/admin/dashboard', { replace: true });
            } else {
              navigate('/manage', { replace: true });
            }
          }
        } else {
          console.error('OAuth failed:', result);
          setError(result?.error || 'Authentication failed');
          setProcessing(false);
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError(`An unexpected error occurred: ${err.message}`);
        setProcessing(false);
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, googleLogin, githubLogin]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center">
        {processing ? (
          <>
            <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Completing sign in...
            </h2>
            <p className="text-gray-600">
              Please wait while we authenticate your account
            </p>
          </>
        ) : (
          <>
            <div className="text-red-600 mb-4">
              <svg
                className="w-16 h-16 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Authentication Failed
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">
              Redirecting to login page...
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default OAuthCallback;
