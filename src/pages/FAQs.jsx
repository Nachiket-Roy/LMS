import React, { useState } from 'react';
import {
  FaChevronDown,
  FaChevronUp,
  FaBookOpen,
  FaClock,
  FaRedo,
  FaExclamationCircle,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaSearch,
  FaQuestion,
  FaUsers,
  FaHeadset,
  FaGlobe,
  FaCreditCard
} from 'react-icons/fa';

const faqData = [
  {
    id: 1,
    question: 'How do I create a library account?',
    answer: 'Visit our library with a valid photo ID and proof of current address. You can also start the process online and complete it during your first visit. Students need their student ID for verification.',
    category: 'account',
    icon: FaUser
  },
  {
    id: 2,
    question: 'What are the borrowing limits?',
    answer: 'Standard members can borrow up to 10 books, 5 DVDs, and 3 audiobooks simultaneously. Premium members have higher limits with extended borrowing periods.',
    category: 'borrowing',
    icon: FaBookOpen
  },
  {
    id: 3,
    question: 'How long can I keep borrowed items?',
    answer: 'Books: 3 weeks, DVDs: 1 week, Audiobooks: 2 weeks, Magazines: 1 week. New releases have shorter periods. Check your account for specific due dates.',
    category: 'borrowing',
    icon: FaClock
  },
  {
    id: 4,
    question: 'Can I renew items online?',
    answer: 'Yes! Log into your account and click "Renew" next to eligible items. Items can be renewed twice unless someone else has placed a hold. Renewals extend the due date by the original borrowing period.',
    category: 'borrowing',
    icon: FaRedo
  },
  {
    id: 5,
    question: 'What are the late fees?',
    answer: 'Books: ₹5/day. Maximum fee per item is ₹1000. Pay online, by phone, or at any library location. We also accept payment plans.',
    category: 'policies',
    icon: FaExclamationCircle
  },
  {
    id: 6,
    question: 'How do I access digital resources?',
    answer: 'Use your library card number and PIN to access our digital collection through our website or mobile app. Download eBooks, audiobooks, stream movies, and access research databases 24/7.',
    category: 'digital',
    icon: FaGlobe
  },
  {
    id: 7,
    question: 'Do you offer printing services?',
    answer: 'Yes! We have black & white printing (₹0.50/page) and color printing (₹5/page). We also offer scanning, copying, and faxing services. Payment accepted via cash, card, or print credits.',
    category: 'services',
    icon: FaCreditCard
  },
  {
    id: 8,
    question: 'How can I suggest new books?',
    answer: 'Fill out our purchase request form online or speak with a librarian. We consider all suggestions based on community interest, budget, and collection development policies. You\'ll be notified when items are added.',
    category: 'services',
    icon: FaQuestion
  }
];

const categoryList = [
  { key: 'all', label: 'All Categories', icon: FaQuestion, color: 'bg-purple-500' },
  { key: 'account', label: 'Account', icon: FaUser, color: 'bg-blue-500' },
  { key: 'borrowing', label: 'Borrowing', icon: FaBookOpen, color: 'bg-green-500' },
  { key: 'policies', label: 'Policies', icon: FaExclamationCircle, color: 'bg-red-500' },
  { key: 'digital', label: 'Digital', icon: FaGlobe, color: 'bg-indigo-500' },
  { key: 'services', label: 'Services', icon: FaUsers, color: 'bg-orange-500' }
];

const FAQs = () => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleFAQToggle = (faqId) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  const getFilteredFAQs = () => {
    return faqData.filter(faq => {
      const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
      const matchesSearch = searchQuery === '' ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  };

  const filteredFAQs = getFilteredFAQs();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Header */}
      <header className="bg-gradient-to-br from-black via-[#0B0B0B] to-[#1a1a1a] text-white">
        <div className="max-w-6xl mx-auto px-4 pt-20 pb-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-6">
            Help Center
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
            Get instant answers to your questions about library services, account management, and digital resources
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Search Section */}
        <section className="mb-10">
          <div className="max-w-xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400 text-lg" />
            </div>
            <input
              type="text"
              placeholder="Search frequently asked questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-sm"
            />
          </div>
        </section>

        {/* Category Navigation */}
        <section className="mb-10">
          <div className="flex flex-wrap justify-center gap-3">
            {categoryList.map((category) => {
              const IconComponent = category.icon;
              const isActive = activeCategory === category.key;

              return (
                <button
                  key={category.key}
                  onClick={() => setActiveCategory(category.key)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-200 transform hover:scale-105 ${isActive
                    ? `${category.color} text-white shadow-lg`
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md border border-gray-200'
                    }`}
                >
                  <IconComponent className="text-sm" />
                  {category.label}
                </button>
              );
            })}
          </div>
        </section>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* FAQ Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-b">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <FaQuestion className="text-blue-600" />
                  Frequently Asked Questions
                  <span className="text-base font-normal text-gray-500 ml-2">
                    ({filteredFAQs.length})
                  </span>
                </h2>
              </div>

              <div className="divide-y divide-gray-100">
                {filteredFAQs.length > 0 ? (
                  filteredFAQs.map((faq) => {
                    const IconComponent = faq.icon;
                    const isExpanded = expandedFAQ === faq.id;

                    return (
                      <article key={faq.id} className="group">
                        <button
                          onClick={() => handleFAQToggle(faq.id)}
                          className="w-full px-8 py-6 text-left hover:bg-blue-50 transition-colors duration-200 focus:outline-none focus:bg-blue-50"
                        >
                          <div className="flex items-start justify-between gap-6">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="flex-shrink-0 mt-1">
                                <IconComponent className="text-blue-600 text-lg" />
                              </div>
                              <h3 className="font-semibold text-gray-900 text-lg leading-relaxed group-hover:text-blue-700 transition-colors">
                                {faq.question}
                              </h3>
                            </div>
                            <div className="flex-shrink-0 mt-1">
                              {isExpanded ? (
                                <FaChevronUp className="text-blue-600 text-lg" />
                              ) : (
                                <FaChevronDown className="text-gray-400 text-lg group-hover:text-blue-600 transition-colors" />
                              )}
                            </div>
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="px-8 pb-8 animate-slideDown">
                            <div className="ml-8 pl-6 py-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                              <p className="text-gray-700 leading-relaxed text-base">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        )}
                      </article>
                    );
                  })
                ) : (
                  <div className="px-8 py-16 text-center">
                    <FaSearch className="text-5xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      No matching questions found
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Try adjusting your search terms or browse different categories to find what you're looking for.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <FaHeadset className="text-blue-600" />
                Contact Support
              </h3>

              <div className="space-y-5">
                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                  <FaPhone className="text-blue-600 text-xl mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Call Us</h4>
                    <p className="text-gray-600">(555) 123-4567</p>
                    <p className="text-sm text-gray-500">Mon-Fri 9AM-6PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                  <FaEnvelope className="text-green-600 text-xl mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Email</h4>
                    <p className="text-gray-600">support@library.org</p>
                    <p className="text-sm text-gray-500">Response within 24hrs</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                  <FaMapMarkerAlt className="text-purple-600 text-xl mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Visit Us</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      123 Main Street<br />
                      Downtown Library<br />
                      City, State 12345
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      
    </div>
  );
};

export default FAQs;