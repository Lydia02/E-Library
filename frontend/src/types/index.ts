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
  preferences?: Record<string, unknown>;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  genres: string[];
  description: string;
  coverUrl: string;
  coverImage?: string; // Keep for backwards compatibility
  publicationDate: string;
  rating: number;
  totalRatings: number;
  price: number;
  isbn: string;
  pages: number;
  pageCount?: number; // Alias for pages
  language: string;
  publisher: string;
  viewCount?: number;
  inStock?: boolean;
  stockQuantity?: number;
}

export type ReadingStatus = 'to-read' | 'currently-reading' | 'read';

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

export interface ReadingList {
  id: string;
  name: string;
  userId: string;
  bookIds: string[];
  isDefault: boolean;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
}

export interface FilterState {
  searchQuery: string;
  selectedGenres: string[];
  minRating: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

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

export interface ProfileFormData {
  displayName: string;
  bio: string;
  location: string;
  favoriteGenres: string[];
  readingGoal: number;
  photoURL?: string;
}
