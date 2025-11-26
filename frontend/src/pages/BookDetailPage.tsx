import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { Book } from '../types';

const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [showRatingSuccess, setShowRatingSuccess] = useState(false);

  useEffect(() => {
    fetchBook();
    checkFavoriteStatus();
    checkUserRating();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const checkUserRating = () => {
    const storedRatings = localStorage.getItem('userRatings');
    if (storedRatings) {
      const ratings = JSON.parse(storedRatings);
      if (ratings[id!]) {
        setUserRating(ratings[id!]);
        setHasRated(true);
      }
    }
  };

  const fetchBook = async () => {
    setLoading(true);
    try {
      // Fetch book details from the real API
      const response = await fetch(API_ENDPOINTS.BOOK_BY_ID(id!));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // The API returns: { success: true, data: { book: {...} } }
      const book = data?.data?.book || data?.book || data;
      setBook(book);
    } catch (error) {
      console.error('Error fetching book:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = () => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      const favorites = JSON.parse(storedFavorites);
      setIsFavorite(favorites.includes(id));
    }
  };

  const toggleFavorite = () => {
    const storedFavorites = localStorage.getItem('favorites');
    let favorites: string[] = storedFavorites ? JSON.parse(storedFavorites) : [];

    if (isFavorite) {
      favorites = favorites.filter(fav => fav !== id);
    } else {
      favorites.push(id!);
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  const handleRatingSubmit = () => {
    if (userRating === 0) return;

    const storedRatings = localStorage.getItem('userRatings');
    const ratings = storedRatings ? JSON.parse(storedRatings) : {};

    ratings[id!] = userRating;
    localStorage.setItem('userRatings', JSON.stringify(ratings));

    setHasRated(true);
    setShowRatingSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowRatingSuccess(false);
    }, 3000);
  };

  const handleStarClick = (rating: number) => {
    setUserRating(rating);

    // If user has already rated, auto-submit the new rating
    if (hasRated) {
      const storedRatings = localStorage.getItem('userRatings');
      const ratings = storedRatings ? JSON.parse(storedRatings) : {};
      ratings[id!] = rating;
      localStorage.setItem('userRatings', JSON.stringify(ratings));

      setShowRatingSuccess(true);
      setTimeout(() => {
        setShowRatingSuccess(false);
      }, 3000);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="bi bi-star-fill"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="bi bi-star-half"></i>);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="bi bi-star"></i>);
    }

    return stars;
  };

  const renderInteractiveStars = () => {
    return (
      <div className="d-flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="btn btn-link p-0"
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              color: (hoverRating || userRating) >= star ? '#ea580c' : '#e5e7eb',
              transition: 'all 0.2s ease',
              textDecoration: 'none',
              transform: (hoverRating || userRating) >= star ? 'scale(1.1)' : 'scale(1)',
            }}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => handleStarClick(star)}
          >
            <i className="bi bi-star-fill"></i>
          </button>
        ))}
      </div>
    );
  };

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

  if (!book) {
    return (
      <div className="container mt-5 pt-5 text-center">
        <h2>Book not found</h2>
        <Link to="/books" className="btn btn-primary mt-3">
          Back to Books
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-5 pt-5">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/books">Books</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {book.title}
          </li>
        </ol>
      </nav>

      <div className="row">
        {/* Book Cover */}
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-lg">
            <div className="position-relative">
              {!imageError ? (
                <img
                  src={book.coverImage || book.coverUrl}
                  className="card-img-top"
                  alt={book.title}
                  onError={() => setImageError(true)}
                  style={{ height: '600px', objectFit: 'cover' }}
                />
              ) : (
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    height: '600px',
                    background: 'var(--gradient-primary)',
                  }}
                >
                  <i className="bi bi-book text-white" style={{ fontSize: '8rem', opacity: 0.5 }}></i>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-grid gap-2 mt-3">
            <button
              className="btn btn-primary btn-lg"
              onClick={toggleFavorite}
            >
              <i className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'} me-2`}></i>
              {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
            <button className="btn btn-secondary btn-lg">
              <i className="bi bi-cart-plus me-2"></i>
              Add to Cart
            </button>
          </div>
        </div>

        {/* Book Details */}
        <div className="col-lg-8">
          <h1 className="display-4 fw-bold mb-3">{book.title}</h1>

          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="book-rating fs-5">
              {renderStars(book.rating)}
            </div>
            <span className="text-muted">({book.rating} out of 5)</span>
          </div>

          <p className="lead mb-4">
            <i className="bi bi-person-fill me-2"></i>
            by <strong>{book.author}</strong>
          </p>

          <div className="card border-0 bg-light mb-4 p-4">
            <div className="row">
              <div className="col-md-6 mb-3">
                <h6 className="text-muted mb-2">Genre</h6>
                <p className="mb-0">
                  <span className="badge bg-primary">{book.genre}</span>
                </p>
              </div>
              <div className="col-md-6 mb-3">
                <h6 className="text-muted mb-2">Price</h6>
                <p className="mb-0 book-price">${book.price.toFixed(2)}</p>
              </div>
              <div className="col-md-6 mb-3">
                <h6 className="text-muted mb-2">Pages</h6>
                <p className="mb-0">{book.pages || (book as Book).pageCount} pages</p>
              </div>
              <div className="col-md-6 mb-3">
                <h6 className="text-muted mb-2">Publication Date</h6>
                <p className="mb-0">
                  {new Date(book.publicationDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div className="col-md-6 mb-3">
                <h6 className="text-muted mb-2">Language</h6>
                <p className="mb-0">{book.language}</p>
              </div>
              <div className="col-md-6 mb-3">
                <h6 className="text-muted mb-2">ISBN</h6>
                <p className="mb-0">
                  <code>{book.isbn}</code>
                </p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="mb-3">About this book</h3>
            <p className="lead text-muted">{book.description}</p>
          </div>

          {/* Interactive Rating Section */}
          <div
            className="card border-0 mb-4"
            style={{
              background: 'var(--bg-primary)',
              borderRadius: 'clamp(18px, 3.5vw, 24px)',
              padding: 'clamp(1.5rem, 3vw, 2rem)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
              border: '2px solid var(--border-light)',
            }}
          >
            <div className="d-flex align-items-center gap-3 mb-3">
              <div
                style={{
                  width: 'clamp(48px, 8vw, 64px)',
                  height: 'clamp(48px, 8vw, 64px)',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #ea580c 0%, #fb923c 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <i className="bi bi-star-fill text-white" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}></i>
              </div>
              <div>
                <h4 className="mb-1 fw-bold" style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)' }}>
                  Rate This Book
                </h4>
                <p className="mb-0 text-muted" style={{ fontSize: 'clamp(0.85rem, 1.8vw, 0.95rem)' }}>
                  {hasRated ? 'You rated this book' : 'Share your thoughts with other readers'}
                </p>
              </div>
            </div>

            <div className="d-flex align-items-center gap-4 mb-3">
              {renderInteractiveStars()}
              {userRating > 0 && (
                <span
                  className="fw-bold"
                  style={{
                    fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
                    color: 'var(--primary-color)',
                  }}
                >
                  {userRating}/5
                </span>
              )}
            </div>

            {userRating > 0 && !hasRated && (
              <button
                className="btn"
                onClick={handleRatingSubmit}
                style={{
                  background: 'var(--gradient-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: 'clamp(0.65rem, 1.5vw, 0.85rem) clamp(1.5rem, 3vw, 2rem)',
                  fontWeight: '600',
                  fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
                  boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(234, 88, 12, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(234, 88, 12, 0.3)';
                }}
              >
                <i className="bi bi-check-circle me-2"></i>
                Submit Rating
              </button>
            )}

            {userRating > 0 && hasRated && (
              <div
                className="d-flex align-items-center gap-2"
                style={{
                  padding: 'clamp(0.75rem, 1.5vw, 1rem)',
                  background: 'rgba(234, 88, 12, 0.1)',
                  borderRadius: '12px',
                  color: 'var(--primary-color)',
                }}
              >
                <i className="bi bi-check-circle-fill"></i>
                <span className="fw-semibold" style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1rem)' }}>
                  Thanks for rating! Click a star to update your rating.
                </span>
              </div>
            )}

            {showRatingSuccess && (
              <div
                className="alert mb-0 mt-3"
                style={{
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(74, 222, 128, 0.15) 100%)',
                  border: '2px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '12px',
                  color: '#15803d',
                  padding: 'clamp(0.75rem, 1.5vw, 1rem)',
                  fontSize: 'clamp(0.9rem, 1.8vw, 1rem)',
                  fontWeight: '600',
                }}
              >
                <i className="bi bi-check-circle-fill me-2"></i>
                Rating saved successfully!
              </div>
            )}
          </div>

          {/* Additional Information */}
          <div className="card border-0 shadow-sm p-4">
            <h4 className="mb-3">
              <i className="bi bi-info-circle me-2"></i>
              Additional Information
            </h4>
            <ul className="list-unstyled mb-0">
              <li className="mb-2">
                <i className="bi bi-check-circle-fill text-success me-2"></i>
                Free shipping on orders over $50
              </li>
              <li className="mb-2">
                <i className="bi bi-check-circle-fill text-success me-2"></i>
                30-day money-back guarantee
              </li>
              <li className="mb-2">
                <i className="bi bi-check-circle-fill text-success me-2"></i>
                Available in multiple formats (Hardcover, Paperback, E-book)
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-5 mb-4">
        <button
          className="btn btn-outline-primary"
          onClick={() => navigate(-1)}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back
        </button>
      </div>
    </div>
  );
};

export default BookDetailPage;
