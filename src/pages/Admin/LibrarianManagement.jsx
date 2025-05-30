import React, { useState } from 'react';
import { FaUserTie, FaUserCheck, FaChartBar, FaShieldAlt, FaClock, FaBook, FaUsers, 
         FaCheckCircle, FaTimesCircle, FaEye, FaEdit, FaTrash, FaStar, FaCalendar,
         FaSearch, FaFilter, FaUserPlus, FaExclamationTriangle, FaSave, FaUndo,
         FaChartLine, FaTasks, FaAward, FaHistory, FaCog, FaKey, FaLock } from 'react-icons/fa';

// Main Librarian Management Component
const LibrarianManagement = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingLibrarians, setPendingLibrarians] = useState(samplePendingLibrarians);
  const [activeLibrarians, setActiveLibrarians] = useState(sampleActiveLibrarians);
  const [selectedLibrarian, setSelectedLibrarian] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('approve');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const tabs = [
    { id: 'pending', label: 'Pending Approvals', icon: <FaUserCheck />, count: pendingLibrarians.length },
    { id: 'active', label: 'Active Librarians', icon: <FaUserTie />, count: activeLibrarians.length },
    { id: 'performance', label: 'Performance Metrics', icon: <FaChartBar /> },
    { id: 'access', label: 'Access Controls', icon: <FaShieldAlt /> }
  ];

  const handleApproveLibrarian = (librarian) => {
    setSelectedLibrarian(librarian);
    setModalType('approve');
    setShowModal(true);
  };

  const handleRejectLibrarian = (librarian) => {
    setSelectedLibrarian(librarian);
    setModalType('reject');
    setShowModal(true);
  };

  const handleViewDetails = (librarian) => {
    setSelectedLibrarian(librarian);
    setModalType('view');
    setShowModal(true);
  };

  const handleEditAccess = (librarian) => {
    setSelectedLibrarian(librarian);
    setModalType('access');
    setShowModal(true);
  };

  const handleEditPerformance = (librarian) => {
    setSelectedLibrarian(librarian);
    setModalType('performance');
    setShowModal(true);
  };

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Librarian Management</h1>
              <p className="text-gray-600 mt-1">Manage librarian approvals, performance, and access controls</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 text-orange-600 px-3 py-2 rounded-lg">
                <span className="font-medium">{pendingLibrarians.length}</span> Pending
              </div>
              <div className="bg-green-100 text-green-600 px-3 py-2 rounded-lg">
                <span className="font-medium">{activeLibrarians.length}</span> Active
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border mb-6">
          <div className="flex border-b overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.count && (
                  <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'pending' && (
          <PendingApprovalsTab
            librarians={pendingLibrarians}
            onApprove={handleApproveLibrarian}
            onReject={handleRejectLibrarian}
            onViewDetails={handleViewDetails}
          />
        )}

        {activeTab === 'active' && (
          <ActiveLibrariansTab
            librarians={activeLibrarians}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onViewDetails={handleViewDetails}
            onEditAccess={handleEditAccess}
            onEditPerformance={handleEditPerformance}
          />
        )}

        {activeTab === 'performance' && (
          <PerformanceMetricsTab librarians={activeLibrarians} />
        )}

        {activeTab === 'access' && (
          <AccessControlsTab librarians={activeLibrarians} onEditAccess={handleEditAccess} />
        )}

        {/* Modal */}
        {showModal && (
          <LibrarianModal
            type={modalType}
            librarian={selectedLibrarian}
            pendingLibrarians={pendingLibrarians}
            setPendingLibrarians={setPendingLibrarians}
            activeLibrarians={activeLibrarians}
            setActiveLibrarians={setActiveLibrarians}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
};

// Pending Approvals Tab
const PendingApprovalsTab = ({ librarians, onApprove, onReject, onViewDetails }) => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl shadow-sm border p-4">
      <h3 className="text-lg font-semibold mb-4">Librarian Applications Pending Review</h3>
      <div className="space-y-4">
        {librarians.map(librarian => (
          <div key={librarian.id} className="border rounded-lg p-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {librarian.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{librarian.name}</h4>
                  <p className="text-gray-600">{librarian.email}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-500">
                      <FaCalendar className="inline w-3 h-3 mr-1" />
                      Applied: {librarian.applicationDate}
                    </span>
                    <span className="text-sm text-gray-500">
                      <FaBook className="inline w-3 h-3 mr-1" />
                      Experience: {librarian.experience} years
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onViewDetails(librarian)}
                  className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50"
                  title="View Details"
                >
                  <FaEye />
                </button>
                <button
                  onClick={() => onApprove(librarian)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                >
                  <FaCheckCircle />
                  <span>Approve</span>
                </button>
                <button
                  onClick={() => onReject(librarian)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2"
                >
                  <FaTimesCircle />
                  <span>Reject</span>
                </button>
              </div>
            </div>
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">{librarian.coverLetter}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Active Librarians Tab
const ActiveLibrariansTab = ({ librarians, searchTerm, setSearchTerm, statusFilter, setStatusFilter, onViewDetails, onEditAccess, onEditPerformance }) => {
  const filteredLibrarians = librarians.filter(librarian => {
    const matchesSearch = librarian.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         librarian.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || librarian.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search librarians by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center space-x-3">
            <FaFilter className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="on-leave">On Leave</option>
              <option value="probation">Probation</option>
            </select>
          </div>
        </div>
      </div>

      {/* Librarians Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLibrarians.map(librarian => (
          <LibrarianCard
            key={librarian.id}
            librarian={librarian}
            onViewDetails={() => onViewDetails(librarian)}
            onEditAccess={() => onEditAccess(librarian)}
            onEditPerformance={() => onEditPerformance(librarian)}
          />
        ))}
      </div>
    </div>
  );
};

// Librarian Card Component
const LibrarianCard = ({ librarian, onViewDetails, onEditAccess, onEditPerformance }) => {
  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      'on-leave': 'bg-yellow-100 text-yellow-800',
      probation: 'bg-red-100 text-red-800'
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`;
  };

  const getPerformanceColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
          {librarian.name.charAt(0)}
        </div>
        <span className={getStatusBadge(librarian.status)}>
          {librarian.status.replace('-', ' ').toUpperCase()}
        </span>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold text-gray-900">{librarian.name}</h3>
        <p className="text-gray-600 text-sm">{librarian.email}</p>
        <p className="text-gray-500 text-sm mt-1">{librarian.department}</p>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Performance Rating</span>
          <div className="flex items-center space-x-1">
            <FaStar className={`w-4 h-4 ${getPerformanceColor(librarian.performanceRating)}`} />
            <span className={`font-medium ${getPerformanceColor(librarian.performanceRating)}`}>
              {librarian.performanceRating}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Books Processed</span>
          <span className="font-medium">{librarian.booksProcessed}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Users Helped</span>
          <span className="font-medium">{librarian.usersHelped}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Access Level</span>
          <span className="font-medium text-blue-600">{librarian.accessLevel}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={onViewDetails}
          className="flex-1 text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 text-sm font-medium"
        >
          <FaEye className="inline w-3 h-3 mr-1" />
          View
        </button>
        <button
          onClick={onEditAccess}
          className="flex-1 text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50 text-sm font-medium"
        >
          <FaKey className="inline w-3 h-3 mr-1" />
          Access
        </button>
        <button
          onClick={onEditPerformance}
          className="flex-1 text-purple-600 hover:text-purple-900 p-2 rounded-lg hover:bg-purple-50 text-sm font-medium"
        >
          <FaChartBar className="inline w-3 h-3 mr-1" />
          Metrics
        </button>
      </div>
    </div>
  );
};

// Performance Metrics Tab
const PerformanceMetricsTab = ({ librarians }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('all');

  const getTopPerformers = () => {
    return [...librarians]
      .sort((a, b) => b.performanceRating - a.performanceRating)
      .slice(0, 5);
  };

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Average Rating</p>
              <p className="text-2xl font-bold text-green-600">4.2</p>
            </div>
            <FaStar className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Books Processed</p>
              <p className="text-2xl font-bold text-blue-600">2,847</p>
            </div>
            <FaBook className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Users Helped</p>
              <p className="text-2xl font-bold text-purple-600">1,924</p>
            </div>
            <FaUsers className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Response Time</p>
              <p className="text-2xl font-bold text-orange-600">3.4m</p>
            </div>
            <FaClock className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Performance Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="all">All Metrics</option>
            <option value="books">Books Processed</option>
            <option value="users">Users Helped</option>
            <option value="rating">Performance Rating</option>
          </select>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Top Performers</h3>
        <div className="space-y-4">
          {getTopPerformers().map((librarian, index) => (
            <div key={librarian.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                  index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-gray-300'
                }`}>
                  {index + 1}
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {librarian.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{librarian.name}</p>
                  <p className="text-sm text-gray-600">{librarian.department}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1">
                  <FaStar className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium">{librarian.performanceRating}</span>
                </div>
                <p className="text-sm text-gray-600">{librarian.booksProcessed} books processed</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Access Controls Tab
const AccessControlsTab = ({ librarians, onEditAccess }) => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const accessLevels = [
    { level: 'Basic', color: 'bg-gray-100 text-gray-800', permissions: ['View Books', 'Issue Returns'] },
    { level: 'Standard', color: 'bg-blue-100 text-blue-800', permissions: ['Add Books', 'Edit Records', 'User Management'] },
    { level: 'Advanced', color: 'bg-green-100 text-green-800', permissions: ['System Config', 'Reports', 'Bulk Operations'] },
    { level: 'Full', color: 'bg-red-100 text-red-800', permissions: ['All Permissions', 'Admin Access', 'System Maintenance'] }
  ];

  const filteredLibrarians = selectedDepartment === 'all' 
    ? librarians 
    : librarians.filter(lib => lib.department === selectedDepartment);

  return (
    <div className="space-y-6">
      {/* Access Level Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {accessLevels.map(level => (
          <div key={level.level} className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">{level.level} Access</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${level.color}`}>
                {librarians.filter(lib => lib.accessLevel === level.level).length}
              </span>
            </div>
            <div className="space-y-1">
              {level.permissions.map(permission => (
                <div key={permission} className="text-sm text-gray-600 flex items-center">
                  <FaCheckCircle className="w-3 h-3 text-green-500 mr-2" />
                  {permission}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Department Filter */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex items-center space-x-4">
          <FaFilter className="text-gray-400" />
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="all">All Departments</option>
            <option value="Reference">Reference</option>
            <option value="Circulation">Circulation</option>
            <option value="Technical Services">Technical Services</option>
            <option value="Digital Resources">Digital Resources</option>
          </select>
        </div>
      </div>

      {/* Librarians Access Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Librarian</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Access Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLibrarians.map(librarian => (
                <tr key={librarian.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {librarian.name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{librarian.name}</div>
                        <div className="text-sm text-gray-500">{librarian.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {librarian.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      accessLevels.find(level => level.level === librarian.accessLevel)?.color
                    }`}>
                      {librarian.accessLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {librarian.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onEditAccess(librarian)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded"
                      title="Edit Access"
                    >
                      <FaKey />
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
};

// Librarian Modal Component
const LibrarianModal = ({ type, librarian, pendingLibrarians, setPendingLibrarians, activeLibrarians, setActiveLibrarians, onClose }) => {
  const [formData, setFormData] = useState(
    librarian || {
      name: '',
      email: '',
      department: 'Reference',
      accessLevel: 'Basic',
      status: 'active'
    }
  );

  const [accessPermissions, setAccessPermissions] = useState({
    viewBooks: true,
    addBooks: false,
    editBooks: false,
    deleteBooks: false,
    userManagement: false,
    reports: false,
    systemConfig: false,
    bulkOperations: false
  });

  const handleSubmit = () => {
    if (type === 'approve') {
      // Move from pending to active
      const newLibrarian = {
        ...librarian,
        status: 'active',
        approvalDate: new Date().toISOString().split('T')[0],
        performanceRating: 4.0,
        booksProcessed: 0,
        usersHelped: 0,
        lastLogin: 'Never',
        accessLevel: formData.accessLevel
      };
      setActiveLibrarians([...activeLibrarians, newLibrarian]);
      setPendingLibrarians(pendingLibrarians.filter(lib => lib.id !== librarian.id));
    } else if (type === 'reject') {
      setPendingLibrarians(pendingLibrarians.filter(lib => lib.id !== librarian.id));
    } else if (type === 'access') {
      setActiveLibrarians(activeLibrarians.map(lib => 
        lib.id === librarian.id ? { ...lib, accessLevel: formData.accessLevel } : lib
      ));
    }
    onClose();
  };

  const getModalTitle = () => {
    switch(type) {
      case 'approve': return 'Approve Librarian Application';
      case 'reject': return 'Reject Librarian Application';
      case 'view': return 'Librarian Details';
      case 'access': return 'Edit Access Controls';
      case 'performance': return 'Performance Metrics';
      default: return 'Librarian Management';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">{getModalTitle()}</h3>
        </div>
        
        <div className="p-6 space-y-4">
          {type === 'reject' ? (
            <div className="text-center">
              <FaExclamationTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-gray-700 mb-4">
                Are you sure you want to reject <strong>{librarian?.name}</strong>'s application?
              </p>
              <p className="text-sm text-gray-500">
                This action cannot be undone. The applicant will be notified of the rejection.
              </p>
            </div>
          ) : type === 'approve' ? (
            <div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <FaCheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-green-700 font-medium">Approve {librarian?.name} as Librarian</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={librarian?.name || ''}
                    disabled
                    className="w-full px-3 py-2 border rounded-lg bg-gray-100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={librarian?.email || ''}
                    disabled
                    className="w-full px-3 py-2 border rounded-lg bg-gray-100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Reference">Reference</option>
                    <option value="Circulation">Circulation</option>
                    <option value="Technical Services">Technical Services</option>
                    <option value="Digital Resources">Digital Resources</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Initial Access Level</label>
                  <select
                    value={formData.accessLevel}
                    onChange={(e) => setFormData({...formData, accessLevel: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Basic">Basic</option>
                    <option value="Standard">Standard</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Full">Full</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience & Qualifications</label>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700">{librarian?.experience} years of experience</p>
                  <p className="text-sm text-gray-600 mt-1">{librarian?.qualifications}</p>
                </div>
              </div>
            </div>
          ) : type === 'access' ? (
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Access Level</label>
                <select
                  value={formData.accessLevel}
                  onChange={(e) => setFormData({...formData, accessLevel: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Basic">Basic Access</option>
                  <option value="Standard">Standard Access</option>
                  <option value="Advanced">Advanced Access</option>
                  <option value="Full">Full Access</option>
                </select>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Specific Permissions</h4>
                {[
                  { key: 'viewBooks', label: 'View Book Records', basic: true },
                  { key: 'addBooks', label: 'Add New Books', basic: false },
                  { key: 'editBooks', label: 'Edit Book Records', basic: false },
                  { key: 'deleteBooks', label: 'Delete Books', basic: false },
                  { key: 'userManagement', label: 'User Management', basic: false },
                  { key: 'reports', label: 'Generate Reports', basic: false },
                  { key: 'systemConfig', label: 'System Configuration', basic: false },
                  { key: 'bulkOperations', label: 'Bulk Operations', basic: false }
                ].map(permission => (
                  <div key={permission.key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={accessPermissions[permission.key]}
                        onChange={(e) => setAccessPermissions({
                          ...accessPermissions,
                          [permission.key]: e.target.checked
                        })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-900">{permission.label}</span>
                    </div>
                    {permission.basic && (
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Basic</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : type === 'view' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <p className="text-gray-900">{librarian?.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{librarian?.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <p className="text-gray-900">{librarian?.department}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Access Level</label>
                  <p className="text-gray-900">{librarian?.accessLevel}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <p className="text-gray-900">{librarian?.status}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Performance Rating</label>
                  <div className="flex items-center space-x-1">
                    <FaStar className="w-4 h-4 text-yellow-500" />
                    <span className="text-gray-900">{librarian?.performanceRating}</span>
                  </div>
                </div>
              </div>
              
              {librarian?.coverLetter && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cover Letter</label>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">{librarian.coverLetter}</p>
                  </div>
                </div>
              )}
            </div>
          ) : type === 'performance' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600">Books Processed</p>
                      <p className="text-2xl font-bold text-blue-800">{librarian?.booksProcessed}</p>
                    </div>
                    <FaBook className="w-8 h-8 text-blue-500" />
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600">Users Helped</p>
                      <p className="text-2xl font-bold text-green-800">{librarian?.usersHelped}</p>
                    </div>
                    <FaUsers className="w-8 h-8 text-green-500" />
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-600">Performance Rating</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-2xl font-bold text-yellow-800">{librarian?.performanceRating}</p>
                      <div className="flex space-x-1">
                        {[1,2,3,4,5].map(star => (
                          <FaStar
                            key={star}
                            className={`w-4 h-4 ${
                              star <= Math.floor(librarian?.performanceRating || 0) 
                                ? 'text-yellow-500' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <FaAward className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Recent Activity</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">Processed 15 book returns</span>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">Helped 8 users with research</span>
                    <span className="text-xs text-gray-500">Yesterday</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">Added 25 new books to catalog</span>
                    <span className="text-xs text-gray-500">3 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          
          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <FaUndo className="w-4 h-4" />
              <span>Cancel</span>
            </button>
            {type !== 'view' && type !== 'performance' && (
              <button
                onClick={handleSubmit}
                className={`px-4 py-2 rounded-lg text-white transition-colors flex items-center space-x-2 ${
                  type === 'reject' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                <FaSave className="w-4 h-4" />
                <span>
                  {type === 'approve' ? 'Approve Librarian' : 
                   type === 'reject' ? 'Reject Application' : 
                   type === 'access' ? 'Update Access' : 
                   'Save Changes'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Sample Data
const samplePendingLibrarians = [
  {
    id: 2001,
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@email.com',
    applicationDate: '2024-05-25',
    experience: 3,
    qualifications: 'Master in Library Science, MLIS certified',
    coverLetter: 'I am passionate about helping people access information and have 3 years of experience in academic libraries. I specialize in digital resources and user education.',
    phone: '+1 (555) 123-9876',
    address: '789 Academic St, University City'
  },
  {
    id: 2002,
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    applicationDate: '2024-05-28',
    experience: 5,
    qualifications: 'Master in Information Studies, Cataloging specialist',
    coverLetter: 'With 5 years of experience in technical services, I bring expertise in cataloging, metadata management, and library systems administration.',
    phone: '+1 (555) 234-8765',
    address: '456 Library Lane, Metro City'
  },
  {
    id: 2003,
    name: 'Jennifer Torres',
    email: 'jennifer.torres@email.com',
    applicationDate: '2024-05-29',
    experience: 2,
    qualifications: 'Master in Library and Information Science, Youth Services',
    coverLetter: 'I am excited to contribute to your library team with my background in youth services and community programming. I have experience with children and teen programming.',
    phone: '+1 (555) 345-7654',
    address: '123 Community Blvd, Suburbia'
  }
];

const sampleActiveLibrarians = [
  {
    id: 3001,
    name: 'Robert Johnson',
    email: 'robert.johnson@library.com',
    department: 'Reference',
    accessLevel: 'Advanced',
    status: 'active',
    performanceRating: 4.5,
    booksProcessed: 1247,
    usersHelped: 892,
    lastLogin: '2 hours ago',
    approvalDate: '2023-03-15'
  },
  {
    id: 3002,
    name: 'Maria Garcia',
    email: 'maria.garcia@library.com',
    department: 'Circulation',
    accessLevel: 'Standard',
    status: 'active',
    performanceRating: 4.2,
    booksProcessed: 856,
    usersHelped: 643,
    lastLogin: '1 day ago',
    approvalDate: '2023-08-20'
  },
  {
    id: 3003,
    name: 'James Wilson',
    email: 'james.wilson@library.com',
    department: 'Technical Services',
    accessLevel: 'Full',
    status: 'active',
    performanceRating: 4.8,
    booksProcessed: 1583,
    usersHelped: 234,
    lastLogin: '30 mins ago',
    approvalDate: '2022-11-01'
  },
  {
    id: 3004,
    name: 'Lisa Anderson',
    email: 'lisa.anderson@library.com',
    department: 'Digital Resources',
    accessLevel: 'Advanced',
    status: 'on-leave',
    performanceRating: 4.3,
    booksProcessed: 692,
    usersHelped: 445,
    lastLogin: '2 weeks ago',
    approvalDate: '2023-06-10'
  },
  {
    id: 3005,
    name: 'David Kim',
    email: 'david.kim@library.com',
    department: 'Reference',
    accessLevel: 'Basic',
    status: 'probation',
    performanceRating: 3.1,
    booksProcessed: 234,
    usersHelped: 156,
    lastLogin: '3 days ago',
    approvalDate: '2024-04-01'
  },
  {
    id: 3006,
    name: 'Amanda Thompson',
    email: 'amanda.thompson@library.com',
    department: 'Circulation',
    accessLevel: 'Standard',
    status: 'active',
    performanceRating: 4.6,
    booksProcessed: 934,
    usersHelped: 721,
    lastLogin: '4 hours ago',
    approvalDate: '2023-01-20'
  }
];

export default LibrarianManagement;