import { useState, useEffect } from 'react';
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
  FaPlus
} from 'react-icons/fa';
import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = ({ role = 'user', isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

  // Navigation items based on role
  const getNavigationItems = () => {
    const commonItems = [
      { path: `/${role}`, icon: FaHome, label: 'Dashboard', exact: true },
    ];

    const roleSpecificItems = {
      user: [
        { path: '/user/browse', icon: FaBook, label: 'Browse Books' },
        { path: '/user/mybooks', icon: FaBookmark, label: 'My Books' },
        { path: '/user/history', icon: FaHistory, label: 'Reading History' },
        { path: '/user/fine', icon: FaShoppingCart, label: 'Fine & Reports' },
        { path: '/user/setting', icon: FaBell, label: 'setting' },
      ],
      librarian: [
        { path: '/librarian/add-book', icon: FaPlus, label: 'Add Book' },
        { path: '/librarian/issued-books', icon: FaClipboardList, label: 'Issued Books' },
        { path: '/librarian/requests', icon: FaFileAlt, label: 'Book Requests' },
        { path: '/librarian/users', icon: FaUsers, label: 'Users' },
        { path: '/librarian/reports', icon: FaChartBar, label: 'Reports' },
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

  const navigationItems = getNavigationItems();

  const getRoleInfo = () => {
    const roleInfo = {
      user: { title: 'User Portal', color: 'bg-gray-600', bgGradient: 'from-gray-600 to-blue-400' },
      librarian: { title: 'Librarian Portal', color: 'bg-gray-600', bgGradient: 'from-gray-600 to-blue-400' },
      admin: { title: 'Admin Portal', color: 'bg-gray-600', bgGradient: 'from-gray-600 to-blue-400' }
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
        <div className="fixed inset-0 bg-white/40 bg-opacity-50 z-40 lg:hidden" />
      )}

      {/* Sidebar */}
      <div
        className={`sidebar fixed ${navbarHeight} left-0 ${sidebarHeight} w-64 bg-gradient-to-b ${roleInfo.bgGradient} text-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isMobile 
            ? (isSidebarOpen ? 'translate-x-0' : '-translate-x-full')
            : 'translate-x-0'
        } lg:translate-x-0`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white border-opacity-20">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${roleInfo.color} rounded-lg flex items-center justify-center shadow-md`}>
              {role === 'admin' && <FaUserShield className="text-lg" />}
              {role === 'librarian' && <FaBookOpen className="text-lg" />}
              {role === 'user' && <FaUser className="text-lg" />}
            </div>
            <div>
              <h2 className="text-lg font-bold">{roleInfo.title}</h2>
              <p className="text-sm text-white text-opacity-80 capitalize">Welcome, {role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);

              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => isMobile && setIsSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                      ? 'bg-white bg-opacity-20 text-white shadow-md'
                      : 'text-white text-opacity-80 hover:bg-gray-100 hover:bg-opacity-10 hover:text-white'
                      }`}
                  >
                    <Icon
                      className={`text-lg transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'
                        }`}
                    />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white border-opacity-20">
          <NavLink
            to={"/"}
            className="flex items-center space-x-3 w-full px-4 py-3 text-white text-opacity-80 hover:bg-white hover:bg-opacity-10 hover:text-white rounded-lg transition-all duration-200 group"
          >
            <FaSignOutAlt className="text-lg transition-transform duration-200 group-hover:scale-105" />
            <span className="font-medium">Logout</span>
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Sidebar;