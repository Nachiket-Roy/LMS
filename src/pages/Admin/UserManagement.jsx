import React, { useState, useEffect } from 'react';
import {
  FaUsers, FaUserPlus, FaEdit, FaTrash, FaEye, FaSearch, FaFilter,
  FaUserTie, FaUser, FaUserShield, FaClock, FaCheck, FaTimes,
  FaHistory, FaExclamationTriangle, FaSave, FaUndo, FaLock
} from 'react-icons/fa';
import {
  getAllUsers,
  getUserById,
  deleteUser,
  getAllLibrarians,
  getAdminDashboard,
  getUserActivityLogs,
} from '../../services/adminApi';
import authApi from '../../services/authApi';
import { useAuth } from '../../contexts/AuthContext';


// Main User Management Component
const UserManagement = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [allUsers, setAllUsers] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view'); // 'view', 'delete', 'add'
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Load initial data
  useEffect(() => {
    loadDashboardData();
    loadAllUsers();
    loadActivityLogs();
  }, []);

  // Load users when filters change
  useEffect(() => {
    loadAllUsers();
  }, [searchTerm, roleFilter, currentPage]);

  const loadDashboardData = async () => {
    try {
      const response = await getAdminDashboard();
      setDashboardData(response.data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  };

  const loadAllUsers = async () => {
    setLoading(true);
    try {
      // Load both regular users and librarians
      const params = {
        page: currentPage,
        limit: pageSize,
        search: searchTerm || undefined,
        role: roleFilter !== 'all' ? roleFilter : undefined
      };

      const [usersResponse, librariansResponse] = await Promise.all([
        getAllUsers(params),
        getAllLibrarians()
      ]);

      console.log("🧑‍💼 getAllUsers response:", usersResponse.data);
      console.log("📘 getAllLibrarians response:", librariansResponse.data);

      const users = Array.isArray(usersResponse.data?.data) ? usersResponse.data.data : [];
      const librarians = Array.isArray(librariansResponse.data?.data) ? librariansResponse.data.data : [];

      // Combine users and librarians, ensuring librarians have correct role
      const combinedUsers = [
        ...users,
        ...librarians.map(lib => ({ ...lib, role: lib.role || 'librarian' }))
      ];

      setAllUsers(combinedUsers);

    } catch (err) {
      setError('Failed to load users');
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadActivityLogs = async () => {
    try {
      const response = await getUserActivityLogs();
      console.log("📝 getUserActivityLogs response:", response.data);
      setActivityLogs(Array.isArray(response.data?.data) ? response.data.data : []);

    } catch (err) {
      console.error('Failed to load activity logs:', err);
    }
  };

  const handleViewUser = async (user) => {
    try {
      const response = await getUserById(user._id);
      setSelectedUser(response.data);
      setModalType('view');
      setShowModal(true);
    } catch (err) {
      setError('Failed to load user details');
      console.error('Failed to load user details:', err);
    }
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setModalType('delete');
    setShowModal(true);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setModalType('add');
    setShowModal(true);
  };

  const confirmDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      await deleteUser(selectedUser._id);
      setAllUsers(allUsers.filter(u => u._id !== selectedUser._id));
      setSuccess('User deleted successfully');
      setShowModal(false);
      setSelectedUser(null);
    } catch (err) {
      setError('Failed to delete user');
      console.error('Failed to delete user:', err);
    }
  };

  const handleCreateUser = async (userData) => {
  try {
    const response = await authApi.adminRegister(userData);
    setSuccess('User created successfully');
    setShowModal(false);
    setSelectedUser(null);
    loadAllUsers(); // reload updated list
  } catch (err) {
    setError(err.message || 'Failed to create user');
    console.error('Failed to create user:', err);
  }
};


  // Filter users based on search and role
  const filteredUsers = allUsers.filter(user => {
    if (!user) return false;
    const matchesSearch = !searchTerm ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user._id?.toString().includes(searchTerm);
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const tabs = [
    { id: 'users', label: 'User Management', icon: <FaUsers /> },
    { id: 'activity', label: 'Activity Logs', icon: <FaHistory /> }
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className=" p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600 mt-1">Manage users, roles, and activity logs</p>
            </div>
            <button
              onClick={handleAddUser}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <FaUserPlus className="w-4 h-4" />
              <span>Add User</span>
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
            <button
              onClick={() => setError(null)}
              className="float-right font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Success Display */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {success}
            <button
              onClick={() => setSuccess(null)}
              className="float-right font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border mb-6">
          <div className="flex border-b">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${activeTab === tab.id
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
            loading={loading}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            onViewUser={handleViewUser}
            onDeleteUser={handleDeleteUser}
            onAddUser={handleAddUser}
          />
        )}

        {activeTab === 'activity' && (
          <ActivityLogsTab logs={activityLogs} />
        )}

        {/* Modal */}
        {showModal && (
          <UserModal
            type={modalType}
            user={selectedUser}
            onClose={() => setShowModal(false)}
            onConfirmDelete={confirmDeleteUser}
            onCreateUser={handleCreateUser}
          />
        )}
      </div>
    </div>
  );
};

// Users Tab Component
const UsersTab = ({ users, loading, searchTerm, setSearchTerm, roleFilter, setRoleFilter, onViewUser, onDeleteUser, onAddUser }) => (
  <div className="space-y-6">
    {/* Search and Filter Bar */}
    <div className="bg-white rounded-xl shadow-sm border p-4">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name, email or id ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FaFilter className="text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="librarian">Librarian</option>
              <option value="user">User</option>
            </select>
          </div>
          <button
            onClick={onAddUser}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <FaUserPlus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>
    </div>

    {/* Users Table */}
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      {loading ? (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <UserRow
                  key={user._id || user.id}
                  user={user}
                  onView={() => onViewUser(user)}
                  onDelete={() => onDeleteUser(user)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Show message if no users found */}
      {!loading && users.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <FaUsers className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No users found matching your criteria.</p>
        </div>
      )}
    </div>
  </div>
);

// Individual User Row Component
const UserRow = ({ user, onView, onDelete }) => {
  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <FaUserShield className="w-4 h-4 text-red-500" />;
      case 'librarian': return <FaUserTie className="w-4 h-4 text-blue-500" />;
      default: return <FaUser className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleBadge = (role) => {
    const styles = {
      admin: 'bg-red-100 text-red-800',
      librarian: 'bg-blue-100 text-blue-800',
      user: 'bg-gray-100 text-gray-800'
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${styles[role] || styles.user}`;
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
            {user.name?.charAt(0) || 'U'}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{user.name || 'Unknown'}</div>
            <div className="text-sm text-gray-500">{user.email || 'No email'}</div>
            <div className="text-xs text-gray-400">ID: {user._id || user.id}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          {getRoleIcon(user.role)}
          <span className={getRoleBadge(user.role)}>
            {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center space-x-2">
         
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-900 p-1 rounded"
            title="Delete User"
          >
            <FaTrash />
          </button>
        </div>
      </td>
    </tr>
  );
};

// Activity Logs Tab Component
const ActivityLogsTab = ({ logs }) => (
  <div className="bg-white rounded-xl shadow-sm border p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold">User Activity Logs</h3>
      <div className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg">
        <span className="font-medium">{logs.length}</span> Recent Activities
      </div>
    </div>

    <div className="space-y-4">
      {logs.map(log => (
        <ActivityLogItem key={log.id} log={log} />
      ))}
    </div>

    {logs.length === 0 && (
      <div className="p-8 text-center text-gray-500">
        <FaHistory className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No activity logs found.</p>
      </div>
    )}
  </div>
);

// Activity Log Item Component
const ActivityLogItem = ({ log }) => {
  if (!log || !log.user_id || !log.book_id) return null;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'requested': return <FaClock className="w-4 h-4 text-yellow-500" />;
      case 'approved': return <FaCheck className="w-4 h-4 text-green-500" />;
      case 'returned': return <FaUndo className="w-4 h-4 text-blue-500" />;
      case 'rejected': return <FaTimes className="w-4 h-4 text-red-500" />;
      default: return <FaClock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow">
          {getStatusIcon(log.status)}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">
            {log.user_id.name} {log.status} <span className="italic">"{log.book_id.title}"</span>
          </p>
          <p className="text-xs text-gray-500">
            Author: {log.book_id.author} • User Email: {log.user_id.email}
          </p>
        </div>
      </div>
      <div className="text-right text-xs text-gray-500">
        <p>{new Date(log.updatedAt || log.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
};

// Add User Form Component
const AddUserForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const { confirmPassword, ...submitData } = formData;
      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter full name"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter email address"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Role
        </label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="user">User</option>
          <option value="librarian">Librarian</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password *
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.password ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter password"
        />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirm Password *
        </label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Confirm password"
        />
        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
      </div>

      <div className="flex items-center justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <FaUndo className="w-4 h-4 mr-2 inline" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Creating...</span>
            </>
          ) : (
            <>
              <FaSave className="w-4 h-4" />
              <span>Create User</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

// User Modal Component
const UserModal = ({ type, user, onClose, onConfirmDelete, onCreateUser }) => {
  const getModalTitle = () => {
    switch (type) {
      case 'view': return 'User Details';
      case 'delete': return 'Delete User';
      case 'add': return 'Add New User';
      default: return 'User Management';
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-800/60 via-gray-900/60 to-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">{getModalTitle()}</h3>
        </div>

        <div className="p-6 space-y-4">
          {type === 'add' ? (
            <AddUserForm 
              onSubmit={onCreateUser}
              onCancel={onClose}
            />
          ) : type === 'delete' ? (
            <div className="text-center">
              <FaExclamationTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete <strong>{user?.name}</strong>?
              </p>
              <p className="text-sm text-gray-500">
                This action cannot be undone.
              </p>
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <FaUndo className="w-4 h-4 mr-2 inline" />
                  Cancel
                </button>
                <button
                  onClick={onConfirmDelete}
                  className="px-4 py-2 rounded-lg text-white transition-colors flex items-center space-x-2 bg-red-600 hover:bg-red-700"
                >
                  <FaTrash className="w-4 h-4" />
                  <span>Delete User</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <div className="w-full px-3 py-2 border rounded-lg bg-gray-100">
                  {user?.name || 'N/A'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="w-full px-3 py-2 border rounded-lg bg-gray-100">
                  {user?.email || 'N/A'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <div className="w-full px-3 py-2 border rounded-lg bg-gray-100">
                  {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'N/A'}
                </div>
              </div>

              {user?.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <div className="w-full px-3 py-2 border rounded-lg bg-gray-100">
                    {user.phone}
                  </div>
                </div>
              )}

              {user?.address && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <div className="w-full px-3 py-2 border rounded-lg bg-gray-100">
                    {user.address}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50                  transition-colors"
                >
                  <FaTimes className="w-4 h-4 mr-2 inline" />
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;