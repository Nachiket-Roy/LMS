import api from './api';

// ✅ Book Management
export const getAllBooks = (filters = {}) => 
  api.get('/api/books', { params: filters });

// ✅ Borrow Management
export const requestBorrow = (bookId) => 
  api.post('/api/borrow/request', { book_id: bookId });

// 🔧 FIXED: Changed from '/api/borrows' to '/api/borrow-requests'
export const getBorrowRequests = (status = null) => {
  const params = status ? { status } : {};
  return api.get('/api/borrow-requests', { params });
};

export const renewBook = (id) => 
  api.post(`/api/borrow/renew/${id}`);

// 🔧 FIXED: Changed from '/api/overdue' to '/api/overdue-books'
export const getOverdueBooks = () => 
  api.get('/api/overdue-books');

export const getReadingHistory = (page = 1, limit = 10) => 
  api.get('/api/reading-history', { params: { page, limit } });

// ✅ Notification Management
export const getNotifications = (page = 1, limit = 10) => 
  api.get('/api/notifications', { params: { page, limit } });

export const getUnreadCount = () => 
  api.get('/api/notifications/unread-count');

export const markNotificationAsRead = (id) => 
  api.put(`/api/notifications/${id}/read`);

export const markAllAsRead = () => 
  api.put('/api/notifications/mark-all-read');

// 🔧 FIXED: Changed from '/api/due-soon' to '/api/latest-due-notification'
export const getLatestDueNotification = () => 
  api.get('/api/latest-due-notification');

// 🔧 FIXED: Changed from '/api/payments' to '/api/payment-history'
export const getPaymentHistory = () => 
  api.get('/api/payment-history');

// ✅ Profile Management
export const getProfile = () => 
  api.get('/api/profile');

export const updateProfile = (data) => 
  api.put('/api/profile', data);

// ✅ Dashboard
export const getDashboardSummary = () => 
  api.get('/api/dashboard-summary');

// ✅ Feedback/Support
export const submitFeedback = (data) => 
  api.post('/api/feedback', data);

// ✅ Query Management
export const getUserQueries = () => 
  api.get('/api/queries');

export const getUserQueryById = (id) => 
  api.get(`/api/queries/${id}`);

export const deleteUserQuery = (id) => 
  api.delete(`/api/queries/${id}`);

// ✅ Account Management
export const deleteAccount = () => 
  api.delete('/api/profile');