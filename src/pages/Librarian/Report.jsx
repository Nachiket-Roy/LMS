import React, { useState } from 'react';
import { 
  FaChartBar, FaDownload, FaFilter, FaCalendarAlt, FaBookOpen, 
  FaUsers, FaDollarSign, FaExclamationTriangle, 
  FaFileAlt, FaPrint, FaSearch, FaChartLine, FaChartPie
} from 'react-icons/fa';

const ReportsPage = () => {
  const [selectedDateRange, setSelectedDateRange] = useState('30days');
  const [selectedReportType, setSelectedReportType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6 p-6  min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Library Reports</h1>
            <p className="text-gray-600">Comprehensive analytics and reporting dashboard</p>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              <FaDownload className="w-4 h-4 mr-2" />
              Export All
            </button>
            <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              <FaPrint className="w-4 h-4 mr-2" />
              Print
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <FaFilter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <select 
            value={selectedDateRange} 
            onChange={(e) => setSelectedDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>

          <select 
            value={selectedReportType} 
            onChange={(e) => setSelectedReportType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Reports</option>
            <option value="circulation">Circulation</option>
            <option value="membership">Membership</option>
            <option value="financial">Financial</option>
            <option value="inventory">Inventory</option>
          </select>

          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ReportStatCard 
          icon={<FaBookOpen className="w-6 h-6 text-blue-600" />}
          title="Total Circulation"
          value="2,847"
          change="+12.5%"
          trend="up"
          color="blue"
        />
        <ReportStatCard 
          icon={<FaUsers className="w-6 h-6 text-green-600" />}
          title="Active Members"
          value="1,523"
          change="+8.3%"
          trend="up"
          color="green"
        />
        <ReportStatCard 
          icon={<FaDollarSign className="w-6 h-6 text-purple-600" />}
          title="Revenue"
          value="$3,247"
          change="-2.1%"
          trend="down"
          color="purple"
        />
        <ReportStatCard 
          icon={<FaExclamationTriangle className="w-6 h-6 text-red-600" />}
          title="Overdue Items"
          value="89"
          change="-15.4%"
          trend="up"
          color="red"
        />
      </div>

      {/* Main Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Circulation Report */}
        <ReportCard
          title="Circulation Analytics"
          subtitle="Book checkout and return trends"
          icon={<FaChartLine className="w-5 h-5 text-blue-600" />}
          type="circulation"
        >
          <CirculationChart />
        </ReportCard>

        {/* Popular Books */}
        <ReportCard
          title="Most Popular Books"
          subtitle="Top borrowed books this month"
          icon={<FaDollarSign className="w-5 h-5 text-green-600" />}
          type="inventory"
        >
          <PopularBooksList />
        </ReportCard>

        {/* Member Demographics */}
        <ReportCard
          title="Member Demographics"
          subtitle="User distribution by category"
          icon={<FaChartPie className="w-5 h-5 text-purple-600" />}
          type="membership"
        >
          <MembershipChart />
        </ReportCard>

        {/* Financial Summary */}
        <ReportCard
          title="Financial Summary"
          subtitle="Revenue and fines overview"
          icon={<FaDollarSign className="w-5 h-5 text-orange-600" />}
          type="financial"
        >
          <FinancialSummary />
        </ReportCard>

        {/* Overdue Analysis */}
        <ReportCard
          title="Overdue Analysis"
          subtitle="Late returns and fine collections"
          icon={<FaExclamationTriangle className="w-5 h-5 text-red-600" />}
          type="circulation"
        >
          <OverdueAnalysis />
        </ReportCard>

        {/* Library Usage Patterns */}
        <ReportCard
          title="Usage Patterns"
          subtitle="Daily and hourly usage statistics"
          icon={<FaChartBar className="w-5 h-5 text-teal-600" />}
          type="all"
        >
          <UsagePatterns />
        </ReportCard>
      </div>

      {/* Detailed Reports Table */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Recent Report Activities</h3>
        </div>
        <RecentActivitiesTable />
      </div>
    </div>
  );
};

// Report Stat Card Component
const ReportStatCard = ({ icon, title, value, change, trend, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2 rounded-lg bg-${color}-100`}>
        {icon}
      </div>
      <div className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
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
  <div className="bg-white rounded-xl shadow-sm border">
    <div className="p-6 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {icon}
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-600">{subtitle}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <FaDownload className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <FaFileAlt className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

// Circulation Chart Component
const CirculationChart = () => (
  <div className="space-y-4">
    <div className="flex justify-between text-sm text-gray-600">
      <span>Checkouts</span>
      <span>Returns</span>
    </div>
    {[
      { day: 'Mon', checkouts: 85, returns: 67 },
      { day: 'Tue', checkouts: 92, returns: 71 },
      { day: 'Wed', checkouts: 78, returns: 89 },
      { day: 'Thu', checkouts: 96, returns: 82 },
      { day: 'Fri', checkouts: 103, returns: 95 },
      { day: 'Sat', checkouts: 67, returns: 54 },
      { day: 'Sun', checkouts: 45, returns: 38 }
    ].map(day => (
      <div key={day.day} className="flex items-center space-x-4">
        <div className="w-8 text-sm text-gray-600">{day.day}</div>
        <div className="flex-1 flex space-x-2">
          <div className="flex-1 bg-gray-200 rounded-full h-6 flex items-center">
            <div 
              className="bg-blue-500 h-full rounded-full flex items-center justify-center text-white text-xs font-medium"
              style={{ width: `${(day.checkouts / 120) * 100}%` }}
            >
              {day.checkouts > 50 ? day.checkouts : ''}
            </div>
          </div>
          <div className="flex-1 bg-gray-200 rounded-full h-6 flex items-center">
            <div 
              className="bg-green-500 h-full rounded-full flex items-center justify-center text-white text-xs font-medium"
              style={{ width: `${(day.returns / 120) * 100}%` }}
            >
              {day.returns > 50 ? day.returns : ''}
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Popular Books List Component
const PopularBooksList = () => (
  <div className="space-y-3">
    {[
      { title: 'The Psychology of Programming', author: 'Gerald Weinberg', checkouts: 47 },
      { title: 'Clean Code', author: 'Robert Martin', checkouts: 42 },
      { title: 'Design Patterns', author: 'Gang of Four', checkouts: 38 },
      { title: 'JavaScript: The Good Parts', author: 'Douglas Crockford', checkouts: 35 },
      { title: 'Refactoring', author: 'Martin Fowler', checkouts: 31 }
    ].map((book, index) => (
      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex-1">
          <h4 className="font-medium text-gray-800 text-sm">{book.title}</h4>
          <p className="text-xs text-gray-600">by {book.author}</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-gray-800">{book.checkouts}</div>
          <div className="text-xs text-gray-600">checkouts</div>
        </div>
      </div>
    ))}
  </div>
);

// Membership Chart Component
const MembershipChart = () => (
  <div className="space-y-4">
    {[
      { category: 'Students', count: 856, percentage: 56, color: 'bg-blue-500' },
      { category: 'Faculty', count: 234, percentage: 15, color: 'bg-green-500' },
      { category: 'Staff', count: 187, percentage: 12, color: 'bg-purple-500' },
      { category: 'Public', count: 246, percentage: 17, color: 'bg-orange-500' }
    ].map(item => (
      <div key={item.category} className="flex items-center space-x-4">
        <div className="w-20 text-sm text-gray-600">{item.category}</div>
        <div className="flex-1 bg-gray-200 rounded-full h-6 flex items-center">
          <div 
            className={`${item.color} h-full rounded-full flex items-center justify-center text-white text-xs font-medium`}
            style={{ width: `${item.percentage}%` }}
          >
            {item.percentage}%
          </div>
        </div>
        <div className="w-12 text-sm text-gray-800 font-medium">{item.count}</div>
      </div>
    ))}
  </div>
);

// Financial Summary Component
const FinancialSummary = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div className="text-center p-4 bg-green-50 rounded-lg">
        <div className="text-2xl font-bold text-green-600">$2,847</div>
        <div className="text-sm text-green-700">Membership Fees</div>
      </div>
      <div className="text-center p-4 bg-orange-50 rounded-lg">
        <div className="text-2xl font-bold text-orange-600">$400</div>
        <div className="text-sm text-orange-700">Late Fees</div>
      </div>
    </div>
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">This Month</span>
        <span className="font-medium text-gray-800">$3,247</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Last Month</span>
        <span className="font-medium text-gray-800">$3,156</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Growth</span>
        <span className="font-medium text-green-600">+2.9%</span>
      </div>
    </div>
  </div>
);

// Overdue Analysis Component
const OverdueAnalysis = () => (
  <div className="space-y-4">
    <div className="text-center p-4 bg-red-50 rounded-lg">
      <div className="text-3xl font-bold text-red-600">89</div>
      <div className="text-sm text-red-700">Overdue Items</div>
    </div>
    <div className="space-y-2">
      {[
        { range: '1-7 days', count: 34, color: 'bg-yellow-500' },
        { range: '8-14 days', count: 28, color: 'bg-orange-500' },
        { range: '15+ days', count: 27, color: 'bg-red-500' }
      ].map(item => (
        <div key={item.range} className="flex items-center justify-between">
          <span className="text-sm text-gray-600">{item.range}</span>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
            <span className="text-sm font-medium">{item.count}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Usage Patterns Component
const UsagePatterns = () => (
  <div className="space-y-4">
    <div className="text-sm text-gray-600 mb-2">Peak Hours</div>
    {[
      { time: '9-11 AM', usage: 85 },
      { time: '2-4 PM', usage: 92 },
      { time: '6-8 PM', usage: 76 }
    ].map(period => (
      <div key={period.time} className="flex items-center space-x-4">
        <div className="w-16 text-sm text-gray-600">{period.time}</div>
        <div className="flex-1 bg-gray-200 rounded-full h-4">
          <div 
            className="bg-teal-500 h-full rounded-full"
            style={{ width: `${period.usage}%` }}
          ></div>
        </div>
        <div className="text-sm font-medium text-gray-800">{period.usage}%</div>
      </div>
    ))}
  </div>
);

// Recent Activities Table Component
const RecentActivitiesTable = () => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Type</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Generated By</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {[
          { type: 'Monthly Circulation', user: 'Sarah Johnson', date: '2025-05-29', status: 'Completed' },
          { type: 'Financial Summary', user: 'Mike Davis', date: '2025-05-28', status: 'Completed' },
          { type: 'Overdue Report', user: 'Sarah Johnson', date: '2025-05-27', status: 'Processing' },
          { type: 'Member Analytics', user: 'Lisa Chen', date: '2025-05-26', status: 'Completed' }
        ].map((report, index) => (
          <tr key={index} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.type}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{report.user}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{report.date}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                report.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {report.status}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              <div className="flex space-x-2">
                <button className="text-indigo-600 hover:text-indigo-900">View</button>
                <button className="text-gray-600 hover:text-gray-900">Download</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ReportsPage;