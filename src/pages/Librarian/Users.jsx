import { FaBook, FaBookOpen, FaClock, FaExclamationTriangle, 
         FaHeart, FaHistory, FaStar, FaDollarSign, FaCalendarAlt } from 'react-icons/fa';

// User Dashboard Content Component
const UserDashboardContent = ({ userData, userStats, borrowedBooks, recommendations }) => (
  <div className="space-y-6">
    {/* Welcome Section */}
    

    {/* Quick Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard 
        icon={<FaBookOpen className="w-8 h-8 text-blue-600" />}
        label="Currently Borrowed"
        value={userStats.currentlyBorrowed}
        color="text-blue-600"
      />
      <StatCard 
        icon={<FaBook className="w-8 h-8 text-green-600" />}
        label="Books Read This Year"
        value={userStats.booksReadThisYear}
        color="text-green-600"
      />
      <StatCard 
        icon={<FaClock className="w-8 h-8 text-orange-600" />}
        label="Due Soon"
        value={userStats.dueSoon}
        color="text-orange-600"
      />
      <StatCard 
        icon={<FaExclamationTriangle className="w-8 h-8 text-red-600" />}
        label="Overdue"
        value={userStats.overdue}
        color="text-red-600"
      />
    </div>

    {/* Additional Stats */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard 
        icon={<FaHeart className="w-8 h-8 text-pink-600" />}
        label="Wishlist Items"
        value={userStats.wishlistItems}
        color="text-pink-600"
      />
      <StatCard 
        icon={<FaHistory className="w-8 h-8 text-purple-600" />}
        label="Total Books Read"
        value={userStats.totalBooksRead}
        color="text-purple-600"
      />
      <StatCard 
        icon={<FaStar className="w-8 h-8 text-yellow-600" />}
        label="Average Rating"
        value={`${userStats.averageRating}/5`}
        color="text-yellow-600"
      />
      <StatCard 
        icon={<FaDollarSign className="w-8 h-8 text-red-600" />}
        label="Outstanding Fines"
        value={`$${userStats.outstandingFines}`}
        color="text-red-600"
      />
    </div>

    {/* Currently Borrowed Books */}
    <BorrowedBooksList books={borrowedBooks} />

    {/* Recommended Books */}
    <RecommendationsList recommendations={recommendations} />
  </div>
);

// Reusable Stat Card Component
const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm">{label}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
      </div>
      {icon}
    </div>
  </div>
);

// Borrowed Books List Component
const BorrowedBooksList = ({ books }) => (
  <div className="bg-white rounded-xl shadow-sm border p-6">
    <h3 className="text-lg font-semibold mb-4 flex items-center">
      <FaBookOpen className="w-5 h-5 mr-2 text-blue-600" />
      Currently Borrowed Books
    </h3>
    <div className="space-y-3">
      {books.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No books currently borrowed</p>
      ) : (
        books.map(book => (
          <BorrowedBookItem key={book.id} book={book} />
        ))
      )}
    </div>
  </div>
);

// Borrowed Book Item Component
const BorrowedBookItem = ({ book }) => {
  const getDaysUntilDue = () => {
    const today = new Date();
    const dueDate = new Date(book.dueDate);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = getDaysUntilDue();
  const getStatusColor = () => {
    if (daysUntilDue < 0) return 'text-red-600 bg-red-50';
    if (daysUntilDue <= 3) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  const getStatusText = () => {
    if (daysUntilDue < 0) return `${Math.abs(daysUntilDue)} days overdue`;
    if (daysUntilDue === 0) return 'Due today';
    return `Due in ${daysUntilDue} days`;
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded flex items-center justify-center text-white font-bold">
          {book.title.charAt(0)}
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{book.title}</h4>
          <p className="text-sm text-gray-600">by {book.author}</p>
          <p className="text-xs text-gray-500">Borrowed: {book.borrowDate}</p>
        </div>
      </div>
      <div className="text-right">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
        <p className="text-xs text-gray-500 mt-1">Due: {book.dueDate}</p>
      </div>
    </div>
  );
};

// Recommendations List Component
const RecommendationsList = ({ recommendations }) => (
  <div className="bg-white rounded-xl shadow-sm border p-6">
    <h3 className="text-lg font-semibold mb-4 flex items-center">
      <FaStar className="w-5 h-5 mr-2 text-yellow-600" />
      Recommended for You
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {recommendations.map(book => (
        <RecommendationItem key={book.id} book={book} />
      ))}
    </div>
  </div>
);

// Recommendation Item Component
const RecommendationItem = ({ book }) => (
  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
    <div className="flex items-start space-x-3">
      <div className="w-10 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded flex items-center justify-center text-white font-bold text-sm">
        {book.title.charAt(0)}
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-sm text-gray-900 line-clamp-2">{book.title}</h4>
        <p className="text-xs text-gray-600 mt-1">{book.author}</p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            <FaStar className="w-3 h-3 text-yellow-400 mr-1" />
            <span className="text-xs text-gray-600">{book.rating}</span>
          </div>
          <span className={`px-2 py-1 rounded text-xs ${
            book.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {book.available ? 'Available' : 'Unavailable'}
          </span>
        </div>
      </div>
    </div>
  </div>
);

// Sample Data
const sampleUserData = {
  userData: {
    name: 'Alex Rodriguez',
    avatar: '👨‍💼',
    memberSince: 'March 2022',
    memberId: 'LM-2022-0847'
  },
  userStats: {
    currentlyBorrowed: 3,
    booksReadThisYear: 24,
    dueSoon: 1,
    overdue: 0,
    wishlistItems: 12,
    totalBooksRead: 187,
    averageRating: 4.2,
    outstandingFines: 0
  },
  borrowedBooks: [
    {
      id: 1,
      title: 'The Art of Clean Code',
      author: 'Robert C. Martin',
      borrowDate: 'Nov 15, 2024',
      dueDate: 'Dec 15, 2024'
    },
    {
      id: 2,
      title: 'Design Patterns',
      author: 'Gang of Four',
      borrowDate: 'Nov 20, 2024',
      dueDate: 'Dec 20, 2024'
    },
    {
      id: 3,
      title: 'JavaScript: The Good Parts',
      author: 'Douglas Crockford',
      borrowDate: 'Nov 28, 2024',
      dueDate: 'Dec 28, 2024'
    }
  ],
  recommendations: [
    { id: 1, title: 'You Don\'t Know JS', author: 'Kyle Simpson', rating: 4.7, available: true },
    { id: 2, title: 'Refactoring', author: 'Martin Fowler', rating: 4.5, available: false },
    { id: 3, title: 'System Design Interview', author: 'Alex Xu', rating: 4.8, available: true },
    { id: 4, title: 'The Pragmatic Programmer', author: 'Hunt & Thomas', rating: 4.6, available: true },
    { id: 5, title: 'Clean Architecture', author: 'Robert C. Martin', rating: 4.4, available: false },
    { id: 6, title: 'Effective Java', author: 'Joshua Bloch', rating: 4.9, available: true }
  ]
};

// Main User Dashboard Component
const UserLibraryDashboard = () => (
  <div className="min-h-screen  p-6">
    <UserDashboardContent 
      userData={sampleUserData.userData}
      userStats={sampleUserData.userStats}
      borrowedBooks={sampleUserData.borrowedBooks}
      recommendations={sampleUserData.recommendations}
    />
  </div>
);

export default UserLibraryDashboard;