import { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaBook, 
  FaUsers, 
  FaPlus, 
  FaBell, 
  FaHome, 
  FaBookOpen, 
  FaUserCheck, 
  FaDollarSign, 
  FaFlag, 
  FaEdit,
  FaTrash,
  FaEye,
  FaChartBar,
  FaCog,
  FaUserPlus,
  FaCalendarAlt,
  FaExclamationTriangle
} from 'react-icons/fa';

const LibrarianDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock data for librarian dashboard
   const librarianData = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@library.edu',
    employeeId: 'LIB-ADMIN-001',
    role: 'Head Librarian',
    avatar: '👩‍🏫'
  };

  const dashboardStats = {
    totalBooks: 12547,
    borrowedBooks: 1834,
    activeMembers: 2156,
    overdueBooks: 47,
    pendingReturns: 234,
    newRegistrations: 18,
    dailyCheckouts: 89,
    pendingFines: 245.50
  };

  const recentActivities = [
    { id: 1, type: 'checkout', user: 'John Doe', book: 'React Fundamentals', time: '10 mins ago' },
    { id: 2, type: 'return', user: 'Jane Smith', book: 'JavaScript Mastery', time: '25 mins ago' },
    { id: 3, type: 'registration', user: 'Mike Wilson', book: null, time: '1 hour ago' },
    { id: 4, type: 'overdue', user: 'Lisa Brown', book: 'CSS Grid Guide', time: '2 hours ago' },
    { id: 5, type: 'fine_paid', user: 'Tom Davis', book: 'Python Basics', time: '3 hours ago' }
  ];

  const bookInventory = [
    { id: 1, title: 'React Fundamentals', author: 'Jane Smith', isbn: '978-1234567890', category: 'Programming', status: 'available', copies: 5, borrowed: 2 },
    { id: 2, title: 'JavaScript Mastery', author: 'John Johnson', isbn: '978-0987654321', category: 'Programming', status: 'available', copies: 3, borrowed: 1 },
    { id: 3, title: 'CSS Grid Guide', author: 'Mary Wilson', isbn: '978-1122334455', category: 'Web Design', status: 'low_stock', copies: 2, borrowed: 1 },
    { id: 4, title: 'Python Basics', author: 'Alice Brown', isbn: '978-5566778899', category: 'Programming', status: 'available', copies: 4, borrowed: 0 },
    { id: 5, title: 'Database Design', author: 'Bob Green', isbn: '978-9988776655', category: 'Database', status: 'out_of_stock', copies: 0, borrowed: 3 }
  ];

  const membersList = [
    { id: 1, name: 'John Doe', email: 'john.doe@email.com', membershipId: 'LIB001234', joinDate: '2023-01-15', status: 'active', borrowed: 2, fines: 0 },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@email.com', membershipId: 'LIB001235', joinDate: '2023-02-20', status: 'active', borrowed: 1, fines: 5.50 },
    { id: 3, name: 'Mike Wilson', email: 'mike.wilson@email.com', membershipId: 'LIB001236', joinDate: '2025-05-27', status: 'new', borrowed: 0, fines: 0 },
    { id: 4, name: 'Lisa Brown', email: 'lisa.brown@email.com', membershipId: 'LIB001237', joinDate: '2022-11-10', status: 'suspended', borrowed: 0, fines: 15.00 }
  ];

  const overdueBooks = [
    { id: 1, title: 'Machine Learning', borrower: 'David Black', dueDate: '2025-05-20', daysOverdue: 7, fine: 3.50 },
    { id: 2, title: 'Web Security', borrower: 'Carol White', dueDate: '2025-05-22', daysOverdue: 5, fine: 2.50 },
    { id: 3, title: 'Data Structures', borrower: 'Tom Hardy', dueDate: '2025-05-18', daysOverdue: 9, fine: 4.50 }
  ];

  const reportedIssues = [
    { id: 1, title: 'Damaged book pages', reporter: 'John Doe', book: 'React Fundamentals', status: 'open', priority: 'medium', date: '2025-05-25' },
    { id: 2, title: 'Missing book cover', reporter: 'Jane Smith', book: 'JavaScript Mastery', status: 'in_progress', priority: 'low', date: '2025-05-24' },
    { id: 3, title: 'Wrong edition received', reporter: 'Mike Wilson', book: 'CSS Grid Guide', status: 'resolved', priority: 'high', date: '2025-05-23' }
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaHome },
    { id: 'books', label: 'Book Management', icon: FaBookOpen },
    { id: 'members', label: 'Members', icon: FaUsers },
    { id: 'checkouts', label: 'Check In/Out', icon: FaUserCheck },
    { id: 'overdue', label: 'Overdue Books', icon: FaExclamationTriangle },
    { id: 'reports', label: 'Reports', icon: FaChartBar },
    { id: 'issues', label: 'Issues', icon: FaFlag },
    { id: 'settings', label: 'Settings', icon: FaCog }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-100';
      case 'low_stock': return 'text-orange-600 bg-orange-100';
      case 'out_of_stock': return 'text-red-600 bg-red-100';
      case 'active': return 'text-green-600 bg-green-100';
      case 'suspended': return 'text-red-600 bg-red-100';
      case 'new': return 'text-blue-600 bg-blue-100';
      case 'open': return 'text-red-600 bg-red-100';
      case 'in_progress': return 'text-yellow-600 bg-yellow-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const DashboardContent = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome, {librarianData.name}!</h2>
            <p className="opacity-90">Library Management System - {new Date().toLocaleDateString()}</p>
          </div>
          <div className="text-4xl">{librarianData.avatar}</div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Books</p>
              <p className="text-2xl font-bold text-indigo-600">{dashboardStats.totalBooks.toLocaleString()}</p>
            </div>
            <FaBookOpen className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Members</p>
              <p className="text-2xl font-bold text-green-600">{dashboardStats.activeMembers.toLocaleString()}</p>
            </div>
            <FaUsers className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Books Borrowed</p>
              <p className="text-2xl font-bold text-blue-600">{dashboardStats.borrowedBooks}</p>
            </div>
            <FaUserCheck className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Overdue Books</p>
              <p className="text-2xl font-bold text-red-600">{dashboardStats.overdueBooks}</p>
            </div>
            <FaExclamationTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Today's Checkouts</p>
              <p className="text-2xl font-bold text-purple-600">{dashboardStats.dailyCheckouts}</p>
            </div>
            <FaCalendarAlt className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">New Registrations</p>
              <p className="text-2xl font-bold text-teal-600">{dashboardStats.newRegistrations}</p>
            </div>
            <FaUserPlus className="w-8 h-8 text-teal-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending Returns</p>
              <p className="text-2xl font-bold text-orange-600">{dashboardStats.pendingReturns}</p>
            </div>
            <FaBook className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending Fines</p>
              <p className="text-2xl font-bold text-red-600">${dashboardStats.pendingFines}</p>
            </div>
            <FaDollarSign className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FaBell className="w-5 h-5 mr-2 text-indigo-600" />
          Recent Activities
        </h3>
        <div className="space-y-3">
          {recentActivities.map(activity => (
            <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'checkout' ? 'bg-blue-500' :
                  activity.type === 'return' ? 'bg-green-500' :
                  activity.type === 'registration' ? 'bg-purple-500' :
                  activity.type === 'overdue' ? 'bg-red-500' : 'bg-orange-500'
                }`}></div>
                <div>
                  <p className="text-sm font-medium">
                    {activity.type === 'checkout' && `${activity.user} checked out "${activity.book}"`}
                    {activity.type === 'return' && `${activity.user} returned "${activity.book}"`}
                    {activity.type === 'registration' && `${activity.user} registered as new member`}
                    {activity.type === 'overdue' && `"${activity.book}" is overdue for ${activity.user}`}
                    {activity.type === 'fine_paid' && `${activity.user} paid fine for "${activity.book}"`}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const BooksContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Book Management</h2>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
          <FaPlus className="w-4 h-4 mr-2" />
          Add New Book
        </button>
      </div>

      <div className="flex space-x-4 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search books by title, author, or ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select 
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Books</option>
          <option value="available">Available</option>
          <option value="low_stock">Low Stock</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Copies</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookInventory.map(book => (
                <tr key={book.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{book.title}</div>
                      <div className="text-sm text-gray-500">by {book.author}</div>
                      <div className="text-xs text-gray-400">ISBN: {book.isbn}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{book.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div>Available: {book.copies - book.borrowed}</div>
                    <div className="text-xs text-gray-500">Borrowed: {book.borrowed}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(book.status)}`}>
                      {book.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium space-x-2">
                    <button className="text-indigo-600 hover:text-indigo-900">
                      <FaEye className="w-4 h-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const MembersContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Member Management</h2>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
          <FaUserPlus className="w-4 h-4 mr-2" />
          Add New Member
        </button>
      </div>

      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search members by name, email, or membership ID..."
          className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Membership ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Books</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fines</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {membersList.map(member => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{member.name}</div>
                      <div className="text-sm text-gray-500">{member.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{member.membershipId}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{member.joinDate}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{member.borrowed}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <span className={member.fines > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
                      ${member.fines.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium space-x-2">
                    <button className="text-indigo-600 hover:text-indigo-900">
                      <FaEye className="w-4 h-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <FaEdit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const CheckoutsContent = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Check In / Check Out</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Check Out Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 text-green-600">Check Out Book</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Member ID or Name</label>
              <input 
                type="text" 
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter member ID or search by name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Book ISBN or Title</label>
              <input 
                type="text" 
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Scan barcode or enter ISBN/title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
              <input 
                type="date" 
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                defaultValue="2025-06-10"
              />
            </div>
            <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors">
              Check Out Book
            </button>
          </div>
        </div>

        {/* Check In Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 text-blue-600">Check In Book</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Book ISBN or Title</label>
              <input 
                type="text" 
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Scan barcode or enter ISBN/title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Book Condition</label>
              <select className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Excellent</option>
                <option>Good</option>
                <option>Fair</option>
                <option>Poor</option>
                <option>Damaged</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
              <textarea 
                rows="3"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Any notes about the book condition..."
              ></textarea>
            </div>
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Check In Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const OverdueContent = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold">Overdue Books</h2>
      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
        Send Reminders
      </button>
    </div>

    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrower</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Overdue</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fine</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {overdueBooks.map(book => (
              <tr key={book.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{book.title}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{book.borrower}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{book.dueDate}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                    {book.daysOverdue} days
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-red-600">${book.fine.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm font-medium space-x-2">
                  <button className="text-blue-600 hover:text-blue-900 text-xs bg-blue-100 px-2 py-1 rounded">
                    Send Reminder
                  </button>
                  <button className="text-green-600 hover:text-green-900 text-xs bg-green-100 px-2 py-1 rounded">
                    Mark Returned
                  </button>
                  <button className="text-orange-600 hover:text-orange-900 text-xs bg-orange-100 px-2 py-1 rounded">
                    Extend Due Date
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Summary Stats */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded-xl shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Total Overdue</p>
            <p className="text-2xl font-bold text-red-600">{overdueBooks.length}</p>
          </div>
          <FaExclamationTriangle className="w-8 h-8 text-red-600" />
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Total Fines</p>
            <p className="text-2xl font-bold text-orange-600">
              ${overdueBooks.reduce((sum, book) => sum + book.fine, 0).toFixed(2)}
            </p>
          </div>
          <FaDollarSign className="w-8 h-8 text-orange-600" />
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Avg Days Overdue</p>
            <p className="text-2xl font-bold text-purple-600">
              {Math.round(overdueBooks.reduce((sum, book) => sum + book.daysOverdue, 0) / overdueBooks.length)}
            </p>
          </div>
          <FaCalendarAlt className="w-8 h-8 text-purple-600" />
        </div>
      </div>
    </div>
  </div>
);
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile menu button */}
      <div className="md:hidden bg-white shadow-sm p-4 flex justify-between items-center">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-500 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="text-lg font-semibold text-indigo-600">Library Dashboard</div>
        <div className="w-6"></div> {/* Spacer for alignment */}
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block w-64 bg-white shadow-md fixed h-full z-10`}>
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{librarianData.avatar}</div>
              <div>
                <div className="font-medium">{librarianData.name}</div>
                <div className="text-xs text-gray-500">{librarianData.role}</div>
              </div>
            </div>
          </div>
          
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id 
                        ? 'bg-indigo-50 text-indigo-600' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 md:ml-64 p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
            </h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button className="p-2 text-gray-500 hover:text-gray-600 relative">
                <FaBell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
          
          {/* Content area */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            {activeTab === 'dashboard' && <DashboardContent />}
            {activeTab === 'books' && <BooksContent />}
            {activeTab === 'members' && <MembersContent />}
            {activeTab === 'checkouts' && <CheckoutsContent />}
            {activeTab === 'overdue' && <OverdueContent />}
          </div>
        </div>
      </div>
    </div>
  );
};


export default LibrarianDashboard;