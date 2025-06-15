import React, { useState, useRef, useEffect } from 'react';
import { FiFilter, FiSearch, FiEye, FiClock, FiCheck, FiX, FiAlertCircle, FiLoader, FiRefreshCw, FiUser, FiMail, FiCalendar, FiTag } from 'react-icons/fi';
import { getAllQueries, getQueryDetails, updateQueryStatus } from '../../services/librarianApi';

const AdminQueryManagement = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [notification, setNotification] = useState(null);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const filterRef = useRef(null);

  // Fetch queries from backend
  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      setLoading(true);
      const response = await getAllQueries();
      console.log('API Response:', response);
      console.log('Response data:', response.data);

      if (response.data.success) {
        // The data is directly in response.data.data (no nested structure)
        const queriesArray = response.data.data || [];
        console.log('Setting queries:', queriesArray);
        setQueries(queriesArray);
      } else {
        console.error('Failed to fetch queries');
        showNotification(response.data.message || 'Failed to load queries', 'error');
        setQueries([]);
      }
    } catch (error) {
      console.error('Error fetching queries:', error);
      showNotification(
        error.response?.data?.message ||
        'Failed to load queries. Please try again later.',
        'error'
      );
      setQueries([]);
    } finally {
      setLoading(false);
    }
  };

  // Fixed status update function with correct status values
  const handleStatusUpdate = async (queryId, newStatus, queryTitle) => {
    try {
      setUpdateLoading(prev => ({ ...prev, [queryId]: true }));

      const response = await updateQueryStatus(queryId, newStatus);

      if (response.data.success) {
        // Update the queries state
        setQueries(prevQueries =>
          prevQueries.map(query =>
            query._id === queryId
              ? { ...query, status: newStatus, updatedAt: new Date().toISOString() }
              : query
          )
        );

        // Update selectedQuery if it's the one being updated
        if (selectedQuery && selectedQuery._id === queryId) {
          setSelectedQuery(prev => ({ ...prev, status: newStatus, updatedAt: new Date().toISOString() }));
        }

        showNotification(`Query "${queryTitle}" status updated to ${newStatus}`, 'success');
      } else {
        showNotification(response.data.message || 'Failed to update status', 'error');
      }
    } catch (error) {
      console.error('Error updating query status:', error);
      showNotification(
        error.response?.data?.message || 'Failed to update status. Please try again.',
        'error'
      );
    } finally {
      setUpdateLoading(prev => ({ ...prev, [queryId]: false }));
    }
  };

  // Handle view query details
  const handleViewDetails = async (queryId) => {
    try {
      setModalLoading(true);
      setShowModal(true);

      const response = await getQueryDetails(queryId);

      if (response.data.success) {
        setSelectedQuery(response.data.data);
      } else {
        showNotification('Failed to load query details', 'error');
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error fetching query details:', error);
      showNotification('Failed to load query details', 'error');
      setShowModal(false);
    } finally {
      setModalLoading(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Get unique values for filters - fixed to use correct field names
  const uniqueStatuses = [...new Set(queries.map(query => query.status).filter(Boolean))];
  const uniquePriorities = [...new Set(queries.map(query => query.priority).filter(Boolean))];
  const uniqueCategories = [...new Set(queries.map(query => query.type).filter(Boolean))]; // Using 'type' instead of 'category'

  // Filter queries - fixed field mappings
  const filteredQueries = queries.filter((query) => {
    const matchesSearch =
      query.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.user_id?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.user_id?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === '' || query.status === selectedStatus;
    const matchesPriority = selectedPriority === '' || query.priority === selectedPriority;
    const matchesCategory = selectedCategory === '' || query.type === selectedCategory; // Using 'type' field

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  // Filter animations
  useEffect(() => {
    const el = filterRef.current;
    if (!el) return;

    if (showFilters) {
      el.style.maxHeight = el.scrollHeight + 'px';
      el.style.opacity = 1;
    } else {
      el.style.maxHeight = '0px';
      el.style.opacity = 0;
    }
  }, [showFilters]);

  const toggleFilters = () => setShowFilters(!showFilters);

  const clearFilters = () => {
    setSelectedStatus('');
    setSelectedPriority('');
    setSelectedCategory('');
    setSearchTerm('');
  };

  const activeFiltersCount = [selectedStatus, selectedPriority, selectedCategory].filter(Boolean).length;

  // Status badge styling - updated for backend status values
  const getStatusBadge = (status) => {
    const styles = {
      open: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      in_progress: 'bg-blue-100 text-blue-700 border-blue-200',
      resolved: 'bg-green-100 text-green-700 border-green-200',
      closed: 'bg-red-100 text-red-700 border-red-200'
    };
    return styles[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  // Priority badge styling
  const getPriorityBadge = (priority) => {
    const styles = {
      low: 'bg-gray-100 text-gray-700',
      medium: 'bg-orange-100 text-orange-700',
      high: 'bg-red-100 text-red-700',
      urgent: 'bg-purple-100 text-purple-700'
    };
    return styles[priority] || 'bg-gray-100 text-gray-700';
  };

  // Status options for dropdown - updated to match backend
  const statusOptions = [
    { value: 'open', label: 'Open', icon: FiClock },
    { value: 'in_progress', label: 'In Progress', icon: FiLoader },
    { value: 'resolved', label: 'Resolved', icon: FiCheck },
    { value: 'closed', label: 'Closed', icon: FiX }
  ];

  if (loading) {
    return (
      <div className="bg-transparent pb-20">
        <div className="pt-10 sm:pt-20 px-4 sm:px-6 pb-6 sm:pb-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center gap-3">
                <FiLoader className="animate-spin w-6 h-6 text-purple-600" />
                <span className="text-lg text-gray-600">Loading queries...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-transparent pb-20">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-20 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transition-all duration-300 ${notification.type === 'success'
          ? 'bg-green-100 text-green-800 border border-green-200'
          : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <FiCheck className="w-5 h-5" />
            ) : (
              <FiAlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Main content container */}
      <div className="pt-20 sm:pt-10 px-4 sm:px-6 pb-6 sm:pb-10">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                Query Management
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Manage and respond to student queries and requests
              </p>
            </div>
            <button
              onClick={fetchQueries}
              className="mt-4 sm:mt-0 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <FiRefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {/* Search & Filter Section */}
          <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 mb-6 sm:mb-8">
            {/* Search bar and filter button */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by subject, student name, or message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={toggleFilters}
                  className={`relative px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm sm:text-base font-medium border ${showFilters
                    ? 'bg-purple-600 text-white border-purple-700 shadow-md'
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                    }`}
                >
                  <FiFilter size={18} />
                  <span className="hidden sm:inline">Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Filter dropdowns */}
            <div
              ref={filterRef}
              className="transition-all duration-300 overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  >
                    <option value="">All Statuses</option>
                    {uniqueStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  >
                    <option value="">All Priorities</option>
                    {uniquePriorities.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  >
                    <option value="">All Types</option>
                    {uniqueCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
            <div className="text-sm sm:text-base text-gray-600">
              Showing <span className="font-semibold text-gray-800">{filteredQueries.length}</span> of{' '}
              <span className="font-semibold text-gray-800">{queries.length}</span> queries
            </div>
            {(searchTerm || activeFiltersCount > 0) && (
              <div className="text-sm text-purple-600">
                {searchTerm && `Search: "${searchTerm}"`}
                {searchTerm && activeFiltersCount > 0 && ' • '}
                {activeFiltersCount > 0 && `${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''} active`}
              </div>
            )}
          </div>

          {/* Queries Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {filteredQueries.map((query) => {
              const isUpdateLoading = updateLoading[query._id];

              return (
                <div
                  key={query._id}
                  className="bg-white shadow-sm rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border"
                >
                  <div className="p-4 sm:p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                          {query.subject}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(query.status)}`}>
                            {query.status?.charAt(0).toUpperCase() + query.status?.slice(1).replace('_', ' ')}
                          </span>
                          {query.priority && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(query.priority)}`}>
                              {query.priority?.charAt(0).toUpperCase() + query.priority?.slice(1)} Priority
                            </span>
                          )}
                          {query.type && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                              {query.type}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Student Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiUser className="w-4 h-4" />
                        <span className="font-medium">{query.user_id?.name || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiMail className="w-4 h-4" />
                        <span>{query.user_id?.email || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiCalendar className="w-4 h-4" />
                        <span>Created: {new Date(query.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                      {query.message}
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleViewDetails(query._id)}
                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <FiEye className="w-4 h-4" />
                        View Details
                      </button>

                      <div className="flex-1">
                        <select
                          value={query.status}
                          onChange={(e) => handleStatusUpdate(query._id, e.target.value, query.subject)}
                          disabled={isUpdateLoading}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                        >
                          {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {isUpdateLoading && (
                      <div className="mt-2 flex items-center justify-center text-sm text-gray-500">
                        <FiLoader className="animate-spin w-4 h-4 mr-2" />
                        Updating status...
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* No results message */}
          {filteredQueries.length === 0 && !loading && (
            <div className="text-center py-12 sm:py-16">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                  <FiSearch className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                  No queries found
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  {queries.length === 0
                    ? "No queries have been submitted yet."
                    : "No queries match your current search and filter criteria."
                  }
                </p>
                {(searchTerm || activeFiltersCount > 0) && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Query Details Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Query Details</h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedQuery(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {modalLoading ? (
                <div className="flex items-center justify-center py-8">
                  <FiLoader className="animate-spin w-6 h-6 text-purple-600" />
                </div>
              ) : selectedQuery ? (
                <div className="space-y-6">
                  {/* Title and Status */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {selectedQuery.subject}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(selectedQuery.status)}`}>
                        {selectedQuery.status?.charAt(0).toUpperCase() + selectedQuery.status?.slice(1).replace('_', ' ')}
                      </span>
                      {selectedQuery.priority && (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityBadge(selectedQuery.priority)}`}>
                          {selectedQuery.priority?.charAt(0).toUpperCase() + selectedQuery.priority?.slice(1)} Priority
                        </span>
                      )}
                      {selectedQuery.type && (
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                          {selectedQuery.type}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Student Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Student Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <FiUser className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{selectedQuery.user_id?.name || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiMail className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">{selectedQuery.user_id?.email || 'N/A'}</span>
                      </div>
                      {selectedQuery.user_id?.contact && (
                        <div className="flex items-center gap-2">
                          <FiUser className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">{selectedQuery.user_id.contact}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Message</h4>
                    <p className="text-gray-600 leading-relaxed">
                      {selectedQuery.message}
                    </p>
                  </div>

                  {/* Response (if exists) */}
                  {selectedQuery.response && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Response</h4>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-gray-700 leading-relaxed">
                          {selectedQuery.response}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Notes (if exists) */}
                  {selectedQuery.notes && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Notes</h4>
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <p className="text-gray-700 leading-relaxed">
                          {selectedQuery.notes}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Timestamps */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Timeline</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <FiCalendar className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">
                          Created: {new Date(selectedQuery.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FiCalendar className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">
                          Last Updated: {new Date(selectedQuery.updatedAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Update */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Update Status</h4>
                    <select
                      value={selectedQuery.status}
                      onChange={(e) => {
                        handleStatusUpdate(selectedQuery._id, e.target.value, selectedQuery.subject);
                        setSelectedQuery({ ...selectedQuery, status: e.target.value });
                      }}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">Failed to load query details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQueryManagement;