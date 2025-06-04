import React, { useState } from 'react';
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaUser,
  FaComment,
  FaPaperPlane,
  FaCheck,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaHeadset,
  FaInfoCircle,
  FaQuestionCircle,
  FaBug
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

const inquiryTypes = [
  { value: 'general', label: 'General Information', icon: FaInfoCircle },
  { value: 'support', label: 'Technical Support', icon: FaHeadset },
  { value: 'question', label: 'Library Services', icon: FaQuestionCircle },
  { value: 'feedback', label: 'Feedback/Suggestions', icon: FaComment },
  { value: 'bug', label: 'Report an Issue', icon: FaBug }
];

const socialLinks = [
  { icon: FaFacebook, url: '#', color: 'hover:text-blue-600' },
  { icon: FaTwitter, url: '#', color: 'hover:text-blue-400' },
  { icon: FaInstagram, url: '#', color: 'hover:text-pink-600' },
  { icon: FaLinkedin, url: '#', color: 'hover:text-blue-700' }
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'general',
    subject: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      inquiryType: 'general',
      subject: '',
      message: ''
    });
    setIsSubmitted(false);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Header */}
      <header className="bg-gradient-to-br from-black via-[#0B0B0B] to-[#1a1a1a] text-white py-1">
        <div className="max-w-7xl mx-auto px-4 pt-20 pb-4 text-center ">
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
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-6 border-b">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <FaPaperPlane className="text-indigo-600" />
                  Send Us a Message
                </h2>
                <p className="text-gray-600 mt-2">Fill out the form below and we'll get back to you as soon as possible.</p>
              </div>

              <div className="p-8">
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                      <FaCheck className="text-3xl text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Message Sent Successfully!</h3>
                    <p className="text-gray-600 mb-8 text-lg">
                      Thank you for contacting us. We've received your message and will respond within 24 hours.
                    </p>
                    <button
                      onClick={resetForm}
                      className="bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition-colors font-semibold"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Name and Email Row */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <FaUser className="inline mr-2" />
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                            }`}
                          placeholder="Enter your full name"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <FaEnvelope className="inline mr-2" />
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                            }`}
                          placeholder="Enter your email address"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                      </div>
                    </div>

                    {/* Phone and Inquiry Type Row */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <FaPhone className="inline mr-2" />
                          Phone Number (Optional)
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
                          placeholder="Enter your phone number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <FaQuestionCircle className="inline mr-2" />
                          Inquiry Type
                        </label>
                        <select
                          name="inquiryType"
                          value={formData.inquiryType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors bg-white"
                        >
                          {inquiryTypes.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <FaInfoCircle className="inline mr-2" />
                        Subject *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${errors.subject ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                          }`}
                        placeholder="Brief description of your inquiry"
                      />
                      {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <FaComment className="inline mr-2" />
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={6}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors resize-none ${errors.message ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'
                          }`}
                        placeholder="Please provide details about your inquiry..."
                      />
                      {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      onClick={handleFormSubmit}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <FaPaperPlane />
                          Send Message
                        </>
                      )}
                    </button>
                  </div>
                )}
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

            {/* Quick Links */}


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