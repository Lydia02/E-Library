# Branch 04: API Configuration and Base Services

## Overview
This branch establishes the API configuration layer for E-Library, providing centralized endpoint definitions, environment-based URL management, and authentication header helpers.

## Changes Made

### 1. Created API Configuration File
Added [src/config/api.ts](src/config/api.ts) with API endpoints and utilities.

## API Configuration Structure

### Environment Detection
```typescript
const isProduction = import.meta.env.PROD;
```
Uses Vite's built-in environment variable to detect production vs development mode.

### Base URL Configuration
```typescript
const API_URLS = {
  production: 'https://summative-a-react-discovery-app-lydia02.onrender.com',
  development: 'http://localhost:5000'
};

export const API_BASE_URL = API_URLS.production;
```

**Current Setup:**
- Production URL points to Render deployment
- Development URL set to localhost:5000
- Currently using production URL by default

**Future Flexibility:**
Can easily switch between environments:
```typescript
export const API_BASE_URL = isProduction ? API_URLS.production : API_URLS.development;
```

## API Endpoints

### Authentication Endpoints
```typescript
LOGIN: `${API_BASE_URL}/api/auth/login`
SIGNUP: `${API_BASE_URL}/api/auth/signup`
FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/forgot-password`
RESET_PASSWORD: `${API_BASE_URL}/api/auth/reset-password`
PROFILE: `${API_BASE_URL}/api/auth/profile`
```

**Used for:**
- User login and registration
- Password recovery flow
- Profile management

---

### Book Endpoints
```typescript
BOOKS: `${API_BASE_URL}/api/books`
BOOK_BY_ID: (id: string) => `${API_BASE_URL}/api/books/${id}`
```

**Used for:**
- Fetching all books (with filters/pagination)
- Getting single book details
- Adding/updating books (admin)

**Dynamic Function:**
```typescript
API_ENDPOINTS.BOOK_BY_ID('123') // Returns: .../api/books/123
```

---

### User Books Endpoints
```typescript
USER_BOOKS: `${API_BASE_URL}/api/user-books`
USER_BOOK_BY_ID: (id: string) => `${API_BASE_URL}/api/user-books/${id}`
USER_BOOKS_STATS: `${API_BASE_URL}/api/user-books/stats`
```

**Used for:**
- Managing user's personal library
- Adding books to reading lists
- Tracking reading progress
- Getting user statistics

---

### Favorites Endpoints
```typescript
FAVORITES: `${API_BASE_URL}/api/favorites`
FAVORITE_BY_ID: (bookId: string) => `${API_BASE_URL}/api/favorites/${bookId}`
```

**Used for:**
- Adding/removing books from favorites
- Fetching user's favorite books
- Checking if book is favorited

---

### Reviews Endpoints
```typescript
REVIEWS: `${API_BASE_URL}/api/reviews`
REVIEW_BY_BOOK_ID: (bookId: string) => `${API_BASE_URL}/api/reviews/${bookId}`
```

**Used for:**
- Submitting book reviews
- Fetching reviews for a book
- Rating books

## Authentication Helper

### getAuthHeaders Function
```typescript
export const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};
```

**Purpose:**
- Automatically retrieves JWT token from localStorage
- Includes token in Authorization header if present
- Always sets Content-Type to application/json

**Usage Example:**
```typescript
import { API_ENDPOINTS, getAuthHeaders } from '../config/api';

fetch(API_ENDPOINTS.PROFILE, {
  headers: getAuthHeaders()
})
```

**Token Management:**
- Token stored in localStorage with key `'authToken'`
- Automatically included in all authenticated requests
- No manual header management needed

## Console Logging

### Environment Logging
```typescript
console.log(` API Mode: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
console.log(`🌐 API Base URL: ${API_BASE_URL}`);
```

**Output on page load:**
```
 API Mode: PRODUCTION
🌐 API Base URL: https://summative-a-react-discovery-app-lydia02.onrender.com
```

**Benefits:**
- Quick visual confirmation of environment
- Easy debugging of API connection issues
- Visible in browser console on load

## Integration Points

### Will be used in:

**Branch 05 - Redux Services:**
- Book fetching with filters
- Redux thunks for async data

**Branch 06 - AuthContext:**
- Login/Signup functionality
- Token management
- Profile updates

**Future Service Files:**
- `bookService.ts` - Branch 11
- `userBooksService.ts` - Branch 13
- `favoritesService.ts` - Branch 15
- `profileService.ts` - Branch 13

## Usage Patterns

### Basic Fetch
```typescript
import { API_ENDPOINTS, getAuthHeaders } from '../config/api';

const response = await fetch(API_ENDPOINTS.BOOKS, {
  headers: getAuthHeaders()
});
const books = await response.json();
```

### With Dynamic ID
```typescript
const bookId = '123';
const response = await fetch(API_ENDPOINTS.BOOK_BY_ID(bookId), {
  headers: getAuthHeaders()
});
```

### POST Request
```typescript
const response = await fetch(API_ENDPOINTS.LOGIN, {
  method: 'POST',
  headers: getAuthHeaders(),
  body: JSON.stringify({ email, password })
});
```

### With Axios (Future)
```typescript
import axios from 'axios';
import { API_ENDPOINTS, getAuthHeaders } from '../config/api';

const response = await axios.get(API_ENDPOINTS.BOOKS, {
  headers: getAuthHeaders()
});
```

## Security Considerations

### Token Storage
- Currently uses localStorage for simplicity
- Token automatically included in requests
- Consider httpOnly cookies for enhanced security in future

### HTTPS
- Production URL uses HTTPS
- Secure token transmission
- CORS properly configured on backend

### Header Management
- Content-Type always set
- Authorization only when token exists
- No token leakage in logs

## Environment Variables

### Future Enhancement
Can use Vite environment variables:
```typescript
// .env.production
VITE_API_BASE_URL=https://production-url.com

// .env.development
VITE_API_BASE_URL=http://localhost:5000

// api.ts
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

## Error Handling

Future service files will implement:
- Try-catch blocks
- HTTP status code handling
- Error message extraction
- User-friendly error messages

## Build Verification

- TypeScript compilation successful
- No build errors
- API endpoints properly typed
- Configuration exported correctly

## Next Steps

The next branch will set up Redux store and filter slice, which will use these API endpoints for fetching and filtering books.

## File Structure

```
src/
  config/
    api.ts  ← API configuration (this branch)
```

## Notes

- Centralized API configuration makes updates easy
- Dynamic endpoint functions prevent string concatenation errors
- Auth headers automatically managed
- Environment detection built-in
- Ready for service layer implementation
- Backwards compatible with fetch and axios
