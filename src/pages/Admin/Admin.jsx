import React, { useState } from 'react';
import {
  FaHome,
  FaUserShield,
  FaBook,
  FaFileAlt,
  FaExclamationTriangle,
  FaCog,
} from 'react-icons/fa';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaHome },
    { id: 'librarians', label: 'Librarians', icon: FaUserShield },
    { id: 'books', label: 'Books', icon: FaBook },
    { id: 'fees', label: 'Fee Reports', icon: FaFileAlt },
    { id: 'issues', label: 'Issue Handling', icon: FaExclamationTriangle },
    { id: 'settings', label: 'Settings', icon: FaCog },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <div>Welcome to the Admin Dashboard</div>;
      case 'librarians':
        return <div>Manage Librarians</div>;
      case 'books':
        return <div>Manage Books (Create, Read, Update, Delete)</div>;
      case 'fees':
        return <div>View and Manage Fee Reports</div>;
      case 'issues':
        return <div>Handle Book Issues and Returns</div>;
      case 'settings':
        return <div>Adjust Admin Settings</div>;
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6 font-bold text-xl border-b">Admin Panel</div>
        <ul className="mt-4">
          {menuItems.map(({ id, label, icon: Icon }) => (
            <li
              key={id}
              className={`flex items-center px-6 py-3 cursor-pointer hover:bg-gray-200 ${
                activeTab === id ? 'bg-gray-200 font-semibold' : ''
              }`}
              onClick={() => setActiveTab(id)}
            >
              <Icon className="mr-3" />
              {label}
            </li>
          ))}
        </ul>
      </aside>
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4 capitalize">{activeTab.replace(/-/g, ' ')}</h2>
        {renderTabContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;