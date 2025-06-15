import api from "./api";

// ===================
// QUERY MANAGEMENT
// ===================
export const getAllQueries = () => api.get("/api/librarian/queries");
export const getQueryDetails = (id) => api.get(`/api/librarian/queries/${id}`);
export const updateQueryStatus = (id, status) =>
  api.patch(`/api/librarian/queries/${id}/status`, { status });

// ===================
// BORROW MANAGEMENT
// ===================
export const getAllBorrowRequests = (status = 'all') => {
  const url = status === 'all'
    ? '/api/librarian/borrow-requests'
    : `/api/librarian/borrow-requests?status=${status}`;
  return api.get(url);
};

// ✅ Correct (matches your backend)
export const updateBorrowStatus = (id, status) =>
  api.patch(`/api/librarian/borrow-requests/${id}/status`, { status });
export const processRenewalRequest = (id, action) =>
  api.patch(`/api/librarian/renewal-requests/${id}/process`, { action });

// ===================
// BOOK MANAGEMENT (CRUD)
// ===================
export const getAllBooks = () => api.get("/api/user/books");
export const getBookDetails = (id) => api.get(`/api/librarian/books/${id}`);
export const addBook = (bookData) => api.post("/api/librarian/books", bookData);
export const updateBook = (id, bookData) =>
  api.patch(`/api/librarian/books/${id}`, bookData);
export const deleteBook = (id) => api.delete(`/api/librarian/books/${id}`);

// ===================
// NOTIFICATION ROUTES
// ===================
export const sendNotification = (data) =>
  api.post("/api/librarian/notifications/send", data);
export const sendOverdueReminders = () =>
  api.post("/api/librarian/notifications/overdue-reminders");
export const sendDueDateReminders = () =>
  api.post("/api/librarian/notifications/due-reminders");

// ===================
// REPORTS & ANALYTICS
// ===================
export const getLibrarianDashboard = () => api.get("/api/librarian/dashboard");
export const getMostBorrowedBooks = () =>
  api.get("/api/librarian/reports/most-borrowed");
export const getOverdueReport = () => api.get("/api/librarian/reports/overdue");
export const getFinesReport = () => api.get("/api/librarian/reports/fines");

// ✅ Profile Management
export const getProfile = () => api.get("/api/user/profile");

export const updateProfile = (data) => api.put("/api/user/profile", data);

// ✅ Account Management
export const deleteAccount = () => api.delete("/api/user/profile");
