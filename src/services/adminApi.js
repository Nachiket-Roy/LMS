import api from './api';

// ==================== USER MANAGEMENT ====================

// Get all users with optional filters and pagination
export const getAllUsers = (params) => api.get('/api/users', { params });

// Get user by ID
export const getUserById = (id) => api.get(`/api/users/${id}`);

// Delete or deactivate a user
export const deleteUser = (id) => api.delete(`/api/users/${id}`);

// ==================== LIBRARIAN MANAGEMENT ====================

// Get all librarians
export const getAllLibrarians = () => api.get('/api/librarians');

// ==================== DASHBOARD & ANALYTICS ====================

// Admin dashboard summary
export const getAdminDashboard = () => api.get('/api/dashboard');

// User activity logs
export const getUserActivityLogs = () => api.get('/api/activity-logs');

// ✅ Profile Management
export const getProfile = () => 
  api.get('/api/profile');

export const updateProfile = (data) => 
  api.put('/api/profile', data);
// ✅ Account Management
export const deleteAccount = () => 
  api.delete('/api/profile');