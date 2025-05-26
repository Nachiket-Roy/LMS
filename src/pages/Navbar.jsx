import React, { useEffect, useState } from 'react';
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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
    <div
  className={`fixed inset-x-0  z-50 h-16  bg-purple-900 shadow-lg transition-all duration-500 ${
    showNavbar ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'
  }`}
>
  <nav className="flex h-full items-center justify-between px-4 sm:px-6">
    {/* Logo / Brand */}
    <a
      href="/"
      className="text-white text-lg sm:text-xl md:text-2xl font-semibold"
    >
      MyLibrary
    </a>

    {/* Center links - visible only on sm and above */}
    <div className="hidden sm:flex gap-4 text-white text-sm sm:text-base md:text-lg">
      <a href="/" className="hover:underline transition">Contact Us</a>
      <a href="/" className="hover:underline transition">FAQs</a>
      <a href="/" className="hover:underline transition">Policies</a>
    </div>

    {/* Auth Buttons */}
    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
      <a
        href="#"
        className="flex items-center gap-1 sm:gap-2 bg-green-600 text-white text-xs sm:text-sm md:text-base px-2 sm:px-3 md:px-2 py-1 sm:py-1.5 md:py-1 rounded-md hover:bg-green-700 transition"
      >
        <FaSignInAlt className="text-sm md:text-base" />
        Login
      </a>
      <a
        href="#"
        className="flex items-center gap-1 sm:gap-2 text-white text-xs sm:text-sm md:text-base px-2 sm:px-3 md:px-2 py-1 sm:py-1.5 md:py-1 rounded-md border border-white hover:bg-white hover:text-[#1F2937] transition"
      >
        <FaUserPlus className="text-sm md:text-base" />
        Register
      </a>
    </div>
  </nav>
</div>

  );
};

export default Navbar;
