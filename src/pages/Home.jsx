import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [visibleCards, setVisibleCards] = useState(3);
  const carouselRef = useRef(null);

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
      {/* Main / Hero */}

      <div className="min-h-screen bg-[#E5E5E5] px-2 pt-28 pb-10 flex flex-col-reverse md:flex-row items-center justify-between gap-40 max-w-7xl mx-auto">

        {/* Left Side: Image (only on md+ screens) */}
        <div className="hidden md:flex w-1/2 justify-center">
          <img
            src="/vector/img1.svg"
            alt="Main Visual"
            className="w-full max-w-md md:max-w-lg object-contain"
          />
        </div>

        {/* Right Side: Text + Buttons + Book-step */}
        <div className="w-full md:w-1/2 flex flex-col justify-center space-y-15 px-4 md:px-0">

          {/* Text Content */}
          <div className="space-y-3 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-purple-800 leading-tight">
              Welcome to MyLibrary
            </h1>

            <p className="text-gray-600 text-lg md:text-xl max-w-xl mx-auto md:mx-0">
              One place solution for all your knowledge needs — discover, search, and explore a wide range of curated books, resources, and educational materials, all in one seamless platform.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              
              <Link
              to='/collection'
              >
              <button className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-md transition duration-300">
                🔍 Search Our Collection
              </button>
              </Link>
              <a
              href="#recommendation" >
              <button className="bg-white hover:bg-gray-100 cursor-pointer text-blue-600 border border-blue-600 px-8 py-3 rounded-lg text-lg font-semibold shadow-md transition duration-300">
                📚 Top Books
              </button>
              </a>
              
            </div>
          </div>

          {/* Book-step image */}
          <div className="flex justify-end mt-10">
            <img
              src="/vector/Book-step.svg"
              alt="Book Step"
              className="w-44 md:w-56"
            />
          </div>
        </div>
      </div>


      <div className="py-12 ">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-purple-800 mb-12">Core Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-purple-50 rounded-lg p-6 shadow hover:shadow-lg transition">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{feature.icon}</span>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <section className="w-full mb-10">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-purple-800">Our Impact</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
              >
                <p className="text-4xl font-extrabold text-green-600 mb-2">
                  {stat.value}
                </p>
                <p className="text-lg font-medium text-gray-700">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div id="recommendation" className=" scroll w-full max-w-7xl mx-auto p-4 md:p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl shadow-xl">
        <div className="relative">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-purple-800 mb-6">
            Recommendation
          </h2>
          {/* Main Carousel */}
          <div
            ref={carouselRef}
            className="overflow-hidden rounded-xl"
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
                  className={`flex-shrink-0 w-full flex gap-4 md:gap-6 px-2 md:px-4 ${visibleCards === 1 ? "justify-center" : ""
                    }`}
                >
                  {group.map((card, idx) => (
                    <div
                      key={idx}
                      className={`group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 ${visibleCards === 1 ? "w-full max-w-sm" : "flex-1"
                        }`}
                    >
                      <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full border border-slate-200 group-hover:shadow-2xl group-hover:border-blue-200 transition-all duration-300">
                        <div className="relative overflow-hidden">
                          <img
                            src={card.img}
                            alt={card.title}
                            className="w-full h-48 md:h-52 object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div className="p-4 md:p-6">
                          <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                            {card.title}
                          </h3>
                          <p className="text-slate-600 text-sm leading-relaxed mb-4">
                            {card.text}
                          </p>
                          <button className="inline-flex items-center px-4 md:px-5 py-2 md:py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium text-sm hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg">
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
            className="absolute left-1 md:left-2 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 flex items-center justify-center group border border-slate-200"
            aria-label="Previous slide"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6 text-slate-700 group-hover:text-blue-600 transition-colors"
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
            className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 flex items-center justify-center group border border-slate-200"
            aria-label="Next slide"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6 text-slate-700 group-hover:text-blue-600 transition-colors"
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
        <div className="flex items-center justify-center mt-4 md:mt-6">
          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 md:gap-3">
            {groupedCards.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${idx === currentIndex
                  ? "bg-blue-600 scale-125 shadow-lg"
                  : "bg-slate-300 hover:bg-slate-400 hover:scale-110"
                  }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Progress Bar
      <div className="mt-3 md:mt-4 h-1 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
          style={{
            width: `${((currentIndex + 1) / totalGroups) * 100}%`,
          }}
        />
      </div> */}

        {/* Card Count Indicator
      <div className="mt-2 text-center text-xs md:text-sm text-slate-500">
        Showing {visibleCards} of {cards.length} cards
        {visibleCards === 1 && " (Mobile view)"}
        {visibleCards === 2 && " (Tablet view)"}
        {visibleCards === 3 && " (Desktop view)"}
      </div> */}
      </div>
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-purple-800 mb-10">What Our Users Say</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {feedback.map((user, idx) => (
              <div
                key={idx}
                className="bg-gray-50 p-6 rounded-2xl shadow hover:shadow-md transition"
              >
                <p className="text-gray-700 italic mb-4">"{user.message}"</p>
                <div className="font-semibold text-purple-900">{user.name}</div>
                <div className="text-sm text-gray-500">{user.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
       <section className="mt-4">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-purple-800 mb-4">
              Stay Updated with MyLibrary
            </h2>
            <p className="text-black text-lg md:text-xl max-w-2xl mx-auto">
              Get the latest book recommendations, library updates, and exclusive content delivered straight to your inbox. Join our community of book lovers!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg border-0 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-200"
            />
            <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
              Subscribe
            </button>
          </div>

          <div className="mt-6 mb-3 flex flex-wrap justify-center gap-6 text-black text-sm">
            <div className="flex items-center gap-2">
              <span>📚</span>
              <span>Weekly book picks</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🎯</span>
              <span>Personalized recommendations</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🔒</span>
              <span>No spam, unsubscribe anytime</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
