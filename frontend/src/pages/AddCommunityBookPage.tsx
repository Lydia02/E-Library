import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_ENDPOINTS, getAuthHeaders } from '../config/api';

const AddCommunityBookPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    coverUrl: '',
    genre: '',
    genres: [] as string[],
    pages: '',
    publicationDate: '',
    description: '',
    price: '',
    language: 'English',
    publisher: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState('');

  const genresList = [
    'Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery',
    'Romance', 'Biography', 'History', 'Self-Help', 'Poetry', 'Drama',
    'Horror', 'Adventure', 'Thriller', 'Children', 'Young Adult', 'Philosophy',
    'Literary', 'Historical', 'Contemporary', 'Dystopian', 'Psychological',
    'War', 'Social Issues', 'Memoir', 'Politics', 'African Literature',
    'Classic', 'American Literature', 'Magical Realism', 'Space Opera',
    'Supernatural', 'Epic', 'Magic', 'Mythology', 'Feminism', 'Crime',
    'Gothic', 'Music', 'Inspirational', 'Coming-of-age'
  ];

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleGenreToggle = (genre: string) => {
    setFormData(prev => {
      const genresArray = prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre];

      return {
        ...prev,
        genres: genresArray,
        genre: genresArray[0] || '' // Set primary genre to first selected
      };
    });
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.genres.length === 0) {
      newErrors.genres = 'Please select at least one genre';
    }

    if (formData.pages && (isNaN(Number(formData.pages)) || Number(formData.pages) < 1)) {
      newErrors.pages = 'Pages must be a positive number';
    }

    if (formData.price && (isNaN(Number(formData.price)) || Number(formData.price) < 0)) {
      newErrors.price = 'Price must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('authToken');

      if (!token) {
        setErrors({ submit: 'You must be logged in to add books to the community' });
        return;
      }

      const bookData = {
        title: formData.title,
        author: formData.author,
        description: formData.description,
        genre: formData.genre,
        genres: formData.genres,
        coverUrl: formData.coverUrl || undefined,
        isbn: formData.isbn || undefined,
        pages: formData.pages ? parseInt(formData.pages) : undefined,
        publicationDate: formData.publicationDate || undefined,
        price: formData.price ? parseFloat(formData.price) : undefined,
        language: formData.language || 'English',
        publisher: formData.publisher || undefined,
        rating: 0,
        totalRatings: 0,
        isUserGenerated: true,
        createdBy: user?.id
      };

      const response = await fetch(API_ENDPOINTS.BOOKS, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(bookData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to add book');
      }

      await response.json();

      setSuccessMessage('Book successfully added to the BookHub community! 🎉');

      // Reset form
      setFormData({
        title: '',
        author: '',
        isbn: '',
        coverUrl: '',
        genre: '',
        genres: [],
        pages: '',
        publicationDate: '',
        description: '',
        price: '',
        language: 'English',
        publisher: ''
      });

      // Redirect to books page after 2 seconds
      setTimeout(() => {
        navigate('/books');
      }, 2000);

    } catch (error: unknown) {
      console.error('Error adding community book:', error);
      const err = error as { message?: string };
      setErrors({ submit: err.message || 'Failed to add book. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-vh-100" style={{ background: 'var(--bg-secondary)', paddingTop: 'clamp(4rem, 8vw, 5rem)' }}>
      <div className="container py-4 py-md-5 px-3 px-md-4">
        {/* Header */}
        <div className="row mb-4 mb-md-5">
          <div className="col-12">
            <button
              onClick={() => navigate(-1)}
              className="btn mb-3 mb-md-4"
              style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-light)',
                borderRadius: 'clamp(10px, 2vw, 12px)',
                padding: 'clamp(0.625rem, 1.5vw, 0.75rem) clamp(1.25rem, 3vw, 1.5rem)',
                fontWeight: '600',
                color: 'var(--text-primary)',
                fontSize: 'clamp(0.9rem, 2vw, 1rem)'
              }}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back
            </button>

            <div style={{
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              borderRadius: 'clamp(20px, 4vw, 30px)',
              padding: 'clamp(2.5rem, 5vw, 3.5rem) clamp(1.5rem, 3vw, 2rem)',
              position: 'relative',
              overflow: 'hidden',
              textAlign: 'center'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
                transform: 'translate(30%, -30%)'
              }}></div>
              <div className="position-relative">
                <h1 className="fw-bold mb-2 mb-md-3" style={{ color: 'white', fontSize: 'clamp(1.75rem, 5vw, 3rem)' }}>
                  <i className="bi bi-globe me-2 me-md-3"></i>
                  Add to BookHub Community
                </h1>
                <p className="lead mb-0 mx-auto" style={{ color: 'rgba(255, 255, 255, 0.9)', maxWidth: '650px', fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}>
                  Share a book with the entire BookHub community. This book will be visible to all users on the homepage!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="alert alert-success mb-4" style={{ borderRadius: '16px', fontSize: '1.1rem', padding: '1.25rem' }}>
            <i className="bi bi-check-circle-fill me-2"></i>
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row g-3 g-md-4">
            {/* Main Form */}
            <div className="col-12 col-lg-8">
              <div style={{
                background: 'var(--bg-primary)',
                borderRadius: 'clamp(18px, 3.5vw, 24px)',
                padding: 'clamp(1.5rem, 4vw, 2.5rem)',
                border: '1px solid var(--border-light)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)'
              }}>
                <h3 className="fw-bold mb-3 mb-md-4" style={{ color: 'var(--text-primary)', fontSize: 'clamp(1.25rem, 3vw, 1.5rem)' }}>
                  <i className="bi bi-book me-2" style={{ color: '#16a34a' }}></i>
                  Book Information
                </h3>

                <div className="row g-3">
                  <div className="col-md-8">
                    <label className="form-label fw-bold" style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                      TITLE <span style={{ color: 'var(--danger-color)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter book title"
                      style={{
                        padding: '0.875rem 1.25rem',
                        borderRadius: '12px',
                        border: '2px solid var(--border-color)',
                        fontSize: '1rem'
                      }}
                    />
                    {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-bold" style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                      ISBN
                    </label>
                    <input
                      type="text"
                      name="isbn"
                      className="form-control"
                      value={formData.isbn}
                      onChange={handleInputChange}
                      placeholder="ISBN (optional)"
                      style={{
                        padding: '0.875rem 1.25rem',
                        borderRadius: '12px',
                        border: '2px solid var(--border-color)',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-bold" style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                      COVER IMAGE URL
                    </label>
                    <input
                      type="url"
                      name="coverUrl"
                      className="form-control"
                      value={formData.coverUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/book-cover.jpg (optional)"
                      style={{
                        padding: '0.875rem 1.25rem',
                        borderRadius: '12px',
                        border: '2px solid var(--border-color)',
                        fontSize: '1rem'
                      }}
                    />
                    <div className="form-text text-muted mt-2">
                      <i className="bi bi-info-circle me-2"></i>
                      Try using covers from: https://covers.openlibrary.org/b/isbn/YOUR_ISBN-L.jpg
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold" style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                      AUTHOR <span style={{ color: 'var(--danger-color)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="author"
                      className={`form-control ${errors.author ? 'is-invalid' : ''}`}
                      value={formData.author}
                      onChange={handleInputChange}
                      placeholder="Enter author name"
                      style={{
                        padding: '0.875rem 1.25rem',
                        borderRadius: '12px',
                        border: '2px solid var(--border-color)',
                        fontSize: '1rem'
                      }}
                    />
                    {errors.author && <div className="invalid-feedback">{errors.author}</div>}
                  </div>

                  <div className="col-md-3">
                    <label className="form-label fw-bold" style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                      PAGES
                    </label>
                    <input
                      type="number"
                      name="pages"
                      className={`form-control ${errors.pages ? 'is-invalid' : ''}`}
                      value={formData.pages}
                      onChange={handleInputChange}
                      placeholder="Number"
                      min="1"
                      style={{
                        padding: '0.875rem 1.25rem',
                        borderRadius: '12px',
                        border: '2px solid var(--border-color)',
                        fontSize: '1rem'
                      }}
                    />
                    {errors.pages && <div className="invalid-feedback">{errors.pages}</div>}
                  </div>

                  <div className="col-md-3">
                    <label className="form-label fw-bold" style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                      PRICE ($)
                    </label>
                    <input
                      type="number"
                      name="price"
                      step="0.01"
                      className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      min="0"
                      style={{
                        padding: '0.875rem 1.25rem',
                        borderRadius: '12px',
                        border: '2px solid var(--border-color)',
                        fontSize: '1rem'
                      }}
                    />
                    {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold" style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                      PUBLICATION DATE
                    </label>
                    <input
                      type="date"
                      name="publicationDate"
                      className="form-control"
                      value={formData.publicationDate}
                      onChange={handleInputChange}
                      style={{
                        padding: '0.875rem 1.25rem',
                        borderRadius: '12px',
                        border: '2px solid var(--border-color)',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label fw-bold" style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                      LANGUAGE
                    </label>
                    <input
                      type="text"
                      name="language"
                      className="form-control"
                      value={formData.language}
                      onChange={handleInputChange}
                      placeholder="English"
                      style={{
                        padding: '0.875rem 1.25rem',
                        borderRadius: '12px',
                        border: '2px solid var(--border-color)',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label fw-bold" style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                      PUBLISHER
                    </label>
                    <input
                      type="text"
                      name="publisher"
                      className="form-control"
                      value={formData.publisher}
                      onChange={handleInputChange}
                      placeholder="Publisher name"
                      style={{
                        padding: '0.875rem 1.25rem',
                        borderRadius: '12px',
                        border: '2px solid var(--border-color)',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-bold" style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                      DESCRIPTION <span style={{ color: 'var(--danger-color)' }}>*</span>
                    </label>
                    <textarea
                      name="description"
                      className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Write a compelling description of the book..."
                      style={{
                        padding: '0.875rem 1.25rem',
                        borderRadius: '12px',
                        border: '2px solid var(--border-color)',
                        fontSize: '1rem'
                      }}
                    />
                    {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                  </div>
                </div>
              </div>
            </div>

            {/* Genres Sidebar */}
            <div className="col-12 col-lg-4">
              <div style={{
                background: 'var(--bg-primary)',
                borderRadius: 'clamp(18px, 3.5vw, 24px)',
                padding: 'clamp(1.5rem, 3.5vw, 2rem)',
                border: '1px solid var(--border-light)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
                position: 'sticky',
                top: 'clamp(80px, 15vw, 100px)'
              }}>
                <h3 className="fw-bold mb-3 mb-md-4" style={{ color: 'var(--text-primary)', fontSize: 'clamp(1.15rem, 2.5vw, 1.25rem)' }}>
                  <i className="bi bi-tags me-2" style={{ color: '#16a34a' }}></i>
                  Select Genres <span style={{ color: 'var(--danger-color)' }}>*</span>
                </h3>

                <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '8px' }}>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {genresList.map(genre => (
                      <button
                        key={genre}
                        type="button"
                        onClick={() => handleGenreToggle(genre)}
                        style={{
                          background: formData.genres.includes(genre) ? '#16a34a' : 'var(--bg-secondary)',
                          color: formData.genres.includes(genre) ? 'white' : 'var(--text-primary)',
                          border: formData.genres.includes(genre) ? 'none' : '2px solid var(--border-color)',
                          borderRadius: '8px',
                          padding: '0.5rem 0.875rem',
                          fontWeight: '600',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>

                {errors.genres && (
                  <div className="text-danger small mt-2">{errors.genres}</div>
                )}

                {formData.genres.length > 0 && (
                  <div className="mt-3 p-2" style={{ background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                    <small className="text-muted">Selected: {formData.genres.length} genre(s)</small>
                  </div>
                )}

                <hr style={{ borderColor: 'var(--border-light)', margin: '1.5rem 0' }} />

                {/* Submit Error */}
                {errors.submit && (
                  <div className="alert alert-danger mb-3" style={{ borderRadius: '12px', fontSize: '0.9rem' }}>
                    {errors.submit}
                  </div>
                )}

                {/* Submit Buttons */}
                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-lg"
                    disabled={isSubmitting}
                    style={{
                      background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                      color: 'white',
                      padding: '1rem',
                      borderRadius: '12px',
                      fontWeight: '700',
                      border: 'none',
                      fontSize: '1rem',
                      boxShadow: '0 4px 16px rgba(22, 163, 74, 0.3)'
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Adding...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-globe me-2"></i>
                        Share with Community
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-lg"
                    onClick={() => navigate(-1)}
                    style={{
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      padding: '1rem',
                      borderRadius: '12px',
                      fontWeight: '700',
                      border: '2px solid var(--border-color)'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCommunityBookPage;
