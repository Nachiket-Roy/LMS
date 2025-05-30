import React, { useState } from 'react';
import { FaUsers, FaUserPlus, FaEdit, FaTrash, FaEye, FaSearch, FaFilter, 
         FaUserTie, FaUser, FaUserShield, FaClock, FaCheck, FaTimes, 
         FaHistory, FaExclamationTriangle, FaSave, FaUndo } from 'react-icons/fa';

// Main User Management Component
const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState(sampleUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add', 'edit', 'view', 'deactivate'
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Filter users based on search and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.id.toString().includes(searchTerm);
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = () => {
    setSelectedUser(null);
    setModalType('add');
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalType('edit');
    setShowModal(true);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setModalType('view');
    setShowModal(true);
  };

  const handleDeactivateUser = (user) => {
    setSelectedUser(user);
    setModalType('deactivate');
    setShowModal(true);
  };

  const tabs = [
    { id: 'users', label: 'User Management', icon: <FaUsers /> },
    { id: 'activity', label: 'Activity Logs', icon: <FaHistory /> }
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600 mt-1">Manage users, roles, and system access</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 text-blue-600 px-3 py-2 rounded-lg">
                <span className="font-medium">{users.length}</span> Total Users
              </div>
              <div className="bg-green-100 text-green-600 px-3 py-2 rounded-lg">
                <span className="font-medium">{users.filter(u => u.status === 'active').length}</span> Active
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border mb-6">
          <div className="flex border-b">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'users' && (
          <UsersTab
            users={filteredUsers}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            onAddUser={handleAddUser}
            onEditUser={handleEditUser}
            onViewUser={handleViewUser}
            onDeactivateUser={handleDeactivateUser}
          />
        )}

        {activeTab === 'activity' && (
          <ActivityLogsTab />
        )}

        {/* Modal */}
        {showModal && (
          <UserModal
            type={modalType}
            user={selectedUser}
            users={users}
            setUsers={setUsers}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
};

// Users Tab Component
const UsersTab = ({ users, searchTerm, setSearchTerm, roleFilter, setRoleFilter, onAddUser, onEditUser, onViewUser, onDeactivateUser }) => (
  <div className="space-y-6">
    {/* Search and Filter Bar */}
    <div className="bg-white rounded-xl shadow-sm border p-4">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <FaFilter className="text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="librarian">Librarian</option>
              <option value="member">Member</option>
            </select>
          </div>
          <button
            onClick={onAddUser}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
          >
            <FaUserPlus />
            <span>Add User</span>
          </button>
        </div>
      </div>
    </div>

    {/* Users Table */}
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Books</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(user => (
              <UserRow
                key={user.id}
                user={user}
                onEdit={() => onEditUser(user)}
                onView={() => onViewUser(user)}
                onDeactivate={() => onDeactivateUser(user)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// Individual User Row Component
const UserRow = ({ user, onEdit, onView, onDeactivate }) => {
  const getRoleIcon = (role) => {
    switch(role) {
      case 'admin': return <FaUserShield className="w-4 h-4 text-red-500" />;
      case 'librarian': return <FaUserTie className="w-4 h-4 text-blue-500" />;
      default: return <FaUser className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleBadge = (role) => {
    const styles = {
      admin: 'bg-red-100 text-red-800',
      librarian: 'bg-blue-100 text-blue-800',
      member: 'bg-gray-100 text-gray-800'
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${styles[role]}`;
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800'
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`;
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
            {user.name.charAt(0)}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{user.name}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
            <div className="text-xs text-gray-400">ID: {user.id}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          {getRoleIcon(user.role)}
          <span className={getRoleBadge(user.role)}>
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={getStatusBadge(user.status)}>
          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="flex items-center space-x-1">
          <FaClock className="w-3 h-3" />
          <span>{user.lastActive}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div>
          <div>Borrowed: {user.borrowedBooks}</div>
          <div>Overdue: {user.overdueBooks}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center space-x-2">
          <button
            onClick={onView}
            className="text-blue-600 hover:text-blue-900 p-1 rounded"
            title="View Details"
          >
            <FaEye />
          </button>
          <button
            onClick={onEdit}
            className="text-green-600 hover:text-green-900 p-1 rounded"
            title="Edit User"
          >
            <FaEdit />
          </button>
          <button
            onClick={onDeactivate}
            className="text-red-600 hover:text-red-900 p-1 rounded"
            title="Deactivate User"
          >
            <FaTrash />
          </button>
        </div>
      </td>
    </tr>
  );
};

// Activity Logs Tab Component
const ActivityLogsTab = () => (
  <div className="bg-white rounded-xl shadow-sm border p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold">User Activity Logs</h3>
      <div className="flex items-center space-x-3">
        <select className="border rounded-lg px-3 py-2">
          <option>Last 24 hours</option>
          <option>Last 7 days</option>
          <option>Last 30 days</option>
        </select>
        <select className="border rounded-lg px-3 py-2">
          <option>All Activities</option>
          <option>User Registration</option>
          <option>Role Changes</option>
          <option>Login/Logout</option>
          <option>Book Actions</option>
        </select>
      </div>
    </div>
    
    <div className="space-y-4">
      {sampleActivityLogs.map(log => (
        <ActivityLogItem key={log.id} log={log} />
      ))}
    </div>
  </div>
);

// Activity Log Item Component
const ActivityLogItem = ({ log }) => {
  const getActivityIcon = (type) => {
    switch(type) {
      case 'user_created': return <FaUserPlus className="w-4 h-4 text-green-500" />;
      case 'role_changed': return <FaUserShield className="w-4 h-4 text-blue-500" />;
      case 'user_login': return <FaCheck className="w-4 h-4 text-green-500" />;
      case 'user_logout': return <FaTimes className="w-4 h-4 text-gray-500" />;
      case 'user_suspended': return <FaExclamationTriangle className="w-4 h-4 text-red-500" />;
      default: return <FaClock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
          {getActivityIcon(log.type)}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{log.description}</p>
          <p className="text-xs text-gray-500">User: {log.user} • IP: {log.ip}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-500">{log.timestamp}</p>
        <p className="text-xs text-gray-400">{log.timeAgo}</p>
      </div>
    </div>
  );
};

// User Modal Component
const UserModal = ({ type, user, users, setUsers, onClose }) => {
  const [formData, setFormData] = useState(
    user || {
      name: '',
      email: '',
      role: 'member',
      status: 'active',
      phone: '',
      address: '',
      membershipDate: new Date().toISOString().split('T')[0]
    }
  );

  const handleSubmit = () => {
    
    if (type === 'add') {
      const newUser = {
        ...formData,
        id: Date.now(),
        borrowedBooks: 0,
        overdueBooks: 0,
        lastActive: 'Just now'
      };
      setUsers([...users, newUser]);
    } else if (type === 'edit') {
      setUsers(users.map(u => u.id === user.id ? { ...u, ...formData } : u));
    } else if (type === 'deactivate') {
      setUsers(users.map(u => u.id === user.id ? { ...u, status: 'inactive' } : u));
    }
    
    onClose();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getModalTitle = () => {
    switch(type) {
      case 'add': return 'Add New User';
      case 'edit': return 'Edit User';
      case 'view': return 'User Details';
      case 'deactivate': return 'Deactivate User';
      default: return 'User Management';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">{getModalTitle()}</h3>
        </div>
        
        <div className="p-6 space-y-4">
          {type === 'deactivate' ? (
            <div className="text-center">
              <FaExclamationTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-gray-700 mb-4">
                Are you sure you want to deactivate <strong>{user?.name}</strong>?
              </p>
              <p className="text-sm text-gray-500">
                This user will no longer be able to access the system.
              </p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={type === 'view'}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={type === 'view'}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  disabled={type === 'view'}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                >
                  <option value="member">Member</option>
                  <option value="librarian">Librarian</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  disabled={type === 'view'}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={type === 'view'}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={type === 'view'}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>
            </>
          )}
          
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <FaUndo className="w-4 h-4 mr-2 inline" />
              Cancel
            </button>
            {type !== 'view' && (
              <button
                type="submit"
                className={`px-4 py-2 rounded-lg text-white transition-colors flex items-center space-x-2 ${
                  type === 'deactivate' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                <FaSave className="w-4 h-4" />
                <span>
                  {type === 'add' ? 'Add User' : 
                   type === 'edit' ? 'Save Changes' : 
                   'Deactivate'}
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
const sampleUsers = [
  {
    id: 1001,
    name: 'Alice Johnson',
    email: 'alice.johnson@email.com',
    role: 'member',
    status: 'active',
    lastActive: '2 hours ago',
    borrowedBooks: 3,
    overdueBooks: 1,
    phone: '+1 (555) 123-4567',
    address: '123 Main St, City, State',
    membershipDate: '2023-01-15'
  },
  {
    id: 1002,
    name: 'Bob Wilson',
    email: 'bob.wilson@email.com',
    role: 'librarian',
    status: 'active',
    lastActive: '30 mins ago',
    borrowedBooks: 1,
    overdueBooks: 0,
    phone: '+1 (555) 234-5678',
    address: '456 Oak Ave, City, State',
    membershipDate: '2022-08-20'
  },
  {
    id: 1003,
    name: 'Carol Smith',
    email: 'carol.smith@email.com',
    role: 'admin',
    status: 'active',
    lastActive: '5 mins ago',
    borrowedBooks: 0,
    overdueBooks: 0,
    phone: '+1 (555) 345-6789',
    address: '789 Pine St, City, State',
    membershipDate: '2021-12-01'
  },
  {
    id: 1004,
    name: 'David Brown',
    email: 'david.brown@email.com',
    role: 'member',
    status: 'suspended',
    lastActive: '1 week ago',
    borrowedBooks: 5,
    overdueBooks: 3,
    phone: '+1 (555) 456-7890',
    address: '321 Elm St, City, State',
    membershipDate: '2024-02-10'
  },
  {
    id: 1005,
    name: 'Emma Davis',
    email: 'emma.davis@email.com',
    role: 'member',
    status: 'active',
    lastActive: '1 day ago',
    borrowedBooks: 2,
    overdueBooks: 0,
    phone: '+1 (555) 567-8901',
    address: '654 Maple Ave, City, State',
    membershipDate: '2023-11-05'
  }
];

const sampleActivityLogs = [
  {
    id: 1,
    type: 'user_created',
    user: 'Emma Davis',
    description: 'New user account created successfully',
    ip: '192.168.1.105',
    timestamp: '2024-05-30 14:30:25',
    timeAgo: '2 hours ago'
  },
  {
    id: 2,
    type: 'role_changed',
    user: 'Bob Wilson',
    description: 'User role changed from Member to Librarian',
    ip: '192.168.1.102',
    timestamp: '2024-05-30 12:15:10',
    timeAgo: '4 hours ago'
  },
  {
    id: 3,
    type: 'user_suspended',
    user: 'David Brown',
    description: 'User account suspended due to overdue books',
    ip: '192.168.1.104',
    timestamp: '2024-05-30 09:45:30',
    timeAgo: '7 hours ago'
  },
  {
    id: 4,
    type: 'user_login',
    user: 'Alice Johnson',
    description: 'User logged into the system',
    ip: '192.168.1.101',
    timestamp: '2024-05-29 16:20:15',
    timeAgo: '1 day ago'
  },
  {
    id: 5,
    type: 'user_logout',
    user: 'Carol Smith',
    description: 'User logged out of the system',
    ip: '192.168.1.103',
    timestamp: '2024-05-29 14:55:45',
    timeAgo: '1 day ago'
  }
];

export default UserManagement;