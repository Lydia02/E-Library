# Branch 03: TypeScript Types and Interfaces

## Overview
This branch establishes the complete TypeScript type system for E-Library, providing type-safe development with well-defined interfaces for all data models, contexts, and state management.

## Changes Made

### 1. Created Type Definitions File
Added [src/types/index.ts](src/types/index.ts) with comprehensive TypeScript interfaces.

## Type Definitions

### Core Data Models

#### User Interface
```typescript
export interface User {
  id: string;
  uid?: string;
  email: string;
  name: string;
  displayName?: string;
  token: string;
  photoURL?: string;
  bio?: string;
  location?: string;
  website?: string;
  favoriteGenres?: string[];
  joinDate?: string;
  readingGoal?: number;
  booksRead?: number;
  currentlyReading?: number;
  isPrivate?: boolean;
  preferences?: Record<string, any>;
}
```

**Purpose**: Represents authenticated users with their profile information, reading preferences, and statistics.

**Key Properties**:
- `token` - JWT authentication token
- `favoriteGenres` - User's preferred book genres
- `readingGoal` - Annual reading goal
- `preferences` - Flexible settings storage

---

#### Book Interface
```typescript
export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  genres: string[];
  description: string;
  coverUrl: string;
  coverImage?: string; // Backwards compatibility
  publicationDate: string;
  rating: number;
  totalRatings: number;
  price: number;
  isbn: string;
  pages: number;
  language: string;
  publisher: string;
  viewCount?: number;
  inStock?: boolean;
  stockQuantity?: number;
}
```

**Purpose**: Represents books in the catalog with all metadata.

**Key Properties**:
- `genres` - Array of genres for better filtering
- `rating` - Average rating (0-5)
- `totalRatings` - Number of user ratings
- `coverUrl/coverImage` - Dual support for image field naming

---

#### ReadingStatus Type
```typescript
export type ReadingStatus = 'to-read' | 'currently-reading' | 'read';
```

**Purpose**: Union type for book reading status in user's library.

---

#### UserBook Interface
```typescript
export interface UserBook {
  id: string;
  userId: string;
  bookId?: string; // Optional for custom books
  book?: Book;     // Book data for reference
  title?: string;  // For custom books
  author?: string; // For custom books
  genre?: string;  // For custom books
  coverImage?: string; // Custom cover image URL
  status: ReadingStatus;
  personalRating?: number;
  personalReview?: string;
  dateAdded: string;
  dateStarted?: string;
  dateFinished?: string;
  progress?: number; // Percentage for currently reading
  isCustomBook: boolean;
}
```

**Purpose**: Represents books in a user's personal library with custom metadata.

**Key Features**:
- Supports both catalog books (`bookId`) and custom user books
- Tracks reading progress and dates
- Personal rating and review separate from global ratings
- Progress tracking (0-100%)

---

#### ReadingList Interface
```typescript
export interface ReadingList {
  id: string;
  name: string;
  userId: string;
  bookIds: string[];
  isDefault: boolean;
  createdAt: string;
}
```

**Purpose**: User-created collections/shelves of books.

**Key Properties**:
- `isDefault` - System-generated lists (e.g., "Favorites", "To Read")
- `bookIds` - References to books in the list

---

### Context & State Types

#### AuthContextType Interface
```typescript
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
}
```

**Purpose**: Type definition for AuthContext (React Context API).

**Methods**:
- `login` - Authenticate user with email/password
- `signup` - Register new user
- `logout` - Clear user session
- `updateProfile` - Update user profile data
- `isAuthenticated` - Boolean flag for auth status

---

#### FilterState Interface
```typescript
export interface FilterState {
  searchQuery: string;
  selectedGenres: string[];
  minRating: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}
```

**Purpose**: Redux state for book filtering and sorting.

**Properties**:
- `searchQuery` - Text search in title/author
- `selectedGenres` - Multi-select genre filter
- `minRating` - Minimum rating threshold (0-5)
- `sortBy` - Field to sort by (e.g., "title", "rating", "date")
- `sortOrder` - Ascending or descending

---

### Analytics & Statistics

#### UserStats Interface
```typescript
export interface UserStats {
  totalBooksRead: number;
  currentlyReading: number;
  toRead: number;
  toReadCount: number;
  totalBooks: number;
  favoriteGenres: { genre: string; count: number }[];
  readingGoalProgress: {
    goal: number;
    current: number;
    percentage: number;
  };
  averageRating: number;
  booksAddedThisMonth: number;
  currentStreak: number;
  totalPagesRead: number;
  recentActivity: Array<{
    type: string;
    bookTitle: string;
    bookAuthor: string;
    status: string;
    date: string;
    rating?: number;
  }>;
}
```

**Purpose**: User dashboard analytics and statistics.

**Features**:
- Reading goal tracking with percentage progress
- Favorite genres analysis
- Reading streak calculation
- Recent activity feed
- Total pages read

---

#### ProfileFormData Interface
```typescript
export interface ProfileFormData {
  displayName: string;
  bio: string;
  location: string;
  favoriteGenres: string[];
  readingGoal: number;
  photoURL?: string;
}
```

**Purpose**: Form data structure for profile updates.

**Usage**: Profile edit page forms use this for type-safe form handling.

---

## Type System Benefits

### 1. Type Safety
- Prevents runtime errors from invalid data types
- Autocomplete support in IDEs
- Compile-time error checking

### 2. Documentation
- Self-documenting code with clear interfaces
- Easy to understand data structures
- Reduced need for separate documentation

### 3. Refactoring Support
- Safe refactoring with TypeScript compiler checks
- Find all usages of interfaces
- Automatic error detection on breaking changes

### 4. Developer Experience
- IntelliSense support in VS Code
- Better code navigation
- Reduced bugs from typos

### 5. Maintainability
- Clear contracts between components
- Easier onboarding for new developers
- Consistent data shapes across the app

## Usage Examples

### Importing Types
```typescript
import { User, Book, UserBook, FilterState } from '../types';
```

### Type Annotations
```typescript
const user: User = {
  id: '123',
  email: 'user@example.com',
  name: 'John Doe',
  token: 'abc123'
};

const books: Book[] = await fetchBooks();
const filters: FilterState = {
  searchQuery: 'harry potter',
  selectedGenres: ['Fantasy'],
  minRating: 4,
  sortBy: 'rating',
  sortOrder: 'desc'
};
```

### Function Signatures
```typescript
async function updateUserProfile(
  userId: string,
  data: Partial<User>
): Promise<User> {
  // Implementation
}

function filterBooks(
  books: Book[],
  filters: FilterState
): Book[] {
  // Implementation
}
```

### Component Props
```typescript
interface BookCardProps {
  book: Book;
  onFavorite?: (bookId: string) => void;
}

function BookCard({ book, onFavorite }: BookCardProps) {
  // Component implementation
}
```

## Integration Points

These types will be used in:
- **Branch 04** - API configuration and services
- **Branch 05** - Redux store and slices
- **Branch 06** - AuthContext implementation
- **Branch 07-15** - All components and pages

## File Organization

```
src/
  types/
    index.ts  ← All type definitions (single source of truth)
```

**Philosophy**: Centralized type definitions make it easy to:
- Import from one location
- Maintain consistency
- Update types globally
- Avoid circular dependencies

## Build Verification

- TypeScript compilation successful
- No type errors
- Build completed without warnings
- All interfaces exported correctly

## Next Steps

The next branch will set up API configuration and base services, which will use these type definitions for type-safe HTTP requests and responses.

## Notes

- Optional properties marked with `?` for flexibility
- Union types (`ReadingStatus`) for strict value constraints
- Generic types (`Record<string, any>`) for flexible metadata
- Partial types (`Partial<User>`) for updates
- Backwards compatibility maintained where needed (e.g., `coverUrl` vs `coverImage`)
