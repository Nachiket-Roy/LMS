import React, { useState, useEffect } from 'react';
import {
  FaBook, FaBell, FaCheck, FaTimes, FaEye, FaClock,
  FaExclamationTriangle, FaUsers, FaCalendarAlt,
  FaEnvelope, FaFilter, FaSearch, FaSync, FaUndo
} from 'react-icons/fa';

// Import API functions (assuming they're available)
import {
  getAllBorrowRequests,
  updateBorrowStatus,
  processRenewalRequest,
  sendNotification,
  sendOverdueReminders,
  sendDueDateReminders
} from '../../services/librarianApi';

const BorrowNotificationPage = () => {
  const [borrowRequests, setBorrowRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [notification, setNotification] = useState({
    type: 'individual',
    recipients: [],
    subject: '',
    message: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Load borrow requests on component mount
  useEffect(() => {
    loadBorrowRequests();
  }, []);

  const loadBorrowRequests = async () => {
    setLoading(true);
    try {
      const response = await getAllBorrowRequests();
      console.log("📥 Borrow Requests Response:", response.data);

      setBorrowRequests(Array.isArray(response.data.data) ? response.data.data : []);

    } catch (error) {
      setErrorMessage('Failed to load borrow requests');
      console.error('Error loading borrow requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBorrowStatusUpdate = async (requestId, status) => {
    try {
      await updateBorrowStatus(requestId, status);
      let message = '';
      switch (status) {
        case 'approved':
          message = 'Borrow request approved successfully';
          break;
        case 'rejected':
          message = 'Borrow request rejected successfully';
          break;
        case 'returned':
          message = 'Book marked as returned successfully';
          break;
        default:
          message = `Borrow request ${status.toLowerCase()} successfully`;
      }
      setSuccessMessage(message);
      loadBorrowRequests(); // Reload data
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(`Failed to ${status.toLowerCase()} borrow request`);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleRenewalRequest = async (requestId, decision) => {
    try {
      await processRenewalRequest(requestId, decision);
      setSuccessMessage(`Renewal request ${decision.toLowerCase()} successfully`);
      loadBorrowRequests();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(`Failed to process renewal request`);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const sendCustomNotification = async () => {
    try {
      await sendNotification(notification);
      setSuccessMessage('Notification sent successfully');
      setShowNotificationPopup(false);
      setNotification({
        type: 'individual',
        recipients: [],
        subject: '',
        message: ''
      });
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Failed to send notification');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const sendBulkNotifications = async (type) => {
    try {
      if (type === 'overdue') {
        await sendOverdueReminders();
        setSuccessMessage('Overdue reminders sent successfully');
      } else if (type === 'due') {
        await sendDueDateReminders();
        setSuccessMessage('Due date reminders sent successfully');
      }
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(`Failed to send ${type} reminders`);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  // Filter borrow requests
  const filteredRequests = borrowRequests.filter(request => {
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesSearch = !searchTerm ||
      request.user_id?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.book_id?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.user_id?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Get counts for different statuses
  const getStatusCounts = () => {
    return {
      requested: borrowRequests.filter(req => req.status === 'requested').length,
      approved: borrowRequests.filter(req => req.status === 'approved').length,
      returned: borrowRequests.filter(req => req.status === 'returned').length,
      rejected: borrowRequests.filter(req => req.status === 'rejected').length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className=" p-6 rounded-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Borrow & Notification Management</h2>
            <p className="opacity-90">Manage borrow requests and send notifications</p>
          </div>
          <div className="flex space-x-4">
            <FaBook className="text-4xl opacity-80" />
            <FaBell className="text-4xl opacity-80" />
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl flex items-center">
          <FaCheck className="w-5 h-5 mr-2" />
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl flex items-center">
          <FaExclamationTriangle className="w-5 h-5 mr-2" />
          {errorMessage}
        </div>
      )}

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-orange-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FaClock className="text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Requested</p>
              <p className="text-2xl font-bold text-orange-600">{statusCounts.requested}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-green-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FaCheck className="text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{statusCounts.approved}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-blue-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaUndo className="text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Returned</p>
              <p className="text-2xl font-bold text-blue-600">{statusCounts.returned}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-red-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <FaTimes className="text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{statusCounts.rejected}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6">
          {/* Quick Notification Actions */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FaBell className="mr-2 text-purple-600" />
              Quick Notifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => sendBulkNotifications('overdue')}
                className="p-3 bg-red-100 border border-red-200 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
              >
                <FaExclamationTriangle className="text-red-600 mr-2" />
                <span className="text-sm font-medium text-red-900">Overdue Reminders</span>
              </button>

              <button
                onClick={() => sendBulkNotifications('due')}
                className="p-3 bg-yellow-100 border border-yellow-200 rounded-lg hover:bg-yellow-200 transition-colors flex items-center justify-center"
              >
                <FaClock className="text-yellow-600 mr-2" />
                <span className="text-sm font-medium text-yellow-900">Due Date Reminders</span>
              </button>

              <button
                onClick={() => setShowNotificationPopup(true)}
                className="p-3 bg-blue-100 border border-blue-200 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center"
              >
                <FaEnvelope className="text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-900">Custom Notification</span>
              </button>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center">
                <FaUsers className="text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">{filteredRequests.length} Requests</span>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by user, book, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="requested">Requested</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="returned">Returned</option>
              </select>
              <button
                onClick={loadBorrowRequests}
                className="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                disabled={loading}
              >
                <FaSync className={`${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Borrow Requests List */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading borrow requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-8">
              <FaBook className="mx-auto text-6xl text-gray-300 mb-4" />
              <p className="text-gray-600">No borrow requests found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <BorrowRequestCard
                  key={request.id || request._id}
                  request={request}
                  onStatusUpdate={handleBorrowStatusUpdate}
                  onRenewalProcess={handleRenewalRequest}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Custom Notification Popup */}
      {showNotificationPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <FaEnvelope className="mr-2 text-blue-600" />
                  Custom Notification
                </h3>
                <button
                  onClick={() => setShowNotificationPopup(false)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notification Type
                  </label>
                  <select
                    value={notification.type}
                    onChange={(e) => setNotification({ ...notification, type: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="individual">Individual</option>
                    <option value="broadcast">Broadcast to All</option>
                    <option value="group">Group</option>
                  </select>
                </div>

                {notification.type === 'individual' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recipients (comma-separated emails)
                    </label>
                    <input
                      type="text"
                      placeholder="user1@email.com, user2@email.com"
                      value={notification.recipients.join(', ')}
                      onChange={(e) => setNotification({
                        ...notification,
                        recipients: e.target.value.split(',').map(email => email.trim())
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Notification subject"
                    value={notification.subject}
                    onChange={(e) => setNotification({ ...notification, subject: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Your notification message"
                    value={notification.message}
                    onChange={(e) => setNotification({ ...notification, message: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowNotificationPopup(false)}
                    className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={sendCustomNotification}
                    disabled={!notification.subject || !notification.message}
                    className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Send Notification
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Borrow Request Card Component
const BorrowRequestCard = ({ request, onStatusUpdate, onRenewalProcess }) => {
  const [showDetails, setShowDetails] = useState(false);
  const requestId = request._id; // Always use this if your DB is MongoDB

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'requested': return 'text-orange-600 bg-orange-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'returned': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-4">
            <div>
              <h4 className="font-semibold text-gray-900">
                {request.user_id?.name || 'Unknown User'}
              </h4>
              <p className="text-sm text-gray-600">
                {request.book_id?.title || 'Unknown Book'}
              </p>
              <p className="text-xs text-gray-500">
                Requested: {new Date(request.createdAt || Date.now()).toLocaleDateString()}
              </p>
              {request.status === 'approved' && request.dueDate && isOverdue(request.dueDate) && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-1">
                  <FaExclamationTriangle className="w-3 h-3 mr-1" />
                  Overdue
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
            {request.status || 'Requested'}
          </span>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaEye />
          </button>
        </div>
      </div>

      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm"><strong>User Email:</strong> {request.user_id?.email || 'N/A'}</p>
              <p className="text-sm"><strong>Book Author:</strong> {request.book_id?.author || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm"><strong>Issue Date:</strong> {request.issueDate ? new Date(request.issueDate).toLocaleDateString() : 'N/A'}</p>
              <p className="text-sm">
                <strong>Due Date:</strong> 
                <span className={request.dueDate && isOverdue(request.dueDate) ? 'text-red-600 font-semibold' : ''}>
                  {request.dueDate ? new Date(request.dueDate).toLocaleDateString() : 'N/A'}
                </span>
              </p>
              <p className="text-sm"><strong>Request Type:</strong> {request.type || 'Borrow'}</p>
            </div>
          </div>

          {/* Action buttons based on status */}
          <div className="flex space-x-2 flex-wrap gap-2">
            {request.status === 'requested' && (
              <>
                <button
                  onClick={() => onStatusUpdate(requestId, 'approved')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center"
                >
                  <FaCheck className="mr-1" /> Approve
                </button>
                <button
                  onClick={() => onStatusUpdate(requestId, 'rejected')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center"
                >
                  <FaTimes className="mr-1" /> Reject
                </button>
              </>
            )}

            {request.status === 'approved' && (
              <button
                onClick={() => onStatusUpdate(requestId, 'returned')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center"
              >
                <FaUndo className="mr-1" /> Mark as Returned
              </button>
            )}

            {request.type === 'renewal' && request.status === 'requested' && (
              <>
                <button
                  onClick={() => onRenewalProcess(request.id || request._id, 'approved')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center"
                >
                  <FaCheck className="mr-1" /> Approve Renewal
                </button>
                <button
                  onClick={() => onRenewalProcess(request.id || request._id, 'rejected')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center"
                >
                  <FaTimes className="mr-1" /> Reject Renewal
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowNotificationPage;