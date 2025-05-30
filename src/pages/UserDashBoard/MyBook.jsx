import { useState } from 'react';
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
  FaTag
} from 'react-icons/fa';

const MyBooksPage = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [bookToRenew, setBookToRenew] = useState(null);

  // Mock data for current books
  const currentBooks = [
    {
      id: 1,
      title: 'The Midnight Library',
      author: 'Matt Haig',
      isbn: '978-0525559474',
      genre: 'Fiction',
      coverUrl: 'https://via.placeholder.com/120x180/4F46E5/FFFFFF?text=TML',
      checkedOut: '2024-11-15',
      dueDate: '2024-12-15',
      renewalsLeft: 2,
      status: 'active',
      rating: 4.5,
      progress: 65,
      tags: ['Currently Reading', 'Philosophy']
    },
    {
      id: 2,
      title: 'Atomic Habits',
      author: 'James Clear',
      isbn: '978-0735211292',
      genre: 'Self-Help',
      coverUrl: 'https://via.placeholder.com/120x180/059669/FFFFFF?text=AH',
      checkedOut: '2024-10-20',
      dueDate: '2024-11-20',
      renewalsLeft: 0,
      status: 'overdue',
      rating: 5.0,
      progress: 45,
      tags: ['Productivity', 'Psychology'],
      daysOverdue: 10
    },
    {
      id: 3,
      title: 'The Seven Husbands of Evelyn Hugo',
      author: 'Taylor Jenkins Reid',
      isbn: '978-1501161933',
      genre: 'Romance',
      coverUrl: 'https://via.placeholder.com/120x180/DC2626/FFFFFF?text=TSHEH',
      checkedOut: '2024-11-01',
      dueDate: '2024-12-01',
      renewalsLeft: 1,
      status: 'due-soon',
      rating: 4.8,
      progress: 20,
      tags: ['Romance', 'Historical Fiction'],
      daysTillDue: 3
    },
    {
      id: 4,
      title: 'Educated',
      author: 'Tara Westover',
      isbn: '978-0399590504',
      genre: 'Biography',
      coverUrl: 'https://via.placeholder.com/120x180/7C3AED/FFFFFF?text=E',
      checkedOut: '2024-10-05',
      dueDate: '2024-11-05',
      renewalsLeft: 3,
      status: 'active',
      rating: 4.7,
      progress: 80,
      tags: ['Memoir', 'Education']
    }
  ];

  // Mock data for reading history
  const readingHistory = [
    {
      id: 5,
      title: 'Where the Crawdads Sing',
      author: 'Delia Owens',
      genre: 'Mystery',
      coverUrl: 'https://via.placeholder.com/120x180/059669/FFFFFF?text=WTCS',
      completedDate: '2024-10-15',
      rating: 4.2,
      review: 'Beautiful story with vivid descriptions of nature.',
      tags: ['Mystery', 'Nature']
    },
    {
      id: 6,
      title: 'The Alchemist',
      author: 'Paulo Coelho',
      genre: 'Philosophy',
      coverUrl: 'https://via.placeholder.com/120x180/F59E0B/FFFFFF?text=TA',
      completedDate: '2024-09-22',
      rating: 4.0,
      review: 'Inspiring journey of self-discovery.',
      tags: ['Philosophy', 'Adventure']
    },
    {
      id: 7,
      title: '1984',
      author: 'George Orwell',
      genre: 'Dystopian Fiction',
      coverUrl: 'https://via.placeholder.com/120x180/1F2937/FFFFFF?text=1984',
      completedDate: '2024-09-10',
      rating: 4.9,
      review: 'Chilling and thought-provoking masterpiece.',
      tags: ['Classic', 'Politics']
    }
  ];

  // Mock data for favorites
  const favorites = [
    {
      id: 8,
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      genre: 'Classic Literature',
      coverUrl: 'https://via.placeholder.com/120x180/EF4444/FFFFFF?text=TKAM',
      rating: 5.0,
      dateAdded: '2024-08-15',
      tags: ['Classic', 'Social Issues']
    },
    {
      id: 9,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      genre: 'Classic Literature',
      coverUrl: 'https://via.placeholder.com/120x180/10B981/FFFFFF?text=TGG',
      rating: 4.6,
      dateAdded: '2024-07-20',
      tags: ['Classic', 'American Literature']
    }
  ];

  const handleRenewBook = (book) => {
    setBookToRenew(book);
    setShowRenewModal(true);
  };

  const confirmRenewal = () => {
    // In a real app, this would make an API call
    console.log(`Renewing book: ${bookToRenew.title}`);
    setShowRenewModal(false);
    setBookToRenew(null);
  };

  const renderStars = (rating) => {
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
    
    return stars;
  };

  const getStatusBadge = (book) => {
    switch (book.status) {
      case 'overdue':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <FaExclamationTriangle className="mr-1" />
            {book.daysOverdue} days overdue
          </span>
        );
      case 'due-soon':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <FaClock className="mr-1" />
            Due in {book.daysTillDue} days
          </span>
        );
      case 'active':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FaCheckCircle className="mr-1" />
            Active
          </span>
        );
      default:
        return null;
    }
  };

  const filteredBooks = () => {
    let books = activeTab === 'current' ? currentBooks : 
                 activeTab === 'history' ? readingHistory : favorites;
    
    if (searchTerm) {
      books = books.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterGenre !== 'all') {
      books = books.filter(book => book.genre === filterGenre);
    }
    
    if (filterStatus !== 'all' && activeTab === 'current') {
      books = books.filter(book => book.status === filterStatus);
    }
    
    return books;
  };

  const renderBookCard = (book) => {
    const isGridView = viewMode === 'grid';
    
    return (
      <div key={book.id} className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ${
        isGridView ? 'p-4' : 'p-4 flex items-start space-x-4'
      }`}>
        <div className={`${isGridView ? 'mb-4' : 'flex-shrink-0'}`}>
          <img 
            src={book.coverUrl} 
            alt={book.title}
            className={`rounded ${isGridView ? 'w-full h-48 object-cover' : 'w-16 h-24 object-cover'}`}
          />
        </div>
        
        <div className={`${isGridView ? '' : 'flex-1 min-w-0'}`}>
          <h3 className={`font-semibold text-gray-900 ${isGridView ? 'text-lg mb-1' : 'text-base mb-1'} truncate`}>
            {book.title}
          </h3>
          <p className="text-gray-600 text-sm mb-2">{book.author}</p>
          
          {book.rating && (
            <div className="flex items-center mb-2">
              {renderStars(book.rating)}
              <span className="ml-2 text-sm text-gray-600">({book.rating})</span>
            </div>
          )}
          
          {activeTab === 'current' && (
            <>
              {getStatusBadge(book)}
              {book.progress && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{book.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${book.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              <div className="mt-3 flex justify-between text-xs text-gray-500">
                <span>Due: {book.dueDate}</span>
                <span>{book.renewalsLeft} renewals left</span>
              </div>
              {book.renewalsLeft > 0 && (
                <button 
                  onClick={() => handleRenewBook(book)}
                  className="mt-2 w-full bg-blue-600 text-white py-2 px-4 rounded text-xs hover:bg-blue-700 transition-colors"
                >
                  <FaRedo className="inline mr-1" />
                  Renew Book
                </button>
              )}
            </>
          )}
          
          {activeTab === 'history' && (
            <div className="text-xs text-gray-500">
              <p>Completed: {book.completedDate}</p>
              {book.review && <p className="mt-1 italic">"{book.review}"</p>}
            </div>
          )}
          
          {book.tags && (
            <div className="mt-2 flex flex-wrap gap-1">
              {book.tags.map((tag, index) => (
                <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                  <FaTag className="mr-1 text-xs" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="bg-gray-50">
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
      <div className=" border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {[
              { id: 'current', name: 'Current Books', icon: FaBookOpen, count: currentBooks.length },
              { id: 'history', name: 'Reading History', icon: FaHistory, count: readingHistory.length },
              { id: 'favorites', name: 'Favorites', icon: FaHeart, count: favorites.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
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
            
            <select
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Genres</option>
              <option value="Fiction">Fiction</option>
              <option value="Self-Help">Self-Help</option>
              <option value="Romance">Romance</option>
              <option value="Biography">Biography</option>
              <option value="Mystery">Mystery</option>
              <option value="Philosophy">Philosophy</option>
            </select>
            
            {activeTab === 'current' && (
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="due-soon">Due Soon</option>
                <option value="overdue">Overdue</option>
              </select>
            )}
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : 'text-gray-500'}`}
            >
              <FaTh />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : 'text-gray-500'}`}
            >
              <FaList />
            </button>
          </div>
        </div>
      </div>

      {/* Books Grid/List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {filteredBooks().length === 0 ? (
          <div className="text-center py-12">
            <FaBook className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No books found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
              : 'space-y-4'
          }`}>
            {filteredBooks().map(renderBookCard)}
          </div>
        )}
      </div>

      {/* Renewal Modal */}
      {showRenewModal && bookToRenew && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Renew Book</h3>
                <button
                  onClick={() => setShowRenewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Are you sure you want to renew "{bookToRenew.title}"?
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Current due date: {bookToRenew.dueDate}
                </p>
                <p className="text-xs text-gray-500">
                  Renewals remaining: {bookToRenew.renewalsLeft}
                </p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRenewModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRenewal}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Confirm Renewal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBooksPage;