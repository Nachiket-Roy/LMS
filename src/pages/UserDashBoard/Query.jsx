import React, { useState, useEffect } from 'react';
import {
    FiMessageSquare,
    FiTrash2,
    FiEye,
    FiSend,
    FiUser,
    FiClock,
    FiSearch,
    FiRefreshCw,
    FiAlertCircle,
    FiCheckCircle
} from 'react-icons/fi';
import { submitFeedback, getUserQueries, getUserQueryById, deleteUserQuery } from '../../services/userApi';

const Query = () => {
    const [queries, setQueries] = useState([]);
    const [selectedQuery, setSelectedQuery] = useState(null);
    const [feedbackData, setFeedbackData] = useState({
        type: 'suggestion', // Default to one of the valid types
        subject: '',
        message: '',
        priority: 'low' // Add priority field
    });
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [activeTab, setActiveTab] = useState('queries');

    useEffect(() => {
        fetchQueries();
    }, []);

    const fetchQueries = async () => {
        try {
            setLoading(true);
            const response = await getUserQueries();
            // The actual data is in response.data.data (first .data is axios, second is your API structure)
            setQueries(response.data?.data || []);
        } catch (error) {
            console.error('Error fetching queries:', error);
            showNotification('Failed to fetch queries', 'error');
            setQueries([]);
        } finally {
            setLoading(false);
        }
    };

    const handleViewQuery = async (id) => {
        try {
            const response = await getUserQueryById(id);
            setSelectedQuery(response.data?.data || null);
        } catch (error) {
            console.error('Error fetching query details:', error);
            showNotification('Failed to fetch query details', 'error');
        }
    };

    const handleDeleteQuery = async (id) => {
        if (!window.confirm('Are you sure you want to delete this query?')) return;

        try {
            await deleteUserQuery(id);
            setQueries(queries.filter(q => q.id !== id));
            if (selectedQuery && selectedQuery.id === id) {
                setSelectedQuery(null);
            }
            showNotification('Query deleted successfully', 'success');
        } catch (error) {
            showNotification('Failed to delete query', 'error');
        }
    };

    const handleSubmitFeedback = async () => {
        if (!feedbackData.subject.trim() || !feedbackData.message.trim()) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        try {
            setLoading(true);
            const response = await submitFeedback(feedbackData);

            // Reset form on success
            setFeedbackData({
                type: 'suggestion',
                subject: '',
                message: '',
                priority: 'low'
            });

            showNotification(response.message || 'Feedback submitted successfully!', 'success');
        } catch (error) {
            const errorMessage = error.response?.data?.message ||
                error.message ||
                'Failed to submit feedback';
            showNotification(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };
    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">


                {/* Notification */}
                {notification && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${notification.type === 'success'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                        {notification.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
                        {notification.message}
                    </div>
                )}

                {/* Tabs */}
                <div className="mb-6 border-b border-gray-200">
                    <nav className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('queries')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'queries'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <FiSearch className="inline mr-2" />
                            My Queries
                        </button>
                        <button
                            onClick={() => setActiveTab('feedback')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'feedback'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <FiMessageSquare className="inline mr-2" />
                            Submit Feedback
                        </button>
                    </nav>
                </div>

                {/* Queries Tab */}
                {activeTab === 'queries' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Queries List */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow">
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-semibold text-gray-900">Your Queries</h2>
                                        <button
                                            onClick={fetchQueries}
                                            disabled={loading}
                                            className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                        >
                                            <FiRefreshCw className={loading ? 'animate-spin' : ''} />
                                            Refresh
                                        </button>
                                    </div>
                                </div>

                                <div className="divide-y divide-gray-200">
                                    {loading ? (
                                        <div className="p-8 text-center text-gray-500">
                                            <FiRefreshCw className="animate-spin mx-auto mb-2 text-2xl" />
                                            Loading queries...
                                        </div>
                                    ) : queries.length === 0 ? (
                                        <div className="p-8 text-center text-gray-500">
                                            <FiSearch className="mx-auto mb-2 text-3xl" />
                                            <p>No queries found</p>
                                        </div>
                                    ) : (
                                        queries.map((query) => (
                                            <div key={query._id} className="p-6 hover:bg-gray-50">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                            {query.subject || `Query #${query._id}`}
                                                        </h3>
                                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                                            {query.message || 'No message available'}
                                                        </p>
                                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                                            <span className="flex items-center gap-1">
                                                                <FiClock />
                                                                {formatDate(query.createdAt)}
                                                            </span>
                                                            <span className={`px-2 py-1 rounded-md ${query.status === 'open' ? 'bg-blue-100 text-blue-800' :
                                                                query.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                                                    'bg-gray-100 text-gray-800'
                                                                }`}>
                                                                {query.status || 'Open'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 ml-4">
                                                        <button
                                                            onClick={() => handleViewQuery(query._id)}
                                                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-md"
                                                            title="View Details"
                                                        >
                                                            <FiEye />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteQuery(query._id)}
                                                            className="p-2 text-red-600 hover:bg-red-100 rounded-md"
                                                            title="Delete Query"
                                                        >
                                                            <FiTrash2 />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Query Details */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow sticky top-6">
                                <div className="p-6 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">Query Details</h3>
                                </div>
                                <div className="p-6">
                                    {selectedQuery ? (
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-3">
                                                {selectedQuery.subject || `Query #${selectedQuery._id}`}
                                            </h4>
                                            <div className="space-y-3 text-sm">
                                                <div>
                                                    <span className="font-medium text-gray-700">Status:</span>
                                                    <span className={`ml-2 px-2 py-1 rounded text-xs ${selectedQuery.status === 'open' ? 'bg-blue-100 text-blue-800' :
                                                        selectedQuery.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {selectedQuery.status || 'Open'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-700">Type:</span>
                                                    <span className="ml-2 capitalize">{selectedQuery.type}</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-700">Priority:</span>
                                                    <span className="ml-2 capitalize">{selectedQuery.priority}</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-700">Created:</span>
                                                    <span className="ml-2 text-gray-600">
                                                        {formatDate(selectedQuery.createdAt)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-700">Message:</span>
                                                    <p className="mt-1 text-gray-600 whitespace-pre-wrap">
                                                        {selectedQuery.message}
                                                    </p>
                                                </div>
                                                {selectedQuery.response && (
                                                    <div>
                                                        <span className="font-medium text-gray-700">Response:</span>
                                                        <p className="mt-1 text-gray-600 whitespace-pre-wrap">
                                                            {selectedQuery.response}
                                                        </p>
                                                        {selectedQuery.resolvedBy && (
                                                            <div className="mt-1 text-sm text-gray-500">
                                                                Resolved by: {selectedQuery.resolvedBy.name}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center text-gray-500">
                                            <FiEye className="mx-auto mb-2 text-2xl" />
                                            <p>Select a query to view details</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Feedback Tab */}
                {activeTab === 'feedback' && (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-lg shadow">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                    <FiMessageSquare />
                                    Submit Feedback
                                </h2>
                                <p className="text-gray-600 mt-1">Help us improve by sharing your thoughts</p>
                            </div>

                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Feedback Type
                                    </label>
                                    <select
                                        value={feedbackData.type}
                                        onChange={(e) => setFeedbackData({ ...feedbackData, type: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="suggestion">Suggestion</option>
                                        <option value="inquiry">Inquiry</option>
                                        <option value="feature_request">Feature Request</option>
                                        <option value="complaint">Complaint</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Priority
                                    </label>
                                    <select
                                        value={feedbackData.priority}
                                        onChange={(e) => setFeedbackData({ ...feedbackData, priority: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        value={feedbackData.subject}
                                        onChange={(e) => setFeedbackData({ ...feedbackData, subject: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Brief description of your feedback"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        value={feedbackData.message}
                                        onChange={(e) => setFeedbackData({ ...feedbackData, message: e.target.value })}
                                        rows={6}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Please provide detailed feedback..."
                                        required
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={handleSubmitFeedback}
                                        disabled={loading}
                                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        <FiSend />
                                        {loading ? 'Submitting...' : 'Submit Feedback'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Query;