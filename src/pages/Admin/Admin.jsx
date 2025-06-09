import React from 'react';
import {
  FaUsers,
  FaUserShield,
  FaBook,
  FaChartLine,
  FaMoneyBillWave,
  FaHistory,
  FaClipboardList,
  FaUniversity,
  FaCog
} from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const AdminDashboard = () => {
  // Mock data - replace with API calls in a real app
  const quickStats = {
    totalUsers: 1243,
    activeLibrarians: 18,
    totalBooks: 9560,
    overdueFines: 420.50,
    pendingApprovals: 2
  };

  const recentTransactions = [
    {
      id: 1,
      user: "Emily Davis",
      bookTitle: "Atomic Habits",
      action: "issued",
      date: "2024-06-03",
      fine: 0
    },
    {
      id: 2,
      user: "Robert Wilson",
      bookTitle: "The Psychology of Money",
      action: "returned",
      date: "2024-06-02",
      fine: 5.00
    }
  ];

  const topBooks = [
    { id: 1, title: "Atomic Habits", author: "James Clear", borrowCount: 42 },
    { id: 2, title: "1984", author: "George Orwell", borrowCount: 38 }
  ];

  return (
    <div className="flex-1 md:ml-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Global overview of library operations</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaUsers className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{quickStats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaUserShield className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Librarians</p>
                <p className="text-2xl font-bold text-gray-900">{quickStats.activeLibrarians}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaBook className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Books</p>
                <p className="text-2xl font-bold text-gray-900">{quickStats.totalBooks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaMoneyBillWave className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue Fines</p>
                <p className="text-2xl font-bold text-gray-900">${quickStats.overdueFines.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 rounded-lg shadow-sm mb-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold mb-2">Admin Actions</h2>
              <p className="text-blue-100">Manage library system operations</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
              <NavLink
                to="/admin/users"
                className="flex flex-col items-center justify-center bg-white text-blue-600 px-4 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
              >
                <FaUsers className="h-6 w-6 mb-1" />
                <span className="text-sm">Users</span>
              </NavLink>
              <NavLink
                to="/admin/librarians"
                className="flex flex-col items-center justify-center bg-white text-blue-600 px-4 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
              >
                <FaUserShield className="h-6 w-6 mb-1" />
                <span className="text-sm">Librarians</span>
              </NavLink>
              <NavLink
                to="/admin/reports"
                className="flex flex-col items-center justify-center bg-white text-blue-600 px-4 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
              >
                <FaChartLine className="h-6 w-6 mb-1" />
                <span className="text-sm">Reports</span>
              </NavLink>
              <NavLink
                to="/admin/settings"
                className="flex flex-col items-center justify-center bg-white text-blue-600 px-4 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
              >
                <FaCog className="h-6 w-6 mb-1" />
                <span className="text-sm">Settings</span>
              </NavLink>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Approvals */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Pending Approvals</h2>
              <NavLink to="/admin/approvals" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All
              </NavLink>
            </div>
            <div className="space-y-4">
              {Array.from({ length: quickStats.pendingApprovals }).map((_, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">Librarian Application #{index + 1}</h3>
                      <p className="text-sm text-gray-600">New librarian registration pending review</p>
                    </div>
                    <div className="text-right">
                      <div className="mt-2 space-x-2">
                        <button className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                          Approve
                        </button>
                        <button className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Borrowed Books */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Top Borrowed Books</h2>
              <NavLink to="/admin/books" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All
              </NavLink>
            </div>
            <div className="space-y-4">
              {topBooks.map((book) => (
                <div key={book.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{book.title}</h3>
                      <p className="text-sm text-gray-600">by {book.author}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {book.borrowCount} borrows
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
            <NavLink to="/admin/transactions" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
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
                    Book
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fine
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.bookTitle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.action === 'issued' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {transaction.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${transaction.fine.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;