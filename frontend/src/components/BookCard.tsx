import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Book } from '../types';
import BookCover from './BookCover';

interface BookCardProps {
  book: Book;
  onToggleFavorite?: (bookId: string) => void;
  isFavorite?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({ book, onToggleFavorite, isFavorite = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(book.id);
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

  return (
    <div className="col">
  <Link to={`/books/${book.id}`} className="text-decoration-none">
        <div
          className="h-100 position-relative"
          style={{
            borderRadius: '24px',
            overflow: 'hidden',
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-light)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: isHovered ? '0 20px 50px rgba(0, 0, 0, 0.15)' : '0 4px 16px rgba(0, 0, 0, 0.06)',
            transform: isHovered ? 'translateY(-12px)' : 'translateY(0)'
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Favorite Button */}
          {onToggleFavorite && (
            <button
              onClick={handleFavoriteClick}
              className="position-absolute"
              style={{
                top: '1rem',
                right: '1rem',
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: isFavorite ? 'var(--gradient-secondary)' : 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: isFavorite ? 'none' : '2px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                zIndex: 10,
                transition: 'all 0.3s ease'
              }}
            >
              <i
                className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'}`}
                style={{
                  fontSize: '1.2rem',
                  color: isFavorite ? 'white' : 'var(--secondary-color)'
                }}
              ></i>
            </button>
          )}

          {/* Book Cover */}
          <div className="position-relative overflow-hidden" style={{ height: '320px' }}>
            <BookCover
              title={book.title}
              author={book.author}
              isbn={book.isbn || undefined}
              customCoverUrl={book.coverUrl || book.coverImage || undefined}
              genre={(book.genre || (book.genres && book.genres[0])) || undefined}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isHovered ? 'scale(1.05)' : 'scale(1)'
              }}
            />

            {/* Gradient Overlay */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '50%',
              background: 'linear-gradient(to top, rgba(0, 0, 0, 0.3), transparent)',
              pointerEvents: 'none'
            }}></div>
          </div>

          {/* Book Info */}
          <div className="p-4">
            {/* Title */}
            <h5 className="fw-bold mb-2" style={{
              color: 'var(--text-primary)',
              fontSize: '1.1rem',
              lineHeight: '1.3',
              minHeight: '50px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {book.title}
            </h5>

            {/* Author */}
            <p className="mb-3" style={{
              color: 'var(--text-secondary)',
              fontSize: '0.95rem',
              fontWeight: '500'
            }}>
              {book.author}
            </p>

            {/* Rating and Genre */}
            <div className="d-flex align-items-center justify-content-between mb-3" style={{
              gap: 'clamp(1rem, 2.5vw, 1.5rem)' // Added gap for better spacing
            }}>
              <div className="d-flex align-items-center gap-1" style={{
                color: '#f59e0b',
                fontSize: '0.9rem',
                flex: '1',
                minWidth: '0'
              }}>
                {renderStars(book.rating)}
                <span style={{
                  color: 'var(--text-light)',
                  fontSize: '0.85rem',
                  marginLeft: 'clamp(0.5rem, 1.2vw, 0.75rem)', // Responsive spacing
                  whiteSpace: 'nowrap'
                }}>
                  {book.rating}
                </span>
              </div>
              {(book.genre || (book.genres && book.genres[0])) && (
                <span style={{
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-secondary)',
                  padding: 'clamp(0.25rem, 0.8vw, 0.35rem) clamp(0.75rem, 1.8vw, 1rem)',
                  borderRadius: '8px',
                  fontSize: 'clamp(0.7rem, 1.6vw, 0.8rem)',
                  fontWeight: '700',
                  whiteSpace: 'nowrap',
                  flexShrink: '0'
                }}>
                  {book.genre || (book.genres && book.genres[0])}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="mb-3" style={{
              color: 'var(--text-light)',
              fontSize: '0.875rem',
              lineHeight: '1.5',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {book.description}
            </p>

            {/* Price and CTA */}
<div className="d-flex align-items-end justify-content-between pt-4 mt-3" style={{
  borderTop: '2px solid var(--border-light)',
  gap: 'clamp(0.5rem, 1.5vw, 1rem)', // Reduced gap to give more space to price
  minHeight: '80px', // Increased height even more
  width: '100%'
}}>
  <div className="flex-grow-1" style={{
    minWidth: '0',
    maxWidth: '70%', // Increased price section width
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    overflow: 'visible' // Ensure price can overflow if needed
  }}>
    <div style={{
      fontSize: 'clamp(1.1rem, 3vw, 1.5rem)', // Slightly smaller but more readable
      fontWeight: '900',
      background: 'var(--gradient-primary)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      lineHeight: '1.2',
      marginBottom: '0.4rem',
      whiteSpace: 'nowrap',
      overflow: 'visible',
      textOverflow: 'unset', // Never cut off text
      minWidth: 'max-content' // Ensure full width for price
    }}>
      ${(book.price ?? 0).toFixed(2)}
    </div>
    <small style={{
      color: 'var(--text-secondary)',
      fontSize: 'clamp(0.65rem, 1.4vw, 0.8rem)',
      fontWeight: '600',
      letterSpacing: '0.3px',
      textTransform: 'uppercase',
      display: 'block',
      lineHeight: '1.2',
      whiteSpace: 'nowrap'
    }}>
      Best Price
    </small>
  </div>
  <button className="btn flex-shrink-0" style={{
    background: isHovered ? 'var(--gradient-primary)' : 'transparent',
    color: isHovered ? 'white' : 'var(--primary-color)',
    padding: 'clamp(0.7rem, 1.8vw, 0.9rem) clamp(1.1rem, 2.8vw, 1.5rem)', // Reduced button padding
    borderRadius: '12px',
    fontWeight: '700',
    border: isHovered ? 'none' : '2px solid var(--primary-color)',
    fontSize: 'clamp(0.8rem, 1.8vw, 0.95rem)',
    transition: 'all 0.3s ease',
    boxShadow: isHovered ? '0 4px 16px rgba(234, 88, 12, 0.4)' : 'none',
    whiteSpace: 'nowrap',
    minWidth: 'fit-content',
    maxWidth: '30%', // Reduced button max width
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
                View
                <i className="bi bi-arrow-right ms-2" style={{
                  fontSize: 'clamp(0.78rem, 1.7vw, 0.95rem)'
                }}></i>
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BookCard;
