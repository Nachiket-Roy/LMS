import React, { useState, useRef, useEffect } from 'react';
import { FiFilter, FiSearch, FiLoader } from 'react-icons/fi';
import { getAllBooks } from "../services/userApi";
import BookCard from '../components/BookCard';
import LoginRegisterCard from './LoginRegisterCard';

const Collection = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginModalMode, setLoginModalMode] = useState('login');

  const filterRef = useRef(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await getAllBooks();

      if (response.data.success) {
        setBooks(response.data.data || []);
      } else {
        console.error('Failed to fetch books');
        setBooks([]);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestClick = () => {
    setLoginModalMode('login');
    setShowLoginModal(true);
  };

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };

  const uniqueGenres = [...new Set(books.map(book => book.genre || book.generic).filter(Boolean))];
  const uniqueRatings = [...new Set(books.map(book => Math.floor(book.rating || 0)).filter(r => r > 0))].sort((a, b) => a - b);

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGenre = selectedGenre === '' || (book.genre || book.generic) === selectedGenre;
    const matchesRating = selectedRating === '' || (book.rating || 0) >= Number(selectedRating);

    const matchesStatus = selectedStatus === '' ||
      (selectedStatus === 'Available' && ((book.availableCopies || 0) > 0 || book.status === 'Available')) ||
      (selectedStatus === 'Unavailable' && ((book.availableCopies || 0) === 0 || book.status === 'Unavailable'));

    return matchesSearch && matchesGenre && matchesRating && matchesStatus;
  });

  useEffect(() => {
    const el = filterRef.current;
    if (!el) return;

    if (showFilters) {
      el.style.maxHeight = el.scrollHeight + 'px';
      el.style.opacity = 1;
    } else {
      el.style.maxHeight = '0px';
      el.style.opacity = 0;
    }
  }, [showFilters]);

  const toggleFilters = () => setShowFilters(!showFilters);

  const clearFilters = () => {
    setSelectedGenre('');
    setSelectedRating('');
    setSelectedStatus('');
    setSearchTerm('');
  };

  const activeFiltersCount = [selectedGenre, selectedRating, selectedStatus].filter(Boolean).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e5e5e5]">
        <div className="flex items-center justify-center h-64 pt-24">
          <div className="flex items-center gap-3">
            <FiLoader className="animate-spin w-6 h-6 text-purple-600" />
            <span className="text-lg text-gray-600">Loading books...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e5e5e5]">
      {showLoginModal && (
        <LoginRegisterCard
          onClose={handleCloseLoginModal}
          initialMode={loginModalMode}
        />
      )}

      <header className="bg-gradient-to-br from-black via-[#0B0B0B] to-[#1a1a1a] text-white w-full">
        <div className="max-w-7xl mx-auto px-4 pt-20 pb-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-6">
            Book Collection
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
            Discover our extensive collection of books. Browse, search, and find your next great read from our carefully curated library.
          </p>
        </div>
      </header>

      <div className="px-4 pt-8 pb-10">
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 mb-6 sm:mb-8 max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title, author, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={toggleFilters}
                className={`relative px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm sm:text-base font-medium border ${showFilters
                  ? 'bg-purple-600 text-white border-purple-700 shadow-md'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }`}
              >
                <FiFilter size={18} />
                <span className="hidden sm:inline">Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div
            ref={filterRef}
            className="transition-all duration-300 overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                >
                  <option value="">All Genres</option>
                  {uniqueGenres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                <select
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                >
                  <option value="">All Ratings</option>
                  {uniqueRatings.map((rating) => (
                    <option key={rating} value={rating}>
                      {rating}+ Stars
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                >
                  <option value="">All Books</option>
                  <option value="Available">Available Only</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2 max-w-6xl mx-auto">
          <div className="text-sm sm:text-base text-gray-600">
            Showing <span className="font-semibold text-gray-800">{filteredBooks.length}</span> of{' '}
            <span className="font-semibold text-gray-800">{books.length}</span> books
          </div>
          {(searchTerm || activeFiltersCount > 0) && (
            <div className="text-sm text-purple-600">
              {searchTerm && `Search: "${searchTerm}"`}
              {searchTerm && activeFiltersCount > 0 && ' • '}
              {activeFiltersCount > 0 && `${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''} active`}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {filteredBooks.map((book) => (
            <BookCard 
              key={book._id || book.id} 
              book={book}
              onBorrowRequest={handleRequestClick}
            />
          ))}
        </div>

        {filteredBooks.length === 0 && !loading && (
          <div className="text-center py-12 sm:py-16">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <FiSearch className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                No books found
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                No books match your current search and filter criteria.
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;