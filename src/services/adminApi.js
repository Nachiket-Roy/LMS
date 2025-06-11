import api from "./api";

// ==================== USER MANAGEMENT ====================

// Get all users with optional filters and pagination
export const getAllUsers = (params) => api.get("/api/admin/users", { params });

// Get user by ID
export const getUserById = (id) => api.get(`/api/admin/users/${id}`);

// Delete or deactivate a user
export const deleteUser = (id) => api.delete(`/api/admin/users/${id}`);

// ==================== LIBRARIAN MANAGEMENT ====================

// Get all librarians
export const getAllLibrarians = () => api.get("/api/admin/librarians");

// ==================== DASHBOARD & ANALYTICS ====================

// Admin dashboard summary
export const getAdminDashboard = () => api.get("/api/admin/dashboard");

// User activity logs
export const getUserActivityLogs = () => api.get("/api/admin/activity-logs");

// ✅ Profile Management
export const getProfile = () => api.get("/api/user/profile");

export const updateProfile = (data) => api.put("/api/user/profile", data);

// ✅ Account Management
export const deleteAccount = () => api.delete("/api/user/profile");
