import { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaBook,  
  FaExclamationCircle, 
  FaBell, 
  FaSignOutAlt, 
  FaHome, 
  FaBookOpen, 
  FaHistory, 
  FaDollarSign, 
  FaFlag, 
  FaBars, 
  FaTimes,
  FaStar
} from 'react-icons/fa';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Book 'React Fundamentals' is due in 2 days", type: 'warning', time: '2h ago' },
    { id: 2, message: "New book 'Advanced JavaScript' available", type: 'info', time: '1d ago' },
    { id: 3, message: "Fine payment reminder: $5.50", type: 'error', time: '3d ago' }
  ]);

  // Mock data
  const userData = {
    name: 'John Doe',
    email: 'john.doe@email.com',
    membershipId: 'LIB001234',
    joinDate: '2023-01-15',
    avatar: '👨‍💼'
  };

  const borrowedBooks = [
    { id: 1, title: 'React Fundamentals', author: 'Jane Smith', dueDate: '2025-05-29', status: 'due-soon', isbn: '978-1234567890' },
    { id: 2, title: 'JavaScript Mastery', author: 'John Johnson', dueDate: '2025-06-05', status: 'active', isbn: '978-0987654321' },
    { id: 3, title: 'CSS Grid Guide', author: 'Mary Wilson', dueDate: '2025-06-10', status: 'active', isbn: '978-1122334455' }
  ];

  const bookHistory = [
    { id: 1, title: 'Python Basics', author: 'Alice Brown', borrowDate: '2025-04-15', returnDate: '2025-05-01', status: 'returned' },
    { id: 2, title: 'Data Structures', author: 'Bob Green', borrowDate: '2025-03-20', returnDate: '2025-04-10', status: 'returned' },
    { id: 3, title: 'Web Development', author: 'Carol White', borrowDate: '2025-02-10', returnDate: '2025-03-01', status: 'returned' },
    { id: 4, title: 'Machine Learning', author: 'David Black', borrowDate: '2025-01-05', returnDate: null, status: 'overdue' }
  ];

  const availableBooks = [
    { id: 1, title: 'Advanced React Patterns', author: 'Sarah Connor', category: 'Programming', available: true, rating: 4.8 },
    { id: 2, title: 'Node.js Complete Guide', author: 'Mike Ross', category: 'Backend', available: true, rating: 4.6 },
    { id: 3, title: 'Database Design', author: 'Lisa Park', category: 'Database', available: false, rating: 4.7 },
    { id: 4, title: 'Cloud Computing', author: 'Tom Hardy', category: 'Infrastructure', available: true, rating: 4.5 }
  ];

  const fines = [
    { id: 1, bookTitle: 'Machine Learning', amount: 5.50, dueDate: '2025-05-20', status: 'pending' },
    { id: 2, bookTitle: 'Web Security', amount: 3.00, dueDate: '2025-04-15', status: 'paid' }
  ];

  const issues = [
    { id: 1, title: 'Damaged book pages', book: 'React Fundamentals', status: 'open', date: '2025-05-25', priority: 'medium' },
    { id: 2, title: 'Missing book cover', book: 'JavaScript Mastery', status: 'resolved', date: '2025-05-20', priority: 'low' }
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaHome },
    { id: 'books', label: 'My Books', icon: FaBookOpen },
    { id: 'search', label: 'Search Books', icon: FaSearch },
    { id: 'history', label: 'History', icon: FaHistory },
    { id: 'fines', label: 'Fines', icon: FaDollarSign },
    { id: 'issues', label: 'Report Issue', icon: FaFlag }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'due-soon': return 'text-orange-600 bg-orange-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      case 'active': return 'text-green-600 bg-green-100';
      case 'returned': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'paid': return 'text-green-600 bg-green-100';
      case 'open': return 'text-red-600 bg-red-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredBooks = availableBooks.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const DashboardContent = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back, {userData.name}!</h2>
            <p className="opacity-90">You have {borrowedBooks.length} books borrowed and {fines.filter(f => f.status === 'pending').length} pending fine(s)</p>
          </div>
          <div className="text-4xl">{userData.avatar}</div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Books</p>
              <p className="text-2xl font-bold text-purple-600">{borrowedBooks.length}</p>
            </div>
            <FaBookOpen className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Books Read</p>
              <p className="text-2xl font-bold text-green-600">{bookHistory.filter(b => b.status === 'returned').length}</p>
            </div>
            <FaHistory className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending Fines</p>
              <p className="text-2xl font-bold text-orange-600">${fines.filter(f => f.status === 'pending').reduce((sum, f) => sum + f.amount, 0).toFixed(2)}</p>
            </div>
            <FaDollarSign className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Open Issues</p>
              <p className="text-2xl font-bold text-red-600">{issues.filter(i => i.status === 'open').length}</p>
            </div>
            <FaFlag className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Currently Borrowed */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FaBookOpen className="w-5 h-5 mr-2 text-purple-600" />
          Currently Borrowed
        </h3>
        <div className="space-y-3">
          {borrowedBooks.map(book => (
            <div key={book.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium">{book.title}</h4>
                <p className="text-sm text-gray-600">by {book.author}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Due: {book.dueDate}</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(book.status)}`}>
                  {book.status.replace('-', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FaBell className="w-5 h-5 mr-2 text-purple-600" />
          Recent Notifications
        </h3>
        <div className="space-y-3">
          {notifications.map(notification => (
            <div key={notification.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <FaExclamationCircle className={`w-5 h-5 mt-0.5 ${
                notification.type === 'error' ? 'text-red-500' : 
                notification.type === 'warning' ? 'text-orange-500' : 'text-blue-500'
              }`} />
              <div className="flex-1">
                <p className="text-sm">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const BooksContent = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Books</h2>
      <div className="space-y-4">
        {borrowedBooks.map(book => (
          <div key={book.id} className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{book.title}</h3>
                <p className="text-gray-600 mb-2">by {book.author}</p>
                <p className="text-sm text-gray-500">ISBN: {book.isbn}</p>
                <p className="text-sm text-gray-500">Due Date: {book.dueDate}</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(book.status)}`}>
                  {book.status.replace('-', ' ')}
                </span>
                <div className="mt-4 space-x-2">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                    Renew
                  </button>
                  <button className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors">
                    Return
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const SearchContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Search Books</h2>
      </div>
      
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by title, author, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredBooks.map(book => (
          <div key={book.id} className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{book.title}</h3>
                <p className="text-gray-600 mb-1">by {book.author}</p>
                <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                  {book.category}
                </span>
              </div>
              <div className="text-right">
                <div className="flex items-center mb-2">
                  <FaStar className="text-yellow-400" />
                  <span className="text-sm text-gray-600 ml-1">{book.rating}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  book.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {book.available ? 'Available' : 'Borrowed'}
                </span>
              </div>
            </div>
            <button 
              disabled={!book.available}
              className={`w-full py-2 rounded-lg font-medium transition-colors ${
                book.available 
                  ? 'bg-purple-600 text-white hover:bg-purple-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {book.available ? 'Borrow Book' : 'Not Available'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const HistoryContent = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Reading History</h2>
      <div className="space-y-4">
        {bookHistory.map(book => (
          <div key={book.id} className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{book.title}</h3>
                <p className="text-gray-600 mb-2">by {book.author}</p>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>Borrowed: {book.borrowDate}</p>
                  <p>Returned: {book.returnDate || 'Not returned'}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(book.status)}`}>
                  {book.status}
                </span>
                {book.status === 'returned' && (
                  <div className="mt-2">
                    <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                      Rate & Review
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const FinesContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Fines & Payments</h2>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Outstanding</p>
          <p className="text-2xl font-bold text-red-600">
            ${fines.filter(f => f.status === 'pending').reduce((sum, f) => sum + f.amount, 0).toFixed(2)}
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        {fines.map(fine => (
          <div key={fine.id} className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{fine.bookTitle}</h3>
                <p className="text-gray-600 mb-2">Due Date: {fine.dueDate}</p>
                <p className="text-2xl font-bold text-red-600">${fine.amount.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block ${getStatusColor(fine.status)}`}>
                  {fine.status}
                </span>
                {fine.status === 'pending' && (
                  <div>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      Pay Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const IssuesContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Report Issue</h2>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          New Issue
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Report New Issue</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Issue Type</label>
            <select className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option>Damaged Book</option>
              <option>Missing Pages</option>
              <option>Wrong Book Received</option>
              <option>Account Issue</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Book Title</label>
            <input 
              type="text" 
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter book title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea 
              rows="4"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Describe the issue in detail..."
            ></textarea>
          </div>
          <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors">
            Submit Issue
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Previous Issues</h3>
        {issues.map(issue => (
          <div key={issue.id} className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold">{issue.title}</h4>
                <p className="text-gray-600 mb-1">Book: {issue.book}</p>
                <p className="text-sm text-gray-500">Date: {issue.date}</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(issue.status)}`}>
                  {issue.status}
                </span>
                <p className="text-sm text-gray-500 mt-2">Priority: {issue.priority}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardContent />;
      case 'books': return <BooksContent />;
      case 'search': return <SearchContent />;
      case 'history': return <HistoryContent />;
      case 'fines': return <FinesContent />;
      case 'issues': return <IssuesContent />;
      default: return <DashboardContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 mr-2"
            >
              {isMobileMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </button>
            <div className="flex items-center">
              <FaBook className="w-8 h-8 text-purple-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-800">MyLibrary</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FaBell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-purple-600" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="font-medium">{userData.name}</p>
                <p className="text-sm text-gray-600">{userData.membershipId}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-lg">{userData.avatar}</span>
              </div>
              <FaSignOutAlt className="w-5 h-5 text-gray-600 cursor-pointer hover:text-red-600" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col h-full pt-20 lg:pt-6">
            <nav className="flex-1 px-4 space-y-2">
              {menuItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-colors ${
                      activeTab === item.id
                        ? 'bg-purple-100 text-purple-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Mobile overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;