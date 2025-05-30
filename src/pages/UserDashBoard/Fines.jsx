import { useState } from 'react';
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
  FaUniversity
} from 'react-icons/fa';

const FinesPaymentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedFines, setSelectedFines] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Mock data for fines
  const finesData = [
    {
      id: 1,
      bookTitle: 'JavaScript: The Good Parts',
      author: 'Douglas Crockford',
      type: 'overdue',
      amount: 5.50,
      daysOverdue: 11,
      issueDate: '2024-11-08',
      dueDate: '2024-11-02',
      status: 'pending',
      description: 'Late return fee'
    },
    {
      id: 2,
      bookTitle: 'Clean Code',
      author: 'Robert C. Martin',
      type: 'overdue',
      amount: 3.00,
      daysOverdue: 6,
      issueDate: '2024-10-18',
      dueDate: '2024-10-12',
      status: 'paid',
      description: 'Late return fee',
      paymentDate: '2024-10-20',
      paymentMethod: 'credit-card'
    },
    {
      id: 3,
      bookTitle: 'React Design Patterns',
      author: 'Michele Bertoli',
      type: 'lost',
      amount: 45.00,
      issueDate: '2024-08-15',
      dueDate: '2024-08-07',
      status: 'pending',
      description: 'Book replacement cost'
    },
    {
      id: 4,
      bookTitle: 'The Pragmatic Programmer',
      author: 'David Thomas',
      type: 'damage',
      amount: 15.00,
      issueDate: '2024-06-20',
      dueDate: '2024-06-17',
      status: 'paid',
      description: 'Book damage fee',
      paymentDate: '2024-06-22',
      paymentMethod: 'paypal'
    },
    {
      id: 5,
      bookTitle: 'Advanced React Patterns',
      author: 'Kent C. Dodds',
      type: 'overdue',
      amount: 7.50,
      daysOverdue: 15,
      issueDate: '2024-12-10',
      dueDate: '2024-11-25',
      status: 'pending',
      description: 'Late return fee'
    },
    {
      id: 6,
      bookTitle: 'CSS Grid Guide',
      author: 'Mary Wilson',
      type: 'overdue',
      amount: 2.00,
      daysOverdue: 4,
      issueDate: '2024-09-15',
      dueDate: '2024-09-11',
      status: 'paid',
      description: 'Late return fee',
      paymentDate: '2024-09-16',
      paymentMethod: 'bank-transfer'
    }
  ];

  // Payment history data
  const paymentHistory = [
    {
      id: 1,
      date: '2024-10-20',
      amount: 3.00,
      method: 'credit-card',
      transactionId: 'TXN-2024-1020-001',
      status: 'completed',
      fineIds: [2]
    },
    {
      id: 2,
      date: '2024-09-16',
      amount: 2.00,
      method: 'bank-transfer',
      transactionId: 'TXN-2024-0916-002',
      status: 'completed',
      fineIds: [6]
    },
    {
      id: 3,
      date: '2024-06-22',
      amount: 15.00,
      method: 'paypal',
      transactionId: 'TXN-2024-0622-003',
      status: 'completed',
      fineIds: [4]
    }
  ];

  // Statistics
  const totalPending = finesData.filter(f => f.status === 'pending').reduce((sum, f) => sum + f.amount, 0);
  const totalPaid = finesData.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);
  const pendingCount = finesData.filter(f => f.status === 'pending').length;
  const paidCount = finesData.filter(f => f.status === 'paid').length;

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
      case 'pending': return 'text-orange-600 bg-orange-100';
      case 'paid': return 'text-green-600 bg-green-100';
      case 'overdue': return 'text-red-600 bg-red-100';
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
      case 'pending': return <FaClock className="w-4 h-4" />;
      case 'paid': return <FaCheckCircle className="w-4 h-4" />;
      default: return <FaExclamationTriangle className="w-4 h-4" />;
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'credit-card': return <FaCreditCard className="w-4 h-4" />;
      case 'paypal': return <FaPaypal className="w-4 h-4" />;
      case 'bank-transfer': return <FaUniversity className="w-4 h-4" />;
      default: return <FaDollarSign className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
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
      .filter(fine => selectedFines.includes(fine.id) && fine.status === 'pending')
      .reduce((sum, fine) => sum + fine.amount, 0);
  };

  const PaymentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <h3 className="text-xl font-semibold mb-4">Payment Options</h3>
        <p className="text-gray-600 mb-4">Total Amount: <span className="font-bold text-purple-600">${getSelectedTotal().toFixed(2)}</span></p>
        
        <div className="space-y-3 mb-6">
          <button className="w-full flex items-center justify-center gap-3 p-3 border-2 border-purple-200 rounded-lg hover:border-purple-400 transition-colors">
            <FaCreditCard className="w-5 h-5 text-purple-600" />
            <span>Credit/Debit Card</span>
          </button>
          <button className="w-full flex items-center justify-center gap-3 p-3 border-2 border-blue-200 rounded-lg hover:border-blue-400 transition-colors">
            <FaPaypal className="w-5 h-5 text-blue-600" />
            <span>PayPal</span>
          </button>
          <button className="w-full flex items-center justify-center gap-3 p-3 border-2 border-green-200 rounded-lg hover:border-green-400 transition-colors">
            <FaUniversity className="w-5 h-5 text-green-600" />
            <span>Bank Transfer</span>
          </button>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setShowPaymentModal(false)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              setShowPaymentModal(false);
              setSelectedFines([]);
            }}
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen ">
      <div className="pt-6">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8">
          
          {/* Page Header */}
          <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
              <FaDollarSign className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-purple-600" />
              Fines & Payments
            </h1>
            <p className="text-gray-600 mt-2">Manage your library fines and payment history</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Pending Fines</p>
                  <p className="text-2xl sm:text-3xl font-bold text-orange-600">${totalPending.toFixed(2)}</p>
                </div>
                <FaExclamationTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Paid</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">${totalPaid.toFixed(2)}</p>
                </div>
                <FaCheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Outstanding Items</p>
                  <p className="text-2xl sm:text-3xl font-bold text-purple-600">{pendingCount}</p>
                </div>
                <FaClock className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Payments Made</p>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-600">{paidCount}</p>
                </div>
                <FaReceipt className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
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

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by book title or author..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="relative">
                <select
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                </select>
                <FaFilter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="overdue">Overdue</option>
                  <option value="lost">Lost Book</option>
                  <option value="damage">Damage</option>
                </select>
                <FaFilter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Fines List */}
          <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
              <FaReceipt className="w-5 h-5 mr-2 text-purple-600" />
              Current Fines ({filteredFines.length})
            </h3>
            
            {filteredFines.length === 0 ? (
              <div className="text-center py-8">
                <FaDollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No fines found matching your criteria</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFines.map(fine => (
                  <div key={fine.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4">
                      
                      {/* Checkbox for pending fines */}
                      {fine.status === 'pending' && (
                        <input
                          type="checkbox"
                          checked={selectedFines.includes(fine.id)}
                          onChange={() => handleFineSelection(fine.id)}
                          className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
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
                              {fine.daysOverdue && (
                                <div className="flex justify-between lg:block">
                                  <span className="text-gray-500">Days Overdue:</span>
                                  <span className="font-medium text-orange-600">{fine.daysOverdue}</span>
                                </div>
                              )}
                              {fine.paymentDate && (
                                <div className="flex justify-between lg:block">
                                  <span className="text-gray-500">Paid On:</span>
                                  <span className="text-green-600">{formatDate(fine.paymentDate)}</span>
                                </div>
                              )}
                              {fine.paymentMethod && (
                                <div className="flex items-center gap-1 justify-end lg:justify-start">
                                  {getPaymentMethodIcon(fine.paymentMethod)}
                                  <span className="text-xs">{fine.paymentMethod.replace('-', ' ')}</span>
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
              Payment History
            </h3>
            
            <div className="space-y-3">
              {paymentHistory.map(payment => (
                <div key={payment.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-3 sm:gap-0">
                  <div className="flex items-center gap-3">
                    {getPaymentMethodIcon(payment.method)}
                    <div>
                      <p className="font-medium">${payment.amount.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">Transaction ID: {payment.transactionId}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:text-right">
                    <p className="text-sm text-gray-600">{formatDate(payment.date)}</p>
                    <div className="flex items-center gap-2 sm:justify-end">
                      <span className="text-green-600 text-sm font-medium">Completed</span>
                      <button className="text-purple-600 hover:text-purple-800 text-sm">
                        <FaDownload className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && <PaymentModal />}
    </div>
  );
};

export default FinesPaymentsPage;