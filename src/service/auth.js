import api from './api';

/**
 * Authentication service for JWT-based auth
 */
const authService = {
  /**
   * Login with email and password
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise} Response with access token and user data
   */
  login: async (email, password) => {
    return api.post('auth/login/', { email, password });
  },

  /**
   * Register a new user
   * @param {string} name 
   * @param {string} email 
   * @param {string} password 
   * @param {string} role - 'student', 'teacher', or 'admin'
   * @param {string} [phone] - optional E.164 phone number
   * @param {string} [country] - optional ISO 3166-1 alpha-2 (e.g. US, IN)
   * @returns {Promise} Response with access token and user data
   */
  register: async (name, email, password, role = 'student', phone = '', country = '') => {
    return api.post('auth/register/', {
      name,
      email,
      password,
      role,
      phone: phone || undefined,
      country: country || undefined,
    });
  },

  /**
   * Update current user profile (e.g. phone, country for OAuth users)
   * @param {object} data - e.g. { phone: '+1234567890', country: 'US' }
   * @returns {Promise} Updated profile
   */
  updateProfile: async (data) => {
    return api.patch('auth/me/', data);
  },

  /**
   * Logout current user
   * @returns {Promise}
   */
  logout: async () => {
    return api.post('auth/logout/');
  },

  /**
   * Refresh access token using httpOnly cookie
   * @returns {Promise} Response with new access token
   */
  refresh: async () => {
    return api.post('auth/refresh/');
  },

  /**
   * Get current user profile
   * @returns {Promise} Response with user profile data
   */
  me: async () => {
    return api.get('auth/me/');
  },

  /**
   * Login with Google OAuth
   * @param {string} code - Authorization code from Google
   * @param {string} redirectUri - OAuth redirect URI
   * @param {string} role - Optional role for new users
   * @returns {Promise} Response with access token and user data
   */
  googleLogin: async (code, redirectUri, role = 'student') => {
    return api.post('auth/google/', { code, redirect_uri: redirectUri, role });
  },

  /**
   * Login with GitHub OAuth
   * @param {string} code - Authorization code from GitHub
   * @param {string} redirectUri - OAuth redirect URI
   * @param {string} role - Optional role for new users
   * @returns {Promise} Response with access token and user data
   */
  githubLogin: async (code, redirectUri, role = 'student') => {
    return api.post('auth/github/', { code, redirect_uri: redirectUri, role });
  },

  /**
   * Send password reset email
   * @param {string} email 
   * @param {string} frontendUrl - Base URL of frontend for reset link
   * @returns {Promise}
   */
  forgotPassword: async (email, frontendUrl = window.location.origin) => {
    return api.post('auth/forgot-password/', { email, frontend_url: frontendUrl });
  },
};

export default authService;
