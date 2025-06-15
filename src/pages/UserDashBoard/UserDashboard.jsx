import React, { useState, useEffect } from 'react';
import {
  FaSearch,
  FaBook,
  FaCalendarAlt,
  FaDollarSign,
  FaClock,
  FaUser,
  FaBell,
  FaBars,
  FaTimes,
  FaBookOpen,
  FaExclamationTriangle,
  FaCheckCircle,
  FaHistory,
  FaInfoCircle,
  FaDownload,
  FaEye,
  FaArrowRight,
  FaRedo
} from 'react-icons/fa';
import { FiLoader, FiRefreshCw, FiAlertCircle, FiCheck } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import {
  getProfile,
  getBorrowRequests,
  getOverdueBooks,
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllAsRead,
  renewBook,
  getDashboardSummary,
  getPaymentHistory
} from '../../services/userApi';

// CSS-based placeholder component for book covers
const PlaceholderBookCover = ({ title, className }) => (
  <div className={`${className} bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-center p-2 rounded shadow-md`}>
    <div className="text-xs leading-tight break-words">
      {title ? (title.length > 15 ? title.substring(0, 15) + '...' : title) : 'Book'}
    </div>
  </div>
);

const UserDashboard = () => {
  // State management
  const [userData, setUserData] = useState(null);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [allNotifications, setAllNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [renewLoading, setRenewLoading] = useState({});
  const [notification, setNotification] = useState(null);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [bookToRenew, setBookToRenew] = useState(null);
  const [error, setError] = useState(null);
  const [markingAllRead, setMarkingAllRead] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsPage, setNotificationsPage] = useState(1);
  

  // Fetch all dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel with proper error handling
      const [
        profileResponse,
        borrowsResponse,
        overdueResponse,
        notificationsResponse,
        unreadResponse,
        summaryResponse,
        paymentResponse
      ] = await Promise.allSettled([
        getProfile(),
        getBorrowRequests(),
        getOverdueBooks(),
        getNotifications(1, 10),
        getUnreadCount(),
        getDashboardSummary(),
        getPaymentHistory()
      ]);

      // Process profile data
      if (profileResponse.status === 'fulfilled' && profileResponse.value?.data?.success) {
        setUserData(profileResponse.value.data.data);
      } else {
        console.warn('Profile fetch failed:', profileResponse.reason);
      }

      // Process borrowed books data
      if (borrowsResponse.status === 'fulfilled' && borrowsResponse.value?.data?.success) {
        const borrowData = borrowsResponse.value.data.data || [];
        setBorrowedBooks(Array.isArray(borrowData) ? borrowData : []);
      } else {
        console.warn('Borrow requests fetch failed:', borrowsResponse.reason);
        setBorrowedBooks([]);
      }

      // Process overdue books data (controller returns { success, count, data: { items: [] } })
      if (overdueResponse.status === 'fulfilled' && overdueResponse.value?.data?.success) {
        const overdueData = overdueResponse.value.data.data;
        if (overdueData && Array.isArray(overdueData.items)) {
          setOverdueBooks(overdueData.items);
        } else {
          setOverdueBooks([]);
        }
      } else {
        console.warn('Overdue books fetch failed:', overdueResponse.reason);
        setOverdueBooks([]);
      }

      // Process notifications data
      if (notificationsResponse.status === 'fulfilled' && notificationsResponse.value?.data?.success) {
        const notifData = notificationsResponse.value.data.data || [];
        setNotifications(Array.isArray(notifData) ? notifData : []);
      } else {
        console.warn('Notifications fetch failed:', notificationsResponse.reason);
        setNotifications([]);
      }

      // Process unread count
      if (unreadResponse.status === 'fulfilled' && unreadResponse.value?.data?.success) {
        setUnreadCount(unreadResponse.value.data.count || 0);
      } else {
        console.warn('Unread count fetch failed:', unreadResponse.reason);
        setUnreadCount(0);
      }

      // Process dashboard summary
      if (summaryResponse.status === 'fulfilled' && summaryResponse.value?.data?.success) {
        setDashboardSummary(summaryResponse.value.data.data);
      } else {
        console.warn('Dashboard summary fetch failed:', summaryResponse.reason);
      }

      // Process payment data for fines
      if (paymentResponse.status === 'fulfilled' && paymentResponse.value?.data?.success) {
        setPaymentData(paymentResponse.value.data);
      } else {
        console.warn('Payment data fetch failed:', paymentResponse.reason);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllNotifications = async (page = 1) => {
    try {
      setNotificationsLoading(true);
      const response = await getNotifications(page, 20);
      
      if (response?.data?.success) {
        const notifData = response.data.data || [];
        if (page === 1) {
          setAllNotifications(Array.isArray(notifData) ? notifData : []);
        } else {
          setAllNotifications(prev => [...prev, ...(Array.isArray(notifData) ? notifData : [])]);
        }
      }
    } catch (error) {
      console.error('Error fetching all notifications:', error);
      showNotification('Failed to load notifications', 'error');
    } finally {
      setNotificationsLoading(false);
    }
  };

  const openNotificationsModal = () => {
    setShowNotificationsModal(true);
    setNotificationsPage(1);
    fetchAllNotifications(1);
  };

  const loadMoreNotifications = () => {
    const nextPage = notificationsPage + 1;
    setNotificationsPage(nextPage);
    fetchAllNotifications(nextPage);
  };

  const refreshDashboard = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
    showNotification('Dashboard refreshed successfully', 'success');
  };

  const handleRenewBook = async (borrowId, bookTitle) => {
    try {
      setRenewLoading(prev => ({ ...prev, [borrowId]: true }));

      const response = await renewBook(borrowId);

      if (response?.data?.success) {
        showNotification(`"${bookTitle}" renewal requested successfully`, 'success');
        // Update the book status locally
        setBorrowedBooks(prev => 
          prev.map(book => 
            book._id === borrowId 
              ? { ...book, status: 'renew_requested' }
              : book
          )
        );
      } else {
        showNotification(response?.data?.message || 'Failed to request book renewal', 'error');
      }
    } catch (error) {
      console.error('Error renewing book:', error);
      const errorMessage = error.response?.data?.message || 'Failed to request book renewal. Please try again.';
      showNotification(errorMessage, 'error');
    } finally {
      setRenewLoading(prev => ({ ...prev, [borrowId]: false }));
      setShowRenewModal(false);
    }
  };

  const confirmRenewal = () => {
    if (bookToRenew) {
      const bookTitle = bookToRenew.book_id?.title || 'Unknown Book';
      handleRenewBook(bookToRenew._id, bookTitle);
    }
  };

  const handleMarkAsRead = async (notificationId, updateModal = false) => {
    try {
      const response = await markNotificationAsRead(notificationId);
      
      if (response?.data?.success) {
        // Update main notifications
        setNotifications(prev =>
          prev.map(notif =>
            notif._id === notificationId ? { ...notif, is_read: true } : notif
          )
        );
        
        // Update modal notifications if needed
        if (updateModal) {
          setAllNotifications(prev =>
            prev.map(notif =>
              notif._id === notificationId ? { ...notif, is_read: true } : notif
            )
          );
        }
        
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      showNotification('Failed to mark notification as read', 'error');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAllRead(true);
      const response = await markAllAsRead();
      
      if (response?.data?.success) {
        setNotifications(prev =>
          prev.map(notif => ({ ...notif, is_read: true }))
        );
        setAllNotifications(prev =>
          prev.map(notif => ({ ...notif, is_read: true }))
        );
        setUnreadCount(0);
        showNotification('All notifications marked as read', 'success');
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      showNotification('Failed to mark all notifications as read', 'error');
    } finally {
      setMarkingAllRead(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Calculate days overdue for overdue books
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

  // Calculate quick stats with proper data structure
  const quickStats = {
    booksIssued: borrowedBooks.filter(book => 
      ['approved', 'issued', 'borrowed', 'renewed'].includes(book.status)
    ).length,
    booksOverdue: overdueBooks.length,
    totalFines: paymentData?.totalOutstandingFines || 0,
    booksReturned: borrowedBooks.filter(book => book.status === 'returned').length,
    totalBooks: borrowedBooks.length,
    pendingRequests: borrowedBooks.filter(book => 
      ['pending', 'requested'].includes(book.status)
    ).length
  };

  // Use dashboard summary if available, otherwise use calculated stats
  const displayStats = dashboardSummary ? {
    booksIssued: dashboardSummary.activeBorrows || quickStats.booksIssued,
    booksOverdue: dashboardSummary.overdueCount || quickStats.booksOverdue,
    totalFines: dashboardSummary.totalOutstandingFines || quickStats.totalFines,
    pendingRequests: dashboardSummary.pendingRequests || quickStats.pendingRequests
  } : quickStats;

  // Format date helper
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

  // Format date with time
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Calculate days remaining or overdue
  const calculateDays = (dueDate, status) => {
    if (!dueDate) return { type: 'unknown', days: 0 };
    
    try {
      const due = new Date(dueDate);
      const today = new Date();
      const diffTime = due - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (status === 'overdue' || diffDays < 0) {
        return { type: 'overdue', days: Math.abs(diffDays) };
      }
      return { type: 'remaining', days: diffDays };
    } catch (error) {
      return { type: 'unknown', days: 0 };
    }
  };

  // Get status badge for books
  const getStatusBadge = (book) => {
    const dueDate = book.dueDate ? new Date(book.dueDate) : null;
    const today = new Date();
    const timeDiff = dueDate ? dueDate.getTime() - today.getTime() : 0;
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    switch (book.status) {
      case 'renew_requested':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <FaClock className="mr-1" />
            Renewal Requested
          </span>
        );
      case 'requested':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <FaClock className="mr-1" />
            Pending Approval
          </span>
        );
      case 'approved':
      case 'issued':
      case 'borrowed':
      case 'renewed':
        if (dueDate && daysDiff < 0) {
          return (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <FaExclamationTriangle className="mr-1" />
              {Math.abs(daysDiff)} days overdue
            </span>
          );
        }
        if (dueDate && daysDiff <= 3) {
          return (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <FaClock className="mr-1" />
              Due in {daysDiff} days
            </span>
          );
        }
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FaCheckCircle className="mr-1" />
            Active
          </span>
        );
      case 'returned':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <FaCheckCircle className="mr-1" />
            Returned
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <FaClock className="mr-1" />
            Pending Approval
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {book.status?.replace('_', ' ') || 'Unknown'}
          </span>
        );
    }
  };

  // Get notification type icon and color
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'overdue':
        return { icon: FaExclamationTriangle, color: 'text-red-500' };
      case 'due_soon':
        return { icon: FaClock, color: 'text-yellow-500' };
      case 'approved':
        return { icon: FaCheckCircle, color: 'text-green-500' };
      case 'returned':
        return { icon: FaCheckCircle, color: 'text-blue-500' };
      default:
        return { icon: FaBell, color: 'text-gray-500' };
    }
  };

  // Enhanced book card component
  const renderBookCard = (borrow) => {
    const book = borrow.book_id || {};
    const dayInfo = calculateDays(borrow.dueDate, borrow.status);
    const isRenewing = renewLoading[borrow._id];
    const canRenew = !['renew_requested', 'requested', 'returned', 'pending'].includes(borrow.status) && 
                     dayInfo.type !== 'overdue';

    return (
      <div key={borrow._id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start space-x-4">
          {/* Book Cover */}
          <div className="flex-shrink-0">
            {book.coverImagePath ? (
              <img
                src={book.coverImagePath}
                alt={book.title || 'Book'}
                className="w-16 h-24 object-cover rounded shadow-sm"
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextElementSibling) {
                    e.target.nextElementSibling.style.display = 'flex';
                  }
                }}
              />
            ) : null}
            <PlaceholderBookCover
              title={book.title}
              className={`w-16 h-24 ${book.coverImagePath ? 'hidden' : ''}`}
            />
          </div>

          {/* Book Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {book.title || 'Unknown Title'}
            </h3>
            <p className="text-sm text-gray-600 truncate">
              by {book.author || 'Unknown Author'}
            </p>
            
            {/* Status Badge */}
            <div className="mt-2">
              {getStatusBadge(borrow)}
            </div>

            {/* Dates */}
            <div className="mt-2 flex justify-between text-xs text-gray-500">
              <span>Issued: {formatDate(borrow.issueDate || borrow.requestDate)}</span>
              <span>Due: {formatDate(borrow.dueDate)}</span>
            </div>

            {/* Genre if available */}
            {book.genre && (
              <p className="text-xs text-gray-500 mt-1">
                Genre: {book.genre}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex-shrink-0 text-right">
            {dayInfo.type === 'remaining' && dayInfo.days >= 0 ? (
              <div className="flex items-center text-green-600 mb-2">
                <FaCheckCircle className="h-4 w-4 mr-1" />
                <span className="text-xs font-medium">{dayInfo.days} days left</span>
              </div>
            ) : dayInfo.type === 'overdue' ? (
              <div className="flex items-center text-red-600 mb-2">
                <FaExclamationTriangle className="h-4 w-4 mr-1" />
                <span className="text-xs font-medium">{dayInfo.days} days overdue</span>
              </div>
            ) : null}

            {/* Renew Button */}
            {canRenew && (
              <button
                onClick={() => {
                  setBookToRenew(borrow);
                  setShowRenewModal(true);
                }}
                disabled={isRenewing}
                className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                {isRenewing ? (
                  <>
                    <FiLoader className="animate-spin w-3 h-3" />
                    Renewing...
                  </>
                ) : (
                  <>
                    <FaRedo className="w-3 h-3" />
                    Renew
                  </>
                )}
              </button>
            )}
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
          <FiLoader className="animate-spin w-12 h-12 text-purple-600" />
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-700">Loading Dashboard</h2>
            <p className="text-gray-500">Please wait while we fetch your data...</p>
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
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transition-all duration-300 ${
          notification.type === 'success'
            ? 'bg-green-100 text-green-800 border border-green-200'
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <FiCheck className="w-5 h-5" />
            ) : (
              <FiAlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 md:ml-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header with refresh */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {userData?.name || 'User'}!
                </h1>
                
              </div>
              <button
                onClick={refreshDashboard}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
              >
                <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FaBook className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Books Issued</p>
                    <p className="text-2xl font-bold text-gray-900">{displayStats.booksIssued || 0}</p>
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
                    <p className="text-2xl font-bold text-gray-900">{displayStats.booksOverdue || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Outstanding Fines</p>
                    <p className="text-2xl font-bold text-gray-900">₹{(displayStats.totalFines || 0).toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FaBell className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Unread Notifications</p>
                    <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Section */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 rounded-lg shadow-sm mb-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Discover New Books</h2>
                  <p className="text-blue-100 mb-4">Explore our vast collection of books across all categories</p>
                </div>
                <div>
                  <NavLink
                    to="/user/browse"
                    className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
                  >
                    <FaBookOpen className="mr-2 h-5 w-5" />
                    Browse Books
                    <FaArrowRight className="ml-2 h-4 w-4" />
                  </NavLink>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Currently Issued Books */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Currently Issued Books</h2>
                  <NavLink
                    to="/user/mybooks"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View All
                  </NavLink>
                </div>
                <div className="space-y-4">
                  {borrowedBooks
                    .filter(book => ['approved', 'issued', 'borrowed', 'renewed'].includes(book.status))
                    .slice(0, 4)
                    .map((borrow) => renderBookCard(borrow))}

                  {borrowedBooks                    .filter(book => ['approved', 'issued', 'borrowed', 'renewed'].includes(book.status))
                    .length === 0 && (
                    <div className="text-center py-8">
                      <FaBookOpen className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No books currently issued</h3>
                      <p className="mt-1 text-sm text-gray-500">You don't have any books issued at the moment.</p>
                      <div className="mt-6">
                        <NavLink
                          to="/user/browse"
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <FaSearch className="-ml-1 mr-2 h-5 w-5" />
                          Browse Books
                        </NavLink>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Overdue Books */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Overdue Books</h2>
                  {overdueBooks.length > 0 && (
                    <NavLink
                      to="/user/mybooks"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View All
                    </NavLink>
                  )}
                </div>
                <div className="space-y-4">
                  {overdueBooks.slice(0, 4).map((borrow) => {
                    const daysOverdue = calculateDaysOverdue(borrow.dueDate);
                    return (
                      <div key={borrow._id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-4">
                          {/* Book Cover */}
                          <div className="flex-shrink-0">
                            {borrow.book_id?.coverImagePath ? (
                              <img
                                src={borrow.book_id.coverImagePath}
                                alt={borrow.book_id.title || 'Book'}
                                className="w-16 h-24 object-cover rounded shadow-sm"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  if (e.target.nextElementSibling) {
                                    e.target.nextElementSibling.style.display = 'flex';
                                  }
                                }}
                              />
                            ) : null}
                            <PlaceholderBookCover
                              title={borrow.book_id?.title}
                              className={`w-16 h-24 ${borrow.book_id?.coverImagePath ? 'hidden' : ''}`}
                            />
                          </div>

                          {/* Book Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {borrow.book_id?.title || 'Unknown Title'}
                            </h3>
                            <p className="text-sm text-gray-600 truncate">
                              by {borrow.book_id?.author || 'Unknown Author'}
                            </p>
                            
                            {/* Status Badge */}
                            <div className="mt-2">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <FaExclamationTriangle className="mr-1" />
                                {daysOverdue} days overdue
                              </span>
                            </div>

                            {/* Dates */}
                            <div className="mt-2 flex justify-between text-xs text-gray-500">
                              <span>Due: {formatDate(borrow.dueDate)}</span>
                              <span>Fine: ₹{(daysOverdue * 5).toFixed(2)}</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex-shrink-0 text-right">
                            <button
                              onClick={() => {
                                setBookToRenew(borrow);
                                setShowRenewModal(true);
                              }}
                              disabled={renewLoading[borrow._id]}
                              className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                            >
                              {renewLoading[borrow._id] ? (
                                <>
                                  <FiLoader className="animate-spin w-3 h-3" />
                                  Renewing...
                                </>
                              ) : (
                                <>
                                  <FaRedo className="w-3 h-3" />
                                  Renew
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {overdueBooks.length === 0 && (
                    <div className="text-center py-8">
                      <FaCheckCircle className="mx-auto h-12 w-12 text-green-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No overdue books</h3>
                      <p className="mt-1 text-sm text-gray-500">You don't have any overdue books. Keep it up!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Notifications */}
            <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Notifications</h2>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleMarkAllAsRead}
                    disabled={unreadCount === 0 || markingAllRead}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {markingAllRead ? (
                      <span className="flex items-center gap-1">
                        <FiLoader className="animate-spin w-3 h-3" />
                        Marking all...
                      </span>
                    ) : (
                      'Mark All as Read'
                    )}
                  </button>
                  <button
                    onClick={openNotificationsModal}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View All
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                {notifications.length > 0 ? (
                  notifications.slice(0, 5).map((notification) => {
                    const { icon: Icon, color } = getNotificationIcon(notification.type);
                    return (
                      <div
                        key={notification._id}
                        className={`p-4 rounded-lg border ${notification.is_read ? 'bg-gray-50' : 'bg-blue-50'} hover:shadow-sm transition-shadow cursor-pointer`}
                        onClick={() => handleMarkAsRead(notification._id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`flex-shrink-0 mt-1 ${color}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {formatDateTime(notification.createdAt)}
                            </p>
                          </div>
                          {!notification.is_read && (
                            <div className="flex-shrink-0">
                              <span className="inline-block h-2 w-2 rounded-full bg-blue-500"></span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <FaBell className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
                    <p className="mt-1 text-sm text-gray-500">You don't have any notifications yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Renew Book Modal */}
      {showRenewModal && bookToRenew && (
        <div className="fixed inset-0 bg-gradient-to-br from-gray-800/60 via-gray-900/60 to-black/70 backdrop-blur-md  flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Confirm Renewal</h3>
              <button
                onClick={() => setShowRenewModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to request renewal for{' '}
                <span className="font-semibold">{bookToRenew.book_id?.title || 'this book'}</span>?
              </p>
              <div className="bg-blue-50 p-4 rounded-md">
                <div className="flex items-center gap-2 text-blue-800">
                  <FaInfoCircle className="flex-shrink-0" />
                  <p className="text-sm">
                    Renewal requests must be approved by the librarian. You can only renew a book once.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRenewModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmRenewal}
                disabled={renewLoading[bookToRenew._id]}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {renewLoading[bookToRenew._id] ? (
                  <span className="flex items-center gap-2">
                    <FiLoader className="animate-spin w-4 h-4" />
                    Processing...
                  </span>
                ) : (
                  'Confirm Renewal'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      {showNotificationsModal && (
        <div className="fixed inset-0 bg-gradient-to-br from-gray-800/60 via-gray-900/60 to-black/70 backdrop-blur-md  flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-semibold text-gray-900">All Notifications</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={unreadCount === 0 || markingAllRead}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {markingAllRead ? (
                    <span className="flex items-center gap-1">
                      <FiLoader className="animate-spin w-3 h-3" />
                      Marking all...
                    </span>
                  ) : (
                    'Mark All as Read'
                  )}
                </button>
                <button
                  onClick={() => setShowNotificationsModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {allNotifications.length > 0 ? (
                <div className="space-y-3">
                  {allNotifications.map((notification) => {
                    const { icon: Icon, color } = getNotificationIcon(notification.type);
                    return (
                      <div
                        key={notification._id}
                        className={`p-4 rounded-lg border ${notification.is_read ? 'bg-gray-50' : 'bg-blue-50'} hover:shadow-sm transition-shadow cursor-pointer`}
                        onClick={() => handleMarkAsRead(notification._id, true)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`flex-shrink-0 mt-1 ${color}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {formatDateTime(notification.createdAt)}
                            </p>
                          </div>
                          {!notification.is_read && (
                            <div className="flex-shrink-0">
                              <span className="inline-block h-2 w-2 rounded-full bg-blue-500"></span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaBell className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
                  <p className="mt-1 text-sm text-gray-500">You don't have any notifications yet.</p>
                </div>
              )}
              {notificationsLoading && (
                <div className="flex justify-center py-4">
                  <FiLoader className="animate-spin w-6 h-6 text-blue-600" />
                </div>
              )}
            </div>
            <div className="border-t p-4 flex justify-center">
              <button
                onClick={loadMoreNotifications}
                disabled={notificationsLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {notificationsLoading ? (
                  <>
                    <FiLoader className="animate-spin w-4 h-4" />
                    Loading...
                  </>
                ) : (
                  <>
                    <FaDownload className="w-4 h-4" />
                    Load More
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;