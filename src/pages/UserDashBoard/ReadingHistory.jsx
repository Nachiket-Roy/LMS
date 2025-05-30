import { useState } from 'react';
import {
  FaHistory,
  FaBook,
  FaCalendarAlt,
  FaStar,
  FaSearch,
  FaFilter,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle
} from 'react-icons/fa';

const ReadingHistoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterYear, setFilterYear] = useState('all');

  const readingHistory = [
    {
      id: 1,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      borrowDate: '2024-12-15',
      returnDate: '2025-01-12',
      dueDate: '2025-01-15',
      status: 'returned',
      rating: 4,
      category: 'Classic Literature',
      isbn: '9780743273565'
    },
    {
      id: 2,
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      borrowDate: '2024-11-20',
      returnDate: '2024-12-18',
      dueDate: '2024-12-20',
      status: 'returned',
      rating: 5,
      category: 'Classic Literature',
      isbn: '9780061120084'
    },
    {
      id: 3,
      title: 'JavaScript: The Good Parts',
      author: 'Douglas Crockford',
      borrowDate: '2024-10-05',
      returnDate: '2024-11-08',
      dueDate: '2024-11-02',
      status: 'returned-late',
      rating: 4,
      category: 'Technology',
      isbn: '9780596517748'
    },
    {
      id: 4,
      title: 'Clean Code',
      author: 'Robert C. Martin',
      borrowDate: '2024-09-12',
      returnDate: '2024-10-15',
      dueDate: '2024-10-12',
      status: 'returned-late',
      rating: 5,
      category: 'Technology',
      isbn: '9780132350884'
    },
    {
      id: 5,
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      borrowDate: '2024-08-01',
      returnDate: '2024-08-28',
      dueDate: '2024-08-29',
      status: 'returned',
      rating: 4,
      category: 'Classic Literature',
      isbn: '9780141439518'
    },
    {
      id: 6,
      title: 'React Design Patterns',
      author: 'Michele Bertoli',
      borrowDate: '2024-07-10',
      returnDate: null,
      dueDate: '2024-08-07',
      status: 'overdue-lost',
      rating: null,
      category: 'Technology',
      isbn: '9781786464538'
    },
    {
      id: 7,
      title: '1984',
      author: 'George Orwell',
      borrowDate: '2024-06-15',
      returnDate: '2024-07-10',
      dueDate: '2024-07-13',
      status: 'returned',
      rating: 5,
      category: 'Classic Literature',
      isbn: '9780451524935'
    },
    {
      id: 8,
      title: 'The Pragmatic Programmer',
      author: 'David Thomas',
      borrowDate: '2024-05-20',
      returnDate: '2024-06-18',
      dueDate: '2024-06-17',
      status: 'returned-late',
      rating: 4,
      category: 'Technology',
      isbn: '9780201616224'
    }
  ];

  // Stats calculations
  const totalBooks = readingHistory.length;
  const returnedOnTime = readingHistory.filter(book => book.status === 'returned').length;
  const returnedLate = readingHistory.filter(book => book.status === 'returned-late').length;
  const lostBooks = readingHistory.filter(book => book.status === 'overdue-lost').length;
  const averageRating = readingHistory
    .filter(book => book.rating)
    .reduce((sum, book) => sum + book.rating, 0) / readingHistory.filter(book => book.rating).length;

  // Filter functions
  const filteredHistory = readingHistory.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || book.status === filterStatus;
    const matchesYear = filterYear === 'all' || new Date(book.borrowDate).getFullYear().toString() === filterYear;
    
    return matchesSearch && matchesStatus && matchesYear;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'returned': return 'text-green-600 bg-green-100';
      case 'returned-late': return 'text-orange-600 bg-orange-100';
      case 'overdue-lost': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'returned': return <FaCheckCircle className="w-4 h-4" />;
      case 'returned-late': return <FaExclamationTriangle className="w-4 h-4" />;
      case 'overdue-lost': return <FaTimesCircle className="w-4 h-4" />;
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

  const renderStars = (rating) => {
    if (!rating) return <span className="text-gray-400 text-sm">Not rated</span>;
    
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map(star => (
          <FaStar
            key={star}
            className={`w-3 h-3 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen ">
      <div className="pt-6">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8">
          
          {/* Page Header */}
          <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
              <FaHistory className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-purple-600" />
              Reading History
            </h1>
            <p className="text-gray-600 mt-2">Track your reading journey and discover your patterns</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Books</p>
                  <p className="text-2xl sm:text-3xl font-bold text-purple-600">{totalBooks}</p>
                </div>
                <FaBook className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">On Time Returns</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">{returnedOnTime}</p>
                </div>
                <FaCheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Late Returns</p>
                  <p className="text-2xl sm:text-3xl font-bold text-orange-600">{returnedLate}</p>
                </div>
                <FaExclamationTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Avg Rating</p>
                  <p className="text-2xl sm:text-3xl font-bold text-yellow-600">
                    {averageRating ? averageRating.toFixed(1) : 'N/A'}
                  </p>
                </div>
                <FaStar className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by title or author..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="returned">Returned On Time</option>
                  <option value="returned-late">Returned Late</option>
                  <option value="overdue-lost">Lost/Overdue</option>
                </select>
                <FaFilter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              {/* Year Filter */}
              <div className="relative">
                <select
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                >
                  <option value="all">All Years</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                </select>
                <FaCalendarAlt className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Reading History List */}
          <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
              <FaBook className="w-5 h-5 mr-2 text-purple-600" />
              Reading History ({filteredHistory.length} books)
            </h3>
            
            {filteredHistory.length === 0 ? (
              <div className="text-center py-8">
                <FaBook className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No books found matching your criteria</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredHistory.map(book => (
                  <div key={book.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      
                      {/* Book Info */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg text-gray-900">{book.title}</h4>
                            <p className="text-gray-600 mb-2">by {book.author}</p>
                            <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                              <span className="bg-gray-100 px-2 py-1 rounded">{book.category}</span>
                              <span>ISBN: {book.isbn}</span>
                            </div>
                          </div>
                          
                          {/* Rating */}
                          <div className="sm:text-right">
                            {renderStars(book.rating)}
                          </div>
                        </div>
                      </div>

                      {/* Dates and Status */}
                      <div className="flex flex-col sm:flex-row lg:flex-col gap-2 sm:gap-4 lg:gap-2 lg:min-w-0 lg:w-64">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-gray-500">Borrowed:</p>
                            <p className="font-medium">{formatDate(book.borrowDate)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Due:</p>
                            <p className="font-medium">{formatDate(book.dueDate)}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-gray-500">Returned:</p>
                            <p className="font-medium">{formatDate(book.returnDate)}</p>
                          </div>
                        </div>
                        
                        {/* Status Badge */}
                        <div className="flex items-center justify-start sm:justify-end lg:justify-start">
                          <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium w-fit ${getStatusColor(book.status)}`}>
                            {getStatusIcon(book.status)}
                            {book.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReadingHistoryPage;