import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BookCard from '../components/BookCard';
import type { Book } from '../types';
import { useAuth } from '../contexts/AuthContext';
import FavoritesService from '../services/favoritesService';

const FavoritesPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavoriteBooks();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const fetchFavoriteBooks = async () => {
    setLoading(true);
    try {
      const favorites = await FavoritesService.getUserFavorites();
      const books = favorites.map(fav => fav.book);
      setFavoriteBooks(books);
    } catch (error) {
      console.error('Error fetching favorite books:', error);
      setFavoriteBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (bookId: string) => {
    try {
      await FavoritesService.removeFromFavorites(bookId);

      // Remove from display
      setFavoriteBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));

      // Show toast notification
      setToastMessage('Book removed from favorites');
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (error) {
      console.error('Error removing favorite:', error);
      setToastMessage('Failed to remove from favorites');
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
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
                background: 'var(--gradient-secondary)',
              }}
            >
              <i className="bi bi-heart-fill text-white" style={{ fontSize: '4rem' }}></i>
            </div>
            <h2 className="display-5 fw-bold mb-3">Login to View Favorites</h2>
            <p className="lead text-muted mb-4">
              Sign in to save your favorite books and access them anytime
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <Link to="/login" className="btn btn-primary btn-lg">
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Login
              </Link>
              <Link to="/signup" className="btn btn-outline-primary btn-lg">
                Create Account
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
        <div className="loading-spinner">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 mt-md-5 pt-4 pt-md-5 px-3 px-md-4">
      {/* Toast Notification */}
      {showToast && (
        <div
          style={{
            position: 'fixed',
            top: 'clamp(80px, 15vw, 100px)',
            right: 'clamp(1rem, 3vw, 2rem)',
            zIndex: 9999,
            animation: 'slideInRight 0.3s ease-out',
          }}
        >
          <div
            className="alert mb-0"
            style={{
              background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.95) 0%, rgba(251, 146, 60, 0.95) 100%)',
              border: 'none',
              borderRadius: '16px',
              color: 'white',
              padding: 'clamp(0.85rem, 2vw, 1.15rem) clamp(1.25rem, 3vw, 1.75rem)',
              fontSize: 'clamp(0.9rem, 1.8vw, 1rem)',
              fontWeight: '600',
              boxShadow: '0 8px 24px rgba(234, 88, 12, 0.4)',
              minWidth: '280px',
            }}
          >
            <i className="bi bi-check-circle-fill me-2"></i>
            {toastMessage}
          </div>
        </div>
      )}

      <div className="row mb-4 mb-md-5">
        <div className="col-12">
          <div className="mb-2 mb-md-3">
            <span
              style={{
                background: 'var(--gradient-primary)',
                color: 'white',
                padding: '0.5rem 1.5rem',
                borderRadius: '50px',
                fontSize: 'clamp(0.75rem, 1.8vw, 0.85rem)',
                fontWeight: '700',
                display: 'inline-block',
                letterSpacing: '0.5px',
              }}
            >
              <i className="bi bi-heart-fill me-2"></i>
              {Array.isArray(favoriteBooks) ? favoriteBooks.length : 0} FAVORITES
            </span>
          </div>
          <h1
            className="fw-bold mb-2 mb-md-3"
            style={{
              fontSize: 'clamp(1.75rem, 6vw, 4rem)',
              color: 'var(--text-primary)',
              lineHeight: '1.1',
            }}
          >
            Your Reading
            <span
              style={{
                display: 'block',
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Wishlist
            </span>
          </h1>
          <p
            className="lead"
            style={{
              color: 'var(--text-secondary)',
              maxWidth: '600px',
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            }}
          >
            All the books you've bookmarked and want to explore
          </p>
        </div>
      </div>

      {(!Array.isArray(favoriteBooks) || favoriteBooks.length === 0) ? (
        <div className="row">
          <div className="col-12">
            <div
              className="card border-0 text-center"
              style={{
                background: 'var(--bg-primary)',
                borderRadius: 'clamp(20px, 4vw, 28px)',
                padding: 'clamp(3rem, 6vw, 5rem) clamp(2rem, 4vw, 3rem)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                border: '2px solid var(--border-light)',
              }}
            >
              <div
                className="mx-auto mb-4"
                style={{
                  width: 'clamp(100px, 20vw, 140px)',
                  height: 'clamp(100px, 20vw, 140px)',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.1) 0%, rgba(251, 146, 60, 0.1) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <i
                  className="bi bi-bookmark-heart"
                  style={{
                    fontSize: 'clamp(3rem, 8vw, 5rem)',
                    background: 'var(--gradient-primary)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                ></i>
              </div>
              <h3
                className="mb-3 fw-bold"
                style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  color: 'var(--text-primary)',
                }}
              >
                No Favorites Yet
              </h3>
              <p
                className="text-muted mb-4"
                style={{
                  fontSize: 'clamp(1rem, 2vw, 1.15rem)',
                  maxWidth: '500px',
                  margin: '0 auto 2rem',
                }}
              >
                Start building your reading wishlist by bookmarking books you love
              </p>
              <div>
                <Link
                  to="/books"
                  className="btn btn-lg"
                  style={{
                    background: 'var(--gradient-primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '14px',
                    padding: 'clamp(0.75rem, 1.8vw, 1rem) clamp(2rem, 4vw, 2.5rem)',
                    fontWeight: '600',
                    fontSize: 'clamp(1rem, 2vw, 1.1rem)',
                    boxShadow: '0 4px 16px rgba(234, 88, 12, 0.3)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(234, 88, 12, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(234, 88, 12, 0.3)';
                  }}
                >
                  <i className="bi bi-compass me-2"></i>
                  Explore Books
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="row g-4 mb-5">
            {Array.isArray(favoriteBooks) && favoriteBooks.map(book => (
              <div key={book.id} className="col-xl-3 col-lg-4 col-md-6 col-sm-12">
                <BookCard
                  book={book}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={true}
                />
              </div>
            ))}
          </div>

          <div
            className="card border-0 text-white mb-5"
            style={{
              background: 'var(--gradient-primary)',
              borderRadius: 'clamp(20px, 4vw, 24px)',
              padding: 'clamp(2rem, 4vw, 2.5rem)',
              boxShadow: '0 8px 24px rgba(234, 88, 12, 0.3)',
            }}
          >
            <div className="row align-items-center g-4">
              <div className="col-lg-8">
                <div className="d-flex align-items-start gap-3">
                  <div
                    style={{
                      width: 'clamp(50px, 10vw, 64px)',
                      height: 'clamp(50px, 10vw, 64px)',
                      borderRadius: '16px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <i className="bi bi-stars" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}></i>
                  </div>
                  <div>
                    <h4 className="mb-2 fw-bold" style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)' }}>
                      Want More?
                    </h4>
                    <p className="mb-0" style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', opacity: 0.95 }}>
                      Browse our full collection and add to your list
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 text-lg-end">
                <Link
                  to="/books"
                  className="btn btn-light btn-lg"
                  style={{
                    borderRadius: '12px',
                    padding: 'clamp(0.65rem, 1.5vw, 0.85rem) clamp(1.5rem, 3vw, 2rem)',
                    fontWeight: '700',
                    fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
                    color: 'var(--primary-color)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  Browse More Books
                  <i className="bi bi-arrow-right ms-2"></i>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FavoritesPage;
