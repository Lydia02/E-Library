import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UserBooksService from '../services/userBooksService';
import type { UserBook } from '../types';

const LibraryPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Generic book cover generator with simple colors (no Unicode)

  const getGenericBookCover = (title: string, genre?: string) => {
    const coverStyles = [
      { primary: '#2c3e50', secondary: '#34495e', accent: '#e74c3c' },
      { primary: '#8e44ad', secondary: '#9b59b6', accent: '#f39c12' },
      { primary: '#2980b9', secondary: '#3498db', accent: '#e67e22' },
      { primary: '#27ae60', secondary: '#2ecc71', accent: '#e74c3c' },
      { primary: '#d35400', secondary: '#e67e22', accent: '#2ecc71' },
      { primary: '#c0392b', secondary: '#e74c3c', accent: '#f1c40f' },
      { primary: '#7f8c8d', secondary: '#95a5a6', accent: '#9b59b6' }
    ];
    
    // Use title's first character code to select a style (deterministic)
    const styleIndex = (title.charCodeAt(0) || 0) % coverStyles.length;
    const style = coverStyles[styleIndex];
    
    // Split title into lines for better formatting
    const words = title.split(' ');
    let titleLines = [];
    let currentLine = '';
    
    for (const word of words) {
      if (currentLine.length + word.length + 1 <= 12) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) titleLines.push(currentLine);
        currentLine = word;
        if (titleLines.length >= 3) break; // Max 3 lines
      }
    }
    if (currentLine) titleLines.push(currentLine);
    
    // Create a realistic book cover design
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="240" height="360" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="coverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${style.primary};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${style.secondary};stop-opacity:1" />
          </linearGradient>
          <linearGradient id="shine" x1="0%" y1="0%" x2="30%" y2="30%">
            <stop offset="0%" style="stop-color:white;stop-opacity:0.3" />
            <stop offset="100%" style="stop-color:white;stop-opacity:0" />
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="2" dy="4" stdDeviation="3" flood-opacity="0.3"/>
          </filter>
        </defs>
        
        <!-- Book spine shadow -->
        <rect x="0" y="0" width="240" height="360" fill="url(#coverGrad)" filter="url(#shadow)" rx="8"/>
        
        <!-- Main cover -->
        <rect x="8" y="8" width="224" height="344" fill="url(#coverGrad)" rx="6"/>
        
        <!-- Inner border -->
        <rect x="16" y="16" width="208" height="328" fill="none" stroke="${style.accent}" stroke-width="2" rx="4" opacity="0.8"/>
        
        <!-- Title area background -->
        <rect x="24" y="80" width="192" height="120" fill="white" opacity="0.1" rx="4"/>
        
        <!-- Title text -->
        ${titleLines.map((line, index) => 
          `<text x="120" y="${120 + (index * 24)}" font-family="Georgia, serif" font-size="16" font-weight="bold" text-anchor="middle" fill="white">${line}</text>`
        ).join('')}
        
        <!-- Genre badge -->
        <rect x="32" y="220" width="${Math.min((genre || 'Fiction').length * 8 + 16, 176)}" height="24" fill="${style.accent}" rx="12"/>
        <text x="40" y="236" font-family="Arial, sans-serif" font-size="11" font-weight="600" fill="white">${(genre || 'Fiction').toUpperCase()}</text>
        
        <!-- Decorative elements -->
        <circle cx="60" cy="300" r="20" fill="${style.accent}" opacity="0.2"/>
        <circle cx="180" cy="280" r="15" fill="white" opacity="0.1"/>
        <rect x="32" y="260" width="176" height="1" fill="white" opacity="0.3"/>
        
        <!-- Shine effect -->
        <rect x="8" y="8" width="224" height="344" fill="url(#shine)" rx="6"/>
      </svg>
    `)}`;
  };

  const [userBooks, setUserBooks] = useState<UserBook[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<UserBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'author' | 'rating'>('title');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<UserBook | null>(null);

  // Show success message if coming from add book page
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      // Clear the message after 5 seconds
      setTimeout(() => setMessage(''), 5000);
    }
  }, [location.state]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserBooks();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    filterAndSortBooks();
  }, [userBooks, activeFilter, searchQuery, sortBy]);

  const fetchUserBooks = async () => {
    setLoading(true);
    try {
      console.log('Fetching user books...');
      // Fetch user's own books using UserBooksService
      const userBooksData = await UserBooksService.getUserBooks();
      console.log('Received user books data:', userBooksData);
      const booksArray = Array.isArray(userBooksData) ? userBooksData : [];
      console.log('Processed books array:', booksArray);
      console.log('Books count:', booksArray.length);
      setUserBooks(booksArray);
    } catch (error) {
      console.error('Error fetching user books:', error);
      // Show empty state or error message
      setUserBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortBooks = () => {
    let filtered = [...userBooks];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(book =>
        book.title?.toLowerCase().includes(query) ||
        book.author?.toLowerCase().includes(query)
      );
    }



    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          const titleA = a.title || a.book?.title || '';
          const titleB = b.title || b.book?.title || '';
          return titleA.localeCompare(titleB);
        case 'author':
          const authorA = a.author || a.book?.author || '';
          const authorB = b.author || b.book?.author || '';
          return authorA.localeCompare(authorB);
        case 'rating':
          return (b.personalRating || 0) - (a.personalRating || 0);
        default:
          return (a.title || a.book?.title || '').localeCompare(b.title || b.book?.title || '');
      }
    });

    setFilteredBooks(filtered);
  };



  const renderStars = (rating?: number) => {
    if (!rating) return null;
    
    return (
      <div className="d-flex">
        {Array.from({ length: 5 }, (_, index) => (
          <i
            key={index}
            className={`bi ${index < rating ? 'bi-star-fill' : 'bi-star'} text-warning`}
            style={{ fontSize: '0.9rem' }}
          ></i>
        ))}
      </div>
    );
  };

  const handleDeleteBook = (bookId: string) => {
    // Set the book ID for delete confirmation modal
    setDeleteConfirm(bookId);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      await UserBooksService.deleteUserBook(deleteConfirm);
      setMessage('Book deleted successfully!');
      setTimeout(() => setMessage(''), 5000);
      // Close modal and refresh the book list
      setDeleteConfirm(null);
      await fetchUserBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
      setMessage('Failed to delete book. Please try again.');
      setTimeout(() => setMessage(''), 5000);
      setDeleteConfirm(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const handleEditBook = (bookId: string) => {
    // Navigate to edit page (we'll create this route)
    navigate(`/edit-book/${bookId}`);
  };

  const getStatsCounts = () => {
    return {
      all: userBooks.length
    };
  };

  if (!isAuthenticated) {
    return (
      <div className="container mt-5 pt-5">
        <div className="row min-vh-75 align-items-center justify-content-center">
          <div className="col-lg-6 text-center">
            <div
              className="rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center"
              style={{
                width: '120px',
                height: '120px',
                background: 'var(--gradient-primary)',
              }}
            >
              <i className="bi bi-book text-white" style={{ fontSize: '4rem' }}></i>
            </div>
            <h2 className="display-5 fw-bold mb-3">Login to View Your Library</h2>
            <p className="lead text-muted mb-4">
              Sign in to manage your personal book collection
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <Link to="/login" className="btn btn-primary btn-lg">
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Login
              </Link>
              <Link to="/signup" className="btn btn-outline-primary btn-lg">
                <i className="bi bi-person-plus me-2"></i>
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mt-5 pt-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading library...</span>
          </div>
        </div>
      </div>
    );
  }

  const stats = getStatsCounts();

  return (
    <div className="container-fluid px-2 px-sm-3 px-md-4 mt-3 mt-md-5 pt-3 pt-md-5" style={{ maxWidth: '1200px' }}>
      {/* Success Message */}
      {message && (
        <div className="alert alert-success alert-dismissible fade show mb-4">
          <i className="bi bi-check-circle me-2"></i>
          {message}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setMessage('')}
          ></button>
        </div>
      )}

      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div 
            className="card border-0 text-white"
            style={{ background: 'var(--gradient-primary)' }}
          >
            <div className="card-body p-3 p-md-4">
              <div className="row align-items-center">
                <div className="col-12 col-md-8 mb-3 mb-md-0">
                  <h1 className="fw-bold mb-2" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
                    <i className="bi bi-book me-2"></i>
                    My Library
                  </h1>
                  <p className="mb-0 opacity-75" style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>
                    Manage your personal book collection and reading progress
                  </p>
                </div>
                <div className="col-12 col-md-4">
                  <div className="d-flex gap-2 justify-content-start justify-content-md-end flex-wrap">
                    <button 
                      onClick={fetchUserBooks}
                      className="btn btn-outline-light"
                      disabled={loading}
                      style={{ minWidth: 'auto' }}
                    >
                      <i className="bi bi-arrow-clockwise me-1 me-sm-2"></i>
                      <span className="d-none d-sm-inline">
                        {loading ? 'Loading...' : 'Refresh'}
                      </span>
                      <span className="d-inline d-sm-none">
                        {loading ? '...' : ''}
                      </span>
                    </button>
                    <Link to="/add-book" className="btn btn-light" style={{ minWidth: 'auto' }}>
                      <i className="bi bi-plus-lg me-1 me-sm-2"></i>
                      <span className="d-none d-sm-inline">Add Book</span>
                      <span className="d-inline d-sm-none">Add</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-12 mb-3">
          <div className="card border-0 shadow-sm text-center">
            <div className="card-body">
              <div className="display-4 fw-bold text-primary mb-2">{stats.all}</div>
              <p className="text-muted mb-0">Books in Library</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="row align-items-center">
                {/* Status Filters */}
                <div className="col-md-6 mb-3 mb-md-0">
                  <div className="btn-group" role="group">
                    <input
                      type="radio"
                      className="btn-check"
                      name="statusFilter"
                      id="filter-all"
                      checked={activeFilter === 'all'}
                      onChange={() => setActiveFilter('all')}
                    />
                    <label className="btn btn-outline-primary" htmlFor="filter-all">
                      All ({stats.all})
                    </label>
                  </div>
                </div>

                {/* Search and Sort */}
                <div className="col-md-6">
                  <div className="row">
                    <div className="col-8">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search books..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="col-4">
                      <select
                        className="form-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                      >
                        <option value="title">Title A-Z</option>
                        <option value="author">Author A-Z</option>
                        <option value="rating">Rating (High to Low)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <div className="row">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => {
            const bookTitle = book.title || book.book?.title || 'Untitled';
            const bookAuthor = book.author || book.book?.author || 'Unknown Author';
            const bookGenre = book.genre || book.book?.genre;
            
            const bookRating = book.personalRating;
            const bookReview = book.personalReview;

            return (
              <div key={book.id} className="col-md-6 col-lg-4 mb-4">
                <div className="card border-0 h-100" style={{
                  boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                  borderRadius: '16px',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }} 
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                }}>
                  <div className="position-relative">
                    <img
                      src={(() => {
                        // Prioritize custom cover image URL
                        if (book.coverImage && book.coverImage.trim()) {
                          console.log('Using custom cover:', book.coverImage);
                          return book.coverImage;
                        }
                        // Then try database cover URLs
                        if (book.book?.coverUrl && book.book.coverUrl.trim()) {
                          console.log('Using book coverUrl:', book.book.coverUrl);
                          return book.book.coverUrl;
                        }
                        if (book.book?.coverImage && book.book.coverImage.trim()) {
                          console.log('Using book coverImage:', book.book.coverImage);
                          return book.book.coverImage;
                        }
                        // Fall back to generated cover
                        console.log('Using generated cover for:', bookTitle);
                        return getGenericBookCover(bookTitle, bookGenre);
                      })()}
                      className="card-img-top"
                      alt={bookTitle}
                      style={{ 
                        height: '250px', 
                        objectFit: 'cover', 
                        cursor: 'pointer',
                        borderRadius: '16px 16px 0 0',
                        transition: 'transform 0.3s ease'
                      }}
                      onClick={() => setSelectedBook(book)}
                      onError={(e) => {
                        console.log('Image failed to load, falling back to generated cover');
                        // If any image fails to load, fallback to generic cover
                        const target = e.currentTarget as HTMLImageElement;
                        target.src = getGenericBookCover(bookTitle, bookGenre);
                      }}
                      onLoad={(e) => {
                        console.log('Image loaded successfully:', (e.currentTarget as HTMLImageElement).src);
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.02)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    />
                  </div>
                  <div className="card-body d-flex flex-column" style={{ padding: '1.5rem' }}>
                    <h5 className="card-title mb-2" style={{
                      fontWeight: '600',
                      color: '#2c3e50',
                      fontSize: '1.1rem',
                      lineHeight: '1.3'
                    }}>{bookTitle}</h5>
                    <p className="text-muted mb-3" style={{
                      fontSize: '0.9rem',
                      fontStyle: 'italic'
                    }}>by {bookAuthor}</p>

                    {bookRating && (
                      <div className="mb-2">
                        <div className="d-flex align-items-center">
                          {renderStars(bookRating)}
                          <small className="text-muted ms-2">({bookRating}/5)</small>
                        </div>
                      </div>
                    )}

                    {bookReview && (
                      <p className="text-muted small mb-3" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {bookReview}
                      </p>
                    )}

                    <div className="mt-auto">
                      <div className="d-flex flex-column gap-2">
                        <button
                          onClick={() => setSelectedBook(book)}
                          className="btn btn-primary btn-sm w-100"
                          style={{
                            background: 'linear-gradient(45deg, #007bff, #0056b3)',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '500'
                          }}
                        >
                          <i className="bi bi-eye me-2"></i>
                          View Details
                        </button>
                        <div className="d-flex gap-2">
                          <button
                            onClick={() => handleEditBook(book.id)}
                            className="btn btn-sm flex-fill"
                            style={{
                              background: 'linear-gradient(45deg, #28a745, #20c997)',
                              border: 'none',
                              color: 'white',
                              borderRadius: '8px',
                              fontWeight: '500'
                            }}
                          >
                            <i className="bi bi-pencil me-1"></i>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBook(book.id)}
                            className="btn btn-sm flex-fill"
                            style={{
                              background: 'linear-gradient(45deg, #dc3545, #c82333)',
                              border: 'none',
                              color: 'white',
                              borderRadius: '8px',
                              fontWeight: '500'
                            }}
                          >
                            <i className="bi bi-trash me-1"></i>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <i className="bi bi-book display-1 text-muted"></i>
                <h5 className="mt-3">
                  {activeFilter === 'all' 
                    ? 'Your library is empty'
                    : 'No books found'
                  }
                </h5>
                <p className="text-muted mb-4">
                  {searchQuery
                    ? `No books match your search "${searchQuery}"`
                    : activeFilter === 'all'
                    ? 'Books you view will appear here for easy access!'
                    : 'No books found for your current filter.'
                  }
                </p>
                <Link to="/books" className="btn btn-primary">
                  <i className="bi bi-search me-2"></i>
                  Discover Books
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Book Preview Modal */}
      {selectedBook && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Book Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedBook(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-4">
                    <img
                      src={(() => {
                        const bookTitle = selectedBook.title || selectedBook.book?.title || 'Untitled';
                        const bookGenre = selectedBook.genre || selectedBook.book?.genre;
                        
                        // Prioritize custom cover image URL
                        if (selectedBook.coverImage && selectedBook.coverImage.trim()) {
                          return selectedBook.coverImage;
                        }
                        // Then try database cover URLs
                        if (selectedBook.book?.coverUrl && selectedBook.book.coverUrl.trim()) {
                          return selectedBook.book.coverUrl;
                        }
                        if (selectedBook.book?.coverImage && selectedBook.book.coverImage.trim()) {
                          return selectedBook.book.coverImage;
                        }
                        // Fall back to generated cover
                        return getGenericBookCover(bookTitle, bookGenre);
                      })()}
                      className="img-fluid rounded"
                      alt={selectedBook.title || selectedBook.book?.title}
                      style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
                      onError={(e) => {
                        // If image fails to load, fallback to generic cover
                        const target = e.currentTarget as HTMLImageElement;
                        const bookTitle = selectedBook.title || selectedBook.book?.title || 'Untitled';
                        const bookGenre = selectedBook.genre || selectedBook.book?.genre;
                        target.src = getGenericBookCover(bookTitle, bookGenre);
                      }}
                    />
                  </div>
                  <div className="col-md-8">
                    <h3>{selectedBook.title || selectedBook.book?.title}</h3>
                    <p className="text-muted mb-3">by {selectedBook.author || selectedBook.book?.author}</p>
                    
                    {(selectedBook.genre || selectedBook.book?.genre) && (
                      <p><strong>Genre:</strong> {selectedBook.genre || selectedBook.book?.genre}</p>
                    )}
                    
                    <p><strong>Reading Status:</strong> 
                      <span className={`badge ms-2 ${
                        selectedBook.status === 'read' ? 'bg-success' :
                        selectedBook.status === 'currently-reading' ? 'bg-warning text-dark' :
                        'bg-secondary'
                      }`}>
                        {selectedBook.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </p>

                    {selectedBook.personalRating && (
                      <div className="mb-3">
                        <strong>My Rating:</strong>
                        <div className="d-flex align-items-center mt-1">
                          {renderStars(selectedBook.personalRating)}
                          <span className="ms-2">({selectedBook.personalRating}/5)</span>
                        </div>
                      </div>
                    )}

                    {selectedBook.dateStarted && (
                      <p><strong>Started Reading:</strong> {new Date(selectedBook.dateStarted).toLocaleDateString()}</p>
                    )}

                    {selectedBook.dateFinished && (
                      <p><strong>Finished Reading:</strong> {new Date(selectedBook.dateFinished).toLocaleDateString()}</p>
                    )}

                    {selectedBook.personalReview && (
                      <div className="mt-3">
                        <strong>My Review:</strong>
                        <p className="mt-2 p-3 bg-light rounded">{selectedBook.personalReview}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedBook(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    handleEditBook(selectedBook.id);
                    setSelectedBook(null);
                  }}
                >
                  <i className="bi bi-pencil me-2"></i>
                  Edit Book
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div 
          className="modal fade show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={cancelDelete}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content" style={{
              borderRadius: '20px',
              border: 'none',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}>
              <div className="modal-header border-0 pb-0" style={{
                background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
                color: 'white',
                padding: '2rem 2rem 1rem'
              }}>
                <div className="d-flex align-items-center">
                  <div 
                    className="me-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: '50px',
                      height: '50px',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      borderRadius: '50%'
                    }}
                  >
                    <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '24px' }}></i>
                  </div>
                  <div>
                    <h4 className="modal-title mb-1" style={{ fontWeight: '600' }}>Confirm Delete</h4>
                    <p className="mb-0" style={{ opacity: 0.9, fontSize: '0.95rem' }}>
                      This action cannot be undone
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="modal-body" style={{ padding: '2rem' }}>
                <p className="mb-4" style={{ 
                  fontSize: '1.1rem', 
                  color: '#495057',
                  lineHeight: '1.6'
                }}>
                  Are you sure you want to delete this book from your library? 
                  All your reading progress and notes will be permanently removed.
                </p>
                
                <div className="d-flex gap-3 justify-content-end">
                  <button
                    type="button"
                    className="btn px-4 py-2"
                    onClick={cancelDelete}
                    style={{
                      background: 'linear-gradient(45deg, #6c757d, #5a6268)',
                      border: 'none',
                      color: 'white',
                      borderRadius: '12px',
                      fontWeight: '500',
                      minWidth: '100px'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn px-4 py-2"
                    onClick={confirmDelete}
                    style={{
                      background: 'linear-gradient(45deg, #dc3545, #c82333)',
                      border: 'none',
                      color: 'white',
                      borderRadius: '12px',
                      fontWeight: '500',
                      minWidth: '100px'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;