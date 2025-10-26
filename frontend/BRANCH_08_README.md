# Branch 08: Book Display Components

## Overview
This branch implements reusable book display components including BookCard for grid displays, BookCover for intelligent cover loading, book cover generator utility, and book cover service for fetching covers from multiple APIs.

## Changes Made

### 1. Created BookCard Component
Added [src/components/BookCard.tsx](src/components/BookCard.tsx) - Main book display card

### 2. Created BookCover Component
Added [src/components/BookCover.tsx](src/components/BookCover.tsx) - Smart cover image component

### 3. Created Book Cover Generator
Added [src/utils/bookCoverGenerator.ts](src/utils/bookCoverGenerator.ts) - SVG fallback covers

### 4. Created Book Cover Service
Added [src/services/bookCoverService.ts](src/services/bookCoverService.ts) - API service for covers

## BookCard Component

### Purpose
Primary component for displaying books in grid/list views throughout the application.

### Props
```typescript
interface BookCardProps {
  book: Book;
  onToggleFavorite?: (bookId: string) => void;
  isFavorite?: boolean;
}
```

### Features

#### Visual Design
- **Card Hover Effect**: Elevates on hover with shadow
- **Glassmorphism**: Modern transparent effects
- **Gradient Overlays**: Subtle image overlays
- **Responsive**: Adapts to container size
- **Rounded Corners**: 24px border radius

#### Book Cover
- **320px Height**: Consistent cover display
- **Image Zoom**: Scale effect on hover
- **Fallback SVG**: Generic covers if image fails
- **Multiple Sources**: Tries coverUrl, coverImage, or generates SVG

#### Favorite Button
- **Fixed Position**: Top-right corner
- **Toggle State**: Heart icon (filled/outline)
- **Gradient Background**: When favorited
- **Click Prevention**: Stops event propagation

#### Rating Display
- **Star Icons**: Full, half, and empty stars
- **Numeric Rating**: Displayed alongside stars
- **Color**: Golden yellow (#f59e0b)
- **Dynamic**: Based on book.rating value

#### Content Sections
1. **Title**: 2-line clamp with ellipsis
2. **Author**: Secondary text color
3. **Rating + Genre**: Side-by-side display
4. **Description**: 2-line preview
5. **Price + CTA**: Bottom section with button

#### Price Display
- **Large Font**: Gradient text effect
- **"Best Price" Label**: Small uppercase text
- **Responsive Sizing**: clamp() for flexibility

#### View Button
- **Hover State**: Fills with gradient
- **Arrow Icon**: Indicates navigation
- **Responsive**: Adjusts to card width

### Generic Cover Generator

```typescript
const getGenericBookCover = (title: string) => {
  // 5 gradient variations
  // Book emojis (📚📖📘📗📙)
  // Encoded as base64 SVG
  // Deterministic selection based on title
}
```

**Gradients:**
1. Orange to Red (#ea580c → #dc2626)
2. Red to Dark Red (#dc2626 → #991b1b)
3. Amber to Orange (#d97706 → #ea580c)
4. Yellow to Amber (#fbbf24 → #f59e0b)
5. Amber to Red (#f59e0b → #dc2626)

**Selection Logic:**
- Uses first character of title
- `charCodeAt(0) % 5` = consistent color per book

### Star Rating Function

```typescript
const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  // Returns array of star icons
}
```

**Examples:**
- 4.7 → ⭐⭐⭐⭐⭐ (5 stars)
- 4.3 → ⭐⭐⭐⭐☆ (4.5 stars shown as 4)
- 3.5 → ⭐⭐⭐⭐☆ (3.5 stars)

---

## BookCover Component

### Purpose
Intelligent book cover component that tries multiple sources before falling back to generated covers.

### Props
```typescript
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
```

### Cover Loading Strategy

**Priority Order:**
1. Custom cover URL (if provided)
2. Open Library by ISBN
3. Google Books API
4. Open Library by title
5. Generated SVG fallback

### Image Source Array
```typescript
const getPotentialCovers = async () => {
  covers.push(customCoverUrl);
  covers.push(`https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`);
  covers.push(...googleBooksCovers);
  covers.push(`https://covers.openlibrary.org/b/title/${cleanTitle}-L.jpg`);
  // Fallback: getGenericBookCover()
}
```

### Error Handling
```typescript
const handleImageError = () => {
  const nextIndex = imageAttemptIndex + 1;

  if (nextIndex < possibleImages.length) {
    // Try next source
    setCurrentImageUrl(possibleImages[nextIndex]);
  } else {
    // All failed, use fallback
    setCurrentImageUrl(getGenericBookCover());
  }
};
```

**Cascade Behavior:**
- Tries each source in order
- Moves to next on error
- Never shows broken images
- Always displays something

### Loading State
```typescript
{isLoading && (
  <div className="spinner-border text-primary">
    <span className="visually-hidden">Loading...</span>
  </div>
)}
```

**Features:**
- Shows spinner while loading
- Positioned over image area
- Bootstrap spinner component
- Disappears on load or error

### Generic Cover Generation

```typescript
const getGenericBookCover = () => {
  // 7 color scheme variations
  // Multi-line title wrapping
  // Genre badge
  // Book icon placeholder
  // SVG with gradients and filters
}
```

**Color Schemes:**
1. Dark Blue (#2c3e50)
2. Purple (#8e44ad)
3. Blue (#2980b9)
4. Green (#27ae60)
5. Orange (#d35400)
6. Red (#c0392b)
7. Gray (#7f8c8d)

**Title Wrapping:**
- Max 12 characters per line
- Up to 3 lines
- Centered text
- White with opacity

---

## bookCoverGenerator.ts Utility

### Purpose
Standalone utility for generating generic book covers as SVG data URLs.

### Function
```typescript
export const generateGenericBookCover = (title: string): string => {
  // Returns base64-encoded SVG as data URL
}
```

### Cover Variations
1. **Purple Gradient** - 📚 emoji
2. **Pink Gradient** - 📖 emoji
3. **Blue Gradient** - 📘 emoji
4. **Green Gradient** - 📗 emoji
5. **Orange Gradient** - 📙 emoji

### Title Handling
```typescript
<tspan x="100" dy="0">${title.substring(0, 14)}</tspan>
${title.length > 14 ? `<tspan x="100" dy="18">${title.substring(14, 28)}</tspan>` : ''}
```

**Features:**
- First line: up to 14 chars
- Second line: up to 14 more chars
- Total: 28 characters max
- Centered with proper spacing

### SVG Structure
```svg
<svg width="200" height="300">
  <linearGradient>...</linearGradient>
  <rect fill="url(#grad)"/>
  <text>📚</text>
  <text>Title Line 1</text>
  <text>Title Line 2</text>
</svg>
```

---

## bookCoverService.ts

### Purpose
API service for fetching book covers from external sources.

### Methods

#### 1. getBookCover()
```typescript
static async getBookCover(
  title: string,
  author?: string,
  isbn?: string
): Promise<string | null>
```

**Features:**
- Caching with Map
- Tests each source
- Returns first valid image
- Returns null if all fail

#### 2. buildCoverSources()
```typescript
private static buildCoverSources(
  title: string,
  author?: string,
  isbn?: string
): string[]
```

**Sources Built:**
```typescript
[
  `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`,
  `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`,
  `https://covers.openlibrary.org/b/title/${title}-L.jpg`,
  `https://covers.openlibrary.org/b/isbn/${isbn}-S.jpg`
]
```

#### 3. testImageUrl()
```typescript
private static async testImageUrl(url: string): Promise<boolean>
```

**Validation:**
- Creates Image object
- 3-second timeout
- Checks dimensions > 10x10
- Prevents 1x1 placeholders

#### 4. getGoogleBooksData()
```typescript
static async getGoogleBooksData(
  title: string,
  author?: string
): Promise<any>
```

**API Call:**
```
GET https://www.googleapis.com/books/v1/volumes?q={query}&maxResults=5
```

#### 5. extractGoogleBooksCovers()
```typescript
static extractGoogleBooksCovers(apiResponse: any): string[]
```

**Priority:**
1. extraLarge
2. large
3. medium
4. small
5. thumbnail

### Caching System
```typescript
private static coverCache = new Map<string, string>();
const cacheKey = `${title}-${author || ''}-${isbn || ''}`;
```

**Benefits:**
- Avoids repeated API calls
- Faster subsequent loads
- Memory-based (session only)

---

## Integration Examples

### Using BookCard
```typescript
import BookCard from '../components/BookCard';

<div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
  {books.map(book => (
    <BookCard
      key={book.id}
      book={book}
      onToggleFavorite={handleToggleFavorite}
      isFavorite={favoriteIds.includes(book.id)}
    />
  ))}
</div>
```

### Using BookCover
```typescript
import BookCover from '../components/BookCover';

<BookCover
  title={book.title}
  author={book.author}
  isbn={book.isbn}
  customCoverUrl={book.coverUrl}
  genre={book.genre}
  className="img-fluid"
  style={{ borderRadius: '12px' }}
/>
```

### Using Generator
```typescript
import { generateGenericBookCover } from '../utils/bookCoverGenerator';

const fallbackCover = generateGenericBookCover(book.title);

<img src={fallbackCover} alt={book.title} />
```

---

## Responsive Design

### BookCard Breakpoints
```css
.row-cols-1        /* Mobile: 1 column */
.row-cols-md-2     /* Tablet: 2 columns */
.row-cols-lg-3     /* Desktop: 3 columns */
.row-cols-xl-4     /* Large: 4 columns */
```

### Font Sizes (clamp)
```css
font-size: clamp(0.8rem, 1.8vw, 0.95rem)
padding: clamp(0.7rem, 1.8vw, 0.9rem)
```

**Benefits:**
- Smooth scaling
- No media queries needed
- Min/ideal/max values

---

## Build Verification

- ✅ TypeScript compilation successful
- ✅ All components created
- ✅ Services and utilities added
- ✅ No build errors
- ✅ Ready for page integration

---

## Usage in Future Branches

### Branch 10 - HomePage
- Featured books grid with BookCard

### Branch 11 - BooksPage
- Filtered books with BookCard
- Genre-based displays

### Branch 12 - BookDetailPage
- Large BookCover display
- Related books with BookCard

### Branch 13 - LibraryPage
- User's books with BookCard
- Custom covers support

### Branch 15 - FavoritesPage
- Favorite books grid
- Toggle favorites functionality

---

## File Structure

```
src/
  components/
    BookCard.tsx         ← Main book card
    BookCover.tsx        ← Smart cover loader
  services/
    bookCoverService.ts  ← Cover API service
  utils/
    bookCoverGenerator.ts ← SVG generator
```

---

## Next Steps

The next branch will create authentication pages (Login, Signup, Forgot Password, Reset Password) that use the AuthContext we set up earlier.

---

## Notes

- BookCard is the primary display component
- BookCover handles complex loading logic
- Generator provides instant fallbacks
- Service enables external API integration
- All components fully typed
- Responsive and accessible
- Ready for production use
