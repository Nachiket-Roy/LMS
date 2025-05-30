import { useState, useEffect } from 'react';
import { FaSignInAlt, FaUserPlus, FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import { NavLink, useLocation } from 'react-router-dom';
import LoginRegisterCard from '../pages/LoginRegisterCard';

const Navbar = () => {
  const location = useLocation();
  const pathname = location.pathname;

  let role = 'guest';
  if (pathname.startsWith('/admin')) {
    role = 'admin';
  } else if (pathname.startsWith('/user')) {
    role = 'user';
  } else if (pathname.startsWith('/librarian')) {
    role = 'librarian';
  }

  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const handleClose = () => setIsAuthModalOpen(false);
  const handleAuthClick = (mode) => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
    setIsMobileMenuOpen(false); // Close mobile menu when auth modal opens
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setShowNavbar(false);
        setIsMobileMenuOpen(false); // Close mobile menu on scroll
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.hamburger-btn')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <>
      <div
        className={`fixed inset-x-0 z-50 h-16 bg-purple-900 shadow-lg transition-all duration-500 ${
          showNavbar ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'
        }`}
      >
        <nav className="flex h-full items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">📚</span>
            </div>
            <span className="text-white text-xl font-bold tracking-wide">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `transition hover:underline ${isActive ? 'underline font-semibold' : ''}`
                }
                onClick={closeMobileMenu}
              >
                MyLibrary
              </NavLink>
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex gap-4 text-white text-sm lg:text-base">
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `transition hover:underline ${isActive ? 'underline font-semibold' : ''}`
              }
            >
              Contact Us
            </NavLink>
            <NavLink
              to="/faqs"
              className={({ isActive }) =>
                `transition hover:underline ${isActive ? 'underline font-semibold' : ''}`
              }
            >
              FAQs
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `transition hover:underline ${isActive ? 'underline font-semibold' : ''}`
              }
            >
              About
            </NavLink>
          </div>

          {/* Right-side buttons and hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cart button - always visible for authenticated users */}
            {['user', 'admin', 'librarian'].includes(role) && (
              <button
                onClick={() => console.log('Go to cart')}
                className="flex items-center gap-2 bg-green-500 text-white text-xs sm:text-sm px-2 sm:px-3 py-1.5 rounded-md hover:bg-yellow-600 transition"
              >
                <FaShoppingCart className="text-sm" />
                <span className="hidden sm:inline">Cart</span>
              </button>
            )}

            {/* Desktop Auth buttons */}
            {role === 'guest' && (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => handleAuthClick('login')}
                  className="flex items-center gap-1 bg-green-600 text-white text-xs sm:text-sm px-2 py-1 rounded-md hover:bg-green-700 transition"
                >
                  <FaSignInAlt className="text-sm" />
                  Login
                </button>
                <button
                  onClick={() => handleAuthClick('register')}
                  className="flex items-center gap-1 text-white text-xs sm:text-sm px-2 py-1 rounded-md border border-white hover:bg-white hover:text-[#1F2937] transition"
                >
                  <FaUserPlus className="text-sm" />
                  Register
                </button>
              </div>
            )}

            {/* Hamburger Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="hamburger-btn md:hidden text-white p-2 hover:bg-purple-800 rounded-md transition"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Dropdown */}
        <div
          className={`mobile-menu md:hidden absolute top-16 left-0 right-0 bg-purple-900 border-t border-purple-700 shadow-lg transition-all duration-300 ${
            isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        >
          <div className="flex flex-col py-4 px-4 space-y-3">
            {/* Mobile Navigation Links */}
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `text-white py-2 px-3 rounded-md hover:bg-purple-800 transition ${
                  isActive ? 'bg-purple-800 font-semibold' : ''
                }`
              }
              onClick={closeMobileMenu}
            >
              Contact Us
            </NavLink>
            <NavLink
              to="/faqs"
              className={({ isActive }) =>
                `text-white py-2 px-3 rounded-md hover:bg-purple-800 transition ${
                  isActive ? 'bg-purple-800 font-semibold' : ''
                }`
              }
              onClick={closeMobileMenu}
            >
              FAQs
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-white py-2 px-3 rounded-md hover:bg-purple-800 transition ${
                  isActive ? 'bg-purple-800 font-semibold' : ''
                }`
              }
              onClick={closeMobileMenu}
            >
              About
            </NavLink>

            {/* Mobile Auth buttons for guests */}
            {role === 'guest' && (
              <div className="flex flex-col space-y-2 pt-2 border-t border-purple-700">
                <button
                  onClick={() => handleAuthClick('login')}
                  className="flex items-center justify-center gap-2 bg-green-600 text-white py-2 px-3 rounded-md hover:bg-green-700 transition"
                >
                  <FaSignInAlt />
                  Login
                </button>
                <button
                  onClick={() => handleAuthClick('register')}
                  className="flex items-center justify-center gap-2 text-white py-2 px-3 rounded-md border border-white hover:bg-white hover:text-purple-900 transition"
                >
                  <FaUserPlus />
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isAuthModalOpen && (
        <LoginRegisterCard mode={authMode} onClose={handleClose} />
      )}
    </>
  );
};

export default Navbar;