import React, { useState, useEffect } from 'react';
import {
  FaBook, FaUser, FaList, FaImage, FaBookOpen, FaSave, FaUndo, FaEdit,
  FaTrash, FaExclamationTriangle, FaPlus, FaTimes, FaChevronDown
} from 'react-icons/fa';

import { updateBook, deleteBook, getBookDetails, addBook, getAllBooks } from '../../services/librarianApi';

// Category options based on the enum values
const CATEGORY_OPTIONS = [
  "Science",
  "Fantasy",
  "Horror",
  "Mystery",
  "Thriller",
  "Crime",
  "Drama",
  "Programming",
  "Fiction",
  "Psychology"
];
// Add this component definition before the BookManagementPage component
const SelectField = ({
  label,
  icon,
  value,
  onChange,
  options,
  placeholder,
  error,
  required = false
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`block w-full ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <FaChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

// Main Book Management Page Component
const BookManagementPage = () => {
  const [activeTab, setActiveTab] = useState('add');
  const [selectedBook, setSelectedBook] = useState(null);

  const tabs = [
    { id: 'add', label: 'Add Book', icon: <FaPlus className="w-4 h-4" /> },
    { id: 'update', label: 'Update Book', icon: <FaEdit className="w-4 h-4" /> },
    { id: 'delete', label: 'Delete Book', icon: <FaTrash className="w-4 h-4" /> }
  ];

  const handleBookSelect = (bookData) => {
    setSelectedBook(bookData);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'add':
        return (
          <AddBookContent
            onBookAdd={(bookData) => {
              console.log('New book added:', bookData);
              alert('Book added successfully!');
            }}
            onCancel={() => setActiveTab('add')}
          />
        );
      case 'update':
        return (
          <UpdateBookContent
            bookId={selectedBook?._id}
            initialBookData={selectedBook}
            onBookUpdate={(updatedBookData) => {
              console.log('Book updated:', updatedBookData);
              setSelectedBook(null);
            }}
            onCancel={() => {
              setSelectedBook(null);
              setActiveTab('add');
            }}
          />
        );
      case 'delete':
        return (
          <DeleteBookContent
            bookId={selectedBook?._id}
            bookData={selectedBook}
            onBookDelete={(deletedBookId) => {
              console.log('Book deleted:', deletedBookId);
              setSelectedBook(null);
              setActiveTab('add');
            }}
            onCancel={() => {
              setSelectedBook(null);
              setActiveTab('add');
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="  p-4 rounded-2xl">
            <div className="flex items-center">
              <FaBookOpen className="w-10 h-10 mr-4" />
              <div>
                <h1 className="text-3xl font-bold mb-2">Book Management</h1>
                <p className="opacity-90">Add, update, or delete books in your library collection</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border mb-6">
          <div className="p-1">
            <nav className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id === 'add') {
                      setSelectedBook(null);
                    }
                  }}
                  className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === tab.id
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                  {tab.icon}
                  <span className="ml-2">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Book Selection for Update/Delete */}
        {(activeTab === 'update' || activeTab === 'delete') && !selectedBook && (
          <BookSelector
            onBookSelect={handleBookSelect}
            mode={activeTab}
          />
        )}

        {/* Tab Content */}
        {(activeTab === 'add' || selectedBook) && (
          <div className="bg-white rounded-xl shadow-sm">
            {renderTabContent()}
          </div>
        )}
      </div>
    </div>
  );
};

// Book Selector Component for Update/Delete modes
const BookSelector = ({ onBookSelect, mode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAllBooks();
      console.log("API Response:", response.data); // ✅ confirm shape
      setBooks(response.data.data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Failed to load books. Please try again.');
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBooks = Array.isArray(books)
    ? books.filter(book =>
      book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];



  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-600">Loading books...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="text-center py-8">
          <FaExclamationTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchBooks}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Select a Book to {mode === 'update' ? 'Update' : 'Delete'}
      </h3>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search books by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <FaBook className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Book List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredBooks.map((book) => (
          <div
            key={book._id}
            onClick={() => onBookSelect(book)}
            className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{book.title}</h4>
                <p className="text-sm text-gray-600">by {book.author}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Category: {book.category || 'N/A'} | Available: {book.availableCopies || 0}/{book.totalCopies || 0}
                </p>
              </div>
              <button className={`px-3 py-1 rounded text-sm font-medium ${mode === 'update'
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}>
                {mode === 'update' ? 'Update' : 'Delete'}
              </button>
            </div>
          </div>
        ))}

        {Array.isArray(filteredBooks) && filteredBooks.length === 0 && !isLoading && (
          <div className="text-center py-8 text-gray-500">
            {Array.isArray(books) && books.length === 0
              ? 'No books found in the library.'
              : 'No books found matching your search.'}
          </div>
        )}

      </div>
    </div>
  );
};

// Add Book Content Component
const AddBookContent = ({ onBookAdd, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    totalCopies: '',
    availableCopies: '',
    coverImage: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.author.trim()) newErrors.author = 'Author is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.totalCopies.trim()) newErrors.totalCopies = 'Total copies is required';

    if (formData.totalCopies && (isNaN(formData.totalCopies) || formData.totalCopies < 1)) {
      newErrors.totalCopies = 'Total copies must be a positive number';
    }

    if (formData.availableCopies && (isNaN(formData.availableCopies) || formData.availableCopies < 0)) {
      newErrors.availableCopies = 'Available copies must be a non-negative number';
    }

    if (formData.availableCopies && formData.totalCopies && parseInt(formData.availableCopies) > parseInt(formData.totalCopies)) {
      newErrors.availableCopies = 'Available copies cannot exceed total copies';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('author', formData.author);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('totalCopies', formData.totalCopies);

      if (formData.availableCopies) {
        formDataToSend.append('availableCopies', formData.availableCopies);
      }

      if (formData.coverImage) {
        formDataToSend.append('coverImage', formData.coverImage); // ✅ must match multer
      }

      const response = await addBook(formDataToSend);

      onBookAdd?.(response.data);

      setFormData({
        title: '',
        author: '',
        category: '',
        totalCopies: '',
        availableCopies: '',
        coverImage: null
      });

      const fileInput = document.getElementById('coverImage');
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Error adding book:', error);

      if (error.response?.data?.error) {
        alert(`Error: ${error.response.data.error}`);
      } else {
        alert('Failed to add book. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      author: '',
      category: '',
      totalCopies: '',
      availableCopies: '',
      coverImage: null
    });
    setErrors({});

    const fileInput = document.getElementById('coverImage');
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Add New Book</h2>
        <p className="text-gray-600">Add a new book to the library collection</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Basic Information */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
              Basic Information
            </h3>
          </div>

          <FormField
            label="Book Title"
            icon={<FaBook className="w-4 h-4 text-indigo-600" />}
            value={formData.title}
            onChange={(value) => handleInputChange('title', value)}
            placeholder="Enter book title"
            error={errors.title}
            required
          />

          <FormField
            label="Author"
            icon={<FaUser className="w-4 h-4 text-indigo-600" />}
            value={formData.author}
            onChange={(value) => handleInputChange('author', value)}
            placeholder="Enter author name"
            error={errors.author}
            required
          />

          <SelectField
            label="Category"
            icon={<FaList className="w-4 h-4 text-indigo-600" />}
            value={formData.category}
            onChange={(value) => handleInputChange('category', value)}
            options={CATEGORY_OPTIONS}
            placeholder="Select book category"
            error={errors.category}
            required
          />

          {/* Inventory Information */}
          <div className="md:col-span-2 mt-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
              Inventory Information
            </h3>
          </div>

          <FormField
            label="Total Copies"
            value={formData.totalCopies}
            onChange={(value) => handleInputChange('totalCopies', value)}
            placeholder="Enter total number of copies"
            error={errors.totalCopies}
            type="number"
            required
          />

          <FormField
            label="Available Copies"
            value={formData.availableCopies}
            onChange={(value) => handleInputChange('availableCopies', value)}
            placeholder="Enter available copies (optional - defaults to total copies)"
            error={errors.availableCopies}
            type="number"
          />

          {/* Cover Image */}
          <div className="md:col-span-2 mt-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
              Book Cover Image
            </h3>
          </div>

          <div className="md:col-span-2">
            <FormField
              label="Cover Image"
              icon={<FaImage className="w-4 h-4 text-indigo-600" />}
              value=""
              onChange={(file) => handleInputChange('coverImage', file)}
              placeholder="Select book cover image"
              type="file"
              accept="image/*"
              error={errors.coverImage}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
            disabled={isSubmitting}
          >
            <FaUndo className="w-4 h-4 mr-2" />
            Reset
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSave className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Adding Book...' : 'Add Book'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Update Book Content Component
const UpdateBookContent = ({ bookId, initialBookData, onBookUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    totalCopies: '',
    availableCopies: '',
    coverImage: null
  });

  const [originalData, setOriginalData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialBookData) {
      const bookData = {
        title: initialBookData.title || '',
        author: initialBookData.author || '',
        category: initialBookData.category || '',
        totalCopies: initialBookData.totalCopies?.toString() || '',
        availableCopies: initialBookData.availableCopies?.toString() || '',
        coverImage: null
      };
      setFormData(bookData);
      setOriginalData(bookData);
    } else if (bookId) {
      fetchBookData();
    }
  }, [bookId, initialBookData]);

  const fetchBookData = async () => {
    setIsLoading(true);
    try {
      const response = await getBookDetails(bookId);
      const book = response.data.book || response.data;

      const bookData = {
        title: book.title || '',
        author: book.author || '',
        category: book.category || '',
        totalCopies: book.totalCopies?.toString() || '',
        availableCopies: book.availableCopies?.toString() || '',
        coverImage: null
      };

      setFormData(bookData);
      setOriginalData(bookData);
    } catch (error) {
      console.error('Error fetching book data:', error);
      alert('Failed to load book data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.author.trim()) newErrors.author = 'Author is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.totalCopies.trim()) newErrors.totalCopies = 'Total copies is required';

    if (formData.totalCopies && (isNaN(formData.totalCopies) || formData.totalCopies < 1)) {
      newErrors.totalCopies = 'Total copies must be a positive number';
    }

    if (formData.availableCopies && (isNaN(formData.availableCopies) || formData.availableCopies < 0)) {
      newErrors.availableCopies = 'Available copies must be a non-negative number';
    }

    if (formData.availableCopies && formData.totalCopies && parseInt(formData.availableCopies) > parseInt(formData.totalCopies)) {
      newErrors.availableCopies = 'Available copies cannot exceed total copies';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('author', formData.author);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('totalCopies', formData.totalCopies);

      if (formData.availableCopies) {
        formDataToSend.append('availableCopies', formData.availableCopies);
      }

      if (formData.coverImage) {
        formDataToSend.append('coverImage', formData.coverImage);
      }

      const response = await updateBook(bookId || initialBookData._id, formDataToSend);

      onBookUpdate?.(response.data);
      alert('Book updated successfully!');

    } catch (error) {
      console.error('Error updating book:', error);

      if (error.response?.data?.error) {
        alert(`Error: ${error.response.data.error}`);
      } else {
        alert('Failed to update book. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({ ...originalData });
    setErrors({});

    const fileInput = document.getElementById('update_coverImage');
    if (fileInput) fileInput.value = '';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Update Book</h2>
          <p className="text-gray-600">Modify book information and inventory</p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Basic Information */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
              Basic Information
            </h3>
          </div>

          <FormField
            label="Book Title"
            icon={<FaBook className="w-4 h-4 text-blue-600" />}
            value={formData.title}
            onChange={(value) => handleInputChange('title', value)}
            placeholder="Enter book title"
            error={errors.title}
            required
          />

          <FormField
            label="Author"
            icon={<FaUser className="w-4 h-4 text-blue-600" />}
            value={formData.author}
            onChange={(value) => handleInputChange('author', value)}
            placeholder="Enter author name"
            error={errors.author}
            required
          />

          <SelectField
            label="Category"
            icon={<FaList className="w-4 h-4 text-blue-600" />}
            value={formData.category}
            onChange={(value) => handleInputChange('category', value)}
            options={CATEGORY_OPTIONS}
            placeholder="Select book category"
            error={errors.category}
            required
          />

          {/* Inventory Information */}
          <div className="md:col-span-2 mt-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
              Inventory Information
            </h3>
          </div>

          <FormField
            label="Total Copies"
            value={formData.totalCopies}
            onChange={(value) => handleInputChange('totalCopies', value)}
            placeholder="Enter total number of copies"
            error={errors.totalCopies}
            type="number"
            required
          />

          <FormField
            label="Available Copies"
            value={formData.availableCopies}
            onChange={(value) => handleInputChange('availableCopies', value)}
            placeholder="Enter available copies"
            error={errors.availableCopies}
            type="number"
          />

          {/* Cover Image */}
          <div className="md:col-span-2 mt-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
              Update Cover Image
            </h3>
          </div>

          <div className="md:col-span-2">
            <FormField
              label="Cover Image"
              icon={<FaImage className="w-4 h-4 text-blue-600" />}
              value=""
              onChange={(file) => handleInputChange('coverImage', file)}
              placeholder="Select new cover image (optional)"
              type="file"
              accept="image/*"
              error={errors.coverImage}
              id="update_coverImage"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
            disabled={isSubmitting}
          >
            <FaUndo className="w-4 h-4 mr-2" />
            Reset
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSave className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Updating Book...' : 'Update Book'}
          </button>
        </div>
      </form>
    </div>
  );
};
// Delete Book Content Component
const DeleteBookContent = ({ bookId, bookData, onBookDelete, onCancel }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [bookInfo, setBookInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (bookData) {
      setBookInfo(bookData);
    } else if (bookId) {
      fetchBookData();
    }
  }, [bookId, bookData]);

  const fetchBookData = async () => {
    setIsLoading(true);
    try {
      const response = await getBookDetails(bookId);
      setBookInfo(response.data.book || response.data);
    } catch (error) {
      console.error('Error fetching book data:', error);
      alert('Failed to load book data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteBook(bookId || bookData._id);
      onBookDelete?.(bookId || bookData._id);
      alert('Book deleted successfully!');
    } catch (error) {
      console.error('Error deleting book:', error);

      if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert('Failed to delete book. Please try again.');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!bookInfo) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Book information not available.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Delete Book</h2>
          <p className="text-gray-600">Remove book from library collection</p>
        </div>
        <button onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <FaExclamationTriangle className="h-5 w-5 text-red-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Warning</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>This action will permanently delete the book from the library system. This cannot be undone.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6 mb-6">
        <div className="flex items-start">
          {bookInfo.coverImagePath ? (
            <img
              src={bookInfo.coverImagePath}
              alt={`${bookInfo.title} cover`}
              className="w-24 h-32 object-cover rounded mr-6"
            />
          ) : (
            <div className="w-24 h-32 bg-gray-200 rounded mr-6 flex items-center justify-center">
              <FaImage className="w-8 h-8 text-gray-400" />
            </div>
          )}

          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">{bookInfo.title}</h3>
            <p className="text-gray-600 mb-2">by {bookInfo.author}</p>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="text-gray-800">{bookInfo.category || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Copies</p>
                <p className="text-gray-800">
                  Available: {bookInfo.availableCopies || 0} / Total: {bookInfo.totalCopies || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          disabled={isDeleting}
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaTrash className="w-4 h-4 mr-2" />
          {isDeleting ? 'Deleting...' : 'Delete Book'}
        </button>
      </div>
    </div>
  );
};

// Reusable Form Field Component
const FormField = ({
  label,
  icon,
  value,
  onChange,
  placeholder,
  error,
  type = 'text',
  required = false,
  accept,
  id
}) => {
  const handleChange = (e) => {
    if (type === 'file') {
      onChange(e.target.files[0]);
    } else {
      onChange(e.target.value);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        {type === 'file' ? (
          <div className="flex items-center">
            <input
              id={id}
              type="file"
              onChange={handleChange}
              accept={accept}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
        ) : (
          <input
            type={type}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
          />
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default BookManagementPage;