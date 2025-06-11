import React, { useState, useEffect } from 'react';
import {
  FaChartBar, FaFilter, FaBookOpen,
  FaUsers, FaDollarSign, FaExclamationTriangle,
  FaPrint, FaSearch, FaSpinner
} from 'react-icons/fa';
import {
  getLibrarianDashboard,
  getMostBorrowedBooks,
  getOverdueReport,
  getFinesReport
} from "../../services/librarianApi";

const ReportsPage = () => {
  const [selectedDateRange, setSelectedDateRange] = useState('30days');
  const [selectedReportType, setSelectedReportType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data states
  const [dashboardData, setDashboardData] = useState(null);
  const [mostBorrowedBooks, setMostBorrowedBooks] = useState([]);
  const [overdueReport, setOverdueReport] = useState([]);
  const [finesReport, setFinesReport] = useState([]);

  useEffect(() => {
    fetchAllReportsData();
  }, []);

  const fetchAllReportsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [dashboardResponse, booksResponse, overdueResponse, finesResponse] = await Promise.all([
        getLibrarianDashboard(),
        getMostBorrowedBooks(),
        getOverdueReport(),
        getFinesReport()
      ]);

      // Safely extract nested .data
      setDashboardData(dashboardResponse.data.data || {}); // assuming it's an object
      setMostBorrowedBooks(Array.isArray(booksResponse.data.data) ? booksResponse.data.data : []);
      setOverdueReport(Array.isArray(overdueResponse.data.data) ? overdueResponse.data.data : []);
      setFinesReport(Array.isArray(finesResponse.data.data) ? finesResponse.data.data : []);

    } catch (err) {
      setError('Failed to load reports data');
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <FaSpinner className="w-6 h-6 animate-spin text-indigo-600" />
          <span className="text-lg text-gray-600">Loading reports...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaExclamationTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Reports</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAllReportsData}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>

      <div className="print-content space-y-6 p-4 min-h-screen">
        {/* Header */}
        <div className="rounded-xl   p-6 print-avoid-break">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Library Reports</h1>
              <p className="text-gray-600">Comprehensive analytics and reporting dashboard</p>
              <p className="text-sm text-gray-500 mt-2 print-only">Generated on: {new Date().toLocaleDateString()}</p>
            </div>
            <div className="no-print">
              <button
                onClick={handlePrint}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <FaPrint className="w-4 h-4 mr-2" />
                Print
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Overview */}
        {dashboardData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 print-avoid-break">
            <ReportStatCard
              icon={<FaBookOpen className="w-6 h-6 text-blue-600" />}
              title="Total Books"
              value={dashboardData.totalBooks || 0}
              trend="up"
              color="blue"
            />
            <ReportStatCard
              icon={<FaUsers className="w-6 h-6 text-green-600" />}
              title="Active Members"
              value={dashboardData.totalUsers || 0}
              trend="up"
              color="green"
            />
            <ReportStatCard
              icon={<FaDollarSign className="w-6 h-6 text-purple-600" />}
              title="Total Fines"
              value={`₹${dashboardData.totalFines || 0}`}
              trend="down"
              color="purple"
            />
            <ReportStatCard
              icon={<FaExclamationTriangle className="w-6 h-6 text-red-600" />}
              title="Overdue Items"
              value={overdueReport.length}
              trend="up"
              color="red"
            />
          </div>
        )}

        {/* Main Reports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Most Borrowed Books */}
          <ReportCard
            title="Most Popular Books"
            subtitle="Top borrowed books"
            icon={<FaBookOpen className="w-5 h-5 text-green-600" />}
            type="inventory"
          >
            <PopularBooksList books={mostBorrowedBooks} />
          </ReportCard>

          {/* Overdue Analysis */}
          <ReportCard
            title="Overdue Analysis"
            subtitle="Books that are overdue"
            icon={<FaExclamationTriangle className="w-5 h-5 text-red-600" />}
            type="circulation"
          >
            <OverdueAnalysis overdueItems={overdueReport} />
          </ReportCard>

          {/* Financial Summary */}
          <ReportCard
            title="Financial Summary"
            subtitle="Fines and revenue overview"
            icon={<FaDollarSign className="w-5 h-5 text-orange-600" />}
            type="financial"
          >
            <FinancialSummary finesData={finesReport} />
          </ReportCard>

          {/* Dashboard Summary */}
          {dashboardData && (
            <ReportCard
              title="Library Overview"
              subtitle="General statistics"
              icon={<FaChartBar className="w-5 h-5 text-teal-600" />}
              type="all"
            >
              <DashboardSummary data={dashboardData} />
            </ReportCard>
          )}
        </div>

        {/* Recent Overdue Items Table */}
        <div className="bg-white rounded-xl shadow-sm border print-break">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Recent Overdue Items</h3>
          </div>
          <OverdueItemsTable items={overdueReport} />
        </div>
      </div>
    </>
  );
};

// Report Stat Card Component
const ReportStatCard = ({ icon, title, value, change, trend, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border print-avoid-break">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2 rounded-lg bg-${color}-100`}>
        {icon}
      </div>
      <div className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'} no-print`}>
        {change}
      </div>
    </div>
    <div>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  </div>
);

// Report Card Component
const ReportCard = ({ title, subtitle, icon, children, type }) => (
  <div className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200 print-avoid-break">
    {/* Header */}
    <div className="p-5 border-b border-gray-100 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-gray-100 text-gray-700">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
    </div>

    {/* Body */}
    <div className="p-5">
      {children}
    </div>
  </div>
);

// Popular Books List Component
const PopularBooksList = ({ books }) => {
  if (!books || books.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FaBookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No popular books data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {books.slice(0, 5).map((book, index) => (
        <div key={book._id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <h4 className="font-medium text-gray-800 text-sm">{book.bookDetails?.title || 'Untitled Book'}</h4>
            <p className="text-xs text-gray-600">by {book.bookDetails?.author || 'Unknown Author'}</p>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-gray-800">{book.borrowCount || 0}</div>
            <div className="text-xs text-gray-600">checkouts</div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Overdue Analysis Component
const OverdueAnalysis = ({ overdueItems }) => {
  if (!overdueItems || overdueItems.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FaExclamationTriangle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No overdue items</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="text-center p-4 bg-red-100 rounded-lg shadow-sm">
        <div className="text-4xl font-bold text-red-700">{overdueItems.length}</div>
        <div className="text-sm text-red-800 font-medium">Total Overdue Items</div>
      </div>

      <div className="space-y-3">
        {overdueItems.slice(0, 3).map((item, index) => (
          <div
            key={item._id || index}
            className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm"
          >
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-900">
                📚 {item.book_id?.title || 'Untitled Book'}
              </p>
              <p className="text-xs text-gray-600">👤 {item.user_id?.name || 'Unknown User'}</p>
            </div>
            <span className="px-3 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full">
              {item.daysOverdue ?? 'Overdue'} days
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Financial Summary Component
const FinancialSummary = ({ finesData }) => {
  const totalFines = finesData?.reduce((sum, fine) => sum + (fine.amount || 0), 0) || 0;
  const paidFines = finesData?.filter(fine => fine.status === 'paid').reduce((sum, fine) => sum + (fine.amount || 0), 0) || 0;
  const pendingFines = totalFines - paidFines;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">₹{paidFines}</div>
          <div className="text-sm text-green-700">Collected Fines</div>
        </div>
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">₹{pendingFines}</div>
          <div className="text-sm text-orange-700">Pending Fines</div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total Fines</span>
          <span className="font-medium text-gray-800">₹{totalFines}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total Records</span>
          <span className="font-medium text-gray-800">{finesData?.length || 0}</span>
        </div>
      </div>
    </div>
  );
};

// Dashboard Summary Component
const DashboardSummary = ({ data }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div className="text-center p-4 bg-blue-50 rounded-lg">
        <div className="text-2xl font-bold text-blue-600">{data.totalBooks || 0}</div>
        <div className="text-sm text-blue-700">Total Books</div>
      </div>
      <div className="text-center p-4 bg-green-50 rounded-lg">
        <div className="text-2xl font-bold text-green-600">{data.totalUsers || 0}</div>
        <div className="text-sm text-green-700">Total Users</div>
      </div>
    </div>
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Available Books</span>
        <span className="font-medium text-gray-800">{data.availableBooks || 0}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Borrowed Books</span>
        <span className="font-medium text-gray-800">{data.borrowedBooks || 0}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Pending Requests</span>
        <span className="font-medium text-gray-800">{data.pendingRequests || 0}</span>
      </div>
    </div>
  </div>
);

// Overdue Items Table Component
const OverdueItemsTable = ({ items }) => {
  if (!items || items.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <FaExclamationTriangle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
        <p>No overdue items found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrower</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Overdue</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fine</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.slice(0, 10).map((item, index) => (
            <tr key={item._id || index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {item.bookTitle || item.book_id?.title || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {item.userName || item.user_id?.name || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                {item.daysOverdue ?? 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                ₹{item.fineAmount || 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportsPage;