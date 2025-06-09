import api from './api';

// ===================
// QUERY MANAGEMENT
// ===================
export const getAllQueries = () => api.get('/api/queries');
export const getQueryDetails = (id) => api.get(`/api/queries/${id}`);
export const updateQueryStatus = (id, status) =>
  api.patch(`/api/queries/${id}/status`, { status });

// ===================
// BORROW MANAGEMENT
// ===================
export const getAllBorrowRequests = () => api.get('/api/borrow-requests');
export const updateBorrowStatus = (id, status) =>
  api.patch(`/api/borrow-requests/${id}/status`, { status });
export const processRenewalRequest = (id, decision) =>
  api.patch(`/api/renewal-requests/${id}/process`, { decision });

// ===================
// BOOK MANAGEMENT (CRUD)
// ===================
export const getAllBooks = () => api.get('/api/books');
export const getBookDetails = (id) => api.get(`/api/books/${id}`);
export const addBook = (bookData) => api.post('/api/books', bookData);
export const updateBook = (id, bookData) => api.patch(`/api/books/${id}`, bookData);
export const deleteBook = (id) => api.delete(`/api/books/${id}`);

// ===================
// NOTIFICATION ROUTES
// ===================
export const sendNotification = (data) => api.post('/api/notifications/send', data);
export const sendOverdueReminders = () => api.post('/api/notifications/overdue-reminders');
export const sendDueDateReminders = () => api.post('/api/notifications/due-reminders');

// ===================
// REPORTS & ANALYTICS
// ===================
export const getLibrarianDashboard = () => api.get('/api/dashboard');
export const getMostBorrowedBooks = () => api.get('/api/reports/most-borrowed');
export const getOverdueReport = () => api.get('/api/reports/overdue');
export const getFinesReport = () => api.get('/api/reports/fines');

// ✅ Profile Management
export const getProfile = () => 
  api.get('/api/profile');

export const updateProfile = (data) => 
  api.put('/api/profile', data);
// ✅ Account Management
export const deleteAccount = () => 
  api.delete('/api/profile');