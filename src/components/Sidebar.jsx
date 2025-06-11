import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  FaBars,
  FaTimes,
  FaHome,
  FaUser,
  FaBook,
  FaUsers,
  FaCog,
  FaChartBar,
  FaClipboardList,
  FaBookmark,
  FaHistory,
  FaShoppingCart,
  FaUserShield,
  FaBookOpen,
  FaFileAlt,
  FaSignOutAlt,
  FaBell,
  FaSearch,
  FaPlus,
  FaQuestion
} from 'react-icons/fa';
import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = ({ role = 'user', isSidebarOpen, setIsSidebarOpen }) => {
  const { logout } = useAuth();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Check if screen is mobile
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Track scroll state to match navbar height
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && isSidebarOpen && !event.target.closest('.sidebar') && !event.target.closest('.sidebar-toggle')) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isSidebarOpen, setIsSidebarOpen]);

  // Handle logout
  const handleLogout = async (e) => {
    e.preventDefault();

    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await logout();
      // Close sidebar on mobile after logout
      if (isMobile) {
        setIsSidebarOpen(false);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Handle non-functional menu clicks
  // const handleMenuClick = (e) => {
  //   e.preventDefault();
  //   // Optional: Show a toast or alert that features are coming soon
  //   console.log('This feature is coming soon!');
  // };

  // Navigation items based on role
  const getNavigationItems = () => {
    const commonItems = [
      { path: `/${role}`, icon: FaHome, label: 'Dashboard', exact: true },
    ];

    const roleSpecificItems = {
      user: [
        { path: '/user/browse', icon: FaBook, label: 'Browse Books' },
        { path: '/user/mybooks', icon: FaBookmark, label: 'My Books' },
        { path: '/user/fine', icon: FaShoppingCart, label: 'Fine & Reports' },
        { path: '/user/query', icon: FaQuestion, label: 'Queries' },
        { path: '/user/setting', icon: FaBell, label: 'Setting' },
      ],
      librarian: [
        { path: '/librarian/manage', icon: FaPlus, label: 'Manage Books' },
        { path: '/librarian/requests', icon: FaClipboardList, label: 'Requests' },
        { path: '/librarian/query', icon: FaQuestion, label: 'Query' },
        { path: '/librarian/reports', icon: FaChartBar, label: 'Reports' },
        { path: '/librarian/setting', icon: FaCog, label: 'Setting' },

      ],
      admin: [
        { path: '/admin/user', icon: FaUsers, label: 'User Management' },
        { path: '/admin/librarian', icon: FaUserShield, label: 'Librarians' },
        { path: '/admin/reports', icon: FaChartBar, label: 'Reports' },
        { path: '/admin/add-book', icon: FaPlus, label: 'Add Book' },
      ]
    };

    return [...commonItems, ...roleSpecificItems[role]];
  };

  // Function to check if a navigation item is active
  const isNavItemActive = (item) => {
    if (item.exact) {
      // For dashboard, check exact match only
      return location.pathname === item.path;
    } else {
      // For other items, check if path starts with the item path
      return location.pathname.startsWith(item.path);
    }
  };

  const navigationItems = getNavigationItems();

  const getRoleInfo = () => {
    const roleInfo = {
      user: { title: 'User Portal' },
      librarian: { title: 'Librarian Portal' },
      admin: { title: 'Admin Portal' }
    };
    return roleInfo[role];
  };

  const roleInfo = getRoleInfo();

  // Calculate navbar height based on current state
  const getNavbarHeight = () => {
    const isHomePage = location.pathname === '/' || location.pathname === '/home';

    if (isHomePage) {
      return isScrolled ? 'top-16' : 'top-20'; // 4rem (64px) or 5rem (80px)
    } else {
      return 'top-16'; // Always 4rem (64px) for non-home pages
    }
  };

  const navbarHeight = getNavbarHeight();

  // Calculate sidebar height based on navbar height
  const getSidebarHeight = () => {
    const isHomePage = location.pathname === '/' || location.pathname === '/home';

    if (isHomePage) {
      return isScrolled ? 'h-[calc(100vh-4rem)]' : 'h-[calc(100vh-5rem)]';
    } else {
      return 'h-[calc(100vh-4rem)]';
    }
  };

  const sidebarHeight = getSidebarHeight();

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`sidebar fixed ${navbarHeight} left-0 ${sidebarHeight} w-64 
    bg-white backdrop-blur-md border-gray-200 shadow-xl 
    transform transition-transform duration-300 ease-in-out z-50
    ${isMobile ? (isSidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'} 
    lg:translate-x-0`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white border-opacity-20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shadow-sm">
              {role === 'admin' && <FaUserShield className="text-gray-700 text-lg" />}
              {role === 'librarian' && <FaBookOpen className="text-gray-700 text-lg" />}
              {role === 'user' && <FaUser className="text-gray-700 text-lg" />}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">{roleInfo.title}</h2>
              <p className="text-sm text-gray-500 capitalize">Welcome, {role}</p>
            </div>
          </div>
        </div>
        <hr />

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isNavItemActive(item);

              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => {
                      // Close sidebar on mobile after navigation
                      if (isMobile) {
                        setIsSidebarOpen(false);
                      }
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${isActive
                      ? 'bg-gray-200 text-gray-900 font-medium'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      } ${isLoggingOut ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`}
                  >
                    <Icon
                      className={`text-lg transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'
                        }`}
                    />
                    <span className="text-left">{item.label}</span>
                  </NavLink>
                </li>
              );
            })}

            {/* Logout Button - Functional */}
            {/* <li>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
                  isLoggingOut
                    ? 'opacity-50 cursor-not-allowed bg-red-50 text-red-400'
                    : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                }`}
              >
                {isLoggingOut ? (
                  <svg className="animate-spin text-lg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <FaSignOutAlt className="text-lg transition-transform duration-200 group-hover:scale-105" />
                )}
                <span className="font-medium text-left">
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </span>
              </button>
            </li> */}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;