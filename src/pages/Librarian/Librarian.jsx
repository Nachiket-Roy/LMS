import { FaBookOpen, FaUsers, FaUserCheck, FaExclamationTriangle, 
         FaCalendarAlt, FaUserPlus, FaBook, FaDollarSign, FaBell } from 'react-icons/fa';

// Dashboard Content Component
const DashboardContent = ({ librarianData, dashboardStats, recentActivities }) => (
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
      <StatCard 
        icon={<FaBookOpen className="w-8 h-8 text-indigo-600" />}
        label="Total Books"
        value={dashboardStats.totalBooks.toLocaleString()}
        color="text-indigo-600"
      />
      <StatCard 
        icon={<FaUsers className="w-8 h-8 text-green-600" />}
        label="Active Members"
        value={dashboardStats.activeMembers.toLocaleString()}
        color="text-green-600"
      />
      <StatCard 
        icon={<FaUserCheck className="w-8 h-8 text-blue-600" />}
        label="Books Borrowed"
        value={dashboardStats.borrowedBooks}
        color="text-blue-600"
      />
      <StatCard 
        icon={<FaExclamationTriangle className="w-8 h-8 text-red-600" />}
        label="Overdue Books"
        value={dashboardStats.overdueBooks}
        color="text-red-600"
      />
    </div>

    {/* Additional Stats */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard 
        icon={<FaCalendarAlt className="w-8 h-8 text-purple-600" />}
        label="Today's Checkouts"
        value={dashboardStats.dailyCheckouts}
        color="text-purple-600"
      />
      <StatCard 
        icon={<FaUserPlus className="w-8 h-8 text-teal-600" />}
        label="New Registrations"
        value={dashboardStats.newRegistrations}
        color="text-teal-600"
      />
      <StatCard 
        icon={<FaBook className="w-8 h-8 text-orange-600" />}
        label="Pending Returns"
        value={dashboardStats.pendingReturns}
        color="text-orange-600"
      />
      <StatCard 
        icon={<FaDollarSign className="w-8 h-8 text-red-600" />}
        label="Pending Fines"
        value={`$${dashboardStats.pendingFines}`}
        color="text-red-600"
      />
    </div>

    {/* Recent Activities */}
    <ActivityFeed activities={recentActivities} />
  </div>
);

// Reusable Stat Card Component
const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm">{label}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
      </div>
      {icon}
    </div>
  </div>
);

// Activity Feed Component
const ActivityFeed = ({ activities }) => (
  <div className="bg-white rounded-xl shadow-sm border p-6">
    <h3 className="text-lg font-semibold mb-4 flex items-center">
      <FaBell className="w-5 h-5 mr-2 text-indigo-600" />
      Recent Activities
    </h3>
    <div className="space-y-3">
      {activities.map(activity => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
    </div>
  </div>
);

// Activity Item Component
const ActivityItem = ({ activity }) => {
  const getActivityColor = () => {
    switch(activity.type) {
      case 'checkout': return 'bg-blue-500';
      case 'return': return 'bg-green-500';
      case 'registration': return 'bg-purple-500';
      case 'overdue': return 'bg-red-500';
      default: return 'bg-orange-500';
    }
  };

  const getActivityText = () => {
    switch(activity.type) {
      case 'checkout': return `${activity.user} checked out "${activity.book}"`;
      case 'return': return `${activity.user} returned "${activity.book}"`;
      case 'registration': return `${activity.user} registered as new member`;
      case 'overdue': return `"${activity.book}" is overdue for ${activity.user}`;
      case 'fine_paid': return `${activity.user} paid fine for "${activity.book}"`;
      default: return '';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className={`w-2 h-2 rounded-full ${getActivityColor()}`}></div>
        <div>
          <p className="text-sm font-medium">{getActivityText()}</p>
          <p className="text-xs text-gray-500">{activity.time}</p>
        </div>
      </div>
    </div>
  );
};

// Sample Data (would normally come from props/API)
const sampleData = {
  librarianData: {
    name: 'Sarah Johnson',
    avatar: '👩‍🏫'
  },
  dashboardStats: {
    totalBooks: 12547,
    borrowedBooks: 1834,
    activeMembers: 2156,
    overdueBooks: 47,
    pendingReturns: 234,
    newRegistrations: 18,
    dailyCheckouts: 89,
    pendingFines: 245.50
  },
  recentActivities: [
    { id: 1, type: 'checkout', user: 'John Doe', book: 'React Fundamentals', time: '10 mins ago' },
    { id: 2, type: 'return', user: 'Jane Smith', book: 'JavaScript Mastery', time: '25 mins ago' },
    { id: 3, type: 'registration', user: 'Mike Wilson', time: '1 hour ago' }
  ]
};

// Usage Example
const LibrarianDashboard = () => (
  <DashboardContent 
    librarianData={sampleData.librarianData}
    dashboardStats={sampleData.dashboardStats}
    recentActivities={sampleData.recentActivities}
  />
);

export default LibrarianDashboard;