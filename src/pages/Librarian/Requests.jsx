import React, { useState } from 'react';
import { FaBook, FaUserPlus, FaClock, FaExclamationCircle, 
         FaSearch, FaCalendarAlt, FaUser, FaEnvelope, FaPhone,
         FaPaperPlane, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

// Main Request Page Component
const RequestPage = ({ userData, requestStats, recentRequests }) => {
  const [activeTab, setActiveTab] = useState('new-request');

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      

      {/* Request Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          icon={<FaPaperPlane className="w-8 h-8 text-blue-600" />}
          label="Total Requests"
          value={requestStats.totalRequests}
          color="text-blue-600"
        />
        <StatCard 
          icon={<FaClock className="w-8 h-8 text-orange-600" />}
          label="Pending Requests"
          value={requestStats.pendingRequests}
          color="text-orange-600"
        />
        <StatCard 
          icon={<FaCheckCircle className="w-8 h-8 text-green-600" />}
          label="Approved Requests"
          value={requestStats.approvedRequests}
          color="text-green-600"
        />
        <StatCard 
          icon={<FaTimesCircle className="w-8 h-8 text-red-600" />}
          label="Rejected Requests"
          value={requestStats.rejectedRequests}
          color="text-red-600"
        />
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="flex border-b">
          <TabButton 
            active={activeTab === 'new-request'}
            onClick={() => setActiveTab('new-request')}
            icon={<FaPaperPlane className="w-4 h-4" />}
            text="New Request"
          />
          <TabButton 
            active={activeTab === 'my-requests'}
            onClick={() => setActiveTab('my-requests')}
            icon={<FaClock className="w-4 h-4" />}
            text="My Requests"
          />
        </div>
        
        <div className="p-6">
          {activeTab === 'new-request' && <NewRequestForm />}
          {activeTab === 'my-requests' && <RequestHistory requests={recentRequests} />}
        </div>
      </div>
    </div>
  );
};

// Tab Button Component
const TabButton = ({ active, onClick, icon, text }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-6 py-3 font-medium transition-colors ${
      active 
        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
    }`}
  >
    {icon}
    <span>{text}</span>
  </button>
);

// New Request Form Component
const NewRequestForm = () => {
  const [requestType, setRequestType] = useState('book-request');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    description: '',
    priority: 'normal',
    contactMethod: 'email'
  });

  const handleSubmit = () => {
    alert('Request submitted successfully!');
    // Reset form
    setFormData({
      title: '',
      author: '',
      isbn: '',
      description: '',
      priority: 'normal',
      contactMethod: 'email'
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Submit New Request</h3>
      
      {/* Request Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RequestTypeCard
          active={requestType === 'book-request'}
          onClick={() => setRequestType('book-request')}
          icon={<FaBook className="w-6 h-6" />}
          title="Book Request"
          description="Request a specific book"
        />
        <RequestTypeCard
          active={requestType === 'membership'}
          onClick={() => setRequestType('membership')}
          icon={<FaUserPlus className="w-6 h-6" />}
          title="Membership"
          description="Apply for library membership"
        />
        <RequestTypeCard
          active={requestType === 'other'}
          onClick={() => setRequestType('other')}
          icon={<FaExclamationCircle className="w-6 h-6" />}
          title="Other Request"
          description="General inquiries or requests"
        />
      </div>

      {/* Request Form */}
      <div className="space-y-4">
        {requestType === 'book-request' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Book Title"
                type="text"
                value={formData.title}
                onChange={(value) => handleInputChange('title', value)}
                placeholder="Enter book title"
                required
              />
              <InputField
                label="Author"
                type="text"
                value={formData.author}
                onChange={(value) => handleInputChange('author', value)}
                placeholder="Enter author name"
                required
              />
            </div>
            <InputField
              label="ISBN (Optional)"
              type="text"
              value={formData.isbn}
              onChange={(value) => handleInputChange('isbn', value)}
              placeholder="Enter ISBN number"
            />
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description / Additional Details
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Provide additional details about your request..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => handleInputChange('priority', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Contact</label>
            <select
              value={formData.contactMethod}
              onChange={(e) => handleInputChange('contactMethod', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="sms">SMS</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <FaPaperPlane className="w-4 h-4" />
            <span>Submit Request</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Input Field Component
const InputField = ({ label, type, value, onChange, placeholder, required = false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

// Request Type Card Component
const RequestTypeCard = ({ active, onClick, icon, title, description }) => (
  <div
    onClick={onClick}
    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
      active 
        ? 'border-blue-500 bg-blue-50' 
        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
    }`}
  >
    <div className={`${active ? 'text-blue-600' : 'text-gray-600'} mb-2`}>
      {icon}
    </div>
    <h4 className="font-medium mb-1">{title}</h4>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

// Request History Component
const RequestHistory = ({ requests }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">My Recent Requests</h3>
    <div className="space-y-3">
      {requests.map(request => (
        <RequestItem key={request.id} request={request} />
      ))}
    </div>
  </div>
);

// Request Item Component
const RequestItem = ({ request }) => {
  const getStatusColor = () => {
    switch(request.status) {
      case 'pending': return 'bg-orange-500';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'in-progress': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    return request.status.charAt(0).toUpperCase() + request.status.slice(1);
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
          <h4 className="font-medium">{request.title}</h4>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full text-white ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-2">{request.description}</p>
      <div className="flex justify-between text-xs text-gray-500">
        <span>Type: {request.type}</span>
        <span>Submitted: {request.date}</span>
      </div>
    </div>
  );
};

// Reusable Stat Card Component (same as dashboard)
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

// Sample Data
const sampleData = {
  userData: {
    name: 'Alex Johnson',
    avatar: '👤'
  },
  requestStats: {
    totalRequests: 12,
    pendingRequests: 3,
    approvedRequests: 8,
    rejectedRequests: 1
  },
  recentRequests: [
    { 
      id: 1, 
      title: 'Advanced React Patterns', 
      type: 'Book Request',
      status: 'pending', 
      description: 'Looking for advanced React patterns book for learning',
      date: '2 days ago' 
    },
    { 
      id: 2, 
      title: 'Membership Renewal', 
      type: 'Membership',
      status: 'approved', 
      description: 'Annual membership renewal request',
      date: '1 week ago' 
    },
    { 
      id: 3, 
      title: 'Python Data Science Handbook', 
      type: 'Book Request',
      status: 'in-progress', 
      description: 'Need this book for my data science course',
      date: '2 weeks ago' 
    }
  ]
};

// Main Component Export
const LibraryRequestPage = () => (
  <RequestPage 
    userData={sampleData.userData}
    requestStats={sampleData.requestStats}
    recentRequests={sampleData.recentRequests}
  />
);

export default LibraryRequestPage;