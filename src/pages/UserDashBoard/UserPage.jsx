import { useState } from 'react';
import {
  FaBookOpen,
  FaHistory,
  FaDollarSign,
  FaFlag,
  FaBell,
  FaExclamationCircle
} from 'react-icons/fa';
import Welcome from '../../components/Welcome';

const UserPage = () => {
  const [notifications] = useState([
    { id: 1, message: "Book 'React Fundamentals' is due in 2 days", type: 'warning', time: '2h ago' },
    { id: 2, message: "New book 'Advanced JavaScript' available", type: 'info', time: '1d ago' },
    { id: 3, message: "Fine payment reminder: $5.50", type: 'error', time: '3d ago' }
  ]);

  const borrowedBooks = [
    { id: 1, title: 'React Fundamentals', author: 'Jane Smith', dueDate: '2025-05-29', status: 'due-soon' },
    { id: 2, title: 'JavaScript Mastery', author: 'John Johnson', dueDate: '2025-06-05', status: 'active' },
    { id: 3, title: 'CSS Grid Guide', author: 'Mary Wilson', dueDate: '2025-06-10', status: 'active' }
  ];

  const bookHistory = [
    { status: 'returned' }, { status: 'returned' }, { status: 'returned' }, { status: 'overdue' }
  ];

  const fines = [
    { amount: 5.50, status: 'pending' },
    { amount: 3.00, status: 'paid' }
  ];

  const issues = [
    { status: 'open' },
    { status: 'resolved' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'due-soon': return 'text-orange-600 bg-orange-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      case 'active': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen ">
      <Welcome/>
      {/* Main content container with responsive padding */}
      <div className="pt-6">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">

          {/* Quick Stats - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Active Books</p>
                  <p className="text-2xl sm:text-3xl font-bold text-purple-600">{borrowedBooks.length}</p>
                </div>
                <FaBookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Books Read</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">
                    {bookHistory.filter(b => b.status === 'returned').length}
                  </p>
                </div>
                <FaHistory className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Pending Fines</p>
                  <p className="text-2xl sm:text-3xl font-bold text-orange-600">
                    ${fines.filter(f => f.status === 'pending').reduce((sum, f) => sum + f.amount, 0).toFixed(2)}
                  </p>
                </div>
                <FaDollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Open Issues</p>
                  <p className="text-2xl sm:text-3xl font-bold text-red-600">
                    {issues.filter(i => i.status === 'open').length}
                  </p>
                </div>
                <FaFlag className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
              </div>
            </div>
          </div>

          {/* Currently Borrowed */}
          <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
              <FaBookOpen className="w-5 h-5 mr-2 text-purple-600" />
              Currently Borrowed
            </h3>
            <div className="space-y-3">
              {borrowedBooks.map(book => (
                <div key={book.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-3 sm:gap-0">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm sm:text-base">{book.title}</h4>
                    <p className="text-xs sm:text-sm text-gray-600">by {book.author}</p>
                  </div>
                  <div className="flex flex-col sm:text-right">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Due: {book.dueDate}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${getStatusColor(book.status)}`}>
                      {book.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Notifications */}
          <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
              <FaBell className="w-5 h-5 mr-2 text-purple-600" />
              Recent Notifications
            </h3>
            <div className="space-y-3">
              {notifications.map(notification => (
                <div key={notification.id} className="flex items-start space-x-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <FaExclamationCircle className={`w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0 ${notification.type === 'error' ? 'text-red-500' :
                      notification.type === 'warning' ? 'text-orange-500' :
                        'text-blue-500'
                    }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm break-words">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserPage;