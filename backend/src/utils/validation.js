const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidISBN = (isbn) => {
  if (!isbn) return true;

  const cleanIsbn = isbn.replace(/[-\s]/g, '');

  if (cleanIsbn.length === 10) {
    const regex = /^[0-9]{9}[0-9X]$/;
    return regex.test(cleanIsbn);
  }

  if (cleanIsbn.length === 13) {
    const regex = /^[0-9]{13}$/;
    return regex.test(cleanIsbn);
  }

  return false;
};

const isValidURL = (url) => {
  if (!url) return true;

  try {
    const urlObject = new URL(url);
    return urlObject.protocol === 'http:' || urlObject.protocol === 'https:';
  } catch (error) {
    return false;
  }
};

const isValidYear = (year) => {
  if (!year) return true;

  const yearNum = parseInt(year);
  const currentYear = new Date().getFullYear();

  return yearNum >= 1000 && yearNum <= currentYear + 1;
};

const isValidRating = (rating) => {
  if (rating === undefined || rating === null) return false;

  const ratingNum = parseFloat(rating);
  return ratingNum >= 1 && ratingNum <= 5 && Number.isInteger(ratingNum);
};

const validateBookData = (bookData) => {
  const errors = [];

  if (!bookData.title || bookData.title.trim() === '') {
    errors.push('Title is required');
  }

  if (!bookData.author || bookData.author.trim() === '') {
    errors.push('Author is required');
  }

  if (bookData.isbn && !isValidISBN(bookData.isbn)) {
    errors.push('Invalid ISBN format. Must be 10 or 13 digits');
  }

  if (bookData.coverImage && !isValidURL(bookData.coverImage)) {
    errors.push('Invalid cover image URL');
  }

  if (bookData.publishedYear && !isValidYear(bookData.publishedYear)) {
    errors.push('Invalid published year');
  }

  return errors;
};

const validateReviewData = (reviewData) => {
  const errors = [];

  if (!isValidRating(reviewData.rating)) {
    errors.push('Rating must be an integer between 1 and 5');
  }

  if (reviewData.comment && reviewData.comment.length > 1000) {
    errors.push('Comment cannot exceed 1000 characters');
  }

  return errors;
};

export {
  isValidEmail,
  isValidISBN,
  isValidURL,
  isValidYear,
  isValidRating,
  validateBookData,
  validateReviewData,
};
