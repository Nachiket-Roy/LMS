import React, { useState } from 'react';
import { FiFilter } from 'react-icons/fi';

const books = [
  {
    title: 'The Great Gatsby',
    description: 'A novel by F. Scott Fitzgerald.',
    status: 'Available',
    generic: 'Classic',
    rating: 4.3,
    image: 'https://images-na.ssl-images-amazon.com/images/I/81xXAy7fNEL.jpg',
  },
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
    title: 'Moby Dick',
    description: 'A novel by Herman Melville.',
    status: 'Unavailable',
    generic: 'Adventure',
    rating: 3.9,
    image: 'https://images-na.ssl-images-amazon.com/images/I/81EXpU8TM-L.jpg',
  },
];

const uniqueGenerics = [...new Set(books.map((book) => book.generic))];
const uniqueRatings = [...new Set(books.map((book) => Math.floor(book.rating)))].sort((a, b) => a - b);

const Collection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGeneric, setSelectedGeneric] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGeneric =
      selectedGeneric === '' || book.generic === selectedGeneric;

    const matchesRating =
      selectedRating === '' || book.rating >= Number(selectedRating);

    return matchesSearch && matchesGeneric && matchesRating;
  });

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="min-h-screen bg-[#e5e5e5] px-4 pt-24 pb-10">
      <header className="text-4xl font-bold text-center text-gray-800 mb-8">
        Book Gallery
      </header>

      {/* Search & Filter Section */}
      <div className="flex flex-col gap-4 w-full max-w-6xl mx-auto mb-10">
        {/* Search bar and filter button */}
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button 
            onClick={toggleFilters}
            className={`p-3 rounded-lg transition-colors ${
              showFilters 
                ? 'bg-purple-800 text-white' 
                : 'bg-purple-700 text-white hover:bg-purple-800'
            }`}
          >
            <FiFilter size={20} />
          </button>
        </div>

        {/* Filter dropdowns - only show when showFilters is true */}
        {showFilters && (
          <div className="flex flex-col md:flex-row gap-4 animate-fadeIn">
            <select
              value={selectedGeneric}
              onChange={(e) => setSelectedGeneric(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Genres</option>
              {uniqueGenerics.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Ratings</option>
              {uniqueRatings.map((r) => (
                <option key={r} value={r}>
                  {r} & up
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="text-center text-gray-600 mb-6">
        Showing {filteredBooks.length} of {books.length} books
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {filteredBooks.map((book, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col hover:shadow-xl transition-shadow"
          >
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{book.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{book.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  <strong>Genre:</strong> {book.generic}
                </p>
                <p className="text-sm text-yellow-600 mt-1">
                  <strong>Rating:</strong> {book.rating.toFixed(1)} ⭐
                </p>
              </div>
              <div className="mt-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    book.status === 'Available'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {book.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No results message */}
      {filteredBooks.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          <p className="text-lg">No books found matching your criteria.</p>
          <p className="text-sm mt-2">Try adjusting your search or filters.</p>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Collection;