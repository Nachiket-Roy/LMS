import { useState, useEffect } from 'react';
import {
  FaDollarSign,
  FaCreditCard,
  FaHistory,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaBook,
  FaCalendarAlt,
  FaReceipt,
  FaDownload,
  FaSearch,
  FaFilter,
  FaPaypal,
  FaUniversity,
  FaSpinner,
  FaTimes,
  FaMobileAlt,
  FaMoneyBill // Fixed: Added FaMoneyBill instead of FaMoney
} from 'react-icons/fa';

// Import your existing API functions
import {
  getOverdueBooks,
  getPaymentHistory,
} from '../../services/userApi';

const FinesPaymentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedFines, setSelectedFines] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  // API State
  const [finesData, setFinesData] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [paymentStats, setPaymentStats] = useState({
    totalPaid: 0,
    totalFines: 0,
    totalOutstandingFines: 0,
    totalPayments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch data from your APIs
      const [overdueResponse, paymentsResponse] = await Promise.all([
        getOverdueBooks().catch(err => {
          console.warn('Failed to fetch overdue books:', err);
          return { data: { success: false, data: { items: [] } } };
        }),
        getPaymentHistory().catch(err => {
          console.warn('Failed to fetch payment history:', err);
          return { 
            data: { 
              success: false, 
              data: { payments: [] }, 
              totalPaid: 0, 
              totalFines: 0, 
              totalOutstandingFines: 0,
              totalPayments: 0
            } 
          };
        })
      ]);

      console.log('API Responses:', { overdueResponse, paymentsResponse });

      // Transform overdue books data to fines
      let transformedFines = [];

      // Fixed: Properly access nested axios response data
      const overdueData = overdueResponse?.data?.data?.items || [];

      if (overdueData.length > 0) {
        transformedFines = overdueData.map(borrowRecord => {
          const dueDate = new Date(borrowRecord.dueDate);
          const today = new Date();
          const daysOverdue = Math.max(0, Math.floor((today - dueDate) / (1000 * 60 * 60 * 24)));
          const fineAmount = calculateFine(daysOverdue);

          return {
            id: borrowRecord._id,
            bookId: borrowRecord.book_id?._id || borrowRecord.book_id,
            bookTitle: borrowRecord.book_id?.title || 'Unknown Title',
            author: borrowRecord.book_id?.author || 'Unknown Author',
            coverImage: borrowRecord.book_id?.coverImagePath || null,
            type: 'overdue',
            amount: fineAmount,
            daysOverdue: daysOverdue,
            issueDate: borrowRecord.createdAt || borrowRecord.borrowDate,
            dueDate: borrowRecord.dueDate,
            status: fineAmount > 0 ? 'unpaid' : 'no-fine',
            description: `Late return fee - ${daysOverdue} days overdue`,
            borrowId: borrowRecord._id,
            borrowStatus: borrowRecord.status
          };
        }).filter(fine => fine.amount > 0);
      }

      // Handle payment history and stats
      let validPaymentHistory = [];
      let stats = {
        totalPaid: 0,
        totalFines: 0,
        totalOutstandingFines: 0,
        totalPayments: 0
      };

      // Fixed: Properly access nested axios response data
      if (paymentsResponse?.data?.success) {
        const responseData = paymentsResponse.data;
        
        validPaymentHistory = responseData.data?.payments || [];
        stats = {
          totalPaid: responseData.totalPaid || 0,
          totalFines: responseData.totalFines || 0,
          totalOutstandingFines: responseData.totalOutstandingFines || 0,
          totalPayments: responseData.totalPayments || validPaymentHistory.length
        };
      }

      setFinesData(transformedFines);
      setPaymentHistory(validPaymentHistory);
      setPaymentStats(stats);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load fines and payment data. Please try again.');
      setFinesData([]);
      setPaymentHistory([]);
      setPaymentStats({
        totalPaid: 0,
        totalFines: 0,
        totalOutstandingFines: 0,
        totalPayments: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate fine based on days overdue (adjust rate as needed)
  const calculateFine = (daysOverdue) => {
    const dailyRate = 0.50; // $0.50 per day - adjust this rate as needed
    return Math.max(daysOverdue * dailyRate, 0);
  };

  // Statistics (calculated from real data)
  const totalPending = finesData.filter(f => f.status === 'unpaid' || f.status === 'pending').reduce((sum, f) => sum + f.amount, 0);
  const pendingCount = finesData.filter(f => f.status === 'unpaid' || f.status === 'pending').length;

  // Filter functions
  const filteredFines = finesData.filter(fine => {
    const matchesSearch = fine.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fine.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || fine.status === filterStatus;
    const matchesType = filterType === 'all' || fine.type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
      case 'unpaid': return 'text-orange-600 bg-orange-100';
      case 'paid': return 'text-green-600 bg-green-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      case 'no-fine': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'overdue': return 'text-orange-600 bg-orange-100';
      case 'lost': return 'text-red-600 bg-red-100';
      case 'damage': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
      case 'unpaid': return <FaClock className="w-4 h-4" />;
      case 'paid': return <FaCheckCircle className="w-4 h-4" />;
      case 'no-fine': return <FaCheckCircle className="w-4 h-4" />;
      default: return <FaExclamationTriangle className="w-4 h-4" />;
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'card': return <FaCreditCard className="w-4 h-4" />;
      case 'upi': return <FaMobileAlt className="w-4 h-4" />;
      case 'cash': return <FaMoneyBill className="w-4 h-4" />;
      case 'online': return <FaUniversity className="w-4 h-4" />;
      default: return <FaDollarSign className="w-4 h-4" />;
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

  const handleFineSelection = (fineId) => {
    setSelectedFines(prev =>
      prev.includes(fineId)
        ? prev.filter(id => id !== fineId)
        : [...prev, fineId]
    );
  };

  const getSelectedTotal = () => {
    return finesData
      .filter(fine => selectedFines.includes(fine.id) && (fine.status === 'unpaid' || fine.status === 'pending'))
      .reduce((sum, fine) => sum + fine.amount, 0);
  };

  const handlePayment = async (paymentMethod) => {
    try {
      setProcessingPayment(true);

      // Here you would integrate with your payment API
      // For now, we'll simulate the payment process
      console.log('Processing payment:', {
        fineIds: selectedFines,
        method: paymentMethod,
        amount: getSelectedTotal()
      });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Close modal and refresh data
      setShowPaymentModal(false);
      setSelectedFines([]);
      await fetchAllData(); // Refresh data after payment

    } catch (err) {
      console.error('Payment error:', err);
      setError('Payment failed. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const PaymentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Payment Options</h3>
          <button
            onClick={() => setShowPaymentModal(false)}
            className="text-gray-400 hover:text-gray-600"
            disabled={processingPayment}
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <p className="text-gray-600 mb-4">
          Total Amount: <span className="font-bold text-purple-600">${getSelectedTotal().toFixed(2)}</span>
        </p>

        <div className="space-y-3 mb-6">
          <button
            onClick={() => handlePayment('card')}
            disabled={processingPayment}
            className="w-full flex items-center justify-center gap-3 p-3 border-2 border-purple-200 rounded-lg hover:border-purple-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaCreditCard className="w-5 h-5 text-purple-600" />
            <span>Credit/Debit Card</span>
            {processingPayment && <FaSpinner className="w-4 h-4 animate-spin" />}
          </button>

          <button
            onClick={() => handlePayment('upi')}
            disabled={processingPayment}
            className="w-full flex items-center justify-center gap-3 p-3 border-2 border-blue-200 rounded-lg hover:border-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaMobileAlt className="w-5 h-5 text-blue-600" />
            <span>UPI Payment</span>
            {processingPayment && <FaSpinner className="w-4 h-4 animate-spin" />}
          </button>

          <button
            onClick={() => handlePayment('online')}
            disabled={processingPayment}
            className="w-full flex items-center justify-center gap-3 p-3 border-2 border-green-200 rounded-lg hover:border-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaUniversity className="w-5 h-5 text-green-600" />
            <span>Net Banking</span>
            {processingPayment && <FaSpinner className="w-4 h-4 animate-spin" />}
          </button>

          <button
            onClick={() => handlePayment('cash')}
            disabled={processingPayment}
            className="w-full flex items-center justify-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaMoneyBill className="w-5 h-5 text-gray-600" />
            <span>Pay at Counter</span>
            {processingPayment && <FaSpinner className="w-4 h-4 animate-spin" />}
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowPaymentModal(false)}
            disabled={processingPayment}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading fines and payments...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <FaExclamationTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAllData}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-6">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8">

          {/* Page Header */}
          <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
                  <FaDollarSign className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-purple-600" />
                  Fines & Payments
                </h1>
                <p className="text-gray-600 mt-2">Manage your library fines and payment history</p>
              </div>
              <button
                onClick={fetchAllData}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors disabled:opacity-50"
              >
                <FaSpinner className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Outstanding Fines</p>
                  <p className="text-2xl sm:text-3xl font-bold text-orange-600">${paymentStats.totalOutstandingFines.toFixed(2)}</p>
                </div>
                <FaExclamationTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Paid</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">${paymentStats.totalPaid.toFixed(2)}</p>
                </div>
                <FaCheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Fines</p>
                  <p className="text-2xl sm:text-3xl font-bold text-purple-600">${paymentStats.totalFines.toFixed(2)}</p>
                </div>
                <FaClock className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Payments Made</p>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-600">{paymentStats.totalPayments}</p>
                </div>
                <FaReceipt className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search books or authors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="unpaid">Unpaid</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="overdue">Overdue</option>
                <option value="lost">Lost</option>
                <option value="damage">Damage</option>
              </select>
            </div>
          </div>

          {/* Quick Pay Section */}
          {selectedFines.length > 0 && (
            <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl shadow-sm p-4 sm:p-6 text-white">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{selectedFines.length} fine(s) selected</h3>
                  <p className="text-purple-100">Total: ${getSelectedTotal().toFixed(2)}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedFines([])}
                    className="px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all"
                  >
                    Clear Selection
                  </button>
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="px-6 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 font-semibold transition-all"
                  >
                    Pay Now
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Fines List */}
          <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
              <FaReceipt className="w-5 h-5 mr-2 text-purple-600" />
              Current Fines ({filteredFines.length})
            </h3>

            {filteredFines.length === 0 ? (
              <div className="text-center py-8">
                <FaDollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {finesData.length === 0
                    ? "No fines found. Great job keeping up with your returns!"
                    : "No fines found matching your criteria"
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFines.map(fine => (
                  <div key={fine.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4">

                      {/* Checkbox for unpaid/pending fines */}
                      {(fine.status === 'unpaid' || fine.status === 'pending') && (
                        <input
                          type="checkbox"
                          checked={selectedFines.includes(fine.id)}
                          onChange={() => handleFineSelection(fine.id)}
                          className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                      )}

                      {/* Book cover image if available */}
                      {fine.coverImage && (
                        <div className="w-12 h-16 bg-gray-200 rounded flex-shrink-0">
                          <img
                            src={fine.coverImage}
                            alt={fine.bookTitle}
                            className="w-full h-full object-cover rounded"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}

                      {/* Fine Details */}
                      <div className="flex-1">
                        <div className="flex flex-col lg:flex-row lg:items-start gap-4">

                          {/* Book and Fine Info */}
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                              <FaBook className="w-4 h-4" />
                              {fine.bookTitle}
                            </h4>
                            <p className="text-gray-600 mb-2">by {fine.author}</p>
                            <p className="text-sm text-gray-500 mb-2">{fine.description}</p>

                            <div className="flex flex-wrap gap-2 mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(fine.type)}`}>
                                {fine.type.charAt(0).toUpperCase() + fine.type.slice(1)}
                              </span>
                              <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(fine.status)}`}>
                                {getStatusIcon(fine.status)}
                                {fine.status.charAt(0).toUpperCase() + fine.status.slice(1)}
                              </span>
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                                {fine.borrowStatus}
                              </span>
                            </div>
                          </div>

                          {/* Amount and Dates */}
                          <div className="lg:text-right lg:min-w-0 lg:w-48">
                            <div className="text-2xl font-bold text-red-600 mb-2">
                              ${fine.amount.toFixed(2)}
                            </div>

                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex justify-between lg:block">
                                <span className="text-gray-500">Due Date:</span>
                                <span>{formatDate(fine.dueDate)}</span>
                              </div>
                              <div className="flex justify-between lg:block">
                                <span className="text-gray-500">Issue Date:</span>
                                <span>{formatDate(fine.issueDate)}</span>
                              </div>
                              {fine.daysOverdue && fine.daysOverdue > 0 && (
                                <div className="flex justify-between lg:block">
                                  <span className="text-gray-500">Days Overdue:</span>
                                  <span className="font-medium text-orange-600">{fine.daysOverdue}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment History */}
          <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
              <FaHistory className="w-5 h-5 mr-2 text-purple-600" />
              Payment History ({paymentHistory.length})
            </h3>

            {paymentHistory.length === 0 ? (
              <div className="text-center py-8">
                <FaHistory className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No payment history found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {paymentHistory.map(payment => (
                  <div key={payment._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-3 sm:gap-0">
                    <div className="flex items-center gap-3">
                      {getPaymentMethodIcon(payment.method)}
                      <div>
                        <p className="font-medium">${(payment.amount || 0).toFixed(2)}</p>
                        <p className="text-sm text-gray-600">
                          {payment.method?.toUpperCase()} Payment
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:text-right">
                      <p className="text-sm text-gray-600">{formatDate(payment.createdAt || payment.updatedAt)}</p>
                      <div className="flex items-center gap-2 sm:justify-end">
                        <span className={`text-sm font-medium ${payment.status === 'paid' ? 'text-green-600' : payment.status === 'failed' ? 'text-red-600' : 'text-orange-600'}`}>
                          {payment.status?.charAt(0).toUpperCase() + payment.status?.slice(1) || 'Completed'}
                        </span>
                        {payment._id && (
                          <span className="text-xs text-gray-500">
                            ID: {payment._id.slice(-6)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>        
      </div>

      {/* Payment Modal */}
      {showPaymentModal && <PaymentModal />}
    </div>
  );
};

export default FinesPaymentsPage;