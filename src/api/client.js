// API client configuration for FastAPI backend
import axios from 'axios';
import { getAuthHeaders } from '../utils/auth';
import { setAccessToken, clearAccessToken } from '../service/api';

// API Base URLs
export const API_CONFIG = {
  DJANGO_BASE_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000/api/',
  FASTAPI_BASE_URL: import.meta.env.VITE_FASTAPI_BASE_URL || 'http://localhost:8001/api/v1',
};

/**
 * FastAPI client with authentication
 */
export const fastApiClient = axios.create({
  baseURL: API_CONFIG.FASTAPI_BASE_URL,
  timeout: 30000, // 30 seconds
});

/**
 * Django client (for backward compatibility)
 */
export const djangoClient = axios.create({
  baseURL: API_CONFIG.DJANGO_BASE_URL,
  timeout: 30000,
});

// ============================================================================
// FASTAPI CLIENT INTERCEPTORS
// ============================================================================

// Request interceptor - Add JWT token to all requests
fastApiClient.interceptors.request.use(
  async (config) => {
    try {
      const headers = await getAuthHeaders();
      config.headers = { ...config.headers, ...headers };
    } catch (error) {
      console.error('Auth error:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh and errors
fastApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if this is a 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh token via Django backend
        const response = await axios.post(
          `${API_CONFIG.DJANGO_BASE_URL}auth/refresh/`, 
          {}, 
          { withCredentials: true }
        );
        const newAccessToken = response.data.access;
        
        // Update token in memory
        setAccessToken(newAccessToken);
        console.log('[FastAPI Client] Token refreshed successfully');
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return fastApiClient(originalRequest);
        
      } catch (refreshError) {
        // Refresh failed - clear auth and redirect to login
        console.error('[FastAPI Client] Token refresh failed. Please log in again.');
        clearAccessToken();
        // Optionally redirect to login
        // window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other error status codes
    if (error.response?.status === 403) {
      console.error('Forbidden. You do not have permission.');
    }
    
    if (error.response?.status === 503) {
      console.error('Service temporarily unavailable');
    }
    
    return Promise.reject(error);
  }
);

// ============================================================================
// DJANGO CLIENT INTERCEPTORS
// ============================================================================

// Request interceptor - Add authentication headers
djangoClient.interceptors.request.use(
  async (config) => {
    try {
      const headers = await getAuthHeaders();
      config.headers = { ...config.headers, ...headers };
    } catch (error) {
      console.error('Auth error:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors (optional, same as FastAPI if needed)
djangoClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized. Please log in again.');
    }
    return Promise.reject(error);
  }
);
