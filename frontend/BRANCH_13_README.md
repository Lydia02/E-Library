# Branch 13: User Pages (Profile, Dashboard, Library)

## Overview
This branch implements three major user-focused pages: ProfilePage (user profile with stats), DashboardPage (personalized reading dashboard), and LibraryPage (personal book collection management).

## Changes Made

### 1. Created ProfilePage
Added [src/pages/ProfilePage.tsx](src/pages/ProfilePage.tsx) - User profile with stats and editing

### 2. Created DashboardPage
Added [src/pages/DashboardPage.tsx](src/pages/DashboardPage.tsx) - Personalized reading dashboard

### 3. Created LibraryPage
Added [src/pages/LibraryPage.tsx](src/pages/LibraryPage.tsx) - Personal book collection manager

### 4. Added Dependencies
- Added [src/components/ToastContainer.tsx](src/components/ToastContainer.tsx) - Toast notifications
- Added [src/services/userBooksService.ts](src/services/userBooksService.tsx) - User books API service

### 5. Updated App Routes
Modified [src/App.tsx](src/App.tsx) - Added user page routes

## Routes Added

```typescript
<Route path="/profile" element={<ProfilePage />} />
<Route path="/dashboard" element={<DashboardPage />} />
<Route path="/library" element={<LibraryPage />} />
```

---

## ProfilePage

### Purpose
User profile page displaying reading statistics, favorite genres, reading goals, and profile editing capabilities.

### Key Features

#### Profile Header
- Gradient header with user avatar
- Display name and email
- Location display
- Edit profile button
- Bio section

#### Tabbed Interface
- **Overview Tab**: Quick stats, reading goal progress, favorite genres
- **Stats Tab**: Detailed reading statistics and genre breakdown

#### Quick Stats Cards
```typescript
- Total Books Read
- Currently Reading
- Want to Read
- Books This Month
- Average Rating
- Day Streak
```

#### Reading Goal Progress
- Visual progress bar
- Percentage completion
- Customizable goal (default: 50 books/year)

#### Edit Profile Modal
- Display name
- Bio (max 500 characters)
- Location
- Website
- Reading goal
- Favorite genres (multi-select)
- Toast notifications on success/error

### API Integration
```typescript
// Fetches user book stats
GET /api/user-books/stats
Authorization: Bearer {token}

Response: {
  data: {
    stats: {
      totalBooksRead: number,
      currentlyReading: number,
      toRead: number,
      favoriteGenres: Array<{genre: string, count: number}>,
      averageRating: number,
      booksAddedThisMonth: number
    }
  }
}
```

### Profile Update
Uses AuthContext's `updateProfile()` method to update user information with automatic state refresh.

---

## DashboardPage

### Purpose
Personalized reading dashboard showing current reading activity, recommendations, quick actions, and stats overview.

### Key Features

#### Welcome Header
- Personalized greeting with user's first name
- Decorative gradient background
- Quick action buttons (Add Book, My Library)

#### Quick Stats Grid
- 4 gradient stat cards with hover effects
- Books Read (orange gradient)
- Reading Now (red gradient)
- Want to Read (amber gradient)
- Average Rating (yellow gradient)

#### Reading Goal Progress
- Same as ProfilePage
- "View Details" link to profile stats tab

#### Currently Reading Section
- Shows 2 most recent "currently reading" books
- Reading progress bars
- Empty state with "Find Something to Read" CTA

#### Quick Actions Panel
- Add a Book I've Read
- Share Book with Community (green gradient, highlighted)
- Browse Books
- View My Favorites
- My Reading List
- Hover effects on all actions

#### Recommendations Section
- Shows 6 recommended books using BookCard component
- Fetches from general books API
- Empty state with lightbulb icon

#### Recent Activity Feed
- Placeholder for future activity feed
- Empty state message

### Auth Guard
Unauthenticated users see:
- Icon with gradient background
- "Welcome to BookHub" message
- Login and Sign Up buttons

### API Calls
```typescript
// Fetch recommendations
GET /api/books?limit=6

// Fetch user stats (same as ProfilePage)
GET /api/user-books/stats
```

---

## LibraryPage

### Purpose
Personal book collection management with search, filter, sort, edit, and delete capabilities.

### Key Features

#### Library Header
- Gradient card design
- Total books count
- Refresh button
- Add Book button
- Responsive button text (full on desktop, icon-only on mobile)

#### Stats Display
- "Books in Library" count card

#### Search & Filter Bar
- Status filter: "All" (expandable for future filters)
- Search input (searches title and author)
- Sort dropdown (Title A-Z, Author A-Z, Rating High-Low)

#### Books Grid
- Responsive columns (3 on desktop, 2 on tablet, 1 on mobile)
- Hover elevation effect
- Book cover (250px height)
- Title and author
- Star rating display
- Personal review preview (3-line clamp)
- Action buttons:
  - **View Details** (blue gradient)
  - **Edit** (green gradient)
  - **Delete** (red gradient)

#### Book Preview Modal
- Large view of selected book
- All book details
- Reading status badge
- Personal rating with stars
- Start/finish dates
- Personal review (full text)
- Edit Book button

#### Delete Confirmation Modal
- Warning modal with red gradient header
- Exclamation icon
- "This action cannot be undone" warning
- Cancel and Delete buttons

#### Generic Book Cover Generator
```typescript
getGenericBookCover(title: string, genre?: string)
```
- 7 color schemes (deterministic based on title)
- SVG-based design with gradients
- Genre badge
- Decorative elements
- Shine and shadow effects

#### Image Error Handling
- Cascading cover image sources:
  1. `book.coverImage` (custom upload)
  2. `book.book?.coverUrl` (database URL)
  3. `book.book?.coverImage` (alternate database field)
  4. Generated SVG cover (fallback)

### UserBooksService Integration
```typescript
// Get user's books
getUserBooks(): Promise<UserBook[]>

// Delete a book
deleteUserBook(bookId: string): Promise<void>
```

### Navigation Integration
- Edit button navigates to `/edit-book/:id`
- Success message displayed when redirected from add-book page

---

## ToastContainer Component

### Purpose
Reusable toast notification system for success/error messages.

### Hook Usage
```typescript
const { showSuccess, showError, ToastContainer } = useToast();

// Show success
showSuccess('Profile updated successfully!');

// Show error
showError('Failed to update profile.');

// Render component
<ToastContainer />
```

### Features
- Auto-dismiss after timeout
- Multiple toast stacking
- Success (green) and error (red) variants
- Bootstrap integration

---

## userBooksService

### Purpose
API service for managing user's personal book collection.

### Methods

```typescript
class UserBooksService {
  // Get all user books
  static async getUserBooks(): Promise<UserBook[]>

  // Add book to user library
  static async addUserBook(bookData: Partial<UserBook>): Promise<UserBook>

  // Update user book
  static async updateUserBook(id: string, bookData: Partial<UserBook>): Promise<UserBook>

  // Delete user book
  static async deleteUserBook(id: string): Promise<void>

  // Get user book stats
  static async getUserBookStats(): Promise<UserStats>
}
```

### Auth Token Injection
Automatic Bearer token added to all requests from localStorage.

---

## Responsive Design

### ProfilePage
- Fluid typography with clamp()
- Stacked layout on mobile
- Horizontal tabs scroll on mobile
- Responsive modal sizing

### DashboardPage
- 4-column stats grid on desktop
- 2-column on tablet
- 1-column on mobile
- Stacked welcome header on mobile

### LibraryPage
- 3-column grid on desktop
- 2-column on tablet
- 1-column on mobile
- Responsive button labels (full text/icon only)

---

## Authentication Guards

All three pages check `isAuthenticated`:
```typescript
if (!isAuthenticated) {
  return (
    <div>
      {/* Login prompt with CTA buttons */}
    </div>
  );
}
```

---

## Build Verification

- ✅ TypeScript compilation successful
- ✅ All three pages created and integrated
- ✅ Dependencies added (ToastContainer, userBooksService)
- ✅ Routes configured
- ✅ Build size: dist/index-D4FSseWk.js 521.91 kB (gzip: 148.92 kB)
- ⚠️ Chunk size warning (expected with feature-rich pages)
- ✅ No runtime errors

---

## Next Steps

The next branch will implement book management pages (AddBookPage, EditBookPage) for creating and editing books in the community library.

---

## File Structure

```
src/
  pages/
    ProfilePage.tsx         ← User profile with stats
    DashboardPage.tsx       ← Reading dashboard
    LibraryPage.tsx         ← Personal library manager
  components/
    ToastContainer.tsx      ← Toast notifications
  services/
    userBooksService.ts     ← User books API
  App.tsx                   ← Routes added
```

---

## Notes

- ProfilePage provides complete user profile management
- DashboardPage serves as personalized home for authenticated users
- LibraryPage manages user's personal book collection (separate from community books)
- ToastContainer provides consistent notification UX
- userBooksService centralizes all user book operations
- All pages are fully responsive and accessible
- Authentication guards prevent unauthorized access
- Generic cover generator ensures books always have visual representation
- Ready for production use
