import { useState, useEffect, useCallback, useRef } from 'react';
import React from 'react';

// Note: These imports will cause the component to fail in Claude's environment
// but will work in your actual project if you have react-icons installed
import {
  FaCog,
  FaUser,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTrash,
  FaSave,
  FaEdit,
  FaTimes,
  FaSpinner,
  FaUserCog,
  FaExclamationTriangle,
  FaCheckCircle
} from 'react-icons/fa';

// Import your actual API functions
import {
  getProfile,
  updateProfile,
  deleteAccount
} from '../../services/userApi';
import { NavLink } from 'react-router-dom';

// Memoized ProfileSection component
const ProfileSection = React.memo(({
  profileData,
  isEditing,
  loading,
  saving,
  handleInputChange,
  saveChanges,
  discardChanges,
  setIsEditing
}) => {
  return (
    <div className="space-y-8">
      {/* Profile Header with Edit Button */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-600 text-white rounded-full p-4">
              <FaUser className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Profile Information</h3>
              <p className="text-gray-600">Keep your personal information up to date</p>
            </div>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <FaEdit className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex space-x-3">
              <button
                onClick={discardChanges}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveChanges}
                disabled={saving}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {saving ? <FaSpinner className="animate-spin inline mr-2" /> : null}
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 bg-gray-50 rounded-xl">
          <FaSpinner className="w-8 h-8 animate-spin text-purple-600" />
          <span className="ml-3 text-lg text-gray-600">Loading profile...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Full Name (editable) */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Full Name *</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 text-lg"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email (read-only) */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={profileData.email}
                  readOnly
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-lg"
                  placeholder="your.email@example.com"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">Email cannot be changed. Contact support if needed.</p>
            </div>

            {/* Member Since (read-only) */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Member Since</label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={profileData.memberSince}
                  readOnly
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-lg"
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Contact (editable) */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Phone Number</label>
              <div className="relative">
                <FaPhone className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  value={profileData.contact}
                  onChange={(e) => handleInputChange('contact', e.target.value)}
                  disabled={!isEditing}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 text-lg"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            {/* Address (editable) */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Address</label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
                <textarea
                  value={profileData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 text-lg resize-none"
                  placeholder="Enter your complete address"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Action Buttons (for mobile or additional options) */}
      {isEditing && (
        <div className="flex justify-end space-x-4 pt-4 lg:hidden">
          <button
            onClick={discardChanges}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Discard Changes
          </button>
          <button
            onClick={saveChanges}
            disabled={saving}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {saving ? <FaSpinner className="animate-spin inline mr-2" /> : null}
            Save Profile
          </button>
        </div>
      )}
    </div>
  );
});

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // User profile state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    contact: '',
    address: '',
    memberSince: '',
  });

  // Original profile data for reset functionality
  const [originalProfileData, setOriginalProfileData] = useState({});
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Use refs to prevent unnecessary re-renders
  const messageTimeoutRef = useRef(null);
  const profileDataRef = useRef(profileData);

  // Update ref when profileData changes
  useEffect(() => {
    profileDataRef.current = profileData;
  }, [profileData]);

  const sections = [
    { id: 'profile', name: 'Profile Information', icon: FaUser, description: 'Update your personal details' },
    { id: 'account', name: 'Account Management', icon: FaUserCog, description: 'Manage your account settings' }
  ];

  // Load profile data on component mount
  useEffect(() => {
    loadProfileData();
  }, []); // ✅ only once

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const res = await getProfile();
      const data = res.data;

      if (data.success && data.data) {
        const user = data.data;

        const newProfileData = {
          name: user.name || '',
          email: user.email || '',
          contact: user.contact || '',
          address: user.address || '',
          memberSince: user.createdAt?.split('T')[0] || '',
        };

        setProfileData(newProfileData);
        setOriginalProfileData(newProfileData);
      }
    } catch (err) {
      console.error('❌ Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  // Optimized input change handler
  const handleInputChange = useCallback((field, value) => {
    setProfileData(prev => {
      // Only update if value actually changed
      if (prev[field] === value) return prev;

      const newData = { ...prev, [field]: value };

      // Set unsaved changes flag
      setUnsavedChanges(true);

      return newData;
    });
  }, []);

  // Clear message timeout helper
  const clearMessageTimeout = useCallback(() => {
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
      messageTimeoutRef.current = null;
    }
  }, []);

  // Set message with auto-clear
  const setMessageWithTimeout = useCallback((msg, duration = 3000) => {
    clearMessageTimeout();
    setMessage(msg);
    messageTimeoutRef.current = setTimeout(() => {
      setMessage('');
    }, duration);
  }, [clearMessageTimeout]);

  const saveChanges = async () => {
    setSaving(true);
    setMessage('');
    clearMessageTimeout();

    try {
      // Prepare update data - only send fields that can be updated
      const updateData = {
        name: profileData.name.trim(),
        contact: profileData.contact.trim(),
        address: profileData.address.trim(),
      };

      // Validate required fields
      if (!updateData.name) {
        throw new Error('Name is required');
      }

      const res = await updateProfile(updateData);
      const data = res.data;

      if (data.success && data.data) {
        const userData = data.data;

        const updatedProfile = {
          name: userData.name || profileData.name,
          email: userData.email || profileData.email,
          contact: userData.contact || profileData.contact,
          address: userData.address || profileData.address,
          memberSince: profileData.memberSince,
        };

        setProfileData(updatedProfile);
        setOriginalProfileData(updatedProfile);
        setUnsavedChanges(false);
        setIsEditing(false);
        setMessageWithTimeout('Profile updated successfully!');
      } else {
        throw new Error(data.message || 'Error saving profile');
      }

    } catch (error) {
      console.error('❌ Error saving profile:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error saving profile. Please try again.';
      setMessageWithTimeout(errorMessage, 5000);
    } finally {
      setSaving(false);
    }
  };

  const discardChanges = useCallback(() => {
    setProfileData({ ...originalProfileData });
    setUnsavedChanges(false);
    setIsEditing(false);
    setMessageWithTimeout('Changes discarded');
  }, [originalProfileData, setMessageWithTimeout]);

  const handleDeleteAccount = async () => {
    const confirmMessage =
      'Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data.\n\nType "DELETE" to confirm:';
    const userInput = prompt(confirmMessage);

    if (userInput === 'DELETE') {
      setSaving(true);
      setMessage('');
      clearMessageTimeout();

      try {
        const res = await deleteAccount();
        const data = res.data;

        if (data.success) {
          setMessage('Account deleted successfully. You will be logged out.');

          // Clear auth state
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          sessionStorage.clear();

          // Redirect to login/home after 2 seconds
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
        } else {
          throw new Error(data.message || 'Failed to delete account');
        }
      } catch (error) {
        console.error('❌ Error deleting account:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Error deleting account. Please try again or contact support.';
        setMessage(errorMessage);
      } finally {
        setSaving(false);
      }
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      clearMessageTimeout();
    };
  }, [clearMessageTimeout]);



  // Memoized AccountSection component
  const AccountSection = React.memo(() => (
    <div className="space-y-8">
      {/* Account Header */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
        <div className="flex items-center space-x-4">
          <div className="bg-orange-600 text-white rounded-full p-4">
            <FaUserCog className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Account Management</h3>
            <p className="text-gray-600">Manage your account settings and data</p>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Account Status</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Active</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Account Type</span>
              <span className="text-gray-900 font-medium">Standard Member</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Member Since</span>
              <span className="text-gray-900 font-medium">
                {profileData.memberSince ? new Date(profileData.memberSince).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h4>
          <div className="space-y-3">
            {/* Fixed NavLink with proper to prop and corrected typo in URL */}
            <NavLink
              to="/user/query"
              onClick={(e) => {
                e.preventDefault();
                window.open('mailto:support@library.com?subject=Account Support Request', '_blank');
              }}
              className="flex flex-col w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Contact Support</div>
              <div className="text-sm text-gray-600">Get help with your account</div>
            </NavLink>

            {/* Improved download data action with better accessibility */}
            <button
              onClick={() => {
                alert('Data export feature will be available soon. Contact support for assistance.');
              }}
              className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Download Data</div>
              <div className="text-sm text-gray-600">Export your account information</div>
            </button>            
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <FaExclamationTriangle className="text-red-600 w-6 h-6 mt-1 flex-shrink-0" />
          <div className="flex-grow">
            <h4 className="text-lg font-semibold text-red-900 mb-2">Danger Zone</h4>
            <p className="text-red-700 mb-6">
              Once you delete your account, there is no going back. Please be certain. This will permanently delete your account,
              remove all your data, and cannot be undone.
            </p>
            <div className="bg-white p-4 rounded-lg border border-red-200 mb-4">
              <h5 className="font-medium text-red-900 mb-2">What will be deleted:</h5>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Your profile information and preferences</li>
                <li>• All your borrowing history and records</li>
                <li>• Your account settings and configurations</li>
                <li>• Any saved bookmarks or favorites</li>
              </ul>
            </div>
            <button
              onClick={handleDeleteAccount}
              disabled={saving}
              className="flex items-center gap-3 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors duration-200"
            >
              {saving ? (
                <FaSpinner className="w-5 h-5 animate-spin" />
              ) : (
                <FaTrash className="w-5 h-5" />
              )}
              Delete Account Permanently
            </button>
          </div>
        </div>
      </div>
    </div>
  ));

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <ProfileSection
            profileData={profileData}
            isEditing={isEditing}
            loading={loading}
            saving={saving}
            handleInputChange={handleInputChange}
            saveChanges={saveChanges}
            discardChanges={discardChanges}
            setIsEditing={setIsEditing}
          />
        );
      case 'account':
        return <AccountSection />;
      default:
        return (
          <ProfileSection
            profileData={profileData}
            isEditing={isEditing}
            loading={loading}
            saving={saving}
            handleInputChange={handleInputChange}
            saveChanges={saveChanges}
            discardChanges={discardChanges}
            setIsEditing={setIsEditing}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-6 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Page Header */}
          <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-600 text-white rounded-full p-3">
                  <FaCog className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                  <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
                </div>
              </div>
            </div>

            {/* Message Display */}
            {message && (
              <div className={`mt-6 p-4 rounded-lg border ${message.includes('Error') || message.includes('error') || message.includes('Failed')
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-green-50 text-green-700 border-green-200'
                }`}>
                <div className="flex items-center">
                  {message.includes('Error') || message.includes('error') || message.includes('Failed') ? (
                    <FaExclamationTriangle className="w-5 h-5 mr-2" />
                  ) : (
                    <FaCheckCircle className="w-5 h-5 mr-2" />
                  )}
                  {message}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-6">
                <h3 className="font-semibold text-gray-900 mb-4">Navigation</h3>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-start gap-4 px-4 py-4 text-sm font-medium rounded-lg transition-all duration-200 ${activeSection === section.id
                        ? 'bg-purple-50 text-purple-700 border-l-4 border-purple-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                      <section.icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <div className="text-left">
                        <div className="font-medium">{section.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{section.description}</div>
                      </div>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm border p-8">
                {renderSection()}

                {/* Save/Discard Buttons - Only show for profile section */}
                {activeSection === 'profile' && (unsavedChanges || isEditing) && (
                  <div className="flex justify-end gap-4 mt-8 pt-8 border-t border-gray-200">
                    <button
                      onClick={discardChanges}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-3 text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 font-medium transition-colors duration-200"
                    >
                      <FaTimes className="w-4 h-4" />
                      Discard Changes
                    </button>
                    <button
                      onClick={saveChanges}
                      disabled={saving || !unsavedChanges}
                      className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors duration-200"
                    >
                      {saving ? (
                        <FaSpinner className="w-4 h-4 animate-spin" />
                      ) : (
                        <FaSave className="w-4 h-4" />
                      )}
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;