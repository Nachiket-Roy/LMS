// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true, // Essential for cookie-based auth
  timeout: 10000,
});

// Token refresh state management
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // Only handle 401 errors and avoid infinite retry loops
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest))
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh token
        await axios.post(`${api.defaults.baseURL}/auth/refresh-token`, {}, {
          withCredentials: true,
          timeout: 5000
        });
        
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        
        // Redirect to login on refresh failure
        if (!['/', '/'].includes(window.location.pathname)) {
          window.location.href = '/';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Enhanced error handling
    if (error.response) {
      switch (error.response.status) {
        case 400:
          error.message = error.response.data?.message || 'Invalid request';
          break;
        case 403:
          error.message = 'You don\'t have permission for this action';
          break;
        case 404:
          error.message = 'Resource not found';
          break;
        case 429:
          error.message = 'Too many requests. Please slow down.';
          break;
        case 500:
          error.message = 'Server error. Please try again later.';
          break;
        default:
          error.message = `Request failed with status ${error.response.status}`;
      }
    } else if (error.code === 'ECONNABORTED') {
      error.message = 'Request timed out. Please try again.';
    } else if (error.message === 'Network Error') {
      error.message = 'Network connection failed. Please check your internet.';
    }

    return Promise.reject(error);
  }
);

// Request interceptor for consistent headers
api.interceptors.request.use(config => {
  config.headers = {
    'Content-Type': 'application/json',
    ...config.headers
  };
  return config;
}, error => Promise.reject(error));

export default api;