import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import HeroSection from "./HeroSection";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // adjust if your path differs

const cards = [
  {
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    title: "Mountain Adventure",
    text: "Explore breathtaking mountain landscapes and discover hidden trails.",
  },
  {
    img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
    title: "Forest Escape",
    text: "Immerse yourself in the tranquil beauty of ancient forests.",
  },
  {
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&sig=2",
    title: "Ocean Views",
    text: "Experience the endless horizon where sky meets the sea.",
  },
  {
    img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&sig=3",
    title: "Desert Sunset",
    text: "Witness spectacular sunsets over golden sand dunes.",
  },
  {
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&sig=4",
    title: "City Lights",
    text: "Discover the vibrant energy of metropolitan nightlife.",
  },
  {
    img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&sig=5",
    title: "Northern Aurora",
    text: "Marvel at the dancing lights of the northern aurora.",
  },
];

const feedback = [
  {
    name: 'Ananya Sharma',
    role: 'Librarian, City Public Library',
    message:
      'This system has transformed how we manage our library. Easy to use, fast, and reliable!',
  },
  {
    name: 'Ravi Kumar',
    role: 'Professor, ABC University',
    message:
      'An intuitive tool for both staff and students. I can finally track resources without confusion.',
  },
  {
    name: 'Meera Iyer',
    role: 'School Administrator',
    message:
      'Managing book inventories and student borrowing records has never been easier. Highly recommended!',
  },
];

const AUTO_SLIDE_INTERVAL = 4000;

const features = [
  {
    title: "Smart Book Search",
    description: "Easily find books by title, genre or rating using our advanced search engine.",
    icon: "🔍"
  },
  {
    title: "Real-time Availability",
    description: "Know instantly if a book is available or currently checked out.",
    icon: "📚"
  },
  {
    title: "Personalized Dashboard",
    description: "Track your borrowing history, due dates, and book recommendations.",
    icon: "📊"
  },
];

const stats = [
  { label: 'Users', value: '100+' },
  { label: 'Books', value: '600+' },
  { label: 'Categories', value: '10+' },
];

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading } = useAuth();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [visibleCards, setVisibleCards] = useState(3);
  const carouselRef = useRef(null);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      if (user?.role === "user") navigate("/user");
      else if (user?.role === "librarian") navigate("/librarian");
      else if (user?.role === "admin") navigate("/admin");
    }
  }, [loading, isAuthenticated, user, navigate]);

  // Responsive logic
  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth < 768) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };

    updateVisibleCards();
    window.addEventListener("resize", updateVisibleCards);
    return () => window.removeEventListener("resize", updateVisibleCards);
  }, []);

  // Reset currentIndex when visibleCards changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [visibleCards]);

  const totalGroups = Math.ceil(cards.length / visibleCards);

  const groupedCards = Array.from({ length: totalGroups }, (_, i) =>
    cards.slice(i * visibleCards, i * visibleCards + visibleCards)
  );

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalGroups);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalGroups) % totalGroups);
  };

  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      nextSlide();
    }, AUTO_SLIDE_INTERVAL);

    return () => clearInterval(interval);
  }, [isHovered, totalGroups]);

  return (
    <>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <p className="text-lg text-gray-500">Loading...</p>
        </div>
      ) : (
        <>
          <HeroSection />

          {/* Features Section */}
          <section className="py-16 bg-[#e5e5e5] text-black">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                  Core Features
                </h2>
                <p className="text-xl text-black max-w-2xl mx-auto">
                  Discover the powerful tools that make library management effortless
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="group bg-white backdrop-blur-sm border border-white/10 rounded-2xl p-8  transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-5xl p-3 bg-orange-500/20 rounded-2xl group-hover:bg-orange-500/30 transition-colors duration-300">
                        {feature.icon}
                      </div>
                      <h3 className="text-2xl font-bold black">{feature.title}</h3>
                    </div>
                    <p className="text-black leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-16 bg-[#e5e5e5] text-white">
            <div className="max-w-5xl mx-auto px-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Our Impact
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="group bg-white backdrop-blur-sm border border-white/10 p-8 rounded-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    <p className="text-5xl font-extrabold text-black mb-4 group-hover:text-orange-400 transition-colors duration-300">
                      {stat.value}
                    </p>
                    <p className="text-xl font-medium text-gray-900">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Recommendations Section */}
          <section className="py-16 text-black">
            <div className="max-w-7xl mx-auto px-6">
              <div className="relative">
                <div className="text-center mb-12">
                  <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                    Recommendations
                  </h2>
                  <p className="text-xl text-black">
                    Discover your next favorite read
                  </p>
                </div>

                {/* Main Carousel */}
                <div
                  ref={carouselRef}
                  className="overflow-hidden rounded-2xl"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <div
                    className="flex transition-transform duration-700 ease-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                  >
                    {groupedCards.map((group, gIdx) => (
                      <div
                        key={gIdx}
                        className={`flex-shrink-0 w-full flex gap-6 px-4 ${visibleCards === 1 ? "justify-center" : ""
                          }`}
                      >
                        {group.map((card, idx) => (
                          <div
                            key={idx}
                            className={`group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 ${visibleCards === 1 ? "w-full max-w-sm" : "flex-1"
                              }`}
                          >
                            <div className="bg-white backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl overflow-hidden h-full group-hover:bg-white/10 group-hover:border-orange-500/50 transition-all duration-300">
                              <div className="relative overflow-hidden">
                                <img
                                  src={card.img}
                                  alt={card.title}
                                  className="w-full h-48 md:h-52 object-cover transition-transform duration-500 group-hover:scale-110"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              </div>
                              <div className="p-6">
                                <h3 className="text-xl font-bold  mb-3 group-hover:text-orange-400 transition-colors duration-300">
                                  {card.title}
                                </h3>
                                <p className=" leading-relaxed mb-6">
                                  {card.text}
                                </p>
                                <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-orange-500/25">
                                  Explore Now
                                  <svg
                                    className="ml-2 w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 5l7 7-7 7"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full shadow-lg hover:bg-white/20 hover:scale-110 transition-all duration-200 flex items-center justify-center group"
                  aria-label="Previous slide"
                >
                  <svg
                    className="w-6 h-6 text-white group-hover:text-orange-400 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <button
                  onClick={nextSlide}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full shadow-lg hover:bg-white/20 hover:scale-110 transition-all duration-200 flex items-center justify-center group"
                  aria-label="Next slide"
                >
                  <svg
                    className="w-6 h-6 text-white group-hover:text-orange-400 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center mt-8">
                {/* Pagination Dots */}
                <div className="flex justify-center gap-3">
                  {groupedCards.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goToSlide(idx)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentIndex
                        ? "bg-orange-500 scale-125 shadow-lg shadow-orange-500/50"
                        : "bg-gray-400/60 hover:bg-gray-500/80 hover:scale-110"
                        }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-16 bg-[#e5e5e5]">
            <div className="max-w-5xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                  What Our Users Say
                </h2>
                <p className="text-xl text-gray-700">
                  Real feedback from real users
                </p>
              </div>

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {feedback.map((user, idx) => (
                  <div
                    key={idx}
                    className="group bg-gray-50 border border-gray-200 p-8 rounded-2xl hover:bg-gray-100 hover:border-orange-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    <div className="mb-6">
                      <svg className="w-8 h-8 text-orange-400 mb-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                      <p className="text-gray-700 italic leading-relaxed text-lg">
                        "{user.message}"
                      </p>
                    </div>
                    <div className="border-t border-gray-200 pt-6">
                      <div className="font-bold text-gray-900 text-lg">{user.name}</div>
                      <div className="text-orange-500 font-medium">{user.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Newsletter Section */}
          {/* <section className="py-16 bg-[#e5e5e5]">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <div className="mb-12">
                <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                  Stay Updated with MyLibrary
                </h2>
                <p className="text-xl  max-w-2xl mx-auto leading-relaxed">
                  Get the latest book recommendations, library updates, and exclusive content delivered straight to your inbox. Join our community of book lovers!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-8">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                />
                <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-orange-500/25">
                  Subscribe
                </button>
              </div>

              <div className="flex flex-wrap justify-center gap-8 text-black">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📚</span>
                  <span className="font-medium">Weekly book picks</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎯</span>
                  <span className="font-medium">Personalized recommendations</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔒</span>
                  <span className="font-medium">No spam, unsubscribe anytime</span>
                </div>
              </div>
            </div>
          </section> */}
        </>
      )}
    </>
  );
};

export default Home;