import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  setSearchQuery,
  toggleGenre,
  setMinRating,
  setSortBy,
  resetFilters,
} from '../redux/filterSlice';
import BookCard from '../components/BookCard';
import { API_ENDPOINTS } from '../config/api';
import type { Book } from '../types';
import FavoritesService from '../services/favoritesService';
import { useAuth } from '../contexts/AuthContext';

const BooksPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filter);
  const { isAuthenticated } = useAuth();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 6;

  const genres = ['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Romance', 'Biography', 'History', 'Self-Help', 'Poetry'];

  useEffect(() => {
    // Fetch books from API
    fetchBooks();

    // Load favorites if authenticated
    if (isAuthenticated) {
      loadFavorites();
    }
  }, [isAuthenticated]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      // Fetch books from the real API
      const response = await fetch(API_ENDPOINTS.BOOKS);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // The API returns books in data.data.books structure
      const books = data.data?.books || data.books || [];
      setBooks(books);
    } catch {
      // Show a fallback message
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const favoritesData = await FavoritesService.getUserFavorites();
      // Trim whitespace from book IDs
      const favoriteIds = favoritesData.map(fav => fav.book.id.trim());
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const handleToggleFavorite = async (bookId: string) => {
    if (!isAuthenticated) {
      return;
    }

    try {
      const trimmedBookId = bookId.trim();
      if (favorites.includes(trimmedBookId)) {
        await FavoritesService.removeFromFavorites(trimmedBookId);
        setFavorites(prev => prev.filter(id => id !== trimmedBookId));
      } else {
        await FavoritesService.addToFavorites(trimmedBookId);
        setFavorites(prev => [...prev, trimmedBookId]);
      }
      // favorites updated
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // Filter and sort books - ensure books is always an array
  const booksArray = Array.isArray(books) ? books : [];
  const filteredBooks = booksArray.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(filters.searchQuery.toLowerCase());
    const matchesGenre = filters.selectedGenres.length === 0 ||
                        filters.selectedGenres.includes(book.genre);
    const matchesRating = book.rating >= filters.minRating;

    return matchesSearch && matchesGenre && matchesRating;
  }).sort((a, b) => {
    const order = filters.sortOrder === 'asc' ? 1 : -1;

    switch (filters.sortBy) {
      case 'title':
        return order * a.title.localeCompare(b.title);
      case 'author':
        return order * a.author.localeCompare(b.author);
      case 'rating':
        return order * (a.rating - b.rating);
      case 'price':
        return order * (a.price - b.price);
      case 'publicationDate':
        return order * (new Date(a.publicationDate).getTime() - new Date(b.publicationDate).getTime());
      default:
        return 0;
    }
  });

  // Pagination
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mt-4 mt-md-5 pt-4 pt-md-5 px-3 px-md-4">
      {/* Page Header */}
      <div className="row mb-4 mb-md-5">
        <div className="col-12 text-center">
          <div className="mb-2 mb-md-3">
            <span style={{
              background: 'var(--gradient-primary)',
              color: 'white',
              padding: '0.5rem 1.5rem',
              borderRadius: '50px',
              fontSize: 'clamp(0.75rem, 1.8vw, 0.85rem)',
              fontWeight: '700',
              display: 'inline-block',
              letterSpacing: '0.5px'
            }}>
              <i className="bi bi-collection me-2"></i>
              {filteredBooks.length} BOOKS AVAILABLE
            </span>
          </div>
          <h1 className="fw-bold mb-2 mb-md-3" style={{
            fontSize: 'clamp(1.75rem, 6vw, 4rem)',
            color: 'var(--text-primary)',
            lineHeight: '1.1'
          }}>
            Find Your Next
            <span style={{
              display: 'block',
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Favorite Book
            </span>
          </h1>
          <p className="lead text-center" style={{ 
            color: 'var(--text-secondary)', 
            maxWidth: '600px', 
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            margin: '0 auto'
          }}>
            Browse our handpicked collection of books across all genres. Find stories that inspire, educate, and entertain.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="row mb-4 mb-md-5">
        <div className="col-12">
          <div className="position-relative">
            <input
              type="text"
              className="form-control"
              placeholder="Search by title, author, or genre..."
              value={filters.searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              style={{
                padding: 'clamp(1rem, 2.5vw, 1.25rem) clamp(1rem, 3vw, 1.5rem) clamp(1rem, 2.5vw, 1.25rem) clamp(2.5rem, 7vw, 3.5rem)',
                borderRadius: 'clamp(15px, 3vw, 20px)',
                border: '2px solid var(--border-color)',
                fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary-color)';
                e.target.style.boxShadow = '0 8px 24px rgba(234, 88, 12, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-color)';
                e.target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.06)';
              }}
            />
            <i className="bi bi-search position-absolute" style={{
              left: 'clamp(1rem, 2.5vw, 1.25rem)',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 'clamp(1.1rem, 2.5vw, 1.25rem)',
              color: 'var(--text-light)'
            }}></i>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Filters Sidebar */}
        <div className="col-lg-3 mb-3 mb-md-4">
          <div className="sticky-top" style={{
            top: 'clamp(80px, 15vw, 100px)',
            background: 'var(--bg-primary)',
            borderRadius: 'clamp(18px, 3.5vw, 24px)',
            padding: 'clamp(1.25rem, 3vw, 2rem)',
            border: '1px solid var(--border-light)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)'
          }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0 fw-bold" style={{ color: 'var(--text-primary)' }}>
                <i className="bi bi-sliders me-2" style={{ color: 'var(--primary-color)' }}></i>
                Filters
              </h5>
              <button
                className="btn btn-sm"
                onClick={() => dispatch(resetFilters())}
                style={{
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: '600',
                  padding: '0.5rem 1rem'
                }}
              >
                Reset
              </button>
            </div>

            {/* Genre Filter */}
            <div className="mb-4">
              <h6 className="mb-3">Genre</h6>
              <div className="d-flex flex-column gap-2">
                {genres.map(genre => (
                  <div key={genre} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`genre-${genre}`}
                      checked={filters.selectedGenres.includes(genre)}
                      onChange={() => dispatch(toggleGenre(genre))}
                    />
                    <label className="form-check-label" htmlFor={`genre-${genre}`}>
                      {genre}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="mb-4">
              <h6 className="mb-3">Minimum Rating</h6>
              <select
                className="form-select"
                value={filters.minRating}
                onChange={(e) => dispatch(setMinRating(Number(e.target.value)))}
              >
                <option value="0">All Ratings</option>
                <option value="3">3+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="5">5 Stars</option>
              </select>
            </div>

            {/* Sort By */}
            <div className="mb-4">
              <h6 className="mb-3">Sort By</h6>
              <select
                className="form-select"
                value={filters.sortBy}
                onChange={(e) => dispatch(setSortBy(e.target.value as 'title' | 'author' | 'rating' | 'price' | 'publicationDate'))}
              >
                <option value="title">Title</option>
                <option value="author">Author</option>
                <option value="rating">Rating</option>
                <option value="price">Price</option>
                <option value="publicationDate">Publication Date</option>
              </select>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        <div className="col-lg-9">
          <div className="mb-4">
            <p className="text-muted">
              Showing {currentBooks.length} of {filteredBooks.length} books
            </p>
          </div>

          {loading ? (
            <div className="loading-spinner">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : currentBooks.length > 0 ? (
            <>
              <div className="row g-4 mb-4">
                {currentBooks.map(book => (
                  <div key={book.id} className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
                    <BookCard
                      book={book}
                      onToggleFavorite={handleToggleFavorite}
                      isFavorite={favorites.includes(book.id.trim())}
                    />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav aria-label="Books pagination" className="mt-5">
                  <ul className="pagination justify-content-center flex-wrap gap-2">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        style={{
                          borderRadius: '12px',
                          padding: '0.75rem 1rem',
                          border: '2px solid var(--border-color)',
                          background: currentPage === 1 ? 'var(--bg-secondary)' : 'var(--bg-primary)',
                          color: currentPage === 1 ? 'var(--text-light)' : 'var(--text-primary)',
                          fontWeight: '600',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <i className="bi bi-chevron-left"></i>
                      </button>
                    </li>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => paginate(pageNum)}
                            style={{
                              borderRadius: '12px',
                              padding: '0.75rem 1.25rem',
                              border: '2px solid var(--border-color)',
                              background: currentPage === pageNum ? 'var(--gradient-primary)' : 'var(--bg-primary)',
                              color: currentPage === pageNum ? 'white' : 'var(--text-primary)',
                              fontWeight: '700',
                              minWidth: '45px',
                              transition: 'all 0.3s ease',
                              boxShadow: currentPage === pageNum ? '0 4px 12px rgba(234, 88, 12, 0.3)' : 'none'
                            }}
                          >
                            {pageNum}
                          </button>
                        </li>
                      );
                    })}

                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        style={{
                          borderRadius: '12px',
                          padding: '0.75rem 1rem',
                          border: '2px solid var(--border-color)',
                          background: currentPage === totalPages ? 'var(--bg-secondary)' : 'var(--bg-primary)',
                          color: currentPage === totalPages ? 'var(--text-light)' : 'var(--text-primary)',
                          fontWeight: '600',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <i className="bi bi-chevron-right"></i>
                      </button>
                    </li>
                  </ul>

                  <div className="text-center mt-3">
                    <p className="text-muted mb-0" style={{ fontSize: 'clamp(0.85rem, 1.8vw, 0.95rem)' }}>
                      Page {currentPage} of {totalPages}
                    </p>
                  </div>
                </nav>
              )}
            </>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-inbox" style={{ fontSize: '4rem', color: 'var(--text-light)' }}></i>
              <h4 className="mt-3">No books found</h4>
              <p className="text-muted">Try adjusting your filters or search query</p>
              <button
                className="btn btn-primary mt-3"
                onClick={() => dispatch(resetFilters())}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BooksPage;