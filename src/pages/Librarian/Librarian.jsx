
import React, { useState, useEffect } from 'react';
import {
  FaBook,
  FaCalendarAlt,
  FaDollarSign,
  FaClock,
  FaBookOpen,
  FaExclamationTriangle,
  FaCheckCircle,
  FaHistory,
  FaUsers,
  FaChartLine,
  FaClipboardList,
  FaArrowRight,
  FaEye,
  FaBell,
  FaTimes,
  FaCheck,
  FaQuestion,
} from 'react-icons/fa';
import { FiLoader, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import {
  getAllQueries,
  getAllBorrowRequests,
  updateBorrowStatus,
  processRenewalRequest,
  getLibrarianDashboard,
  getOverdueReport,
  sendOverdueReminders,
  sendDueDateReminders,
  getProfile
} from '../../services/librarianApi';

const LibrarianDashboard = () => {
  // State management
  const [dashboardData, setDashboardData] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [queries, setQueries] = useState([]);
  const [librarian, setLibrarian] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);
  const [showOverdueModal, setShowOverdueModal] = useState(false);

  // Fetch all dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    console.log('Dashboard Data:', dashboardData);
    console.log('Pending Requests:', pendingRequests);
    console.log('Overdue Books:', overdueBooks);
    console.log('Recent Transactions:', recentTransactions);
  }, [dashboardData, pendingRequests, overdueBooks, recentTransactions]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [
        dashboardResponse,
        borrowRequestsResponse,
        overdueResponse,
        queriesResponse,
        profileResponse
      ] = await Promise.allSettled([
        getLibrarianDashboard(),
        getAllBorrowRequests(),
        getOverdueReport(),
        getAllQueries(),
        getProfile()
      ]);

      // Process dashboard data
      // Process dashboard data
      if (dashboardResponse.status === 'fulfilled' && dashboardResponse.value?.data?.success) {
        const data = dashboardResponse.value.data.data || {};
        setDashboardData({
          pendingRequests: data.pendingRequests || 0,
          todayReturns: data.todayReturns || 0,
          overdueBooks: data.overdueBooks || 0,
          totalFines: data.totalFines || 0,
          totalBooks: data.totalBooks || 0,
          totalUsers: data.totalUsers || 0,
          activeBorrows: data.activeBorrows || 0,
          openQueries: data.openQueries || 0
        });
      }

      // Process borrow requests
      if (borrowRequestsResponse.status === 'fulfilled' && borrowRequestsResponse.value?.data?.success) {
        const requests = borrowRequestsResponse.value.data.data || [];
        setPendingRequests(requests.filter(req => req.status === 'requested'));
        setRecentTransactions(requests.slice(0, 5)); // Recent 5 transactions
      }

      // Process overdue books
      if (overdueResponse.status === 'fulfilled' && overdueResponse.value?.data?.success) {
        const overdueData = overdueResponse.value.data.data || [];
        setOverdueBooks(Array.isArray(overdueData) ? overdueData : []);
        console.log('Raw Overdue Data:', overdueData);
      }

      // Process queries
      if (queriesResponse.status === 'fulfilled' && queriesResponse.value?.data?.success) {
        const queryData = queriesResponse.value.data.data || [];
        setQueries(Array.isArray(queryData) ? queryData.slice(0, 5) : []);
      }

      // Process profile
      if (profileResponse.status === 'fulfilled' && profileResponse.value?.data?.success) {
        setLibrarian(profileResponse.value.data.data);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  const refreshDashboard = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
    showNotification('Dashboard refreshed successfully', 'success');
  };

  const handleBorrowAction = async (requestId, status, bookTitle) => {
    try {
      setActionLoading(prev => ({ ...prev, [requestId]: true }));

      const response = await updateBorrowStatus(requestId, status);

      if (response?.data?.success) {
        showNotification(
          `Book request ${status === 'approved' ? 'approved' : 'rejected'} successfully`,
          'success'
        );

        // Update local state
        setPendingRequests(prev => prev.filter(req => req._id !== requestId));

        // Refresh dashboard data to get updated stats
        await fetchDashboardData();
      } else {
        showNotification(response?.data?.message || 'Failed to update request', 'error');
      }
    } catch (error) {
      console.error('Error updating borrow request:', error);
      showNotification('Failed to update request. Please try again.', 'error');
    } finally {
      setActionLoading(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const handleRenewalAction = async (renewalId, decision) => {
    try {
      setActionLoading(prev => ({ ...prev, [renewalId]: true }));

      const response = await processRenewalRequest(renewalId, decision);

      if (response?.data?.success) {
        showNotification(
          `Renewal request ${decision}d successfully`,
          'success'
        );
        await fetchDashboardData();
      } else {
        showNotification(response?.data?.message || 'Failed to process renewal', 'error');
      }
    } catch (error) {
      console.error('Error processing renewal:', error);
      showNotification('Failed to process renewal. Please try again.', 'error');
    } finally {
      setActionLoading(prev => ({ ...prev, [renewalId]: false }));
    }
  };

  const sendReminders = async (type) => {
    try {
      setActionLoading(prev => ({ ...prev, [type]: true }));

      const response = type === 'overdue'
        ? await sendOverdueReminders()
        : await sendDueDateReminders();

      if (response?.data?.success) {
        showNotification(
          `${type === 'overdue' ? 'Overdue' : 'Due date'} reminders sent successfully`,
          'success'
        );
      } else {
        showNotification('Failed to send reminders', 'error');
      }
    } catch (error) {
      console.error('Error sending reminders:', error);
      showNotification('Failed to send reminders. Please try again.', 'error');
    } finally {
      setActionLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const calculateDaysOverdue = (dueDate) => {
    if (!dueDate) return 0;
    try {
      const due = new Date(dueDate);
      const today = new Date();
      const diffTime = today - due;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(0, diffDays);
    } catch (error) {
      return 0;
    }
  };

  // Calculate quick stats from dashboard data - Fixed field mapping
  // Replace the current quickStats calculation with this:
  const quickStats = dashboardData ? {
    pendingRequests: dashboardData.pendingRequests || pendingRequests.length,
    todayReturns: dashboardData.todayReturns ||
      recentTransactions.filter(t =>
        t.status === 'returned' &&
        t.returnDate &&
        new Date(t.returnDate).toDateString() === new Date().toDateString()
      ).length,
    overdueBooks: dashboardData.overdueBooks || overdueBooks.length,
    totalFines: dashboardData.totalFines ||
      overdueBooks.reduce((sum, book) => sum + (book.fineAmount || (book.daysOverdue || calculateDaysOverdue(book.dueDate)) * 5 || 0), 0)
  } : {
    pendingRequests: pendingRequests.length,
    todayReturns: recentTransactions.filter(t =>
      t.status === 'returned' &&
      t.returnDate &&
      new Date(t.returnDate).toDateString() === new Date().toDateString()
    ).length,
    overdueBooks: overdueBooks.length,
    totalFines: overdueBooks.reduce((sum, book) => sum + (book.fineAmount || (book.daysOverdue || calculateDaysOverdue(book.dueDate)) * 5 || 0), 0)
  };

  // Overdue Books Modal Component
  const OverdueBooksModal = () => {
    if (!showOverdueModal) return null;

    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-800/60 via-gray-900/60 to-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">
              All Overdue Books ({overdueBooks.length})
            </h2>
            <button
              onClick={() => setShowOverdueModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            {overdueBooks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FaCheckCircle className="h-16 w-16 mx-auto mb-4 text-green-300" />
                <p className="text-lg font-medium">No overdue books</p>
                <p className="text-sm">All books have been returned on time!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {overdueBooks.map((book) => {
                  const daysOverdue = book.daysOverdue || calculateDaysOverdue(book.dueDate);
                  const bookInfo = book.book_id || book.book || {};
                  const userInfo = book.user_id || book.user || {};
                  const fineAmount = book.fineAmount || (daysOverdue * 5);

                  return (
                    <div key={book._id} className="border rounded-lg p-4 bg-red-50 border-red-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 text-lg">
                            {bookInfo.title || 'Unknown Title'}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            by {bookInfo.author || 'Unknown Author'}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <p className="text-red-600 font-medium flex items-center gap-1">
                              <FaExclamationTriangle className="w-4 h-4" />
                              {daysOverdue} days overdue
                            </p>
                            <p className="text-gray-600">
                              Due: {formatDate(book.dueDate)}
                            </p>
                            <p className="text-gray-600">
                              Borrowed: {formatDate(book.issueDate)}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center gap-4 text-sm">
                            <p className="text-gray-700">
                              <span className="font-medium">Borrower:</span> {userInfo.name || userInfo.username || 'Unknown User'}
                            </p>
                            {userInfo.email && (
                              <p className="text-gray-600">
                                <span className="font-medium">Email:</span> {userInfo.email}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-lg font-bold text-red-600">
                            ₹{fineAmount.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">Fine Amount</p>
                          <div className="mt-2 flex gap-2">
                            <button
                              onClick={() => sendReminders('overdue')}
                              className="px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700 transition-colors"
                            >
                              Send Reminder
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between p-6 border-t bg-gray-50">
            <div className="text-sm text-gray-600">
              Total Fine Amount: <span className="font-bold text-red-600 text-lg">
                ₹{overdueBooks.reduce((sum, book) => {
                  const daysOverdue = book.daysOverdue || calculateDaysOverdue(book.dueDate);
                  const fineAmount = book.fineAmount || (daysOverdue * 5);
                  return sum + fineAmount;
                }, 0).toFixed(2)}
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => sendReminders('overdue')}
                disabled={actionLoading.overdue}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {actionLoading.overdue ? (
                  <FiLoader className="animate-spin w-4 h-4" />
                ) : (
                  <FaBell className="w-4 h-4" />
                )}
                Send All Reminders
              </button>
              <button
                onClick={() => setShowOverdueModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <FiLoader className="animate-spin w-12 h-12 text-blue-600" />
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-700">Loading Dashboard</h2>
            <p className="text-gray-500">Please wait while we fetch the data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 md:ml-0">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transition-all duration-300 ${notification.type === 'success'
          ? 'bg-green-100 text-green-800 border border-green-200'
          : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <FaCheckCircle className="w-5 h-5" />
            ) : (
              <FiAlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Overdue Books Modal */}
      <OverdueBooksModal />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {librarian?.name || 'Librarian'}!
            </h1>
            <p className="text-gray-600">Manage book requests, inventory, and user interactions</p>
          </div>
          <button
            onClick={refreshDashboard}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Quick Stats - Fixed labels and calculations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaClipboardList className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-900">{quickStats.pendingRequests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaBookOpen className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Returns Today</p>
                <p className="text-2xl font-bold text-gray-900">{quickStats.todayReturns}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaClock className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue Books</p>
                <p className="text-2xl font-bold text-gray-900">{quickStats.overdueBooks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaDollarSign className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Fines</p>
                <p className="text-2xl font-bold text-gray-900">₹{quickStats.totalFines.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Dashboard Stats */}
        {dashboardData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaBook className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Books</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.totalBooks || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaUsers className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.totalUsers || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaBookOpen className="h-8 w-8 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Borrows</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.activeBorrows || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaClipboardList className="h-8 w-8 text-teal-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Open Queries</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.openQueries || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 rounded-lg shadow-sm mb-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold mb-2">Quick Actions</h2>
              <p className="text-blue-100">Manage library operations efficiently</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full md:w-auto">
              <NavLink
                to="/librarian/requests"
                className="flex flex-col items-center justify-center bg-white text-blue-600 px-4 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
              >
                <FaClipboardList className="h-6 w-6 mb-1" />
                <span className="text-sm">Requests</span>
              </NavLink>
              <NavLink
                to="/librarian/manage"
                className="flex flex-col items-center justify-center bg-white text-blue-600 px-4 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
              >
                <FaBook className="h-6 w-6 mb-1" />
                <span className="text-sm">Inventory</span>
              </NavLink>
              <NavLink
                to="/librarian/query"
                className="flex flex-col items-center justify-center bg-white text-blue-600 px-4 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
              >
                <FaQuestion className="h-6 w-6 mb-1" />
                <span className="text-sm">Query</span>
              </NavLink>
              <NavLink
                to="/librarian/query"
                className="flex flex-col items-center justify-center bg-white text-blue-600 px-4 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
              >
                <FaChartLine className="h-6 w-6 mb-1" />
                <span className="text-sm">Reports</span>
              </NavLink>
              <button
                onClick={() => sendReminders('overdue')}
                disabled={actionLoading.overdue}
                className="flex flex-col items-center justify-center bg-white text-blue-600 px-4 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg disabled:opacity-50"
              >
                {actionLoading.overdue ? (
                  <FiLoader className="h-6 w-6 mb-1 animate-spin" />
                ) : (
                  <FaBell className="h-6 w-6 mb-1" />
                )}
                <span className="text-sm">Reminders</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Requests */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Pending Book Requests</h2>
              <NavLink to="/librarian/requests" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All ({pendingRequests.length})
              </NavLink>
            </div>
            <div className="space-y-4">
              {pendingRequests.slice(0, 5).map((request) => {
                const book = request.book_id || {};
                const user = request.user_id || {};
                return (
                  <div key={request._id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {book.title || 'Unknown Title'}
                        </h3>
                        <p className="text-sm text-gray-600">by {book.author || 'Unknown Author'}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Requested by: {user.name || user.username || 'Unknown User'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(request.requestDate || request.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleBorrowAction(request._id, 'approved', book.title)}
                            disabled={actionLoading[request._id]}
                            className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50 flex items-center gap-1"
                          >
                            {actionLoading[request._id] ? (
                              <FiLoader className="animate-spin w-3 h-3" />
                            ) : (
                              <FaCheck className="w-3 h-3" />
                            )}
                            Approve
                          </button>
                          <button
                            onClick={() => handleBorrowAction(request._id, 'rejected', book.title)}
                            disabled={actionLoading[request._id]}
                            className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 disabled:opacity-50 flex items-center gap-1"
                          >
                            {actionLoading[request._id] ? (
                              <FiLoader className="animate-spin w-3 h-3" />
                            ) : (
                              <FaTimes className="w-3 h-3" />
                            )}
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {pendingRequests.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FaClipboardList className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No pending requests</p>
                </div>
              )}
            </div>
          </div>

          {/* Overdue Books */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Overdue Books</h2>
              <div className="flex gap-2">

                <button
                  onClick={() => setShowOverdueModal(true)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View All ({overdueBooks.length})
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {overdueBooks.slice(0, 5).map((book) => {
                const daysOverdue = book.daysOverdue || calculateDaysOverdue(book.dueDate);
                const bookInfo = book.book_id || book.book || {};
                const userInfo = book.user_id || book.user || {};
                const fineAmount = book.fineAmount || (daysOverdue * 5); // Default fine calculation

                return (
                  <div key={book._id} className="border rounded-lg p-4 bg-red-50 border-red-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {bookInfo.title || 'Unknown Title'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          by {bookInfo.author || 'Unknown Author'}
                        </p>
                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                          <FaExclamationTriangle className="w-3 h-3" />
                          {daysOverdue} days overdue
                        </p>
                        <p className="text-xs text-gray-500">
                          Due: {formatDate(book.dueDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {userInfo.name || userInfo.username || 'Unknown User'}
                        </p>
                        <p className="text-lg font-bold text-red-600">
                          ₹{fineAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {overdueBooks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FaCheckCircle className="h-12 w-12 mx-auto mb-3 text-green-300" />
                  <p>No overdue books</p>
                </div>
              )}
            </div>
          </div>
        </div>



        {/* Recent Transactions - Fixed field mapping */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
            <NavLink to="/librarian/requests" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </NavLink>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Book
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentTransactions.map((transaction) => {
                  const book = transaction.book_id || {};
                  const user = transaction.user_id || {};

                  return (
                    <tr key={transaction._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name || user.username || 'Unknown User'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {book.title || 'Unknown Book'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${transaction.status === 'approved' ? 'bg-green-100 text-green-800' :
                          transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            transaction.status === 'returned' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                          }`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(transaction.issueDate || transaction.requestDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <NavLink
                          to={`/librarian/requests/${transaction._id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FaEye className="h-4 w-4" />
                        </NavLink>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {recentTransactions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FaHistory className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No recent transactions</p>
              </div>
            )}
          </div>
        </div>

        {/* User Queries Section - Fixed field mapping */}
        {queries.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent User Queries</h2>
              <NavLink to="/librarian/query" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All
              </NavLink>
            </div>
            <div className="space-y-4">
              {queries.map((query) => (
                <div key={query._id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {query.subject || 'No Subject'}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{query.message}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        From: {query.user_id?.name || query.user_id?.username || 'Unknown User'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(query.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 text-xs rounded-full ${query.status === 'resolved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {query.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibrarianDashboard;