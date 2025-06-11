import api from "./api";

// ✅ Book Management
export const getAllBooks = (filters = {}) =>
  api.get("/api/user/books", { params: filters });

// ✅ Borrow Management
export const requestBorrow = (bookId) =>
  api.post("/api/user/borrow/request", { book_id: bookId });

export const getBorrowRequests = (status = null) => {
  const params = status ? { status } : {};
  return api.get("/api/user/borrow-requests", { params });
};

export const renewBook = (id) => api.post(`/api/user/borrow/renew/${id}`);

export const getOverdueBooks = () => api.get("/api/user/overdue-books");

export const getReadingHistory = (page = 1, limit = 10) =>
  api.get("/api/user/reading-history", { params: { page, limit } });

// ✅ Notification Management
export const getNotifications = (page = 1, limit = 10) =>
  api.get("/api/user/notifications", { params: { page, limit } });

export const getUnreadCount = () =>
  api.get("/api/user/notifications/unread-count");

export const markNotificationAsRead = (id) =>
  api.put(`/api/user/notifications/${id}/read`);

export const markAllAsRead = () =>
  api.put("/api/user/notifications/mark-all-read");
// export const getNotificationById = (id) =>
//   api.get(`/api/user/notifications/${id}`);


export const getLatestDueNotification = () =>
  api.get("/api/user/latest-due-notification");

export const getPaymentHistory = () => api.get("/api/user/payment-history");

// ✅ Profile Management
export const getProfile = () => api.get("/api/user/profile");

export const updateProfile = (data) => api.put("/api/user/profile", data);

// ✅ Dashboard
export const getDashboardSummary = () => api.get("/api/user/dashboard-summary");

// ✅ Feedback/Support
export const submitFeedback = (data) => api.post("/api/user/feedback", data);

// ✅ Query Management
export const getUserQueries = () => api.get("/api/user/queries");

export const getUserQueryById = (id) => api.get(`/api/user/queries/${id}`);

export const deleteUserQuery = (id) => api.delete(`/api/user/queries/${id}`);

// ✅ Account Management
export const deleteAccount = () => api.delete("/api/user/profile");
