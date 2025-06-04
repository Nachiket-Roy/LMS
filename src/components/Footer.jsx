import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#f5f5f5] text-black pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* About Us */}
          <div className="lg:col-span-2">
            <h5 className="text-2xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              About MyLibrary
            </h5>
            <p className="text-gray-700 leading-relaxed mb-6">
              At MyLibrary, we're passionate about making knowledge accessible to everyone. Whether you're a student, professional, or lifelong learner, our platform offers a growing collection of curated resources, intuitive tools, and a supportive community.
            </p>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-lg">📚</span>
                <span className="font-medium text-black">10,000+ Books</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">👥</span>
                <span className="font-medium text-black">50,000+ Users</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">⭐</span>
                <span className="font-medium text-black">4.9/5 Rating</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Quick Links
            </h5>
            <ul className="space-y-3">
              <li>
                <NavLink
                  to="/browse"
                  className={({ isActive }) =>
                    `text-gray-700 hover:text-orange-500 transition-colors duration-200 font-medium ${
                      isActive ? 'text-orange-500' : ''
                    }`
                  }
                >
                  Browse Books
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/recommendations"
                  className={({ isActive }) =>
                    `text-gray-700 hover:text-orange-500 transition-colors duration-200 font-medium ${
                      isActive ? 'text-orange-500' : ''
                    }`
                  }
                >
                  Recommendations
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/faqs"
                  className={({ isActive }) =>
                    `text-gray-700 hover:text-orange-500 transition-colors duration-200 font-medium ${
                      isActive ? 'text-orange-500' : ''
                    }`
                  }
                >
                  FAQs
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    `text-gray-700 hover:text-orange-500 transition-colors duration-200 font-medium ${
                      isActive ? 'text-orange-500' : ''
                    }`
                  }
                >
                  Contact Us
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Connect & Support */}
          <div>
            <h5 className="text-xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Connect & Support
            </h5>
            
            {/* Social Media */}
            <div className="mb-6">
              <p className="text-gray-700 font-medium mb-3">Follow Us</p>
              <div className="flex gap-4">
                <a 
                  href="https://facebook.com" 
                  className="w-10 h-10 bg-white/60 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center text-gray-600 hover:text-white hover:bg-orange-500 hover:scale-110 transition-all duration-300 shadow-md hover:shadow-orange-500/25"
                  aria-label="Facebook"
                >
                  <FaFacebookF className="text-sm" />
                </a>
                <a 
                  href="https://twitter.com" 
                  className="w-10 h-10 bg-white/60 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center text-gray-600 hover:text-white hover:bg-orange-500 hover:scale-110 transition-all duration-300 shadow-md hover:shadow-orange-500/25"
                  aria-label="Twitter"
                >
                  <FaTwitter className="text-sm" />
                </a>
                <a 
                  href="https://instagram.com" 
                  className="w-10 h-10 bg-white/60 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center text-gray-600 hover:text-white hover:bg-orange-500 hover:scale-110 transition-all duration-300 shadow-md hover:shadow-orange-500/25"
                  aria-label="Instagram"
                >
                  <FaInstagram className="text-sm" />
                </a>
                <a 
                  href="https://linkedin.com" 
                  className="w-10 h-10 bg-white/60 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center text-gray-600 hover:text-white hover:bg-orange-500 hover:scale-110 transition-all duration-300 shadow-md hover:shadow-orange-500/25"
                  aria-label="LinkedIn"
                >
                  <FaLinkedinIn className="text-sm" />
                </a>
              </div>
            </div>

            
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-600 text-sm">
              &copy; {new Date().getFullYear()} MyLibrary. All rights reserved.
            </div>
            
            
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;