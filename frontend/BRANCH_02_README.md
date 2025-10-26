# Branch 02: Styling System (CSS Variables, Bootstrap, Theme)

## Overview
This branch implements the complete styling system for E-Library, including Bootstrap integration, custom CSS variables for theming, light/dark mode support, and sophisticated design elements with gradients and animations.

## Changes Made

### 1. Bootstrap Integration
Updated [main.tsx](src/main.tsx) to import Bootstrap assets:
- **bootstrap/dist/css/bootstrap.min.css** - Bootstrap CSS framework
- **bootstrap/dist/js/bootstrap.bundle.min.js** - Bootstrap JavaScript components
- **bootstrap-icons/font/bootstrap-icons.css** - Bootstrap icon library

### 2. Complete CSS Variable System
Replaced [index.css](src/index.css) with comprehensive styling including:

#### Color Palette (Light & Dark Themes)
**Light Theme:**
- Primary: `#d97706` (Amber/Orange)
- Secondary: `#dc2626` (Red)
- Accent: `#ea580c` (Orange accent)
- Success/Info/Warning/Danger colors

**Dark Theme:**
- Adjusts colors for dark background
- Primary: `#fb923c`
- Secondary: `#f87171`
- Background: `#0c0a09` (deep dark)

#### CSS Variables Defined
```css
:root {
  /* Colors */
  --primary-color, --primary-dark, --primary-light
  --secondary-color, --secondary-dark, --secondary-light
  --accent-color, --accent-light, --accent-dark

  /* Background */
  --bg-primary, --bg-secondary, --bg-tertiary

  /* Text */
  --text-primary, --text-secondary, --text-light

  /* Borders */
  --border-color, --border-light

  /* Gradients */
  --gradient-primary, --gradient-secondary, --gradient-tertiary
  --gradient-success, --gradient-sunset, --gradient-fire
  --gradient-earth, --gradient-warm, --gradient-autumn

  /* Effects */
  --glass-bg, --glass-border (glassmorphism)
  --shadow-xs through --shadow-xl, --shadow-glow
}
```

### 3. Typography System
- **Primary Font**: Inter (sans-serif) - modern, clean
- **Heading Font**: Inter with 800 weight - bold and impactful
- Google Fonts imported for Playfair Display & Inter
- Proper font weights (300-900) available

### 4. Component Styles

#### Buttons
- Custom `.btn` styles with gradients
- `.btn-primary`, `.btn-secondary` with hover effects
- `.btn-outline-primary`, `.btn-outline-light` variants
- Shimmer animation on hover

#### Cards
- Glassmorphism effects
- Smooth hover transitions (translateY, scale)
- Image zoom on hover
- Rounded corners (20px border-radius)
- Shadow effects

#### Forms
- Custom input styling with focus states
- Form labels with uppercase styling
- Input groups with themed backgrounds
- Placeholder color handling in dark mode

#### Navbar
- Glass-like background with blur effect
- Gradient brand logo text
- Active link highlighting
- Smooth hover transitions

### 5. Dark Mode Support
Complete dark mode implementation with:
- `[data-theme="dark"]` selector for all elements
- Automatic color adjustments
- Form element dark styling
- Bootstrap override for dark theme
- Smooth transitions between themes

### 6. Special Features

#### Theme Toggle Styling
- Fixed position floating button
- Pulse glow animation in dark mode
- Smooth rotation and scale on hover
- High z-index for always-visible

#### Scrollbar Customization
- Custom scrollbar with gradient thumb
- Themed track background
- Smooth hover effects

#### Animations
```css
@keyframes fadeInUp - Entrance animation
@keyframes wave - Hero section background
@keyframes pulse-glow - Theme toggle pulse
@keyframes heartBeat - Favorite icon
@keyframes slideInLeft/Right - Slide animations
@keyframes float - Floating elements
```

#### Hero Section
- Full-height hero with gradient background
- Animated SVG wave overlay
- Large hero title (4.5rem)
- Fade-in animations

#### Book Card Styling
- 400px cover image height
- Favorite icon overlay
- Price display with gradient text
- Footer with border-top
- Book details button with icon animation

#### Additional Components
- Pagination styles
- Loading spinner
- Footer styling
- Badge/Label styles
- Alert messages
- Dropdown menus
- Breadcrumbs
- Filter section with glassmorphism

### 7. Responsive Design
Media queries for mobile devices:
- Hero title: 2.5rem on mobile
- Book cover: 300px on mobile
- Theme toggle: smaller size on mobile
- Adjusts for screens < 768px

### 8. Utility Classes
- `.gradient-text` - Gradient text effect
- `.gradient-border` - Gradient borders
- `.glow-on-hover` - Hover glow effect
- `.fade-in-up` - Fade animation
- `.slide-in-left/right` - Slide animations
- `.float-animation` - Floating effect
- `.glass-card` - Glassmorphism card

## Theme System Usage

### Light Mode (Default)
Automatically applied on page load.

### Dark Mode
Applied by adding `data-theme="dark"` attribute to `<html>` element:
```javascript
document.documentElement.setAttribute('data-theme', 'dark');
```

### Switching Themes
Will be implemented in Branch 07 (ThemeToggle component).

## CSS Architecture

### File Size
- **Total Lines**: ~1100+ lines of CSS
- **Includes**: All component styles, animations, theme support
- **Optimized**: For production with proper specificity

### Organization
1. CSS Variables (Root & Dark theme)
2. Base Resets
3. Typography
4. Scrollbar
5. Transitions
6. Theme Toggle
7. Button Styles
8. Card Styles
9. Form Styles
10. Badge/Label Styles
11. Navbar
12. Hero Section
13. Book Cards
14. Pagination
15. Animations
16. Utility Classes
17. Responsive Design

## Build Verification
- Build tested and working successfully
- All Bootstrap assets loading correctly
- CSS compiled without errors
- File size optimized for production

## Integration Points
This styling system is designed to work with:
- Future components (Navbar, Footer, Cards, Forms)
- Theme toggle functionality (Branch 07)
- All page layouts (Branches 10-15)
- Book components (Branch 08)

## Next Steps
The next branch will focus on setting up TypeScript types and interfaces for type-safe development.

## Dependencies Added (Already in package.json)
- bootstrap: ^5.3.8
- bootstrap-icons: ^1.13.1

## Notes
- All colors use CSS variables for easy theming
- Dark mode fully supported across all components
- Animations are smooth and performant
- Glassmorphism effects add modern touch
- Gradients create visual interest
- Mobile-responsive design included
