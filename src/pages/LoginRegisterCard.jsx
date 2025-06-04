import { useEffect, useState } from 'react';
import { FaBook, FaBookOpen, FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaArrowLeft } from 'react-icons/fa';

const LoginRegisterCard = ({ onClose = () => {}, initialMode = 'login' }) => {
  const [currentMode, setCurrentMode] = useState(initialMode);
  const [fadeIn, setFadeIn] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [time, setTime] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Animation fade-in effect
  useEffect(() => {
    setFadeIn(true);
  }, []);

  // Mouse move handler
  const handleMouseMove = (e) => {
    setMousePosition({
      x: (e.clientX / window.innerWidth) * 100,
      y: (e.clientY / window.innerHeight) * 100,
    });
  };

  // Animation timer and event listeners
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    const timer = setInterval(() => setTime(prev => prev + 0.01), 16);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(timer);
    };
  }, []);

  // Close handler
  const handleClose = () => {
    setFadeIn(false);
    setTimeout(onClose, 300);
  };

  // Escape key handler
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', { mode: currentMode, data: formData });

    if (currentMode === 'forgot') {
      alert('Password reset instructions have been sent to your email!');
      setCurrentMode('login');
    }
  };

  const handleForgotPassword = () => {
    setCurrentMode('forgot');
  };

  const handleBackToLogin = () => {
    setCurrentMode('login');
  };

  const getHeaderContent = () => {
    switch (currentMode) {
      case 'login':
        return {
          title: 'Welcome Back',
          subtitle: 'Access your library dashboard',
          icon: FaBookOpen
        };
      case 'register':
        return {
          title: 'Join the Library',
          subtitle: 'Create your account to get started',
          icon: FaBook
        };
      case 'forgot':
        return {
          title: 'Reset Password',
          subtitle: 'Enter your email to receive reset instructions',
          icon: FaLock
        };
      default:
        return {
          title: 'Welcome Back',
          subtitle: 'Access your library dashboard',
          icon: FaBookOpen
        };
    }
  };

  const headerContent = getHeaderContent();

  // Floating particles
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 3
  }));

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-500 ${
        fadeIn ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      } bg-black/60 backdrop-blur-sm`}
      onClick={handleClose}
    >
      {/* Background animated elements */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-full blur-3xl"
          style={{
            left: `${mousePosition.x * 0.1}%`,
            top: `${mousePosition.y * 0.1}%`,
            transition: 'all 0.3s ease-out'
          }}
        />
        <div
          className="absolute w-64 h-64 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl"
          style={{
            right: `${(100 - mousePosition.x) * 0.05}%`,
            bottom: `${(100 - mousePosition.y) * 0.05}%`,
            transition: 'all 0.5s ease-out'
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          />
        ))}
      </div>

      <div
        className={`relative w-full max-w-md mx-4 p-8 bg-gradient-to-br from-black/90 via-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 transition-all duration-500 ${
          fadeIn ? 'translate-y-0' : 'translate-y-8'
        } overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Card glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-purple-500/5 rounded-3xl" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 group z-10"
          aria-label="Close modal"
        >
          <svg
            className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Back Button for Forgot Password */}
        {currentMode === 'forgot' && (
          <button
            onClick={handleBackToLogin}
            className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 group z-10"
            aria-label="Back to login"
          >
            <FaArrowLeft className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full blur-lg opacity-50" />
            <div className="relative w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
              <headerContent.icon className="text-2xl text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-2">
            {headerContent.title}
          </h2>
          <p className="text-gray-400">
            {headerContent.subtitle}
          </p>
        </div>

        {/* Toggle Buttons - Only show for login/register */}
        {currentMode !== 'forgot' && (
          <div className="flex mb-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-1 relative z-10">
            <button
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 relative ${
                currentMode === 'login'
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setCurrentMode('login')}
            >
              Login
            </button>
            <button
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 relative ${
                currentMode === 'register'
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setCurrentMode('register')}
            >
              Register
            </button>
          </div>
        )}

        {/* Form */}
        <div className="space-y-5 relative z-10">
          {currentMode === 'register' && (
            <div className="relative group">
              <input
                type="text"
                name="username"
                placeholder="Full Name"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full p-4 pl-12 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 group-hover:bg-white/10"
                required
              />
              <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-orange-400 transition-colors duration-200" />
            </div>
          )}

          <div className="relative group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-4 pl-12 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 group-hover:bg-white/10"
              required
            />
            <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-orange-400 transition-colors duration-200" />
          </div>

          {currentMode !== 'forgot' && (
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-4 pl-12 pr-12 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 group-hover:bg-white/10"
                required
              />
              <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-orange-400 transition-colors duration-200" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          )}

          {currentMode === 'register' && (
            <div className="relative group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full p-4 pl-12 pr-12 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 group-hover:bg-white/10"
                required
              />
              <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-orange-400 transition-colors duration-200" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          )}

          {currentMode === 'login' && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray-400">
                <input
                  type="checkbox"
                  className="mr-2 rounded bg-white/5 border-white/10 text-orange-500 focus:ring-orange-500 focus:ring-2"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-orange-400 hover:text-orange-300 font-medium transition-colors duration-200"
              >
                Forgot password?
              </button>
            </div>
          )}

          {currentMode === 'forgot' && (
            <div className="text-center text-sm text-gray-400">
              <p>We'll send you a link to reset your password.</p>
            </div>
          )}

          <button
            type="submit"
            className="group relative w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25"
          >
            <span className="relative z-10">
              {currentMode === 'login' && 'Sign In'}
              {currentMode === 'register' && 'Create Account'}
              {currentMode === 'forgot' && 'Send Reset Link'}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
          </button>
        </div>

        {/* Social Login - Only show for login/register */}
        {currentMode !== 'forgot' && (
          <div className="mt-8 relative z-10">
            <div className="flex items-center justify-center mb-6">
              <div className="border-t border-white/20 flex-grow"></div>
              <span className="px-4 text-gray-400 text-sm">or continue with</span>
              <div className="border-t border-white/20 flex-grow"></div>
            </div>

            
          </div>
        )}

        {/* Back to Login link for forgot password */}
        {currentMode === 'forgot' && (
          <div className="mt-6 text-center relative z-10">
            <button
              type="button"
              onClick={handleBackToLogin}
              className="text-orange-400 hover:text-orange-300 font-medium text-sm transition-colors duration-200"
            >
              Back to Login
            </button>
          </div>
        )}

        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-20 h-20 border border-dashed border-white/10 rounded-full animate-pulse opacity-20 pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-16 h-16 border border-white/5 rounded-lg rotate-45 opacity-10 pointer-events-none" />
      </div>
    </div>
  );
};

export default LoginRegisterCard;