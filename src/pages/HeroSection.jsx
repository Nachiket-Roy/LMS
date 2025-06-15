import { FaBook, FaBookOpen, FaBookReader, FaSearch, FaUsers, FaChartLine, FaStar, FaHeart, FaBookmark } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { useCallback } from "react";
import { NavLink } from "react-router-dom";

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [animatedCounts, setAnimatedCounts] = useState({ reading: 0, available: 0, upcoming: 0 });
  const [statsAnimatedCounts, setStatsAnimatedCounts] = useState({ users: 0, books: 0 });
  const [animationTime, setAnimationTime] = useState(0);

  const targetCounts = { reading: 78, available: 342, upcoming: 156 };
  const statsTargetCounts = { users: 2400, books: 15000 };
  const animationFrameRef = useRef(null);
  const lastMouseEventRef = useRef(0);
  const animationTimeRef = useRef(0);

  // Throttled mouse move handler

  const handleMouseMove = useCallback((e) => {
    const now = Date.now();
    if (now - lastMouseEventRef.current > 50) {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
      lastMouseEventRef.current = now;
    }
  }, []);


  useEffect(() => {
    setIsVisible(true);
    const animate = () => {
      animationTimeRef.current += 0.032;
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    // Start animation loop
    animationFrameRef.current = requestAnimationFrame(animate);

    // Counter animation for main books
    const animateCounters = () => {
      const duration = 2000;
      const steps = 60;
      let currentStep = 0;

      const counterInterval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);

        setAnimatedCounts({
          reading: Math.floor(targetCounts.reading * easeOutQuart),
          available: Math.floor(targetCounts.available * easeOutQuart),
          upcoming: Math.floor(targetCounts.upcoming * easeOutQuart),
        });

        if (currentStep >= steps) {
          clearInterval(counterInterval);
          setAnimatedCounts(targetCounts);
        }
      }, duration / steps);

      return counterInterval;
    };

    // Counter animation for stats
    const animateStatsCounters = () => {
      const duration = 2500;
      const steps = 60;
      let currentStep = 0;

      const statsInterval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);

        setStatsAnimatedCounts({
          users: Math.floor(statsTargetCounts.users * easeOutQuart),
          books: Math.floor(statsTargetCounts.books * easeOutQuart),
        });

        if (currentStep >= steps) {
          clearInterval(statsInterval);
          setStatsAnimatedCounts(statsTargetCounts);
        }
      }, duration / steps);

      return statsInterval;
    };

    // Start animations after delays
    const counterIntervalId = setTimeout(animateCounters, 500);
    const statsIntervalId = setTimeout(animateStatsCounters, 800);

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameRef.current);
      clearTimeout(counterIntervalId);
      clearTimeout(statsIntervalId);
    };
  }, [handleMouseMove]);

  const features = [
    { icon: FaSearch, text: "Smart Search", delay: "0ms" },
    { icon: FaUsers, text: "Member Management", delay: "200ms" },
    { icon: FaChartLine, text: "Analytics Dashboard", delay: "400ms" }
  ];

  const floatingBooks = [
    { id: 1, icon: FaBook, size: 'w-8 h-8', color: 'text-blue-400', x: 15, y: 20 },
    { id: 2, icon: FaBookOpen, size: 'w-6 h-6', color: 'text-purple-400', x: 75, y: 35 },
    { id: 3, icon: FaBookReader, size: 'w-10 h-10', color: 'text-orange-400', x: 90, y: 60 },
    { id: 4, icon: FaBook, size: 'w-7 h-7', color: 'text-green-400', x: 25, y: 80 },
    { id: 5, icon: FaBookmark, size: 'w-5 h-5', color: 'text-pink-400', x: 65, y: 15 },
    { id: 6, icon: FaStar, size: 'w-4 h-4', color: 'text-yellow-400', x: 45, y: 70 },
  ];

  const formatStatsNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <section className="relative bg-gradient-to-br from-black via-[#0B0B0B] to-[#1a1a1a] text-white overflow-hidden min-h-screen flex items-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-30">
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

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
        {/* Left Content */}
        <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-full text-sm font-medium border border-orange-500/30 mb-6">
              ✨ Next-Gen Library Management
            </span>
          </div>

          <h1 className="text-6xl lg:text-7xl font-bold mb-8 leading-tight bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
            Organize knowledge with{" "}
            <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              every book
            </span>
          </h1>

          <p className="text-xl mb-10 text-gray-300 leading-relaxed max-w-lg">
            Transform your library with intelligent management. Track borrowings, analyze trends, and create seamless experiences for every reader.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3 mb-10">
            {features.map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
                style={{ animationDelay: feature.delay }}
              >
                <feature.icon className="text-orange-400 text-sm" />
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Show on medium and large devices */}
            <div className="hidden md:flex flex-col sm:flex-row gap-4">
              <NavLink
              to="/collection" className="group relative bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-orange-500/25">
                <span className="relative z-10">Search our collection</span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
              </NavLink>
            </div>

            {/* Show on small devices only */}
            <div className="flex md:hidden flex-col sm:flex-row gap-4">
              <button className="group relative bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-orange-500/25">
                <span className="relative z-10">Login</span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
              </button>
              <button className="group border border-white/20 bg-white/5 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                <span className="relative z-50">
                  Register
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Interactive Visual */}
        <div className="relative flex items-center justify-center h-full">
          {/* Floating Book Icons */}
          <div className="absolute inset-0 pointer-events-none">
            {floatingBooks.map((book) => (
              <div
                key={book.id}
                className={`absolute opacity-40 hover:opacity-80 transition-opacity duration-300 ${book.size} ${book.color}`}
                style={{
                  left: `${book.x}%`,
                  top: `${book.y}%`,
                  transform: `translateY(${Math.sin(animationTime * 2 + book.id) * 10}px) rotate(${Math.sin(animationTime + book.id) * 15}deg)`,
                }}
              >
                <book.icon className="w-full h-full drop-shadow-lg" />
              </div>
            ))}
          </div>

          {/* Central Book Display */}
          <div className="relative w-full max-w-md">
            {/* Glowing Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-orange-500/30 animate-spin"
              style={{ animation: 'spin 20s linear infinite' }}>
              <div className="absolute w-3 h-3 bg-orange-500 rounded-full -top-1.5 left-1/2 transform -translate-x-1/2 shadow-lg shadow-orange-500/50" />
            </div>

            {/* Main Book Stack with Enhanced Animation */}
            <div className="flex flex-col gap-6 items-center justify-center h-96">
              {[
                { Icon: FaBookReader, color: "from-purple-500 to-purple-700", label: "Reading", count: animatedCounts.reading, key: 'reading' },
                { Icon: FaBookOpen, color: "from-blue-500 to-blue-700", label: "Available", count: animatedCounts.available, key: 'available' },
                { Icon: FaBook, color: "from-orange-500 to-orange-700", label: "Upcoming", count: animatedCounts.upcoming, key: 'upcoming' }
              ].map((item, i) => (
                <div
                  key={i}
                  className={`group relative w-64 h-24 bg-gradient-to-r ${item.color} rounded-2xl shadow-2xl transition-all duration-500 hover:scale-110 overflow-hidden`}
                  style={{
                    transform: `translateX(${Math.sin(animationTime * 0.5 + i) * 15}px) translateY(${Math.cos(animationTime * 0.3 + i) * 8}px) rotateY(${Math.sin(animationTime * 0.2 + i) * 5}deg)`,
                    animationDelay: `${i * 200}ms`,
                    marginTop: i === 0 ? '0' : '-12px'
                  }}
                >
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 group-hover:animate-pulse" />
                  </div>

                  <div className="relative flex justify-between items-center h-full px-6 text-white z-10">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <item.Icon className="text-3xl drop-shadow-lg group-hover:scale-125 transition-transform duration-300" />
                        <div className="absolute -inset-2 bg-white/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div>
                        <div className="font-bold text-lg">{item.label}</div>
                        <div className="text-sm opacity-80">Books</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold tabular-nums">{item.count}</div>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />

                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                    <div
                      className="h-full bg-white/60 transition-all duration-1000"
                      style={{ width: `${(item.count / 400) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Stats Cards */}
            <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-4">
              {[
                { label: "Active Users", value: formatStatsNumber(statsAnimatedCounts.users), icon: FaUsers, color: "text-blue-400" },
                { label: "Total Books", value: formatStatsNumber(statsAnimatedCounts.books), icon: FaBook, color: "text-green-400" }
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 min-w-[100px] text-center hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                  <stat.icon className={`${stat.color} text-lg mx-auto mb-1`} />
                  <div className="text-lg font-bold tabular-nums">{stat.value}</div>
                  <div className="text-xs opacity-70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Decorative Elements */}
          <div className="absolute top-10 right-10 w-32 h-32 border-2 border-dashed border-white/20 rounded-full animate-pulse opacity-30" />
          <div className="absolute bottom-20 left-10 w-20 h-20 border border-white/10 rounded-lg rotate-45 opacity-20" />
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
    </section>
  );
}