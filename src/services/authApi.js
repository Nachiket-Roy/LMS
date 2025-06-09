// src/services/authApi.js
import api from './api';

export const authApi = {
  /**
   * Login with credentials
   */
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      let errorMsg = 'Login failed';
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMsg = 'Invalid email or password';
        } else if (error.response.status === 429) {
          errorMsg = 'Too many attempts. Please wait before trying again.';
        } else {
          errorMsg = error.response.data?.message || errorMsg;
        }
      }
      
      throw new Error(errorMsg);
    }
  },

  /**
   * Public user registration
   */
  register: async (userData) => {
    try {
      const response = await api.post('/auth/public-register', userData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        'Registration failed. Please check your information.'
      );
    }
  },

  /**
   * Admin-only user registration
   */
  adminRegister: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        'User creation failed. Please check your permissions.'
      );
    }
  },

  /**
   * Logout current session
   */
  logout: async (allDevices = false) => {
    try {
      await api.post('/auth/logout', { allDevices });
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Failed to logout properly');
    }
  },

  /**
   * Check current authentication status
   */
  checkAuth: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      return null;
    }
  },

  /**
   * Silent refresh (for automatic token renewal)
   */
  silentRefresh: async () => {
    try {
      await api.post('/auth/refresh-token');
      return true;
    } catch (error) {
      return false;
    }
  },

  /**
   * Update user profile
   */
  updateProfile: async (userData) => {
    try {
      const response = await api.patch('/auth/me', userData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        'Profile update failed. Please check your information.'
      );
    }
  }
};

export default authApi;