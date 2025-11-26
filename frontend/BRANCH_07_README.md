# Branch 07: Layout Components (Navbar, Footer, ThemeToggle)

## Overview
This branch implements the core layout components for E-Library: a responsive navigation bar with authentication state, a footer with links and information, and a theme toggle button for light/dark mode switching. Also includes React Router integration.

## Changes Made

### 1. Created Navbar Component
Added [src/components/Navbar.tsx](src/components/Navbar.tsx) - Full-featured navigation with auth

### 2. Created Footer Component
Added [src/components/Footer.tsx](src/components/Footer.tsx) - Site footer with links

### 3. Created ThemeToggle Component
Added [src/components/ThemeToggle.tsx](src/components/ThemeToggle.tsx) - Dark/Light mode toggle

### 4. Updated App Component
Modified [src/App.tsx](src/App.tsx) - Integrated Router and layout components

## Navbar Component

### Features
- **Responsive Design**: Mobile-friendly with Bootstrap collapse
- **Auth Integration**: Shows different menu based on login status
- **Active Link Highlighting**: Current page highlighted with gradient
- **User Dropdown**: Account menu with profile, library, settings
- **Fixed Position**: Always visible at top of page
- **Glassmorphism**: Blurred transparent background effect

### Structure

#### Brand Logo
```tsx
<Link to="/">
  <div> Icon</div>
  <span>E-Library</span>
</Link>
```
- Gradient text effect
- Book icon in gradient box
- Links to homepage

#### Navigation Links (All Users)
- **Home** - `/`
- **Browse** - `/books`
- **Share Book** - `/add-community-book` (requires login)

#### Authenticated User Menu
- **Dashboard** - `/dashboard`
- **Favorites** - `/favorites`
- **Account Dropdown**:
  - User avatar (first letter of name)
  - My Profile
  - My Library
  - Add Book
  - Logout button

#### Non-Authenticated Menu
- **Login** - `/login`
- **Sign Up** - `/signup` (gradient button)

### Styling Features
- Fixed top positioning
- Glassmorphism background
- Hover effects on all links
- Active state with gradient background
- Smooth transitions
- Mobile hamburger menu
- Bootstrap dropdown integration

### Share Book Button Logic
```typescript
const handleAddCommunityBook = () => {
  if (!isAuthenticated) {
    localStorage.setItem('redirectAfterLogin', '/add-community-book');
    navigate('/login');
  } else {
    navigate('/add-community-book');
  }
};
```
- Redirects to login if not authenticated
- Saves intended destination
- Navigates after successful login

---

## Footer Component

### Features
- 4-column responsive layout
- Social media links
- Quick navigation links
- Category links
- Contact information
- Copyright notice
- Policy links

### Sections

#### Column 1: Brand & Social
- E-Library branding
- Tagline
- Social media icons (Facebook, Twitter, Instagram, LinkedIn)

#### Column 2: Quick Links
- Home
- Discover Books
- Favorites

#### Column 3: Categories
- Fiction
- Non-Fiction
- Science Fiction
- Mystery

#### Column 4: Contact
- Email: info@elibrary.com
- Phone: +1 (555) 123-4567
- Address: 123 Book Street, Reading City

#### Footer Bottom
- Copyright with dynamic year
- Privacy Policy
- Terms of Service
- Cookie Policy

### Styling
- Dark background from CSS variables
- Consistent spacing
- Responsive grid layout
- Icon integration
- Hover effects on links

---

## ThemeToggle Component

### Features
- Fixed position floating button
- Smooth theme transitions
- localStorage persistence
- System preference detection
- Icon changes (sun/moon)
- Pulse animation in dark mode

### Theme Detection
```typescript
useEffect(() => {
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    setIsDark(true);
    document.documentElement.setAttribute('data-theme', 'dark');
  }
}, []);
```

**Priority Order:**
1. Saved theme in localStorage
2. System/browser preference
3. Default (light mode)

### Toggle Function
```typescript
const toggleTheme = (event: React.MouseEvent) => {
  event.preventDefault();
  event.stopPropagation();

  const newTheme = !isDark;
  setIsDark(newTheme);

  document.documentElement.classList.add('theme-transitioning');

  if (newTheme) {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
  }

  setTimeout(() => {
    document.documentElement.classList.remove('theme-transitioning');
  }, 400);
};
```

**Actions:**
1. Prevent default behavior
2. Toggle state
3. Add transition class for smooth animation
4. Set/remove `data-theme` attribute on `<html>`
5. Save to localStorage
6. Remove transition class after 400ms

### Button Position
- Fixed to bottom-right corner
- z-index: 9999 (always on top)
- Floating above all content
- Mobile-responsive positioning

### Icons
- **Light Mode**: Moon icon (`bi-moon-stars-fill`)
- **Dark Mode**: Sun icon (`bi-sun-fill`)

---

## App.tsx Integration

### Router Setup
```tsx
<Router>
  <AuthProvider>
    <Navbar />
    <ThemeToggle />
    <div style={{ minHeight: 'calc(100vh - 200px)', paddingTop: '80px' }}>
      <Routes>
        {/* Routes here */}
      </Routes>
    </div>
    <Footer />
  </AuthProvider>
</Router>
```

**Structure:**
1. BrowserRouter wrapper
2. AuthProvider for auth state
3. Navbar (fixed top)
4. ThemeToggle (fixed bottom-right)
5. Main content area with padding for navbar
6. Footer at bottom

### Content Area Styling
- `minHeight: calc(100vh - 200px)` - Push footer to bottom
- `paddingTop: 80px` - Space for fixed navbar
- Prevents content from hiding under navbar

---

## Authentication Integration

### useAuth Hook Usage
```typescript
const { user, logout, isAuthenticated } = useAuth();
```

**Navbar displays:**
- User name and email in dropdown
- User avatar (first letter)
- Logout functionality
- Conditional menu items

**When authenticated:**
- Shows Dashboard, Favorites, Account dropdown
- Hides Login/Signup buttons

**When not authenticated:**
- Shows Login/Signup buttons
- Hides Dashboard, Favorites, Account dropdown

---

## React Router Integration

### Hooks Used
- `useLocation()` - Get current path for active link highlighting
- `useNavigate()` - Programmatic navigation
- `Link` - Declarative navigation

### Active Link Detection
```typescript
const isActive = (path: string) => {
  return location.pathname === path;
};
```

**Usage:**
```typescript
style={{
  color: isActive('/dashboard') ? 'white' : 'var(--text-primary)',
  background: isActive('/dashboard') ? 'var(--gradient-primary)' : 'transparent'
}}
```

---

## Responsive Design

### Navbar Breakpoints
- **Desktop (lg+)**: Full horizontal menu
- **Mobile (<lg)**: Hamburger menu with collapse

### Navbar Mobile Features
- Hamburger icon
- Collapsible menu
- Vertical stacked links
- Full-width dropdown

### Footer Breakpoints
- **Desktop (lg)**: 4 columns
- **Tablet (md)**: 2 columns
- **Mobile (sm)**: Single column stack

### ThemeToggle Mobile
- Smaller button size
- Adjusted bottom/right positioning
- Same functionality

---

## Styling Details

### CSS Variables Used
- `--gradient-primary` - Brand gradients
- `--bg-secondary` - Hover backgrounds
- `--text-primary` - Text colors
- `--border-light` - Borders
- `--primary-color` - Icon colors
- `--danger-color` - Logout button

### Glassmorphism Effect
```tsx
style={{
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderBottom: '1px solid var(--border-light)',
  boxShadow: '0 2px 16px rgba(0, 0, 0, 0.04)'
}}
```

### Hover Effects
All nav links have:
- `onMouseEnter` - Apply hover styles
- `onMouseLeave` - Remove hover styles
- Smooth transitions

---

## Build Verification

-  TypeScript compilation successful
-  All three components created
-  Router integrated
-  Build size increased by ~45KB (React Router)
-  No runtime errors

---

## Integration Points

### Current Usage
- Visible on all pages
- Theme persists across sessions
- Auth state updates navbar in real-time

### Future Pages Will Use
- **Branch 09** - Auth pages (redirect after login)
- **Branch 10-15** - All pages benefit from navbar/footer/theme

---

## localStorage Keys

| Key | Value | Purpose |
|-----|-------|---------|
| `theme` | 'light' \| 'dark' | Theme preference |
| `redirectAfterLogin` | path string | Where to go after login |

---

## Testing Checklist

### Navbar
-  Brand logo links to home
-  Active link highlighting
-  Mobile menu collapse
-  Authenticated menu appears when logged in
-  Login/Signup buttons appear when logged out
-  Logout button works
-  Dropdown menu functions

### Footer
-  All links clickable
-  Responsive layout
-  Social icons visible
-  Dynamic year displayed

### ThemeToggle
-  Toggles between light/dark mode
-  Saves preference to localStorage
-  Respects system preference
-  Icon changes correctly
-  Smooth transition animation

---

## Next Steps

The next branch will create book display components (BookCard, BookCover, EnhancedBookCard) that will be used throughout the application to display book information.

---

## File Structure

```
src/
  components/
    Navbar.tsx         ← Navigation bar
    Footer.tsx         ← Site footer
    ThemeToggle.tsx    ← Theme switcher
  App.tsx              ← Router & layout integration
```

---

## Notes

- Navbar uses fixed positioning (always visible)
- ThemeToggle button styled in index.css
- Footer uses semantic `<footer>` tag
- All components fully typed with TypeScript
- Bootstrap components for dropdown/collapse
- React Router v7 compatible
- Ready for page components in next branches
