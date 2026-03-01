// Authentication utility functions for API calls (JWT-based)
import { getAccessToken } from '../service/api';

/**
 * Get the current JWT access token
 * @returns {Promise<string>} JWT access token
 * @throws {Error} If user is not authenticated
 */
export const getAuthToken = async () => {
  const token = getAccessToken();
  if (!token) {
    throw new Error('User not authenticated');
  }
  return token;
};

/**
 * Get authentication headers with Bearer token
 * @returns {Promise<Object>} Headers object with Authorization
 */
export const getAuthHeaders = async () => {
  const token = await getAuthToken();
  return {
    'Authorization': `Bearer ${token}`,
  };
};

/**
 * Get current user information.
 * With JWT auth, user details are stored in app state (e.g. VideoInterviewContext).
 * @returns {Object|null} User object or null (use context for current user)
 */
export const getCurrentUser = () => {
  return null;
};
