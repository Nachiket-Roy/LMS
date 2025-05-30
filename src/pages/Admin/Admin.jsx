import { FaBookOpen, FaUsers, FaUserTie, FaChartLine, 
         FaDatabase, FaCog, FaShieldAlt, FaDollarSign, FaBell, FaExclamationTriangle } from 'react-icons/fa';

// Dashboard Content Component
const AdminDashboardContent = ({ adminData, dashboardStats, recentActivities }) => (
  <div className="space-y-6">
    {/* Welcome Section */}
    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Welcome, {adminData.name}!</h2>
          <p className="opacity-90">System Administration Panel - {new Date().toLocaleDateString()}</p>
        </div>
        <div className="text-4xl">{adminData.avatar}</div>
      </div>
    </div>

    {/* Quick Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard 
        icon={<FaUsers className="w-8 h-8 text-blue-600" />}
        label="Total Users"
        value={dashboardStats.totalUsers.toLocaleString()}
        color="text-blue-600"
      />
      <StatCard 
        icon={<FaUserTie className="w-8 h-8 text-green-600" />}
        label="Active Librarians"
        value={dashboardStats.activeLibrarians}
        color="text-green-600"
      />
      <StatCard 
        icon={<FaBookOpen className="w-8 h-8 text-indigo-600" />}
        label="Total Books"
        value={dashboardStats.totalBooks.toLocaleString()}
        color="text-indigo-600"
      />
      <StatCard 
        icon={<FaChartLine className="w-8 h-8 text-purple-600" />}
        label="System Usage"
        value={`${dashboardStats.systemUsage}%`}
        color="text-purple-600"
      />
    </div>

    {/* Additional Admin Stats */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard 
        icon={<FaDatabase className="w-8 h-8 text-teal-600" />}
        label="Database Size"
        value={`${dashboardStats.databaseSize} GB`}
        color="text-teal-600"
      />
      <StatCard 
        icon={<FaShieldAlt className="w-8 h-8 text-orange-600" />}
        label="Security Alerts"
        value={dashboardStats.securityAlerts}
        color="text-orange-600"
      />
      <StatCard 
        icon={<FaDollarSign className="w-8 h-8 text-green-600" />}
        label="Total Revenue"
        value={`$${dashboardStats.totalRevenue.toLocaleString()}`}
        color="text-green-600"
      />
      <StatCard 
        icon={<FaExclamationTriangle className="w-8 h-8 text-red-600" />}
        label="System Issues"
        value={dashboardStats.systemIssues}
        color="text-red-600"
      />
    </div>

    {/* Recent Admin Activities */}
    <AdminActivityFeed activities={recentActivities} />
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

// Admin Activity Feed Component
const AdminActivityFeed = ({ activities }) => (
  <div className="bg-white rounded-xl shadow-sm border p-6">
    <h3 className="text-lg font-semibold mb-4 flex items-center">
      <FaBell className="w-5 h-5 mr-2 text-blue-600" />
      Recent System Activities
    </h3>
    <div className="space-y-3">
      {activities.map(activity => (
        <AdminActivityItem key={activity.id} activity={activity} />
      ))}
    </div>
  </div>
);

// Admin Activity Item Component
const AdminActivityItem = ({ activity }) => {
  const getActivityColor = () => {
    switch(activity.type) {
      case 'user_created': return 'bg-green-500';
      case 'librarian_added': return 'bg-blue-500';
      case 'system_backup': return 'bg-purple-500';
      case 'security_alert': return 'bg-red-500';
      case 'book_added': return 'bg-indigo-500';
      case 'fine_collected': return 'bg-green-500';
      case 'system_maintenance': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getActivityText = () => {
    switch(activity.type) {
      case 'user_created': return `New user "${activity.user}" registered in the system`;
      case 'librarian_added': return `New librarian "${activity.user}" added to staff`;
      case 'system_backup': return `System backup completed successfully`;
      case 'security_alert': return `Security alert: ${activity.details}`;
      case 'book_added': return `${activity.count} new books added to catalog`;
      case 'fine_collected': return `Fine payment of $${activity.amount} collected`;
      case 'system_maintenance': return `System maintenance: ${activity.details}`;
      default: return activity.message || 'System activity recorded';
    }
  };

  const getActivityIcon = () => {
    switch(activity.type) {
      case 'user_created': return <FaUsers className="w-4 h-4" />;
      case 'librarian_added': return <FaUserTie className="w-4 h-4" />;
      case 'system_backup': return <FaDatabase className="w-4 h-4" />;
      case 'security_alert': return <FaShieldAlt className="w-4 h-4" />;
      case 'book_added': return <FaBookOpen className="w-4 h-4" />;
      case 'fine_collected': return <FaDollarSign className="w-4 h-4" />;
      case 'system_maintenance': return <FaCog className="w-4 h-4" />;
      default: return <FaBell className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className={`w-8 h-8 rounded-full ${getActivityColor()} flex items-center justify-center text-white`}>
          {getActivityIcon()}
        </div>
        <div>
          <p className="text-sm font-medium">{getActivityText()}</p>
          <p className="text-xs text-gray-500">{activity.time}</p>
        </div>
      </div>
      {activity.priority === 'high' && (
        <div className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
          High Priority
        </div>
      )}
    </div>
  );
};

// Sample Admin Data (would normally come from props/API)
const sampleAdminData = {
  adminData: {
    name: 'David Martinez',
    avatar: '👨‍💼'
  },
  dashboardStats: {
    totalUsers: 3247,
    activeLibrarians: 12,
    totalBooks: 25890,
    systemUsage: 87,
    databaseSize: 15.8,
    securityAlerts: 3,
    totalRevenue: 45750,
    systemIssues: 1
  },
  recentActivities: [
    { 
      id: 1, 
      type: 'security_alert', 
      details: 'Multiple failed login attempts detected', 
      time: '5 mins ago',
      priority: 'high'
    },
    { 
      id: 2, 
      type: 'librarian_added', 
      user: 'Emily Chen', 
      time: '1 hour ago' 
    },
    { 
      id: 3, 
      type: 'system_backup', 
      time: '2 hours ago' 
    },
    { 
      id: 4, 
      type: 'book_added', 
      count: 50, 
      time: '3 hours ago' 
    },
    { 
      id: 5, 
      type: 'fine_collected', 
      amount: 125.50, 
      time: '4 hours ago' 
    },
    { 
      id: 6, 
      type: 'user_created', 
      user: 'Alice Thompson', 
      time: '5 hours ago' 
    }
  ]
};

// Usage Example
const AdminDashboard = () => (
  <AdminDashboardContent 
    adminData={sampleAdminData.adminData}
    dashboardStats={sampleAdminData.dashboardStats}
    recentActivities={sampleAdminData.recentActivities}
  />
);

export default AdminDashboard;