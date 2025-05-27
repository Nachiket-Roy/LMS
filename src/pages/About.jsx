import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-800 to-blue-600 bg-clip-text text-transparent mb-6">
            About Our Library
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering knowledge seekers through innovative digital library solutions
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Our Mission */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h2 className="text-3xl font-semibold text-purple-800">Our Mission</h2>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              Our mission is to revolutionize access to information by making library resources available, intuitive,
              and inclusive. We aim to empower students, educators, researchers, and lifelong learners by
              providing a seamless and efficient digital library management experience. Through innovation and
              accessibility, we believe in supporting education, encouraging curiosity, and fostering a culture of reading.
            </p>
          </div>

          {/* Our Journey */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h2 className="text-3xl font-semibold text-blue-800">Our Journey</h2>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              Established in 2025, our Library Management System was created in response to the growing need
              for digitization in library services. What began as a small project to assist local institutions has now
              grown into a platform serving diverse educational and organizational libraries. Our platform combines
              simplicity with powerful features to replace outdated, manual systems with a more organized and
              scalable solution.
            </p>
          </div>

          {/* Who We Serve */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">👥</span>
              </div>
              <h2 className="text-3xl font-semibold text-green-800">Who We Serve</h2>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              We proudly serve a wide audience—from public and school libraries to academic institutions,
              corporate libraries, and private organizations. Whether you manage a small collection or a vast archive,
              our platform adapts to your needs. By automating borrowing, returning, inventory tracking, and user
              management, we help institutions focus on what matters most—connecting people to knowledge.
            </p>
          </div>

          {/* Our Vision */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">🔮</span>
              </div>
              <h2 className="text-3xl font-semibold text-orange-800">Our Vision</h2>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              We envision a world where every library, regardless of size or budget, can offer the best possible
              experience to its users. By blending technology with user-centered design, we aim to create a
              global network of smart libraries that empower communities and bridge gaps in information access.
            </p>
          </div>
        </div>

        

        {/* Call to Action */}
      </div>
    </div>
  );
};

export default About;