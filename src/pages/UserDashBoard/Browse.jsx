import React, { useState } from 'react';
import { FiFilter, FiSearch } from 'react-icons/fi';

const books = [
  
  {
    title: 'To Kill a Mockingbird',
    description: 'A novel by Harper Lee published in 1960.',
    status: 'Unavailable',
    generic: 'Classic',
    rating: 4.8,
    image: 'https://images-na.ssl-images-amazon.com/images/I/81gepf1eMqL.jpg',
  },
  {
    title: '1984',
    description: 'Dystopian novel by George Orwell.',
    status: 'Available',
    generic: 'Dystopian',
    rating: 4.6,
    image: 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg',
  },
  {
    title: 'Pride and Prejudice',
    description: 'A romantic novel by Jane Austen.',
    status: 'Available',
    generic: 'Romance',
    rating: 4.7,
    image: 'https://images-na.ssl-images-amazon.com/images/I/91HHqVTAJQL.jpg',
  },
  {
    title: 'The Catcher in the Rye',
    description: 'A novel by J.D. Salinger about teenage rebellion.',
    status: 'Available',
    generic: 'Classic',
    rating: 4.1,
    image: 'https://images-na.ssl-images-amazon.com/images/I/8125BDk3l9L.jpg',
  },
  {
    title: 'Harry Potter and the Sorcerer\'s Stone',
    description: 'The first book in the Harry Potter series by J.K. Rowling.',
    status: 'Available',
    generic: 'Fantasy',
    rating: 4.9,
    image: 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg',
  },
  {
    title: 'The Lord of the Rings',
    description: 'Epic fantasy novel by J.R.R. Tolkien.',
    status: 'Unavailable',
    generic: 'Fantasy',
    rating: 4.8,
    image: 'https://images-na.ssl-images-amazon.com/images/I/91b0C2YNSrL.jpg',
  },
];

const uniqueGenerics = [...new Set(books.map((book) => book.generic))];
const uniqueRatings = [...new Set(books.map((book) => Math.floor(book.rating)))].sort((a, b) => a - b);

const Browse = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGeneric, setSelectedGeneric] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGeneric =
      selectedGeneric === '' || book.generic === selectedGeneric;

    const matchesRating =
      selectedRating === '' || book.rating >= Number(selectedRating);

    const matchesStatus =
      selectedStatus === '' || book.status === selectedStatus;

    return matchesSearch && matchesGeneric && matchesRating && matchesStatus;
  });

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const clearFilters = () => {
    setSelectedGeneric('');
    setSelectedRating('');
    setSelectedStatus('');
    setSearchTerm('');
  };

  const activeFiltersCount = [selectedGeneric, selectedRating, selectedStatus].filter(Boolean).length;

  return (
    <div className=" bg-[#e5e5e5]">
      {/* Main content container with responsive padding */}
      <div className="pt-16 sm:pt-20 px-4 sm:px-6 pb-6 sm:pb-10">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
              Book Collection
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Discover and explore our comprehensive library collection
            </p>
          </div>

          {/* Search & Filter Section */}
          <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 mb-6 sm:mb-8">
            
            {/* Search bar and filter button */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search books by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={toggleFilters}
                  className={`relative px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm sm:text-base font-medium ${
                    showFilters 
                      ? 'bg-purple-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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

            {/* Filter dropdowns - animated collapse */}
            <div className={`overflow-hidden transition-all duration-300 ${
              showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
                  <select
                    value={selectedGeneric}
                    onChange={(e) => setSelectedGeneric(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  >
                    <option value="">All Genres</option>
                    {uniqueGenerics.map((g) => (
                      <option key={g} value={g}>
                        {g}
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
                    {uniqueRatings.map((r) => (
                      <option key={r} value={r}>
                        {r}+ Stars
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

          {/* Results Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
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

          {/* Book Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredBooks.map((book, index) => (
              <div
                key={index}
                className="bg-white shadow-sm rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x600/f3f4f6/9ca3af?text=Book+Cover';
                    }}
                  />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium shadow-sm ${
                        book.status === 'Available'
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : 'bg-red-100 text-red-700 border border-red-200'
                      }`}
                    >
                      {book.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-4 sm:p-5">
                  <div className="mb-3">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-3">
                      {book.description}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-gray-500">Genre</span>
                      <span className="font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded-full">
                        {book.generic}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-gray-500">Rating</span>
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-yellow-600">
                          {book.rating.toFixed(1)}
                        </span>
                        <span className="text-yellow-500">⭐</span>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    className={`w-full mt-4 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                      book.status === 'Available'
                        ? 'bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={book.status !== 'Available'}
                  >
                    {book.status === 'Available' ? 'Borrow Book' : 'Unavailable'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* No results message */}
          {filteredBooks.length === 0 && (
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
    </div>
  );
};

export default Browse;