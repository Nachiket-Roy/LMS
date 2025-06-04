const About = () => {
  const stats = [
    { number: '5K+', label: 'Books Managed', icon: '📚' },
    { number: '2,400+', label: 'Active Users', icon: '👤' },
    { number: '100+', label: 'Libraries ', icon: '🏛️' },
    { number: '24x7', label: 'Uptime', icon: '⚡' }
  ];

  const features = [
    {
      icon: '🔍',
      title: 'Smart Search',
      description: 'Advanced search capabilities with filters and recommendations'
    },
    {
      icon: '📱',
      title: 'Mobile First',
      description: 'Responsive design that works perfectly on all devices'
    },
    {
      icon: '🔒',
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with 24/7 monitoring'
    },
    {
      icon: '📊',
      title: 'Analytics Dashboard',
      description: 'Comprehensive insights into library usage and trends'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative pt-20 pb-4 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0B0B0B] to-[#1a1a1a]"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-6">
            About Our Library
          </h1>
          <p className="text-xl md:text-2xl text-white max-w-4xl mx-auto leading-relaxed">
            Empowering knowledge seekers through innovative digital library solutions that transform how we discover, access, and share information
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-1">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Our Mission */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-purple-100 hover:border-purple-200 group">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">🎯</span>
                </div>
                <h2 className="text-3xl font-bold text-purple-800">Our Mission</h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                Our mission is to revolutionize access to information by making library resources available, intuitive,
                and inclusive. We aim to empower students, educators, researchers, and lifelong learners by
                providing a seamless and efficient digital library management experience. Through innovation and
                accessibility, we believe in supporting education, encouraging curiosity, and fostering a culture of reading.
              </p>
            </div>

            {/* Our Journey */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-blue-100 hover:border-blue-200 group">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">🚀</span>
                </div>
                <h2 className="text-3xl font-bold text-blue-800">Our Journey</h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                Established in 2025, our Library Management System was created in response to the growing need
                for digitization in library services. What began as a small project to assist local institutions has now
                grown into a platform serving diverse educational and organizational libraries. Our platform combines
                simplicity with powerful features to replace outdated, manual systems.
              </p>
            </div>

            {/* Who We Serve */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-green-100 hover:border-green-200 group">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">👥</span>
                </div>
                <h2 className="text-3xl font-bold text-green-800">Who We Serve</h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                We proudly serve a wide audience—from public and school libraries to academic institutions,
                corporate libraries, and private organizations. Whether you manage a small collection or a vast archive,
                our platform adapts to your needs. By automating borrowing, returning, inventory tracking, and user
                management, we help institutions focus on connecting people to knowledge.
              </p>
            </div>

            {/* Our Vision */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-orange-100 hover:border-orange-200 group">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">🔮</span>
                </div>
                <h2 className="text-3xl font-bold text-orange-800">Our Vision</h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                We envision a world where every library, regardless of size or budget, can offer the best possible
                experience to its users. By blending technology with user-centered design, we aim to create a
                global network of smart libraries that empower communities and bridge gaps in information access.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-6 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with modern technology and designed for the future of library management
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center group hover:scale-105">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      
      {/* Call to Action */}
      
    </div>
  );
};

export default About;