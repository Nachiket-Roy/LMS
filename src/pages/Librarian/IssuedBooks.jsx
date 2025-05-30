import React, { useState } from 'react';
import { FaSearch, FaBook, FaUser, FaCalendarAlt, FaCheckCircle, 
         FaExclamationTriangle, FaTimes, FaPlus, FaBarcode } from 'react-icons/fa';

// Main Issue Book Component
const IssueBookPage = () => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchResults, setSearchResults] = useState({ books: [], members: [] });
  const [bookSearch, setBookSearch] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [returnDate, setReturnDate] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Calculate default return date (14 days from issue date)
  React.useEffect(() => {
    if (issueDate) {
      const date = new Date(issueDate);
      date.setDate(date.getDate() + 14);
      setReturnDate(date.toISOString().split('T')[0]);
    }
  }, [issueDate]);

  // Sample data (would normally come from API)
  const sampleBooks = [
    { id: 1, title: 'React Fundamentals', author: 'John Smith', isbn: '978-0-123456-78-9', available: 5, category: 'Technology' },
    { id: 2, title: 'JavaScript Mastery', author: 'Jane Doe', isbn: '978-0-987654-32-1', available: 3, category: 'Programming' },
    { id: 3, title: 'Data Structures', author: 'Mike Johnson', isbn: '978-0-456789-01-2', available: 2, category: 'Computer Science' },
    { id: 4, title: 'Web Development', author: 'Sarah Wilson', isbn: '978-0-234567-89-0', available: 0, category: 'Technology' },
    { id: 5, title: 'Python Programming', author: 'David Brown', isbn: '978-0-345678-90-1', available: 4, category: 'Programming' }
  ];

  const sampleMembers = [
    { id: 1, name: 'Alex Thompson', memberId: 'M001', email: 'alex@email.com', phone: '123-456-7890', status: 'Active', booksIssued: 2 },
    { id: 2, name: 'Emily Davis', memberId: 'M002', email: 'emily@email.com', phone: '098-765-4321', status: 'Active', booksIssued: 1 },
    { id: 3, name: 'Robert Chen', memberId: 'M003', email: 'robert@email.com', phone: '555-123-4567', status: 'Active', booksIssued: 0 },
    { id: 4, name: 'Lisa Garcia', memberId: 'M004', email: 'lisa@email.com', phone: '444-567-8901', status: 'Suspended', booksIssued: 3 }
  ];

  const handleBookSearch = (query) => {
    setBookSearch(query);
    if (query.length > 2) {
      const filtered = sampleBooks.filter(book => 
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase()) ||
        book.isbn.includes(query)
      );
      setSearchResults(prev => ({ ...prev, books: filtered }));
    } else {
      setSearchResults(prev => ({ ...prev, books: [] }));
    }
  };

  const handleMemberSearch = (query) => {
    setMemberSearch(query);
    if (query.length > 2) {
      const filtered = sampleMembers.filter(member => 
        member.name.toLowerCase().includes(query.toLowerCase()) ||
        member.memberId.toLowerCase().includes(query.toLowerCase()) ||
        member.email.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(prev => ({ ...prev, members: filtered }));
    } else {
      setSearchResults(prev => ({ ...prev, members: [] }));
    }
  };

  const handleIssueBook = () => {
    if (selectedBook && selectedMember) {
      // Here you would typically make an API call
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        // Reset form
        setSelectedBook(null);
        setSelectedMember(null);
        setBookSearch('');
        setMemberSearch('');
        setSearchResults({ books: [], members: [] });
      }, 2000);
    }
  };

  const canIssueBook = () => {
    return selectedBook && 
           selectedMember && 
           selectedBook.available > 0 && 
           selectedMember.status === 'Active' &&
           selectedMember.booksIssued < 5; // Max 5 books per member
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Issue Book</h2>
            <p className="opacity-90">Issue books to library members</p>
          </div>
          <FaBook className="text-4xl opacity-80" />
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl flex items-center">
          <FaCheckCircle className="w-5 h-5 mr-2" />
          Book issued successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Book Search Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FaSearch className="w-5 h-5 mr-2 text-blue-600" />
            Search Books
          </h3>
          
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search by title, author, or ISBN..."
              value={bookSearch}
              onChange={(e) => handleBookSearch(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
          </div>

          {/* Selected Book */}
          {selectedBook && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-blue-900">{selectedBook.title}</h4>
                  <p className="text-sm text-blue-700">by {selectedBook.author}</p>
                  <p className="text-xs text-blue-600">ISBN: {selectedBook.isbn}</p>
                  <p className="text-xs text-green-600">Available: {selectedBook.available} copies</p>
                </div>
                <button
                  onClick={() => setSelectedBook(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          )}

          {/* Book Search Results */}
          {searchResults.books.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {searchResults.books.map(book => (
                <BookSearchItem 
                  key={book.id} 
                  book={book} 
                  onSelect={setSelectedBook}
                  isSelected={selectedBook?.id === book.id}
                />
              ))}
            </div>
          )}
        </div>

        {/* Member Search Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FaUser className="w-5 h-5 mr-2 text-green-600" />
            Search Members
          </h3>
          
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search by name, member ID, or email..."
              value={memberSearch}
              onChange={(e) => handleMemberSearch(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
          </div>

          {/* Selected Member */}
          {selectedMember && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-green-900">{selectedMember.name}</h4>
                  <p className="text-sm text-green-700">ID: {selectedMember.memberId}</p>
                  <p className="text-xs text-green-600">{selectedMember.email}</p>
                  <p className="text-xs text-blue-600">Books Issued: {selectedMember.booksIssued}/5</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                    selectedMember.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedMember.status}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          )}

          {/* Member Search Results */}
          {searchResults.members.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {searchResults.members.map(member => (
                <MemberSearchItem 
                  key={member.id} 
                  member={member} 
                  onSelect={setSelectedMember}
                  isSelected={selectedMember?.id === member.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Issue Details Section */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FaCalendarAlt className="w-5 h-5 mr-2 text-purple-600" />
          Issue Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Issue Date</label>
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Return Date</label>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Validation Messages */}
        {selectedBook && selectedBook.available === 0 && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg flex items-center">
            <FaExclamationTriangle className="w-4 h-4 mr-2" />
            This book is currently out of stock.
          </div>
        )}

        {selectedMember && selectedMember.status !== 'Active' && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg flex items-center">
            <FaExclamationTriangle className="w-4 h-4 mr-2" />
            This member's account is not active.
          </div>
        )}

        {selectedMember && selectedMember.booksIssued >= 5 && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg flex items-center">
            <FaExclamationTriangle className="w-4 h-4 mr-2" />
            This member has reached the maximum book limit (5 books).
          </div>
        )}

        {/* Issue Button */}
        <button
          onClick={handleIssueBook}
          disabled={!canIssueBook()}
          className={`w-full py-3 px-6 rounded-lg font-semibold flex items-center justify-center ${
            canIssueBook()
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <FaPlus className="w-4 h-4 mr-2" />
          Issue Book
        </button>
      </div>
    </div>
  );
};

// Book Search Item Component
const BookSearchItem = ({ book, onSelect, isSelected }) => (
  <div 
    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
      isSelected 
        ? 'border-blue-500 bg-blue-50' 
        : 'border-gray-200 hover:bg-gray-50'
    }`}
    onClick={() => onSelect(book)}
  >
    <div className="flex items-center justify-between">
      <div>
        <h4 className="font-medium">{book.title}</h4>
        <p className="text-sm text-gray-600">by {book.author}</p>
        <div className="flex items-center space-x-4 mt-1">
          <span className="text-xs text-gray-500 flex items-center">
            <FaBarcode className="w-3 h-3 mr-1" />
            {book.isbn}
          </span>
          <span className="text-xs text-blue-600">{book.category}</span>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-sm font-medium ${
          book.available > 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {book.available > 0 ? `${book.available} available` : 'Out of stock'}
        </p>
      </div>
    </div>
  </div>
);

// Member Search Item Component
const MemberSearchItem = ({ member, onSelect, isSelected }) => (
  <div 
    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
      isSelected 
        ? 'border-green-500 bg-green-50' 
        : 'border-gray-200 hover:bg-gray-50'
    }`}
    onClick={() => onSelect(member)}
  >
    <div className="flex items-center justify-between">
      <div>
        <h4 className="font-medium">{member.name}</h4>
        <p className="text-sm text-gray-600">ID: {member.memberId}</p>
        <p className="text-xs text-gray-500">{member.email}</p>
      </div>
      <div className="text-right">
        <span className={`inline-block px-2 py-1 rounded-full text-xs mb-1 ${
          member.status === 'Active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {member.status}
        </span>
        <p className="text-xs text-gray-500">Books: {member.booksIssued}/5</p>
      </div>
    </div>
  </div>
);

export default IssueBookPage;