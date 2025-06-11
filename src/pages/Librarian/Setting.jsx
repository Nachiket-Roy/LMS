import { useState, useEffect, useCallback, useRef } from 'react';
import React from 'react';

// React Icons imports
import {
    FaCog,
    FaUser,
    FaEye,
    FaEyeSlash,
    FaUserTie,
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
    FaCheckCircle,
    FaBell,
    FaChartBar,
    FaBook,
    FaUsers,
    FaShieldAlt,
    FaDatabase,
    FaIdBadge,
    FaBriefcase,
    FaUserShield,
    FaBuilding
} from 'react-icons/fa';

// Import librarian API functions
import {
    getProfile,
    updateProfile,
    deleteAccount,
    getLibrarianDashboard,
    sendNotification,
    sendOverdueReminders,
    sendDueDateReminders
} from '../../services/librarianApi';
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
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Profile Header with Edit Button */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-blue-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="bg-blue-600 text-white rounded-full p-3 sm:p-4">
                            <FaUser className="w-6 h-6 sm:w-8 sm:h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Librarian Profile</h3>
                            <p className="text-sm sm:text-base text-gray-600">Manage your professional information</p>
                        </div>
                    </div>
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                        >
                            <FaEdit className="w-4 h-4" />
                            <span>Edit Profile</span>
                        </button>
                    ) : (
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                            <button
                                onClick={discardChanges}
                                className="px-4 sm:px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveChanges}
                                disabled={saving}
                                className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {saving ? <FaSpinner className="animate-spin inline mr-2" /> : null}
                                Save Changes
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-8 sm:py-12 bg-gray-50 rounded-lg sm:rounded-xl">
                    <FaSpinner className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-blue-600" />
                    <span className="ml-3 text-base sm:text-lg text-gray-600">Loading profile...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                    {/* Left Column - Personal Information */}
                    <div className="space-y-4 sm:space-y-6">
                        {/* Full Name */}
                        <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl border border-gray-200 shadow-sm">
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                                Full Name *
                            </label>
                            <div className="relative">
                                <input
                                    id="name"
                                    type="text"
                                    value={profileData.name || ''}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 text-base sm:text-lg"
                                    placeholder="Enter your full name"
                                    required
                                    aria-required="true"
                                />
                                {!profileData.name && (
                                    <span className="absolute right-3 top-2 sm:top-3 text-red-500">*</span>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl border border-gray-200 shadow-sm">
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                                Email Address
                            </label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-3 sm:left-4 top-3 sm:top-4 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                                <input
                                    id="email"
                                    type="email"
                                    value={profileData.email || ''}
                                    readOnly
                                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-base sm:text-lg"
                                    placeholder="your.email@library.edu"
                                    aria-readonly="true"
                                />
                            </div>
                            <p className="text-xs sm:text-sm text-gray-500 mt-2">
                                Email cannot be changed. Contact IT support if needed.
                            </p>
                        </div>

                        {/* Contact Number */}
                        <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl border border-gray-200 shadow-sm">
                            <label htmlFor="contact" className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                                Phone Number
                            </label>
                            <div className="relative">
                                <FaPhone className="absolute left-3 sm:left-4 top-3 sm:top-4 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                                <input
                                    id="contact"
                                    type="tel"
                                    value={profileData.contact || ''}
                                    onChange={(e) => handleInputChange('contact', e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 text-base sm:text-lg"
                                    placeholder="+1 (555) 123-4567"
                                    pattern="[0-9]{10}"
                                />
                            </div>
                            {isEditing && (
                                <p className="text-xs sm:text-sm text-gray-500 mt-2">
                                    Include country code if outside the US
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Additional Information */}
                    <div className="space-y-4 sm:space-y-6">
                        {/* Address */}
                        <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl border border-gray-200 shadow-sm">
                            <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                                Address
                            </label>
                            <div className="relative">
                                <FaMapMarkerAlt className="absolute left-3 sm:left-4 top-3 sm:top-4 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                                <textarea
                                    id="address"
                                    value={profileData.address || ''}
                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                    disabled={!isEditing}
                                    rows={4}
                                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 text-base sm:text-lg resize-none"
                                    placeholder="123 Main St, City, State ZIP"
                                />
                            </div>
                        </div>

                        {/* Hire Date */}
                        <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl border border-gray-200 shadow-sm">
                            <label htmlFor="hireDate" className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                                Hire Date
                            </label>
                            <div className="relative">
                                <FaCalendarAlt className="absolute left-3 sm:left-4 top-3 sm:top-4 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                                <input
                                    id="hireDate"
                                    type="text"
                                    value={profileData.hireDate ? new Date(profileData.hireDate).toLocaleDateString() : 'N/A'}
                                    readOnly
                                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-base sm:text-lg"
                                    aria-readonly="true"
                                />
                            </div>
                        </div>

                        {/* Position */}
                        {profileData.role && (
                            <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl border border-gray-200 shadow-sm">
                                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                                    Position
                                </label>
                                <div className="relative">
                                    <FaUserTie className="absolute left-3 sm:left-4 top-3 sm:top-4 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                                    <input
                                        type="text"
                                        value={profileData.role}
                                        readOnly
                                        className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-base sm:text-lg"
                                        aria-readonly="true"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Bottom Action Buttons (for mobile) */}
            {isEditing && (
                <div className="flex flex-col sm:hidden space-y-3 pt-4">
                    <button
                        onClick={discardChanges}
                        className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Discard Changes
                    </button>
                    <button
                        onClick={saveChanges}
                        disabled={saving}
                        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {saving ? <FaSpinner className="animate-spin inline mr-2" /> : null}
                        Save Profile
                    </button>
                </div>
            )}
        </div>
    );
});

// Memoized AccountSection component
const AccountSection = React.memo(({ profileData, handleDeleteAccount, saving }) => (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Account Header */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-orange-100">
            <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="bg-orange-600 text-white rounded-full p-3 sm:p-4">
                    <FaUserCog className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Account Management</h3>
                    <p className="text-sm sm:text-base text-gray-600">Manage your librarian account settings and permissions</p>
                </div>
            </div>
        </div>

        {/* Account Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Account Details</h4>
                <div className="space-y-3 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 space-y-1 sm:space-y-0">
                        <span className="text-gray-600 text-sm sm:text-base">Account Status</span>
                        <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs sm:text-sm font-medium w-fit">Active</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 space-y-1 sm:space-y-0">
                        <span className="text-gray-600 text-sm sm:text-base">Account Type</span>
                        <span className="text-gray-900 font-medium text-sm sm:text-base">Librarian</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 space-y-1 sm:space-y-0">
                        <span className="text-gray-600 text-sm sm:text-base">Department</span>
                        <span className="text-gray-900 font-medium text-sm sm:text-base">{profileData.department || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 space-y-1 sm:space-y-0">
                        <span className="text-gray-600 text-sm sm:text-base">Employee Since</span>
                        <span className="text-gray-900 font-medium text-sm sm:text-base">
                            {profileData.hireDate ? new Date(profileData.hireDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            }) : 'N/A'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Permissions & Access</h4>
                <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center space-x-3 p-2 sm:p-3 bg-blue-50 rounded-lg">
                        <FaBook className="text-blue-600 flex-shrink-0" />
                        <span className="text-blue-900 font-medium text-sm sm:text-base">Book Management</span>
                    </div>
                    <div className="flex items-center space-x-3 p-2 sm:p-3 bg-green-50 rounded-lg">
                        <FaUsers className="text-green-600 flex-shrink-0" />
                        <span className="text-green-900 font-medium text-sm sm:text-base">User Management</span>
                    </div>
                    <div className="flex items-center space-x-3 p-2 sm:p-3 bg-purple-50 rounded-lg">
                        <FaChartBar className="text-purple-600 flex-shrink-0" />
                        <span className="text-purple-900 font-medium text-sm sm:text-base">Reports & Analytics</span>
                    </div>
                    <div className="flex items-center space-x-3 p-2 sm:p-3 bg-orange-50 rounded-lg">
                        <FaBell className="text-orange-600 flex-shrink-0" />
                        <span className="text-orange-900 font-medium text-sm sm:text-base">Notification System</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 border-2 border-red-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                <FaExclamationTriangle className="text-red-600 w-6 h-6 flex-shrink-0" />
                <div className="flex-grow">
                    <h4 className="text-base sm:text-lg font-semibold text-red-900 mb-2">Danger Zone</h4>
                    <p className="text-red-700 mb-4 sm:mb-6 text-sm sm:text-base">
                        Once you delete your librarian account, there is no going back. This action requires administrator approval
                        and will permanently remove your access to the library management system.
                    </p>
                    <div className="bg-white p-3 sm:p-4 rounded-lg border border-red-200 mb-4">
                        <h5 className="font-medium text-red-900 mb-2 text-sm sm:text-base">What will be affected:</h5>
                        <ul className="text-xs sm:text-sm text-red-700 space-y-1">
                            <li>• Your profile and employment information</li>
                            <li>• Access to library management system</li>
                            <li>• Historical records and activity logs</li>
                            <li>• Notification preferences and settings</li>
                            <li>• Administrative permissions and roles</li>
                        </ul>
                    </div>
                    <button
                        onClick={handleDeleteAccount}
                        disabled={saving}
                        className="w-full sm:w-auto flex items-center justify-center gap-3 px-4 sm:px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors duration-200"
                    >
                        {saving ? (
                            <FaSpinner className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                        ) : (
                            <FaTrash className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                        Request Account Deletion
                    </button>
                </div>
            </div>
        </div>
    </div>
));

const LibrarianSettingsPage = () => {
    const [activeSection, setActiveSection] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    // Librarian profile state
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        contact: '',
        address: '',
        employeeId: '',
        department: '',
        position: '',
        hireDate: '',
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
        { id: 'profile', name: 'Profile Information', icon: FaUser, description: 'Update your personal and professional details' },
        { id: 'account', name: 'Account Management', icon: FaUserCog, description: 'Manage your librarian account settings' }
    ];

    // Load profile data on component mount
    useEffect(() => {
        loadProfileData();
    }, []);

    const loadProfileData = async () => {
        try {
            setLoading(true);
            const res = await getProfile();
            const data = res.data;

            if (data.success && data.data) {
                const librarian = data.data;

                const newProfileData = {
                    name: librarian.name || '',
                    email: librarian.email || '',
                    contact: librarian.contact || '',
                    address: librarian.address || '',
                    employeeId: librarian.employeeId || '',
                    department: librarian.department || '',
                    position: librarian.position || '',
                    hireDate: librarian.hireDate?.split('T')[0] || librarian.createdAt?.split('T')[0] || '',
                };

                setProfileData(newProfileData);
                setOriginalProfileData(newProfileData);
            }
        } catch (err) {
            console.error('❌ Failed to load librarian profile:', err);
            setMessageWithTimeout('Failed to load profile data. Please refresh the page.', 5000);
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
                    employeeId: profileData.employeeId,
                    department: profileData.department,
                    position: profileData.position,
                    hireDate: profileData.hireDate,
                };

                setProfileData(updatedProfile);
                setOriginalProfileData(updatedProfile);
                setUnsavedChanges(false); setIsEditing(false);
                setMessageWithTimeout('Profile updated successfully!');
            } else {
                throw new Error(data.message || 'Failed to update profile');
            }
        } catch (err) {
            console.error('❌ Profile update error:', err);
            setMessageWithTimeout(err.message || 'Failed to update profile. Please try again.', 5000);
        } finally {
            setSaving(false);
        }
    };

    const discardChanges = useCallback(() => {
        setProfileData(originalProfileData);
        setIsEditing(false);
        setUnsavedChanges(false);
        setMessage('');
        clearMessageTimeout();
    }, [originalProfileData, clearMessageTimeout]);

    const handleDeleteAccount = async () => {
        if (!window.confirm('Are you sure you want to request account deletion? This action cannot be undone.')) {
            return;
        }

        setSaving(true);
        setMessage('');
        clearMessageTimeout();

        try {
            const res = await deleteAccount();
            const data = res.data;

            if (data.success) {
                setMessageWithTimeout('Account deletion request submitted. An administrator will review your request.', 8000);
            } else {
                throw new Error(data.message || 'Failed to request account deletion');
            }
        } catch (err) {
            console.error('❌ Account deletion error:', err);
            setMessageWithTimeout(err.message || 'Failed to request account deletion. Please try again.', 5000);
        } finally {
            setSaving(false);
        }
    };

    // Warn about unsaved changes when leaving the page
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (unsavedChanges) {
                e.preventDefault();
                e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [unsavedChanges]);

    return (
        <div className="min-h-screen ">
            {/* Header */}
            <header className="">
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-gray-900">Librarian Settings</h1>
                        {message && (
                            <div className={`px-4 py-2 rounded-lg ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {message}
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <div className="lg:w-64 flex-shrink-0">
                        <nav className="space-y-1">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full text-left group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeSection === section.id
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                >
                                    <section.icon
                                        className={`mr-3 flex-shrink-0 h-5 w-5 ${activeSection === section.id ? 'text-blue-500' : 'text-gray-400'
                                            }`}
                                    />
                                    {section.name}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1">
                        {activeSection === 'profile' && (
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
                        )}

                        {activeSection === 'notifications' && (
                            <NotificationSection
                                saving={saving}
                                setSaving={setSaving}
                                setMessageWithTimeout={setMessageWithTimeout}
                            />
                        )}

                        {activeSection === 'account' && (
                            <AccountSection
                                profileData={profileData}
                                handleDeleteAccount={handleDeleteAccount}
                                saving={saving}
                            />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LibrarianSettingsPage;