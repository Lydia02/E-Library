import React, { useState, useEffect } from 'react';
import BookCoverService from '../services/bookCoverService';

interface BookCoverProps {
  title: string;
  author?: string;
  isbn?: string;
  customCoverUrl?: string;
  genre?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const BookCover: React.FC<BookCoverProps> = ({
  title,
  author,
  isbn,
  customCoverUrl,
  genre,
  className = '',
  style = {},
  onClick
}) => {
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
  const [imageAttemptIndex, setImageAttemptIndex] = useState(0);
  const [possibleImages, setPossibleImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Generate fallback SVG cover
  const getGenericBookCover = () => {
    const coverStyles = [
      { primary: '#2c3e50', secondary: '#34495e', accent: '#e74c3c' },
      { primary: '#8e44ad', secondary: '#9b59b6', accent: '#f39c12' },
      { primary: '#2980b9', secondary: '#3498db', accent: '#e67e22' },
      { primary: '#27ae60', secondary: '#2ecc71', accent: '#e74c3c' },
      { primary: '#d35400', secondary: '#e67e22', accent: '#2ecc71' },
      { primary: '#c0392b', secondary: '#e74c3c', accent: '#f1c40f' },
      { primary: '#7f8c8d', secondary: '#95a5a6', accent: '#9b59b6' }
    ];
    
    const styleIndex = (title.charCodeAt(0) || 0) % coverStyles.length;
    const style = coverStyles[styleIndex];
    
    const words = title.split(' ');
    const titleLines = [];
    let currentLine = '';
    
    for (const word of words) {
      if (currentLine.length + word.length + 1 <= 12) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) titleLines.push(currentLine);
        currentLine = word;
        if (titleLines.length >= 3) break;
      }
    }
    if (currentLine) titleLines.push(currentLine);
    
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="240" height="360" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="coverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${style.primary};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${style.secondary};stop-opacity:1" />
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="2" dy="4" stdDeviation="3" flood-opacity="0.3"/>
          </filter>
        </defs>
        <rect x="0" y="0" width="240" height="360" fill="url(#coverGrad)" filter="url(#shadow)" rx="8"/>
        <rect x="8" y="8" width="224" height="344" fill="url(#coverGrad)" rx="6"/>
        <rect x="16" y="16" width="208" height="328" fill="none" stroke="${style.accent}" stroke-width="2" rx="4" opacity="0.8"/>
        <rect x="24" y="80" width="192" height="120" fill="white" opacity="0.1" rx="4"/>
        ${titleLines.map((line, index) => 
          `<text x="120" y="${120 + (index * 24)}" font-family="Georgia, serif" font-size="16" font-weight="bold" text-anchor="middle" fill="white">${line}</text>`
        ).join('')}
        <rect x="32" y="220" width="${Math.min((genre || 'Fiction').length * 8 + 16, 176)}" height="24" fill="${style.accent}" rx="12"/>
        <text x="40" y="236" font-family="Arial, sans-serif" font-size="11" font-weight="600" fill="white">${(genre || 'Fiction').toUpperCase()}</text>
      </svg>
    `)}`;
  };

  // Get potential book cover URLs
  useEffect(() => {
    const getPotentialCovers = async () => {
      const covers: string[] = [];
      
      // 1. Custom cover URL (highest priority)
      if (customCoverUrl) {
        covers.push(customCoverUrl);
      }

      // 2. Try to get real book covers from APIs
      try {
        // Open Library by ISBN
        if (isbn) {
          const cleanIsbn = isbn.replace(/[^0-9X]/g, '');
          covers.push(`https://covers.openlibrary.org/b/isbn/${cleanIsbn}-L.jpg`);
          covers.push(`https://covers.openlibrary.org/b/isbn/${cleanIsbn}-M.jpg`);
        }

        // Google Books API
        if (title) {
          const googleData = await BookCoverService.getGoogleBooksData(title, author);
          const googleCovers = BookCoverService.extractGoogleBooksCovers(googleData);
          covers.push(...googleCovers);
        }

        // Open Library by title search
        if (title) {
          const cleanTitle = title.replace(/[^a-zA-Z0-9\s]/g, '').toLowerCase().replace(/\s+/g, '_');
          covers.push(`https://covers.openlibrary.org/b/title/${cleanTitle}-L.jpg`);
        }

        // More ISBN variations
        if (isbn) {
          const cleanIsbn = isbn.replace(/[^0-9X]/g, '');
          covers.push(`https://covers.openlibrary.org/b/isbn/${cleanIsbn}-S.jpg`);
        }
      } catch {
        // ignore cover fetch errors
      }

      setPossibleImages(covers);
      
      // Start with the first image if we have any
      if (covers.length > 0) {
        setCurrentImageUrl(covers[0]);
        setImageAttemptIndex(0);
      } else {
        // No potential covers, use fallback immediately
        setCurrentImageUrl(getGenericBookCover());
        setIsLoading(false);
      }
    };

    getPotentialCovers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, author, isbn, customCoverUrl, genre]);

  // Handle image load errors - try next image source
  const handleImageError = () => {
    const nextIndex = imageAttemptIndex + 1;
    
    if (nextIndex < possibleImages.length) {
      setImageAttemptIndex(nextIndex);
      setCurrentImageUrl(possibleImages[nextIndex]);
    } else {
      // All sources failed, use fallback
      setCurrentImageUrl(getGenericBookCover());
      setIsLoading(false);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="position-relative">
      {isLoading && (
        <div 
          className="d-flex align-items-center justify-content-center position-absolute w-100 h-100 bg-light"
          style={{ zIndex: 1, borderRadius: '8px' }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      <img
        src={currentImageUrl}
        className={className}
        alt={title}
        style={style}
        onClick={onClick}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
    </div>
  );
};

export default BookCover;