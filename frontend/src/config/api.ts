const isProduction = import.meta.env.PROD;

// API Base URLs
const API_URLS = {
  production: 'http://52.176.217.99:5000',
  development: 'http://localhost:5000'
};

export const API_BASE_URL = isProduction ? API_URLS.production : API_URLS.development;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  SIGNUP: `${API_BASE_URL}/api/auth/signup`,
  FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/api/auth/reset-password`,
  PROFILE: `${API_BASE_URL}/api/auth/profile`,

  // Books
  BOOKS: `${API_BASE_URL}/api/books`,
  BOOK_BY_ID: (id: string) => `${API_BASE_URL}/api/books/${id}`,

  // User Books
  USER_BOOKS: `${API_BASE_URL}/api/user-books`,
  USER_BOOK_BY_ID: (id: string) => `${API_BASE_URL}/api/user-books/${id}`,
  USER_BOOKS_STATS: `${API_BASE_URL}/api/user-books/stats`,

  // Favorites
  FAVORITES: `${API_BASE_URL}/api/favorites`,
  FAVORITE_BY_ID: (bookId: string) => `${API_BASE_URL}/api/favorites/${bookId}`,

  // Reviews
  REVIEWS: `${API_BASE_URL}/api/reviews`,
  REVIEW_BY_BOOK_ID: (bookId: string) => `${API_BASE_URL}/api/reviews/${bookId}`,
};

// Helper function to get authorization headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Environment logs removed to avoid printing URLs and environment info in console
