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
  FaCog,
  FaTimes,
  FaCheck,
  FaQuestion,
  FaUserTie,
  FaQuestionCircle,
} from 'react-icons/fa';
import { FiLoader, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import {
  getAllQueries,
  getAdminDashboard,
  getOverdueReport,
  getAllPayments,
  getProfile
} from '../../services/adminApi';

const Admin = () => {
  // State management
  const [dashboardData, setDashboardData] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null); // Add admin profile state
  const [quickStats, setQuickStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalLibrarians: 0,
    totalBorrows: 0,
    activeBorrows: 0,
    overdueBorrows: 0,
    totalFines: 0,
    totalQueries: 0,
  });
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch admin profile data
      try {
        const profileResponse = await getProfile();
        console.log('Admin Profile Response:', profileResponse);
        
        if (profileResponse?.data?.success) {
          setAdminProfile(profileResponse.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch admin profile:", err);
      }

      // Fetch admin dashboard data
      const adminDashboardResponse = await getAdminDashboard();
      console.log('Admin Dashboard Response:', adminDashboardResponse);

      if (adminDashboardResponse?.data?.success) {
        const data = adminDashboardResponse.data.data;

        // Handle the correct response structure
        setQuickStats(prevStats => ({
          ...prevStats,
          totalUsers: data.users?.total || 0,
          totalLibrarians: data.librarians?.total || 0,
          totalBorrows: data.borrows?.total || 0,
          activeBorrows: data.borrows?.active || 0,
          overdueBorrows: data.borrows?.overdue || 0,
          totalFines: data.finances?.totalFines || 0,
        }));

        setDashboardData(data);
      } else {
        setError(adminDashboardResponse?.data?.message || 'Failed to fetch admin dashboard data.');
      }

      // Fetch overdue reports
      try {
        const overdueReportResponse = await getOverdueReport();
        console.log('Overdue Report Response:', overdueReportResponse);

        if (overdueReportResponse?.data?.success) {
          setOverdueBooks(Array.isArray(overdueReportResponse.data.data) ? overdueReportResponse.data.data : []);
        }
      } catch (err) {
        console.error("Failed to fetch overdue report:", err);
      }

      // Fetch all payments for recent transactions
      try {
        const allPaymentsResponse = await getAllPayments();
        console.log('All Payments Response:', allPaymentsResponse);

        if (allPaymentsResponse?.data?.success) {
          const paymentsData = allPaymentsResponse.data.data;
          setRecentTransactions(Array.isArray(paymentsData) ? paymentsData : []);
        }
      } catch (err) {
        console.error("Failed to fetch all payments:", err);
      }

      // Fetch all queries
      try {
        const allQueriesResponse = await getAllQueries();
        console.log('All Queries Response:', allQueriesResponse);

        if (allQueriesResponse?.data?.success) {
          const queriesArray = Array.isArray(allQueriesResponse.data.data) ? allQueriesResponse.data.data : [];
          setQueries(queriesArray);
          setQuickStats(prevStats => ({
            ...prevStats,
            totalQueries: queriesArray.length,
          }));
        }

      } catch (err) {
        console.error("Failed to fetch all queries:", err);
      }

    } catch (err) {
      console.error("Error fetching admin dashboard data:", err);
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

  const formatCurrency = (amount) => {
    return `₹${(amount || 0).toFixed(2)}`;
  };

  // Helper function to get admin name
  const getAdminName = () => {
    if (adminProfile?.name) return adminProfile.name;
    if (adminProfile?.username) return adminProfile.username;
    if (adminProfile?.email) return adminProfile.email.split('@')[0];
    return 'Admin';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <FiLoader className="animate-spin w-12 h-12 text-blue-600" />
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-700">Loading Admin Dashboard</h2>
            <p className="text-gray-500">Please wait while we fetch the data...</p>
          </div>
        </div>
      </div>
    );
  }

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {getAdminName()}!
            </h1>
            <p className="text-gray-600 mt-1">Overview of library management system</p>
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

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaUsers className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{quickStats.totalUsers}</p>
                <div className="flex text-xs text-gray-500 mt-1">
                </div>
              </div>
            </div>
          </div>

          {/* Total Librarians */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FaUserTie className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Librarians</p>
                <p className="text-2xl font-bold text-gray-900">{quickStats.totalLibrarians}</p>
              </div>
            </div>
          </div>

          {/* Book Borrows */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FaBook className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Borrows</p>
                <p className="text-2xl font-bold text-gray-900">{quickStats.totalBorrows}</p>
                <div className="flex text-xs text-gray-500 mt-1">
                  <span className="text-green-600">Active: {quickStats.activeBorrows}</span>
                  <span className="mx-1">•</span>
                  <span className="text-red-600">Overdue: {quickStats.overdueBorrows}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Total Fines */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <FaDollarSign className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Fines</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(quickStats.totalFines)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-8 rounded-xl shadow-sm mb-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold mb-2">Admin Actions</h2>
              <p className="text-blue-100">Quick access to key administrative functions</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
              <NavLink
                to="/admin/user"
                className="flex flex-col items-center justify-center bg-white text-blue-600 px-6 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
              >
                <FaUsers className="h-6 w-6 mb-2" />
                <span className="text-sm">Manage Users</span>
              </NavLink>
              <NavLink
                to="/admin/fine"
                className="flex flex-col items-center justify-center bg-white text-blue-600 px-6 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
              >
                <FaUserTie className="h-6 w-6 mb-2" />
                <span className="text-sm">Fine & Payment</span>
              </NavLink>
              <NavLink
                to="/admin/query"
                className="flex flex-col items-center justify-center bg-white text-blue-600 px-6 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
              >
                <FaQuestion className="h-6 w-6 mb-2" />
                <span className="text-sm">Query</span>
              </NavLink>
              <NavLink
                to="/admin/setting"
                className="flex flex-col items-center justify-center bg-white text-blue-600 px-6 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
              >
                <FaCog className="h-6 w-6 mb-2" />
                <span className="text-sm">Setting</span>
              </NavLink>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Overdue Books */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FaExclamationTriangle className="h-5 w-5 text-red-500" />
                Overdue Books
              </h2>
              
            </div>
            <div className="space-y-4">
              {overdueBooks.length > 0 ? (
                overdueBooks.slice(0, 3).map((book) => (
                  <div key={book._id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">
                          {book.book_id?.title || 'Unknown Book'}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">
                          Borrowed by: {book.user_id?.name || book.user_id?.username || 'Unknown User'}
                        </p>
                        <p className="text-xs text-red-600 font-medium">
                          Due: {formatDate(book.dueDate)} • Overdue by {book.overdueDays || 0} days
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-red-600">
                          Fine: {formatCurrency(book.fineAmount)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <FaCheckCircle className="h-16 w-16 mx-auto mb-4 text-green-300" />
                  <p className="text-lg font-medium text-gray-600">No overdue books</p>
                  <p className="text-sm text-gray-500">All books are returned on time!</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Queries */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FaQuestion className="h-5 w-5 text-purple-500" />
                Recent Queries
              </h2>
              <NavLink
                to="/admin/query"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
              >
                View All <FaArrowRight className="h-3 w-3" />
              </NavLink>
            </div>
            <div className="space-y-4">
              {queries.length > 0 ? (
                queries.slice(0, 3).map((query) => (
                  <div key={query._id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">
                          {query.subject || 'No Subject'}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {query.message}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>From: {query.user_id?.name || query.user_id?.username || 'Unknown User'}</span>
                          <span>•</span>
                          <span>{formatDate(query.createdAt)}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${query.status === 'resolved'
                          ? 'bg-green-100 text-green-800'
                          : query.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                          }`}>
                          {query.status || 'pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <FaQuestion className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium text-gray-600">No recent queries</p>
                  <p className="text-sm text-gray-500">All user questions have been addressed</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FaHistory className="h-5 w-5 text-green-500" />
              Recent Transactions
            </h2>
            <NavLink
              to="/admin/fine"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
            >
              View All <FaArrowRight className="h-3 w-3" />
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
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentTransactions.length > 0 ? (
                  recentTransactions.slice(0, 5).map((transaction) => (
                    <tr key={transaction._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transaction.user_id?.name || transaction.user_id?.username || 'Unknown User'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${transaction.type === 'fine'
                          ? 'bg-red-100 text-red-800'
                          : transaction.type === 'membership'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                          }`}>
                          {transaction.type || 'payment'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(transaction.paymentDate || transaction.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 py-1 text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Completed
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-gray-500">
                      <FaHistory className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium text-gray-600">No recent transactions</p>
                      <p className="text-sm text-gray-500">Transaction history will appear here</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;