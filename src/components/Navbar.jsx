import { useState, useEffect } from 'react';
import { FaSignInAlt, FaUserPlus, FaBell, FaUser, FaUserShield, FaUserTie, FaBook, FaBars, FaTimes, FaCircle, FaCog, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { NavLink, useLocation } from 'react-router-dom';
import LoginRegisterCard from '../pages/LoginRegisterCard';

const Navbar = ({ role = 'guest', onAuthClick, onSidebarToggle }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Get current location to determine if we're on home page
  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname === '/home';

  const handleClose = () => setIsAuthModalOpen(false);
  
  const handleAuthClick = (mode) => {
    setAuthMode(mode);
    if (onAuthClick) {
      onAuthClick(); // Use parent's auth handler if provided
    } else {
      setIsAuthModalOpen(true); // Fallback to internal modal
    }
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    console.log('Logout');
    setIsUserMenuOpen(false);
    // Add your logout logic here
  };

  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    if (onSidebarToggle) {
      onSidebarToggle();
    }
  };

  // Mock notifications data - replace with actual data from your API
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "New book 'JavaScript Mastery' has been added to your wishlist",
      time: "2 minutes ago",
      read: false,
      type: "info"
    },
    {
      id: 2,
      message: "Your book 'React Fundamentals' is due tomorrow",
      time: "1 hour ago",
      read: false,
      type: "warning"
    },
    {
      id: 3,
      message: "Successfully returned 'Python Cookbook'",
      time: "3 hours ago",
      read: true,
      type: "success"
    },
    {
      id: 4,
      message: "New announcement from library administration",
      time: "1 day ago",
      read: true,
      type: "info"
    },
    {
      id: 5,
      message: "Your reservation for 'Advanced Web Development' is ready",
      time: "2 days ago",
      read: false,
      type: "success"
    }
  ]);

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // Get role-based avatar styles and icons
  const getRoleAvatar = (userRole) => {
    switch (userRole) {
      case 'admin':
        return {
          icon: FaUserShield,
          bgColor: 'bg-gradient-to-r from-red-500 to-red-600',
          hoverBg: 'hover:from-red-600 hover:to-red-700',
          shadowColor: 'hover:shadow-red-500/25',
          name: 'Admin User',
          email: 'admin@mylibrary.com'
        };
      case 'librarian':
        return {
          icon: FaUserTie,
          bgColor: 'bg-gradient-to-r from-green-500 to-green-600',
          hoverBg: 'hover:from-green-600 hover:to-green-700',
          shadowColor: 'hover:shadow-green-500/25',
          name: 'Librarian',
          email: 'librarian@mylibrary.com'
        };
      case 'user':
        return {
          icon: FaUser,
          bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
          hoverBg: 'hover:from-blue-600 hover:to-blue-700',
          shadowColor: 'hover:shadow-blue-500/25',
          name: 'Library User',
          email: 'user@mylibrary.com'
        };
      default:
        return {
          icon: FaUser,
          bgColor: 'bg-gradient-to-r from-gray-500 to-gray-600',
          hoverBg: 'hover:from-gray-600 hover:to-gray-700',
          shadowColor: 'hover:shadow-gray-500/25',
          name: 'Guest User',
          email: 'guest@mylibrary.com'
        };
    }
  };

  const roleAvatar = getRoleAvatar(role);

  // Improved scroll detection with lower threshold and requestAnimationFrame
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          // Reduced threshold from 50 to 20 for quicker response
          setIsScrolled(currentScrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.hamburger-menu')) {
        setIsMobileMenuOpen(false);
      }
      if (isNotificationOpen && !event.target.closest('.notification-dropdown') && !event.target.closest('.notification-button')) {
        setIsNotificationOpen(false);
      }
      if (isUserMenuOpen && !event.target.closest('.user-menu-dropdown') && !event.target.closest('.user-avatar-button')) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen, isNotificationOpen, isUserMenuOpen]);

  // Determine navbar background and text colors based on page and scroll state
  const getNavbarStyles = () => {
    // For guest users, maintain consistent behavior across all pages
    if (role === 'guest') {
      if (isHomePage) {
        // Home page: transparent initially, white when scrolled
        return {
          background: isScrolled
            ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50'
            : 'bg-transparent',
          textColor: isScrolled ? 'text-gray-900' : 'text-white',
          linkColor: isScrolled
            ? 'text-gray-700 hover:text-orange-600'
            : 'text-white/90 hover:text-white',
          height: isScrolled ? 'h-16' : 'h-20'
        };
      } else {
        // Other pages for guests: dark background initially, white when scrolled
        return {
          background: isScrolled
            ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50'
            : 'bg-transparent',
          textColor: isScrolled ? 'text-gray-900' : 'text-white',
          linkColor: isScrolled
            ? 'text-gray-700 hover:text-orange-600'
            : 'text-white/90 hover:text-white',
          height: 'h-16'
        };
      }
    } else {
      // For logged-in users (admin, user, librarian)
      if (isHomePage) {
        // Home page: transparent initially, white when scrolled
        return {
          background: isScrolled
            ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50'
            : 'bg-transparent',
          textColor: isScrolled ? 'text-gray-900' : 'text-white',
          linkColor: isScrolled
            ? 'text-gray-700 hover:text-orange-600'
            : 'text-white/90 hover:text-white',
          height: isScrolled ? 'h-16' : 'h-20'
        };
      } else {
        // Other pages: always white background
        return {
          background: 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50',
          textColor: 'text-gray-900',
          linkColor: 'text-gray-700 hover:text-orange-600',
          height: 'h-16'
        };
      }
    }
  };

  const navStyles = getNavbarStyles();

  return (
    <>
      <div
        className={`fixed inset-x-0 z-50 transition-all duration-200 ease-out ${navStyles.background} ${navStyles.height}`}
      >
        <nav className="flex h-full items-center justify-between px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            {/* Sidebar Toggle Button - Show only for logged-in users on smaller and medium devices */}
            {['user', 'admin', 'librarian'].includes(role) && (
              <button
                onClick={handleSidebarToggle}
                className={`sidebar-toggle lg:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ease-out cursor-pointer hover:scale-105 ${(isHomePage && !isScrolled)
                    ? 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                  }`}
                aria-label="Toggle sidebar"
              >
                <FaBars className="text-lg" />
              </button>
            )}

            {/* Logo */}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ease-out cursor-pointer hover:scale-105 ${(isHomePage && !isScrolled)
                ? 'bg-gradient-to-r from-orange-400 to-orange-500 shadow-xl shadow-orange-500/25'
                : 'bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg'
              }`}>
              <FaBook className="text-white text-lg" />
            </div>
            <span className={`text-xl font-bold tracking-wide transition-colors duration-200 ease-out ${navStyles.textColor}`}>
              {['user', 'admin', 'librarian'].includes(role) ? (
                <span className="cursor-default">MyLibrary</span>
              ) : (
                <a
                  href="/"
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                  onClick={closeMobileMenu}
                >
                  MyLibrary
                </a>
              )}
            </span>
          </div>

          {/* Desktop Navigation Links - Show on large devices only for guests */}
          {role === 'guest' && (
            <div className="hidden lg:flex items-center gap-8">
              {[
                { href: '/contact', label: 'Contact Us' },
                { href: '/faqs', label: 'FAQs' },
                { href: '/about', label: 'About' }
              ].map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className={`relative font-medium transition-all duration-200 ease-out hover:scale-105 cursor-pointer ${navStyles.linkColor}`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}

          {/* Right-side buttons and menus */}
          <div className="flex items-center gap-3">
            {/* Notification button for logged-in users */}
            {['user', 'admin', 'librarian'].includes(role) && (
              <div className="relative">
                <button
                  onClick={toggleNotifications}
                  className={`notification-button relative flex items-center justify-center w-10 h-10 rounded-xl font-medium transition-all duration-200 ease-out hover:scale-105 cursor-pointer ${(isHomePage && !isScrolled)
                      ? 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20'
                      : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-blue-500/25'
                    }`}
                >
                  <FaBell className="text-lg" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                <div
                  className={`notification-dropdown absolute top-full right-0 mt-2 w-80 max-w-[90vw] transition-all duration-200 ease-out ${isNotificationOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    } ${(isHomePage && !isScrolled)
                      ? 'bg-black/90 backdrop-blur-lg border border-white/20'
                      : 'bg-white/95 backdrop-blur-lg border border-gray-200/50 shadow-lg'
                    } rounded-xl overflow-hidden`}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className={`font-semibold ${(isHomePage && !isScrolled) ? 'text-white' : 'text-gray-900'}`}>
                        Notifications
                      </h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className={`text-xs font-medium transition-colors duration-200 ${(isHomePage && !isScrolled) ? 'text-orange-400 hover:text-orange-300' : 'text-orange-600 hover:text-orange-700'}`}
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {notifications.slice(0, 5).map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => markAsRead(notification.id)}
                          className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${!notification.read 
                              ? (isHomePage && !isScrolled) 
                                ? 'bg-white/10 hover:bg-white/20' 
                                : 'bg-blue-50 hover:bg-blue-100'
                              : (isHomePage && !isScrolled)
                                ? 'bg-white/5 hover:bg-white/10'
                                : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                        >
                          <div className="flex items-start gap-2">
                            <div className="flex-shrink-0 mt-1">
                              {!notification.read && (
                                <FaCircle className="text-blue-500 text-xs" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium ${(isHomePage && !isScrolled) ? 'text-white' : 'text-gray-900'} ${!notification.read ? 'font-semibold' : ''}`}>
                                {notification.message}
                              </p>
                              <p className={`text-xs mt-1 ${(isHomePage && !isScrolled) ? 'text-white/70' : 'text-gray-500'}`}>
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-200/20">
                      <button
                        onClick={() => console.log('View all notifications')}
                        className={`w-full text-center text-sm font-medium transition-colors duration-200 ${(isHomePage && !isScrolled) ? 'text-orange-400 hover:text-orange-300' : 'text-orange-600 hover:text-orange-700'}`}
                      >
                        View all notifications
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* User Avatar Button for logged-in users */}
            {['user', 'admin', 'librarian'].includes(role) && (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className={`user-avatar-button flex items-center justify-center w-10 h-10 rounded-xl font-medium transition-all duration-200 ease-out hover:scale-105 cursor-pointer ${(isHomePage && !isScrolled)
                      ? 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20'
                      : `${roleAvatar.bgColor} ${roleAvatar.hoverBg} text-white shadow-lg ${roleAvatar.shadowColor}`
                    }`}
                >
                  <roleAvatar.icon className="text-lg" />
                </button>

                {/* User Menu Dropdown */}
                <div
                  className={`user-menu-dropdown absolute top-full right-0 mt-2 w-64 transition-all duration-200 ease-out ${isUserMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    } ${(isHomePage && !isScrolled)
                      ? 'bg-black/90 backdrop-blur-lg border border-white/20'
                      : 'bg-white/95 backdrop-blur-lg border border-gray-200/50 shadow-lg'
                    } rounded-xl overflow-hidden`}
                >
                  <div className="p-4">
                    {/* User Info Section */}
                    <div className="flex items-center gap-3 pb-3 border-b border-gray-200/20">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${roleAvatar.bgColor} shadow-lg`}>
                        <roleAvatar.icon className="text-white text-lg" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold truncate ${(isHomePage && !isScrolled) ? 'text-white' : 'text-gray-900'}`}>
                          {roleAvatar.name}
                        </p>
                        <p className={`text-sm truncate ${(isHomePage && !isScrolled) ? 'text-white/70' : 'text-gray-500'}`}>
                          {roleAvatar.email}
                        </p>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2 space-y-1">
                      <a
                        href="/profile"
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${(isHomePage && !isScrolled) 
                          ? 'text-white hover:bg-white/10' 
                          : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FaUserCircle className="text-lg" />
                        Profile
                      </a>
                      <a
                        href="/settings"
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${(isHomePage && !isScrolled) 
                          ? 'text-white hover:bg-white/10' 
                          : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FaCog className="text-lg" />
                        Settings
                      </a>
                    </div>

                    {/* Logout Section */}
                    <div className="pt-2 mt-2 border-t border-gray-200/20">
                      <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${(isHomePage && !isScrolled) 
                          ? 'text-red-400 hover:bg-red-500/10' 
                          : 'text-red-600 hover:bg-red-50'
                        }`}
                      >
                        <FaSignOutAlt className="text-lg" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Desktop Auth buttons for guests - Show on medium+ devices */}
            {role === 'guest' && (
              <div className="hidden md:flex items-center gap-3">
                <button
                  onClick={() => handleAuthClick('login')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ease-out hover:scale-105 cursor-pointer ${(isHomePage && !isScrolled)
                      ? 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                    }`}
                >
                  <FaSignInAlt className="text-sm" />
                  Login
                </button>
                <button
                  onClick={() => handleAuthClick('register')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ease-out hover:scale-105 cursor-pointer ${(isHomePage && !isScrolled)
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-xl hover:shadow-orange-500/25'
                      : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-orange-500/25'
                    }`}
                >
                  <FaUserPlus className="text-sm" />
                  Register
                </button>
              </div>
            )}

            {/* Hamburger Menu - Only show for guests on mobile/tablet */}
            {role === 'guest' && (
              <button
                onClick={toggleMobileMenu}
                className={`hamburger-menu md:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ease-out cursor-pointer hover:scale-105 ${(isHomePage && !isScrolled)
                    ? 'bg-gradient-to-r from-orange-400 to-orange-500 shadow-xl shadow-orange-500/25'
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg'
                  }`}
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? (
                  <FaTimes className="text-white text-lg" />
                ) : (
                  <FaBars className="text-white text-lg" />
                )}
              </button>
            )}
          </div>
        </nav>

        {/* Mobile Menu Dropdown - Only for guests */}
        {role === 'guest' && (
          <div
            className={`mobile-menu md:hidden absolute top-full left-0 right-0 transition-all duration-200 ease-out ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
              } ${(isHomePage && !isScrolled)
                ? 'bg-black/90 backdrop-blur-lg border-t border-white/20'
                : 'bg-white/95 backdrop-blur-lg border-t border-gray-200/50 shadow-lg'
              }`}
          >
            <div className="flex flex-col py-6 px-4 space-y-1">
              {/* Mobile Navigation Links - Only Contact Us, FAQs, About Us */}
              {[
                { to: '/contact', label: 'Contact Us' },
                { to: '/faqs', label: 'FAQs' },
                { to: '/about', label: 'About' }
              ].map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `py-3 px-4 rounded-xl font-medium transition-all duration-200 ease-out cursor-pointer ${(isHomePage && !isScrolled)
                      ? `text-white hover:bg-white/10 ${isActive ? 'bg-white/20 text-white border-l-4 border-orange-500' : ''}`
                      : `text-gray-700 hover:bg-gray-100 ${isActive ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-500' : ''}`
                    }`
                  }
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </NavLink>
              ))}

              {/* Mobile Auth buttons for guests */}
              <div className={`flex flex-col space-y-3 pt-4 mt-4 ${(isHomePage && !isScrolled) ? 'border-t border-white/20' : 'border-t border-gray-200'
                }`}>
                <button
                  onClick={() => handleAuthClick('login')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ease-out hover:scale-105 cursor-pointer ${(isHomePage && !isScrolled)
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-xl hover:shadow-orange-500/25'
                      : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-orange-500/25'
                    }`}
                >
                  <FaSignInAlt className="text-sm" />
                  Login
                </button>

                <button
                  onClick={() => handleAuthClick('register')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ease-out hover:scale-105 cursor-pointer ${(isHomePage && !isScrolled)
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-xl hover:shadow-orange-500/25'
                      : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-orange-500/25'
                    }`}
                >
                  <FaUserPlus className="text-sm" />
                  Register
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Only show internal auth modal if no external handler is provided */}
      {isAuthModalOpen && !onAuthClick && (
        <LoginRegisterCard initialMode={authMode} onClose={handleClose} />
      )}
    </>
  );
};

export default Navbar;