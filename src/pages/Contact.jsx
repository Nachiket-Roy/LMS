import React from 'react';
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaSignInAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaCommentDots,
  FaUserCircle
} from 'react-icons/fa';

const contactMethods = [
  {
    icon: FaPhone,
    title: 'Call Us',
    description: 'Speak with our friendly staff',
    contact: '(555) 123-4567',
    subtext: 'Mon-Fri 9AM-6PM',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: FaEnvelope,
    title: 'Email Support',
    description: 'Send us a detailed message',
    contact: 'support@library.org',
    subtext: 'Response within 24 hours',
    color: 'from-green-500 to-green-600'
  },
  {
    icon: FaMapMarkerAlt,
    title: 'Visit Our Library',
    description: 'Come see us in person',
    contact: '123 Main Street, Downtown',
    subtext: 'City, State 12345',
    color: 'from-purple-500 to-purple-600'
  }
];

const socialLinks = [
  { icon: FaFacebook, url: '#', color: 'hover:text-blue-600' },
  { icon: FaTwitter, url: '#', color: 'hover:text-blue-400' },
  { icon: FaInstagram, url: '#', color: 'hover:text-pink-600' },
  { icon: FaLinkedin, url: '#', color: 'hover:text-blue-700' }
];

const Contact = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Header */}
      <header className="bg-gradient-to-br from-black via-[#0B0B0B] to-[#1a1a1a] text-white py-1">
        <div className="max-w-7xl mx-auto px-4 pt-20 pb-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-6">
            Get in Touch
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
            Have questions about our services? Need help with your account? We're here to help you make the most of your library experience.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Contact Methods */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">How Can We Help?</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Choose the method that works best for you. We're committed to providing excellent support.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <div key={index} className="bg-white rounded-2xl shadow-xl p-8 text-center hover:transform hover:scale-105 transition-all duration-300">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${method.color} rounded-full mb-6`}>
                    <IconComponent className="text-2xl text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{method.title}</h3>
                  <p className="text-gray-600 mb-4">{method.description}</p>
                  <p className="font-semibold text-gray-800 mb-2">{method.contact}</p>
                  <p className="text-sm text-gray-500">{method.subtext}</p>
                </div>
              );
            })}
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Login Message Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-6 border-b">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <FaCommentDots className="text-indigo-600" />
                  Send Us a Message Online
                </h2>
                <p className="text-gray-600 mt-2">Access our online messaging system to get personalized support.</p>
              </div>

              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full mb-8">
                  <FaUserCircle className="text-4xl text-indigo-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h3>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed max-w-md mx-auto">
                  To send us a message through our online system, please log in to your library account. This helps us provide you with personalized assistance and track your inquiries.
                </p>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
                  <h4 className="font-semibold text-gray-800 mb-3">Benefits of logging in:</h4>
                  <ul className="text-gray-600 space-y-2 text-left max-w-sm mx-auto">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      Track your message history
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      Faster response times
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      Access to account-specific help
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      Secure communication
                    </li>
                  </ul>
                </div>

                

                <p className="text-gray-500 text-sm mt-6">
                  Don't have an account? Contact us via phone or email to get started.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Library Hours */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <FaClock className="text-indigo-600" />
                Library Hours
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Monday - Friday</span>
                  <span className="text-gray-600">9:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">Saturday</span>
                  <span className="text-gray-600">10:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium text-gray-700">Sunday</span>
                  <span className="text-gray-600">12:00 PM - 5:00 PM</span>
                </div>
              </div>
            </div>

            {/* Need Help Now? */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl shadow-xl p-8 border border-orange-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Need Help Now?</h3>
              <p className="text-gray-600 mb-4">
                For immediate assistance, call us directly or visit our library location during business hours.
              </p>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700">📞 (555) 123-4567</p>
                <p className="text-sm font-semibold text-gray-700">✉️ support@library.org</p>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Follow Us</h3>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.url}
                      className={`flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl text-gray-600 ${social.color} transition-colors hover:scale-110 transform`}
                    >
                      <IconComponent className="text-xl" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;