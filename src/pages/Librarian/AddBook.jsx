import { FaBook, FaUser, FaCalendarAlt, FaHashtag, FaDollarSign, 
         FaImage, FaList, FaBookOpen, FaSave, FaUndo } from 'react-icons/fa';
import { useState } from 'react';

// AddBook Content Component
const AddBookContent = ({ onBookAdd, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    genre: '',
    publicationYear: '',
    publisher: '',
    price: '',
    copiesAvailable: '',
    totalCopies: '',
    description: '',
    bookCover: '',
    language: 'English',
    location: '',
    edition: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
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
    if (!formData.isbn.trim()) newErrors.isbn = 'ISBN is required';
    if (!formData.genre.trim()) newErrors.genre = 'Genre is required';
    if (!formData.publicationYear.trim()) newErrors.publicationYear = 'Publication year is required';
    if (!formData.totalCopies.trim()) newErrors.totalCopies = 'Total copies is required';
    if (!formData.copiesAvailable.trim()) newErrors.copiesAvailable = 'Available copies is required';
    
    if (formData.publicationYear && (isNaN(formData.publicationYear) || formData.publicationYear < 1000 || formData.publicationYear > new Date().getFullYear())) {
      newErrors.publicationYear = 'Please enter a valid year';
    }
    
    if (formData.totalCopies && (isNaN(formData.totalCopies) || formData.totalCopies < 1)) {
      newErrors.totalCopies = 'Total copies must be a positive number';
    }
    
    if (formData.copiesAvailable && (isNaN(formData.copiesAvailable) || formData.copiesAvailable < 0)) {
      newErrors.copiesAvailable = 'Available copies must be a non-negative number';
    }
    
    if (formData.copiesAvailable && formData.totalCopies && parseInt(formData.copiesAvailable) > parseInt(formData.totalCopies)) {
      newErrors.copiesAvailable = 'Available copies cannot exceed total copies';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const bookData = {
        ...formData,
        id: Date.now(), // In real app, this would come from backend
        dateAdded: new Date().toISOString(),
        status: 'available'
      };
      
      onBookAdd?.(bookData);
      
      // Reset form
      setFormData({
        title: '',
        author: '',
        isbn: '',
        genre: '',
        publicationYear: '',
        publisher: '',
        price: '',
        copiesAvailable: '',
        totalCopies: '',
        description: '',
        bookCover: '',
        language: 'English',
        location: '',
        edition: ''
      });
      
    } catch (error) {
      console.error('Error adding book:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      author: '',
      isbn: '',
      genre: '',
      publicationYear: '',
      publisher: '',
      price: '',
      copiesAvailable: '',
      totalCopies: '',
      description: '',
      bookCover: '',
      language: 'English',
      location: '',
      edition: ''
    });
    setErrors({});
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-2xl">
        <div className="flex items-center">
          <FaBookOpen className="w-8 h-8 mr-3" />
          <div>
            <h2 className="text-2xl font-bold mb-2">Add New Book</h2>
            <p className="opacity-90">Add a new book to the library collection</p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-xl shadow-sm border">
        <form onSubmit={handleSubmit} className="p-6">
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

            <FormField
              label="ISBN"
              icon={<FaHashtag className="w-4 h-4 text-indigo-600" />}
              value={formData.isbn}
              onChange={(value) => handleInputChange('isbn', value)}
              placeholder="Enter ISBN number"
              error={errors.isbn}
              required
            />

            <FormField
              label="Genre"
              icon={<FaList className="w-4 h-4 text-indigo-600" />}
              value={formData.genre}
              onChange={(value) => handleInputChange('genre', value)}
              placeholder="Enter genre"
              error={errors.genre}
              required
            />

            <FormField
              label="Publication Year"
              icon={<FaCalendarAlt className="w-4 h-4 text-indigo-600" />}
              value={formData.publicationYear}
              onChange={(value) => handleInputChange('publicationYear', value)}
              placeholder="Enter publication year"
              error={errors.publicationYear}
              type="number"
              required
            />

            <FormField
              label="Publisher"
              icon={<FaBook className="w-4 h-4 text-indigo-600" />}
              value={formData.publisher}
              onChange={(value) => handleInputChange('publisher', value)}
              placeholder="Enter publisher name"
            />

            <FormField
              label="Edition"
              value={formData.edition}
              onChange={(value) => handleInputChange('edition', value)}
              placeholder="Enter edition (e.g., 1st, 2nd)"
            />

            <FormField
              label="Language"
              value={formData.language}
              onChange={(value) => handleInputChange('language', value)}
              type="select"
              options={[
                { value: 'English', label: 'English' },
                { value: 'Spanish', label: 'Spanish' },
                { value: 'French', label: 'French' },
                { value: 'German', label: 'German' },
                { value: 'Other', label: 'Other' }
              ]}
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
              value={formData.copiesAvailable}
              onChange={(value) => handleInputChange('copiesAvailable', value)}
              placeholder="Enter available copies"
              error={errors.copiesAvailable}
              type="number"
              required
            />

            <FormField
              label="Price"
              icon={<FaDollarSign className="w-4 h-4 text-indigo-600" />}
              value={formData.price}
              onChange={(value) => handleInputChange('price', value)}
              placeholder="Enter book price"
              type="number"
              step="0.01"
            />

            <FormField
              label="Location/Shelf"
              value={formData.location}
              onChange={(value) => handleInputChange('location', value)}
              placeholder="Enter shelf location (e.g., A-1-5)"
            />

            {/* Additional Information */}
            <div className="md:col-span-2 mt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
                Additional Information
              </h3>
            </div>

            <div className="md:col-span-2">
              <FormField
                label="Book Cover URL"
                icon={<FaImage className="w-4 h-4 text-indigo-600" />}
                value={formData.bookCover}
                onChange={(value) => handleInputChange('bookCover', value)}
                placeholder="Enter book cover image URL"
              />
            </div>

            <div className="md:col-span-2">
              <FormField
                label="Description"
                value={formData.description}
                onChange={(value) => handleInputChange('description', value)}
                placeholder="Enter book description"
                type="textarea"
                rows={4}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
            >
              <FaUndo className="w-4 h-4 mr-2" />
              Reset
            </button>
            
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
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
  type = 'text', 
  error, 
  required, 
  options,
  rows,
  step 
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          {icon}
        </div>
      )}
      
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={`w-full ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        />
      ) : type === 'select' ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          step={step}
          className={`w-full ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        />
      )}
    </div>
    
    {error && (
      <p className="text-sm text-red-600">{error}</p>
    )}
  </div>
);

// Usage Example
const AddBookPage = () => {
  const handleBookAdd = (bookData) => {
    console.log('New book added:', bookData);
    // Handle successful book addition (e.g., redirect, show success message)
    alert('Book added successfully!');
  };

  const handleCancel = () => {
    // Handle cancel action (e.g., navigate back)
    console.log('Add book cancelled');
  };

  return (
    <AddBookContent 
      onBookAdd={handleBookAdd}
      onCancel={handleCancel}
    />
  );
};

export default AddBookPage;