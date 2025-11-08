import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UserBooksService from '../services/userBooksService';
import type { ReadingStatus } from '../types';

const EditBookPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    genre: '',
    pages: '',
    publishedDate: '',
    description: '',
    status: 'read' as ReadingStatus,
    personalRating: 0,
    personalReview: '',
    dateStarted: '',
    dateFinished: ''
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const genres = [
    'Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery',
    'Romance', 'Biography', 'History', 'Self-Help', 'Poetry', 'Drama',
    'Horror', 'Adventure', 'Thriller', 'Children', 'Young Adult', 'Other'
  ];

  const readingStatuses: { value: ReadingStatus; label: string; icon: string; color: string }[] = [
    { value: 'read', label: 'Read', icon: 'bi-check-circle-fill', color: '#16a34a' },
    { value: 'currently-reading', label: 'Currently Reading', icon: 'bi-book-half', color: '#ea580c' },
    { value: 'to-read', label: 'Want to Read', icon: 'bi-bookmark-heart', color: '#ca8a04' }
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (id) {
      loadBookData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, id, navigate]);

  const loadBookData = async () => {
    try {
      setLoading(true);
      const bookData = await UserBooksService.getUserBook(id!);

      setFormData({
        title: bookData.title || bookData.book?.title || '',
        author: bookData.author || bookData.book?.author || '',
        isbn: bookData.book?.isbn || '',
        genre: bookData.book?.genre || '',
        pages: bookData.book?.pages?.toString() || '',
        publishedDate: bookData.book?.publicationDate || '',
        description: bookData.book?.description || '',
        status: bookData.status,
        personalRating: bookData.personalRating || 0,
        personalReview: bookData.personalReview || '',
        dateStarted: bookData.dateStarted?.split('T')[0] || '',
        dateFinished: bookData.dateFinished?.split('T')[0] || ''
      });
    } catch (error) {
      console.error('Error loading book:', error);
      setErrors({ load: 'Failed to load book details' });
    } finally {
      setLoading(false);
    }
  };

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

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      personalRating: rating
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }

    if (formData.pages && (isNaN(Number(formData.pages)) || Number(formData.pages) < 1)) {
      newErrors.pages = 'Pages must be a positive number';
    }

    if (formData.status === 'read' && formData.personalRating === 0) {
      newErrors.personalRating = 'Please rate the book';
    }

    if (formData.dateFinished && formData.dateStarted &&
        new Date(formData.dateFinished) < new Date(formData.dateStarted)) {
      newErrors.dateFinished = 'Finish date cannot be before start date';
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
    try {
      const updateData = {
        title: formData.title,
        author: formData.author,
        description: formData.description || undefined,
        genre: formData.genre || undefined,
        pages: formData.pages ? parseInt(formData.pages) : undefined,
        publishedDate: formData.publishedDate || undefined,
        isbn: formData.isbn || undefined,
        status: formData.status,
        rating: formData.personalRating || undefined,
        notes: formData.personalReview || undefined,
        startDate: formData.dateStarted || undefined,
        finishDate: formData.dateFinished || undefined,
      };

      await UserBooksService.updateUserBook(id!, updateData);

      navigate('/library', {
        state: { message: 'Book updated successfully!' }
      });
    } catch (error) {
      console.error('Error updating book:', error);
      setErrors({ submit: 'Failed to update book. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <button
        key={index}
        type="button"
        className="btn p-0 me-2"
        onClick={() => handleRatingChange(index + 1)}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '2rem',
          color: index < rating ? '#f59e0b' : '#e5e7eb',
          transition: 'all 0.2s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <i className={`bi ${index < rating ? 'bi-star-fill' : 'bi-star'}`}></i>
      </button>
    ));
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="container mt-5 pt-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ background: 'var(--bg-secondary)', paddingTop: 'clamp(4rem, 8vw, 5rem)' }}>
      <div className="container py-4 py-md-5 px-3 px-md-4">
        {/* Header */}
        <div className="row mb-4 mb-md-5">
          <div className="col-12">
            <button
              onClick={() => navigate('/library')}
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
              Back to Library
            </button>

            <div style={{
              background: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)',
              borderRadius: 'clamp(20px, 4vw, 30px)',
              padding: 'clamp(2rem, 5vw, 3rem) clamp(1.5rem, 3vw, 2rem)',
              position: 'relative',
              overflow: 'hidden'
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
                  <i className="bi bi-pencil-square me-2 me-md-3"></i>
                  Edit Book
                </h1>
                <p className="lead mb-0" style={{ color: 'rgba(255, 255, 255, 0.9)', maxWidth: '600px', fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}>
                  Update your book details and reading progress
                </p>
              </div>
            </div>
          </div>
        </div>

        {errors.load && (
          <div className="alert alert-danger mb-4">
            {errors.load}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row g-3 g-md-4">
            {/* Book Information Card */}
            <div className="col-12 col-lg-8">
              <div style={{
                background: 'var(--bg-primary)',
                borderRadius: 'clamp(18px, 3.5vw, 24px)',
                padding: 'clamp(1.5rem, 4vw, 2.5rem)',
                border: '1px solid var(--border-light)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)'
              }}>
                <h3 className="fw-bold mb-3 mb-md-4" style={{ color: 'var(--text-primary)', fontSize: 'clamp(1.25rem, 3vw, 1.5rem)' }}>
                  <i className="bi bi-book me-2" style={{ color: 'var(--primary-color)' }}></i>
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
                      GENRE
                    </label>
                    <select
                      name="genre"
                      className="form-select"
                      value={formData.genre}
                      onChange={handleInputChange}
                      style={{
                        padding: '0.875rem 1.25rem',
                        borderRadius: '12px',
                        border: '2px solid var(--border-color)',
                        fontSize: '1rem'
                      }}
                    >
                      <option value="">Select genre</option>
                      {genres.map(genre => (
                        <option key={genre} value={genre}>{genre}</option>
                      ))}
                    </select>
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
                      placeholder="Number of pages"
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

                  <div className="col-md-6">
                    <label className="form-label fw-bold" style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                      PUBLICATION DATE
                    </label>
                    <input
                      type="date"
                      name="publishedDate"
                      className="form-control"
                      value={formData.publishedDate}
                      onChange={handleInputChange}
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
                      DESCRIPTION
                    </label>
                    <textarea
                      name="description"
                      className="form-control"
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Brief description of the book (optional)"
                      style={{
                        padding: '0.875rem 1.25rem',
                        borderRadius: '12px',
                        border: '2px solid var(--border-color)',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Personal Review Section (if read) */}
              {formData.status === 'read' && (
                <div className="mt-3 mt-md-4" style={{
                  background: 'var(--bg-primary)',
                  borderRadius: 'clamp(18px, 3.5vw, 24px)',
                  padding: 'clamp(1.5rem, 4vw, 2.5rem)',
                  border: '1px solid var(--border-light)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)'
                }}>
                  <h3 className="fw-bold mb-3 mb-md-4" style={{ color: 'var(--text-primary)', fontSize: 'clamp(1.25rem, 3vw, 1.5rem)' }}>
                    <i className="bi bi-star me-2" style={{ color: '#f59e0b' }}></i>
                    Your Review
                  </h3>

                  <div className="mb-4">
                    <label className="form-label fw-bold mb-3" style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                      YOUR RATING <span style={{ color: 'var(--danger-color)' }}>*</span>
                    </label>
                    <div className="d-flex align-items-center">
                      {renderStars(formData.personalRating)}
                      <span style={{ color: 'var(--text-secondary)', marginLeft: '1rem', fontSize: '1.1rem', fontWeight: '600' }}>
                        {formData.personalRating > 0 ? `${formData.personalRating}/5` : 'Click to rate'}
                      </span>
                    </div>
                    {errors.personalRating && (
                      <div className="text-danger small mt-2">{errors.personalRating}</div>
                    )}
                  </div>

                  <div>
                    <label className="form-label fw-bold" style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                      YOUR REVIEW
                    </label>
                    <textarea
                      name="personalReview"
                      className="form-control"
                      rows={4}
                      value={formData.personalReview}
                      onChange={handleInputChange}
                      placeholder="Share your thoughts about this book..."
                      style={{
                        padding: '0.875rem 1.25rem',
                        borderRadius: '12px',
                        border: '2px solid var(--border-color)',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Reading Status Sidebar */}
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
                  <i className="bi bi-bookmark me-2" style={{ color: 'var(--primary-color)' }}></i>
                  Reading Status
                </h3>

                {/* Status Selection */}
                <div className="mb-4">
                  <div className="d-flex flex-column gap-3">
                    {readingStatuses.map(status => (
                      <button
                        key={status.value}
                        type="button"
                        onClick={() => handleInputChange({ target: { name: 'status', value: status.value } } as any)}
                        style={{
                          background: formData.status === status.value ? status.color : 'var(--bg-secondary)',
                          color: formData.status === status.value ? 'white' : 'var(--text-primary)',
                          border: formData.status === status.value ? 'none' : '2px solid var(--border-color)',
                          borderRadius: 'clamp(12px, 2.5vw, 16px)',
                          padding: 'clamp(0.875rem, 2vw, 1rem) clamp(1rem, 2.5vw, 1.25rem)',
                          fontWeight: '700',
                          fontSize: 'clamp(0.875rem, 2vw, 0.95rem)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem'
                        }}
                      >
                        <i className={`bi ${status.icon}`} style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.25rem)' }}></i>
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>

                <hr style={{ borderColor: 'var(--border-light)', margin: '1.5rem 0' }} />

                {/* Date Tracking */}
                <div className="mb-3">
                  <label className="form-label fw-bold" style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                    DATE STARTED
                  </label>
                  <input
                    type="date"
                    name="dateStarted"
                    className="form-control"
                    value={formData.dateStarted}
                    onChange={handleInputChange}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '12px',
                      border: '2px solid var(--border-color)',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold" style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                    DATE FINISHED
                  </label>
                  <input
                    type="date"
                    name="dateFinished"
                    className={`form-control ${errors.dateFinished ? 'is-invalid' : ''}`}
                    value={formData.dateFinished}
                    onChange={handleInputChange}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '12px',
                      border: '2px solid var(--border-color)',
                      fontSize: '0.95rem'
                    }}
                  />
                  {errors.dateFinished && (
                    <div className="invalid-feedback">{errors.dateFinished}</div>
                  )}
                </div>

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
                      background: 'var(--gradient-primary)',
                      color: 'white',
                      padding: '1rem',
                      borderRadius: '12px',
                      fontWeight: '700',
                      border: 'none',
                      fontSize: '1rem',
                      boxShadow: '0 4px 16px rgba(234, 88, 12, 0.3)'
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-lg me-2"></i>
                        Update Book
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-lg"
                    onClick={() => navigate('/library')}
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

export default EditBookPage;
