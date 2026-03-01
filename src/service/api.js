// src/service/api.js
import axios from 'axios';

// const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000/api/';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000/api/';
const FASTAPI_URL = import.meta.env.VITE_FASTAPI_URL || 'http://localhost:8001/'; 

// In-memory access token storage
let accessToken = null;

/**
 * Set the access token in memory
 * @param {string} token - JWT access token
 */
export const setAccessToken = (token) => {
  accessToken = token;
};

/**
 * Get the current access token from memory
 * @returns {string|null} Current access token
 */
export const getAccessToken = () => {
  return accessToken;
};

/**
 * Clear the access token from memory
 */
export const clearAccessToken = () => {
  accessToken = null;
};

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Automatically attach access token to all requests
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// List of endpoints that should NOT trigger token refresh
const noRefreshEndpoints = ['auth/me/', 'auth/refresh/', 'auth/login/', 'auth/register/'];

// Response interceptor: Handle 401 errors and refresh tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest.url || '';
    
    // Check if this is an auth endpoint that shouldn't trigger refresh
    const isAuthEndpoint = noRefreshEndpoints.some(endpoint => requestUrl.includes(endpoint));
    
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      
      try {
        const response = await axios.post(`${API_URL}auth/refresh/`, {}, { withCredentials: true });
        const newAccessToken = response.data.access;
        
        // Update access token in memory
        setAccessToken(newAccessToken);
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios({
          ...originalRequest,
          headers: {
            ...originalRequest.headers,
            Authorization: `Bearer ${newAccessToken}`
          }
        });
      } catch (refreshError) {
        // Refresh failed - clear token and let app handle it
        clearAccessToken();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;