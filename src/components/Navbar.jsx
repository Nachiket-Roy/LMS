import { useState, useEffect } from 'react';
import { FaSignInAlt, FaUserPlus, FaUser, FaUserShield, FaUserTie, FaBook, FaBars, FaTimes, FaCog, FaSignOutAlt, FaSpinner } from 'react-icons/fa';
import { NavLink, useLocation } from 'react-router-dom';
import LoginRegisterCard from '../pages/LoginRegisterCard';
import { getProfile } from '../services/userApi';
import { getProfile as getLibrarianProfile } from '../services/librarianApi';
import { getProfile as getAdminProfile } from '../services/adminApi';
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({ onAuthClick, onSidebarToggle }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  // Get current location to determine if we're on home page
  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname === '/home';
  const { user, isAuthenticated, logout, authInitialized } = useAuth();
  const role = userProfile?.role || user?.role || (authInitialized ? "guest" : null);
  // Fetch user profile data based on role
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isAuthenticated || !user?.role) return;

      setLoading(true);
      try {
        let res;
        switch (user.role) {
          case 'user':
            res = await getProfile();
            break;
          case 'librarian':
            res = await getLibrarianProfile();
            break;
          case 'admin':
            res = await getAdminProfile();
            break;
          default:
            return;
        }

        if (res.data?.success && res.data?.data) {
          setUserProfile(res.data.data);
        } else {
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, user]);



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

  const handleLogout = async (e) => {
    e.preventDefault();

    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);
      setIsUserMenuOpen(false);

      // Clear local state immediately
      setUserProfile(null);

      // Call the logout function from auth context
      await logout();

      // Optional: Redirect to home page after logout
      window.location.href = '/'; // This will cause a full page reload

    } catch (error) {
      console.error('Logout error:', error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsLoggingOut(false);
    }
  };
  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    if (onSidebarToggle) {
      onSidebarToggle();
    }
  };

  // Get role-based avatar styles and icons
  const getRoleAvatar = (userRole) => {
    const baseConfig = {
      admin: {
        icon: FaUserShield,
        bgColor: 'bg-gradient-to-r from-red-500 to-red-600',
        hoverBg: 'hover:from-red-600 hover:to-red-700',
        shadowColor: 'hover:shadow-red-500/25',
      },
      librarian: {
        icon: FaUserTie,
        bgColor: 'bg-gradient-to-r from-green-500 to-green-600',
        hoverBg: 'hover:from-green-600 hover:to-green-700',
        shadowColor: 'hover:shadow-green-500/25',
      },
      user: {
        icon: FaUser,
        bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
        hoverBg: 'hover:from-blue-600 hover:to-blue-700',
        shadowColor: 'hover:shadow-blue-500/25',
      },
      guest: {
        icon: FaUser,
        bgColor: 'bg-gradient-to-r from-gray-500 to-gray-600',
        hoverBg: 'hover:from-gray-600 hover:to-gray-700',
        shadowColor: 'hover:shadow-gray-500/25',
      }
    };

    const config = baseConfig[userRole] || baseConfig.guest;

    return {
      ...config,
      name: userProfile?.name || userProfile?.full_name || '',
      email: userProfile?.email || '',
      avatar: userProfile?.avatar || userProfile?.profile_picture || null
    };
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
      if (isUserMenuOpen && !event.target.closest('.user-menu-dropdown') && !event.target.closest('.user-avatar-button')) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen, isUserMenuOpen]);

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

  // Render avatar content (image or icon)
  const renderAvatarContent = () => {
    if (roleAvatar.avatar) {
      return (
        <img
          src={roleAvatar.avatar}
          alt="User Avatar"
          className="w-full h-full rounded-xl object-cover"
          onError={(e) => {
            // Fallback to icon if image fails to load
            e.target.style.display = 'none';
            e.target.parentNode.querySelector('.fallback-icon').style.display = 'flex';
          }}
        />
      );
    }
    return <roleAvatar.icon className="text-lg" />;
  };

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
            {/* User Avatar Button for logged-in users */}
            {['user', 'admin', 'librarian'].includes(role) && (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className={`user-avatar-button relative flex items-center justify-center w-10 h-10 rounded-xl font-medium transition-all duration-200 ease-out hover:scale-105 cursor-pointer overflow-hidden ${(isHomePage && !isScrolled)
                    ? 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20'
                    : `${roleAvatar.bgColor} ${roleAvatar.hoverBg} text-white shadow-lg ${roleAvatar.shadowColor}`
                    }`}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <>
                      {renderAvatarContent()}
                      {/* Fallback icon (hidden by default, shown if image fails) */}
                      <div className="fallback-icon absolute inset-0 flex items-center justify-center" style={{ display: roleAvatar.avatar ? 'none' : 'flex' }}>
                        <roleAvatar.icon className="text-lg" />
                      </div>
                    </>
                  )}
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
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center overflow-hidden relative ${roleAvatar.bgColor} shadow-lg`}>
                        {loading ? (
                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                        ) : roleAvatar.avatar ? (
                          <>
                            <img
                              src={roleAvatar.avatar}
                              alt="User Avatar"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentNode.querySelector('.dropdown-fallback-icon').style.display = 'flex';
                              }}
                            />
                            <div className="dropdown-fallback-icon absolute inset-0 flex items-center justify-center" style={{ display: 'none' }}>
                              <roleAvatar.icon className="text-white text-lg" />
                            </div>
                          </>
                        ) : (
                          <roleAvatar.icon className="text-white text-lg" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold truncate ${(isHomePage && !isScrolled) ? 'text-white' : 'text-gray-900'}`}>
                          {loading ? 'Loading...' : (roleAvatar.name || 'User')}
                        </p>
                        <p className={`text-sm truncate ${(isHomePage && !isScrolled) ? 'text-white/70' : 'text-gray-500'}`}>
                          {loading ? 'Please wait...' : (roleAvatar.email || 'No email available')}
                        </p>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2 space-y-1">
                      <NavLink
                        to="/user/setting"
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${(isHomePage && !isScrolled)
                          ? 'text-white hover:bg-white/10'
                          : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FaCog className="text-lg" />
                        Settings
                      </NavLink>
                    </div>

                    {/* Logout Section */}
                    <div className="pt-2 border-t border-gray-200/20">
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${(isHomePage && !isScrolled)
                          ? 'text-red-400 hover:bg-red-500/10'
                          : 'text-red-600 hover:bg-red-50'
                          } ${isLoggingOut ? 'opacity-50' : ''}`}
                      >
                        {isLoggingOut ? (
                          <FaSpinner className="animate-spin text-lg" />
                        ) : (
                          <>
                            <FaSignOutAlt className="text-lg" />
                            Logout
                          </>
                        )}
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