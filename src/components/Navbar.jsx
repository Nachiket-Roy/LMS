import React, { useEffect, useState } from 'react';
import { FaBars, FaTimes, FaSignInAlt, FaUserPlus, FaShoppingCart } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import LoginRegisterCard from '../pages/LoginRegisterCard';
import { useLocation } from 'react-router-dom';



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

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // "login" or "register"

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);


  const handleClose = () => setIsAuthModalOpen(false);

  const handleAuthClick = (mode) => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setShowNavbar(false); // Scrolling down
      } else {
        setShowNavbar(true); // Scrolling up
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <div
        className={`fixed inset-x-0 z-50 h-16 bg-purple-900 shadow-lg transition-all duration-500 ${showNavbar
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-10 pointer-events-none'
          }`}
      >
        <nav className="flex h-full items-center justify-between px-4 sm:px-6">
          {/* Logo / Brand */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">📚</span>
            </div>
            <span className="text-white text-xl font-bold tracking-wide">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `transition hover:underline ${isActive ? 'underline font-semibold' : ''
                  }`
                }
              >
                MyLibrary
              </NavLink>
            </span>
            {/* <span className="text-white text-xl font-bold tracking-wide">
              <NavLink
                to="/user"
                className={({ isActive }) =>
                  `transition hover:underline ${isActive ? 'underline font-semibold' : ''
                  }`
                }
              >
                UserDashBoard
              </NavLink>
            </span>
            <span className="text-white text-xl font-bold tracking-wide">
              <NavLink
                to="/librarian"
                className={({ isActive }) =>
                  `transition hover:underline ${isActive ? 'underline font-semibold' : ''
                  }`
                }
              >
                LibrarianDashoard
              </NavLink>
            </span>
            <span className="text-white text-xl font-bold tracking-wide">
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `transition hover:underline ${isActive ? 'underline font-semibold' : ''
                  }`
                }
              >
                AdminDashboard
              </NavLink>
            </span> */}
          </div>

          {/* Hamburger */}
          <div className="sm:hidden">
            <button onClick={toggleMenu} className="text-white text-2xl">
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {/* Center links */}
          <div className="hidden sm:flex gap-4 text-white text-sm sm:text-base md:text-lg">
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `transition hover:underline ${isActive ? 'underline font-semibold' : ''
                }`
              }
            >
              Contact Us
            </NavLink>
            <NavLink
              to="/faqs"
              className={({ isActive }) =>
                `transition hover:underline ${isActive ? 'underline font-semibold' : ''
                }`
              }
            >
              FAQs
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `transition hover:underline ${isActive ? 'underline font-semibold' : ''
                }`
              }
            >
              About
            </NavLink>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            {role === 'user' && (
              <button
                onClick={() => console.log('Go to cart')}
                className="flex items-center gap-2 bg-green-500 text-white text-xs sm:text-sm md:text-base px-3 py-1.5 rounded-md hover:bg-yellow-600 transition"
              >
                <FaShoppingCart className="text-sm md:text-base" />
                Cart
              </button>
            )}

            {role === 'guest' && (
              <>
                <button
                  onClick={() => handleAuthClick('login')}
                  className="flex items-center gap-1 sm:gap-2 bg-green-600 text-white text-xs sm:text-sm md:text-base px-2 sm:px-3 md:px-2 py-1 sm:py-1.5 md:py-1 rounded-md hover:bg-green-700 transition"
                >
                  <FaSignInAlt className="text-sm md:text-base" />
                  Login
                </button>
                <button
                  onClick={() => handleAuthClick('register')}
                  className="flex items-center gap-1 sm:gap-2 text-white text-xs sm:text-sm md:text-base px-2 sm:px-3 md:px-2 py-1 sm:py-1.5 md:py-1 rounded-md border border-white hover:bg-white hover:text-[#1F2937] transition"
                >
                  <FaUserPlus className="text-sm md:text-base" />
                  Register
                </button>
              </>
            )}
            {role === 'admin' && (
              <button
                onClick={() => console.log('Go to cart')}
                className="flex items-center gap-2 bg-green-500 text-white text-xs sm:text-sm md:text-base px-3 py-1.5 rounded-md hover:bg-yellow-600 transition"
              >
                <FaShoppingCart className="text-sm md:text-base" />
                Cart
              </button>
            )}
            {role === 'librarian' && (
              <button
                onClick={() => console.log('Go to cart')}
                className="flex items-center gap-2 bg-green-500 text-white text-xs sm:text-sm md:text-base px-3 py-1.5 rounded-md hover:bg-yellow-600 transition"
              >
                <FaShoppingCart className="text-sm md:text-base" />
                Cart
              </button>
            )}
          </div>

        </nav>
        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="sm:hidden bg-purple-800 text-white px-4 py-2 space-y-2">
            <NavLink
              to="/contact"
              onClick={toggleMenu}
              className={({ isActive }) =>
                `block hover:underline ${isActive ? 'underline font-semibold' : ''}`
              }
            >
              Contact Us
            </NavLink>
            <NavLink
              to="/faqs"
              onClick={toggleMenu}
              className={({ isActive }) =>
                `block hover:underline ${isActive ? 'underline font-semibold' : ''}`
              }
            >
              FAQs
            </NavLink>
            <NavLink
              to="/about"
              onClick={toggleMenu}
              className={({ isActive }) =>
                `block hover:underline ${isActive ? 'underline font-semibold' : ''}`
              }
            >
              About
            </NavLink>
            {role === 'guest' && (
              <>
                <button
                  onClick={() => handleAuthClick('login')}
                  className="block w-full text-left mt-2 text-white hover:underline"
                >
                  <FaSignInAlt className="inline mr-1" />
                  Login
                </button>
                <button
                  onClick={() => handleAuthClick('register')}
                  className="block w-full text-left text-white hover:underline"
                >
                  <FaUserPlus className="inline mr-1" />
                  Register
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {isAuthModalOpen && (
        <LoginRegisterCard onClose={handleClose} initialMode={authMode} />
      )}
    </>
  );
};

export default Navbar;
