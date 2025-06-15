import React, { useState } from 'react';
import { FiLoader, FiBookOpen } from 'react-icons/fi';

const PlaceholderBookCover = ({ title, className }) => (
  <div className={`${className} bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-center p-2 rounded shadow-md`}>
    <div className="text-xs leading-tight break-words">
      {title ? (title.length > 15 ? title.substring(0, 15) + '...' : title) : 'Book'}
    </div>
  </div>
);

const BookCard = ({ book, onBorrowRequest, borrowLoading }) => {
  const [imageError, setImageError] = useState(false);

  const imageSrc = book.coverImagePath?.startsWith("http")
    ? book.coverImagePath
    : book.coverImagePath
      ? `http://localhost:3000${book.coverImagePath}`
      : null;

  const handleRequestClick = () => {
    if (onBorrowRequest && !borrowLoading) {
      onBorrowRequest(book._id, book.title);
    }
  };

  const isAvailable = (book.availableCopies || 0) > 0;

  return (
    <div className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 group">
      <div className="relative overflow-hidden rounded-t-lg">
        {!imageError && imageSrc ? (
          <img
            src={imageSrc}
            alt={book.title}
            className="w-full h-48 sm:h-56 md:h-64 lg:h-48 xl:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <PlaceholderBookCover
            title={book.title}
            className="w-full h-48 sm:h-56 md:h-64 lg:h-48 xl:h-56"
          />
        )}

        {/* Availability badge */}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium shadow-sm ${isAvailable
              ? 'bg-green-100 text-green-700 border border-green-200'
              : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
            {isAvailable ? `${book.availableCopies} Available` : 'Unavailable'}
          </span>
        </div>

        {/* Overlay on hover for better UX */}
        
      </div>

      <div className="p-4">
        <div className="min-h-[60px] mb-3">
          <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1" title={book.title}>
            {book.title}
          </h4>
          <p className="text-xs text-gray-600 line-clamp-1" title={book.author}>
            by {book.author}
          </p>
        </div>

        {/* Book details */}
        {book.genre && (
          <div className="mb-3">
            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              {book.genre}
            </span>
          </div>
        )}

        {/* Request button - only show for available books */}
        {isAvailable && (
          <button
            onClick={handleRequestClick}
            disabled={borrowLoading}
            className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              borrowLoading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2'
            }`}
          >
            {borrowLoading ? (
              <>
                <FiLoader className="w-4 h-4 animate-spin" />
                <span>Requesting...</span>
              </>
            ) : (
              <>
                <FiBookOpen className="w-4 h-4" />
                <span>Request Book</span>
              </>
            )}
          </button>
        )}

        {/* Show message for unavailable books */}
        {!isAvailable && (
          <div className="w-full py-2 px-3 rounded-lg text-sm font-medium bg-gray-100 text-gray-500 text-center">
            Currently Unavailable
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;