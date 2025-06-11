import { useState, useEffect } from 'react';
import {
  FaBook,
  FaBookOpen,
  FaHeart,
  FaHistory,
  FaRedo,
  FaCalendarAlt,
  FaClock,
  FaExclamationTriangle,
  FaCheckCircle,
  FaSearch,
  FaFilter,
  FaEye,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaTh,
  FaList,
  FaDownload,
  FaShareAlt,
  FaTimes,
  FaPlus,
  FaBookmark,
  FaTag,
  FaTimesCircle,
  FaSpinner
} from 'react-icons/fa';

// CSS-based placeholder component that works everywhere
const PlaceholderBookCover = ({ title, className }) => (
  <div className={`${className} bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-center p-2 rounded shadow-md`}>
    <div className="text-xs leading-tight break-words">
      {title ? (title.length > 15 ? title.substring(0, 15) + '...' : title) : 'Book'}
    </div>
  </div>
);

// Import your API functions - replace with your actual import paths
import {
  getBorrowRequests,
  renewBook,
  getOverdueBooks,
  getReadingHistory,
  getPaymentHistory
} from '../../services/userApi'; // Adjust path as needed

const MyBooksPage = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [bookToRenew, setBookToRenew] = useState(null);
  const [renewLoading, setRenewLoading] = useState(false);

  // Data states
  const [currentBooks, setCurrentBooks] = useState([]);
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [readingHistory, setReadingHistory] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Load data on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const loadAllData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [borrowsRes, overdueRes, historyRes, paymentsRes] = await Promise.allSettled([
        getBorrowRequests(), // Get all borrow requests
        getOverdueBooks(), // Get overdue books
        getReadingHistory(), // Get reading history
        getPaymentHistory() // Get payment history
      ]);

      // Process borrow requests - filter for current books
      if (borrowsRes.status === 'fulfilled') {
        const allBorrows = borrowsRes.value.data?.data || [];
        // Filter current books (not returned) - matching your backend statuses
        const current = allBorrows.filter(book =>
          ['approved', 'issued', 'borrowed', 'renewed', 'renew_requested', 'requested'].includes(book.status)
        );
        setCurrentBooks(current);
      } else {
        console.error('Failed to load borrow requests:', borrowsRes.reason);
      }

      // Process overdue books
      if (overdueRes.status === 'fulfilled') {
        setOverdueBooks(overdueRes.value.data?.data || []);
      } else {
        console.error('Failed to load overdue books:', overdueRes.reason);
      }

      // Process reading history
      if (historyRes.status === 'fulfilled') {
        setReadingHistory(historyRes.value.data?.data || []);
      } else {
        console.error('Failed to load reading history:', historyRes.reason);
      }

      // Process payments
      if (paymentsRes.status === 'fulfilled') {
        setPaymentHistory(paymentsRes.value.data?.data || []);
      } else {
        console.error('Failed to load payment history:', paymentsRes.reason);
      }

    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load library data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRenewBook = async (book) => {
    setRenewLoading(true);

    // Optimistically update UI
    setCurrentBooks(prevBooks =>
      prevBooks.map(b =>
        b._id === book._id ? { ...b, status: 'renew_requested' } : b
      )
    );

    try {
      const response = await renewBook(book._id);

      // Log the full response for debugging
      console.log('Renewal API Response:', response);

      if (!response?.success) {
        // Handle cases where response.message is missing
        const errorMsg = response?.message || 'Renewal request submitted (pending approval)';
        console.warn('Renewal submission note:', errorMsg);
      }

      // Silently refresh data (no UI message)
      await loadAllData();
    } catch (err) {
      console.error('Renewal failed:', err);

      // Only show network errors to the user
      if (err.message === "Network Error") {
        setError("Network issue. Please check your connection.");
      }

      // Revert optimistic update
      setCurrentBooks(prevBooks =>
        prevBooks.map(b =>
          b._id === book._id ? { ...b, status: book.status } : b
        )
      );
    } finally {
      setRenewLoading(false);
      setShowRenewModal(false);
    }
  };
  const confirmRenewal = () => {
    if (bookToRenew) {
      handleRenewBook(bookToRenew);
    }
  };

  const renderStars = (rating) => {
    if (!rating) return <span className="text-gray-400 text-sm">Not rated</span>;

    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300" />);
    }

    return (
      <div className="flex items-center">
        {stars}
        <span className="ml-1 text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  };

  const getStatusBadge = (book) => {
    const dueDate = new Date(book.dueDate);
    const today = new Date();
    const timeDiff = dueDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    // Handle different statuses from your backend
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
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <FaClock className="mr-1" />
            Renewal Requested
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FaCheckCircle className="mr-1" />
            Approved
          </span>
        );
      case 'issued':
      case 'borrowed':
      case 'renewed':
        if (daysDiff < 0) {
          return (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <FaExclamationTriangle className="mr-1" />
              {Math.abs(daysDiff)} days overdue
            </span>
          );
        }
        if (daysDiff <= 3) {
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
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {book.status}
          </span>
        );
    }
  };

  const getHistoryStatusColor = (status) => {
    switch (status) {
      case 'returned': return 'text-green-600 bg-green-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getHistoryStatusIcon = (status) => {
    switch (status) {
      case 'returned': return <FaCheckCircle className="w-4 h-4" />;
      case 'overdue': return <FaExclamationTriangle className="w-4 h-4" />;
      default: return <FaBook className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCurrentBooks = () => {
    const safeCurrent = Array.isArray(currentBooks) ? currentBooks : [];
    const safeOverdue = Array.isArray(overdueBooks) ? overdueBooks : [];

    const allCurrent = [...safeCurrent, ...safeOverdue];

    // Remove duplicates based on _id
    const uniqueBooks = allCurrent.filter((book, index, self) =>
      index === self.findIndex(b => b._id === book._id)
    );

    return uniqueBooks;
  };


  const filteredBooks = () => {
    let books = activeTab === 'current' ? getCurrentBooks() : readingHistory;

    if (searchTerm) {
      books = books.filter(book =>
        book.book_id?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.book_id?.author?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all' && activeTab === 'current') {
      books = books.filter(book => {
        if (filterStatus === 'overdue') {
          const dueDate = new Date(book.dueDate);
          return dueDate < new Date();
        }
        return book.status === filterStatus;
      });
    }

    return books;
  };

  const renderBookCard = (book) => {
    const isGridView = viewMode === 'grid';
    const bookInfo = book.book_id || {};

    return (
      <div key={book._id} className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 ${isGridView ? 'p-4' : 'p-4 flex items-start space-x-4'
        }`}>
        <div className={`${isGridView ? 'mb-4' : 'flex-shrink-0'}`}>
          {bookInfo.coverImagePath ? (
            <img
              src={bookInfo.coverImagePath}
              alt={bookInfo.title || 'Book'}
              className={`rounded shadow-sm ${isGridView ? 'w-full h-48 object-cover' : 'w-16 h-24 object-cover'}`}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <PlaceholderBookCover
            title={bookInfo.title}
            className={`${isGridView ? 'w-full h-48' : 'w-16 h-24'} ${bookInfo.coverImagePath ? 'hidden' : ''}`}
          />
        </div>

        <div className={`${isGridView ? '' : 'flex-1 min-w-0'}`}>
          <h3 className={`font-semibold text-gray-900 ${isGridView ? 'text-lg mb-1' : 'text-base mb-1'} truncate`}>
            {bookInfo.title || 'Unknown Title'}
          </h3>
          <p className="text-gray-600 text-sm mb-2 truncate">{bookInfo.author || 'Unknown Author'}</p>

          {activeTab === 'current' && (
            <>
              {getStatusBadge(book)}
              <div className="mt-3 flex justify-between text-xs text-gray-500">
                <span>Due: {formatDate(book.dueDate)}</span>
                <span className="capitalize">{book.status.replace('_', ' ')}</span>
              </div>
              {book.status !== 'renew_requested' && book.status !== 'requested' && (
                <button
                  onClick={() => {
                    setBookToRenew(book);
                    setShowRenewModal(true);
                  }}
                  disabled={renewLoading}
                  className="mt-2 w-full bg-blue-600 text-white py-2 px-4 rounded text-xs hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaRedo className="inline mr-1" />
                  {renewLoading ? 'Processing...' : 'Request Renewal'}
                </button>
              )}
            </>
          )}

          {activeTab === 'history' && (
            <div className="text-xs text-gray-500">
              <p>Borrowed: {formatDate(book.borrowDate || book.createdAt)}</p>
              <p>Returned: {formatDate(book.returnDate)}</p>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${getHistoryStatusColor(book.status)}`}>
                {getHistoryStatusIcon(book.status)}
                <span className="ml-1">{book.status.charAt(0).toUpperCase() + book.status.slice(1)}</span>
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <FaSpinner className="animate-spin text-4xl text-blue-600" />
          <span className="ml-3 text-lg text-gray-600">Loading your library...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <FaExclamationTriangle className="w-12 h-12 text-red-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Error Loading Data</h3>
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={loadAllData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    const books = filteredBooks();

    if (books.length === 0) {
      return (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <FaBook className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No books found</h3>
          <p className="text-gray-500">
            {activeTab === 'current'
              ? "You don't have any books currently borrowed"
              : "No reading history available"}
          </p>
        </div>
      );
    }

    return viewMode === 'grid' ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map(book => renderBookCard(book))}
      </div>
    ) : (
      <div className="space-y-4">
        {books.map(book => renderBookCard(book))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50 shadow-lg">
          <div className="flex items-center">
            <FaCheckCircle className="mr-2" />
            {successMessage}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FaBook className="mr-3 text-blue-600" />
              My Library
            </h1>
            <p className="mt-2 text-gray-600">Manage your reading journey</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {[
              {
                id: 'current',
                name: 'Current Books',
                icon: FaBookOpen,
                count: getCurrentBooks().length
              },
              {
                id: 'history',
                name: 'Reading History',
                icon: FaHistory,
                count: readingHistory.length
              }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <tab.icon />
                <span>{tab.name}</span>
                <span className="bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          {/* Search and Filters */}
          <div className="flex flex-1 space-x-4 max-w-2xl">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {activeTab === 'current' && (
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="requested">Requested</option>
                <option value="approved">Approved</option>
                <option value="issued">Issued</option>
                <option value="borrowed">Borrowed</option>
                <option value="renewed">Renewed</option>
                <option value="renew_requested">Renewal Requested</option>
                <option value="overdue">Overdue</option>
              </select>
            )}
          </div>

          {/* View Mode and Actions */}
          <div className="flex items-center space-x-4">
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600'}`}
              >
                <FaTh />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600'}`}
              >
                <FaList />
              </button>
            </div>

            <button
              onClick={loadAllData}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <FaRedo className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">
            {activeTab === 'current' ? 'Currently Reading' : 'Reading History'}
            <span className="text-gray-500 ml-2">({filteredBooks().length})</span>
          </h2>
        </div>

        {renderContent()}
      </div>

      {/* Renew Modal */}
      {showRenewModal && bookToRenew && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium text-gray-900">Request Book Renewal</h3>
              <button
                onClick={() => setShowRenewModal(false)}
                className="text-gray-400 hover:text-gray-500"
                disabled={renewLoading}
              >
                <FaTimes />
              </button>
            </div>

            <div className="mt-4">
              <p className="text-gray-600">
                Are you sure you want to request renewal for{' '}
                <span className="font-semibold">{bookToRenew.book_id?.title}</span>?
              </p>
              <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Current Due Date:</span>
                  <span className="font-medium">{formatDate(bookToRenew.dueDate)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>Status:</span>
                  <span className="font-medium capitalize">{bookToRenew.status.replace('_', ' ')}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                * Renewal requests are subject to librarian approval
              </p>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowRenewModal(false)}
                disabled={renewLoading}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmRenewal}
                disabled={renewLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {renewLoading && <FaSpinner className="animate-spin mr-2" />}
                {renewLoading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBooksPage;