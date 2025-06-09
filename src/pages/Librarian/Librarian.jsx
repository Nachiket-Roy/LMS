import React, { useState } from 'react';
import { 
  FaBook, 
  FaCalendarAlt, 
  FaDollarSign, 
  FaClock, 
  FaBookOpen, 
  FaExclamationTriangle, 
  FaCheckCircle,
  FaHistory,
  FaUsers,
  FaChartLine,
  FaClipboardList,
  FaArrowRight,
  FaEye
} from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const LibrarianDashboard = () => {
  // Mock data - in real app this would come from API
  const pendingRequests = [
    {
      id: 1,
      user: "John Doe",
      bookTitle: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      requestDate: "2024-06-01",
      status: "pending"
    },
    {
      id: 2,
      user: "Jane Smith",
      bookTitle: "To Kill a Mockingbird",
      author: "Harper Lee",
      requestDate: "2024-06-02",
      status: "pending"
    }
  ];

  const overdueBooks = [
    {
      id: 1,
      user: "Michael Brown",
      bookTitle: "1984",
      author: "George Orwell",
      dueDate: "2024-05-28",
      daysOverdue: 7
    }
  ];

  const recentTransactions = [
    {
      id: 1,
      user: "Emily Davis",
      bookTitle: "Atomic Habits",
      action: "issued",
      date: "2024-06-03"
    },
    {
      id: 2,
      user: "Robert Wilson",
      bookTitle: "The Psychology of Money",
      action: "returned",
      date: "2024-06-02"
    }
  ];

  const quickStats = {
    pendingRequests: 2,
    booksIssuedToday: 5,
    overdueBooks: 1,
    totalFines: 35.00
  };

  return (
    <div className="flex-1 md:ml-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Librarian Dashboard</h1>
          <p className="text-gray-600">Manage book requests, inventory, and user interactions</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaClipboardList className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-900">{quickStats.pendingRequests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaBookOpen className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Issued Today</p>
                <p className="text-2xl font-bold text-gray-900">{quickStats.booksIssuedToday}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaClock className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue Books</p>
                <p className="text-2xl font-bold text-gray-900">{quickStats.overdueBooks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaDollarSign className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Fines</p>
                <p className="text-2xl font-bold text-gray-900">${quickStats.totalFines.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 rounded-lg shadow-sm mb-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold mb-2">Quick Actions</h2>
              <p className="text-blue-100">Manage library operations efficiently</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
              <NavLink
                to="/librarian/requests"
                className="flex flex-col items-center justify-center bg-white text-blue-600 px-4 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
              >
                <FaClipboardList className="h-6 w-6 mb-1" />
                <span className="text-sm">Requests</span>
              </NavLink>
              <NavLink
                to="/librarian/inventory"
                className="flex flex-col items-center justify-center bg-white text-blue-600 px-4 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
              >
                <FaBook className="h-6 w-6 mb-1" />
                <span className="text-sm">Inventory</span>
              </NavLink>
              <NavLink
                to="/librarian/fines"
                className="flex flex-col items-center justify-center bg-white text-blue-600 px-4 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
              >
                <FaDollarSign className="h-6 w-6 mb-1" />
                <span className="text-sm">Fines</span>
              </NavLink>
              <NavLink
                to="/librarian/reports"
                className="flex flex-col items-center justify-center bg-white text-blue-600 px-4 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
              >
                <FaChartLine className="h-6 w-6 mb-1" />
                <span className="text-sm">Reports</span>
              </NavLink>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Requests */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Pending Book Requests</h2>
              <NavLink to="/librarian/requests" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All
              </NavLink>
            </div>
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{request.bookTitle}</h3>
                      <p className="text-sm text-gray-600">by {request.author}</p>
                      <p className="text-sm text-gray-600 mt-1">Requested by: {request.user}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {new Date(request.requestDate).toLocaleDateString()}
                      </p>
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

          {/* Overdue Books */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Overdue Books</h2>
              <NavLink to="/librarian/overdue" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All
              </NavLink>
            </div>
            <div className="space-y-4">
              {overdueBooks.map((book) => (
                <div key={book.id} className="border rounded-lg p-4 bg-yellow-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{book.bookTitle}</h3>
                      <p className="text-sm text-gray-600">by {book.author}</p>
                      <p className="text-sm text-yellow-600 mt-1">
                        {book.daysOverdue} days overdue
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {book.user}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Due: {new Date(book.dueDate).toLocaleDateString()}
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
            <NavLink to="/librarian/transactions" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
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
                    View
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
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-blue-600 hover:text-blue-900">
                        <FaEye className="h-4 w-4" />
                      </button>
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

export default LibrarianDashboard;