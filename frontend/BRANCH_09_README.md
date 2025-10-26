# Branch 09: Authentication Pages

## Overview
This branch implements complete authentication pages including Login, Signup, Forgot Password, and Reset Password. All pages are fully integrated with the AuthContext and include form validation, error handling, and responsive design.

## Changes Made

### 1. Created LoginPage
Added [src/pages/LoginPage.tsx](src/pages/LoginPage.tsx) - User login interface

### 2. Created SignupPage
Added [src/pages/SignupPage.tsx](src/pages/SignupPage.tsx) - User registration interface

### 3. Created ForgotPasswordPage
Added [src/pages/ForgotPasswordPage.tsx](src/pages/ForgotPasswordPage.tsx) - Password reset request

### 4. Created ResetPasswordPage
Added [src/pages/ResetPasswordPage.tsx](src/pages/ResetPasswordPage.tsx) - Password reset completion

### 5. Updated App Routes
Modified [src/App.tsx](src/App.tsx) - Added authentication routes

## Routes Added

```typescript
<Route path="/login" element={<LoginPage />} />
<Route path="/signup" element={<SignupPage />} />
<Route path="/forgot-password" element={<ForgotPasswordPage />} />
<Route path="/reset-password" element={<ResetPasswordPage />} />
```

## LoginPage

### Features
- Email and password input fields
- Remember me checkbox
- Form validation
- Error message display
- Loading state during authentication
- Forgot password link
- Signup link for new users
- Auto-redirect after successful login
- Gradient card design

### Form Structure
```typescript
const [formData, setFormData] = useState({
  email: '',
  password: '',
  rememberMe: false
});
```

### Authentication Flow
1. User enters email and password
2. Form validates inputs (client-side)
3. Calls `useAuth().login(email, password)`
4. Shows loading spinner
5. On success: redirects to dashboard or saved location
6. On error: displays error message

### Redirect Logic
```typescript
const redirectPath = localStorage.getItem('redirectAfterLogin') || '/dashboard';
localStorage.removeItem('redirectAfterLogin');
navigate(redirectPath);
```

**Usage:**
- If user tried to access protected route, redirects there
- Otherwise defaults to dashboard
- Clears saved redirect after use

### Styling
- Centered card layout
- Gradient background
- Glassmorphism effects
- Input icons (email, password)
- Hover effects on buttons
- Responsive design

---

## SignupPage

### Features
- Name, email, and password fields
- Password confirmation field
- Password strength indicator
- Terms of service checkbox
- Form validation
- Error message display
- Loading state
- Auto-login after signup
- Login link for existing users

### Form Structure
```typescript
const [formData, setFormData] = useState({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
});
```

### Validation Rules
- **Name**: Required, minimum 2 characters
- **Email**: Required, valid email format
- **Password**: Required, minimum 8 characters
- **Confirm Password**: Must match password

### Password Strength Indicator
- Weak: < 8 characters
- Medium: 8-12 characters
- Strong: > 12 characters with mixed case/numbers

### Signup Flow
1. User fills registration form
2. Client-side validation
3. Password match verification
4. Calls `useAuth().signup(name, email, password)`
5. On success: auto-login and redirect
6. On error: display error message

### Auto-Login
After successful signup:
```typescript
await signup(name, email, password);
navigate('/dashboard');
```
No need for separate login - already authenticated.

---

## ForgotPasswordPage

### Features
- Email input field
- Email validation
- Send reset link button
- Success message display
- Error handling
- Back to login link
- Instructions text

### Form Structure
```typescript
const [email, setEmail] = useState('');
const [message, setMessage] = useState('');
const [error, setError] = useState('');
```

### Reset Flow
1. User enters email
2. Submits reset request
3. API sends reset email
4. Success message displayed
5. User checks email for link

### API Endpoint
```typescript
POST /api/auth/forgot-password
Body: { email }
```

### Success Message
```
"Password reset link sent to your email. Please check your inbox."
```

### Email Link
Contains token: `/reset-password?token=abc123`

---

## ResetPasswordPage

### Features
- New password input
- Confirm password input
- Password strength indicator
- Token validation
- Form validation
- Error handling
- Success redirect to login

### Form Structure
```typescript
const [formData, setFormData] = useState({
  password: '',
  confirmPassword: ''
});
```

### Token Handling
```typescript
const [searchParams] = useSearchParams();
const token = searchParams.get('token');
```

**Validation:**
- Checks if token exists
- Validates token with API
- Shows error if invalid/expired

### Reset Flow
1. User clicks link from email
2. Token extracted from URL
3. User enters new password
4. Confirms password matches
5. Submits with token
6. On success: redirect to login
7. User logs in with new password

### API Endpoint
```typescript
POST /api/auth/reset-password
Body: { token, newPassword }
```

---

## Common Features Across All Pages

### Form Validation
- Client-side validation before API calls
- Real-time error display
- Required field indicators
- Email format validation
- Password strength checking

### Error Handling
```typescript
try {
  await authFunction();
} catch (error) {
  setError(error.message || 'An error occurred');
}
```

**Error Display:**
- Red alert banner
- Specific error messages from API
- Dismissible alerts

### Loading States
```typescript
const [loading, setLoading] = useState(false);

// During API call
setLoading(true);

// In button
<button disabled={loading}>
  {loading ? 'Loading...' : 'Submit'}
</button>
```

**Visual Feedback:**
- Disabled buttons
- Loading text/spinner
- Prevents double submission

### Responsive Design
- Mobile-first approach
- Stacked layout on mobile
- Centered card on desktop
- Touch-friendly inputs
- Proper spacing

---

## Styling Details

### Card Layout
```css
max-width: 450px
margin: auto
padding: 2.5rem
border-radius: 24px
box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1)
```

### Background
- Gradient overlay
- Pattern or solid color
- Theme-aware (light/dark)

### Input Fields
```css
border: 2px solid var(--border-color)
border-radius: 12px
padding: 0.875rem 1.25rem
focus: border-color: var(--primary-color)
```

### Icons
- Email icon: `bi-envelope`
- Password icon: `bi-lock`
- User icon: `bi-person`
- Eye icon: `bi-eye` (show/hide password)

### Buttons
- Primary gradient background
- Hover elevation
- Box shadow
- Full width on mobile
- Icon + text combination

---

## AuthContext Integration

All pages use:
```typescript
const { login, signup, loading } = useAuth();
```

### Login Integration
```typescript
await login(email, password);
// User automatically set in context
// Token saved to localStorage
// isAuthenticated becomes true
```

### Signup Integration
```typescript
await signup(name, email, password);
// User created and logged in
// Same behavior as login
```

### Error Propagation
Errors from AuthContext are caught and displayed:
```typescript
try {
  await login(email, password);
} catch (error) {
  setError(error.message);
}
```

---

## Navigation Flow

### From Login
- **Success** → Dashboard (or saved redirect)
- **Forgot Password** → ForgotPasswordPage
- **Need Account** → SignupPage

### From Signup
- **Success** → Dashboard (auto-login)
- **Have Account** → LoginPage

### From Forgot Password
- **Back** → LoginPage
- **Success** → Check email message

### From Reset Password
- **Success** → LoginPage with success message
- **Invalid Token** → Error message

---

## Security Features

### Password Requirements
- Minimum 8 characters
- (Can be enhanced with: uppercase, number, special char)

### Token Validation
- Tokens expire after set time (backend)
- Single-use tokens
- Invalid token error handling

### Rate Limiting
- Handled by backend API
- Frontend shows appropriate errors

### HTTPS
- All authentication over HTTPS (production)
- Secure cookie options (if used)

---

## Form Examples

### Login Form
```typescript
<form onSubmit={handleLogin}>
  <input type="email" name="email" required />
  <input type="password" name="password" required />
  <checkbox name="rememberMe" />
  <button type="submit">Login</button>
</form>
```

### Signup Form
```typescript
<form onSubmit={handleSignup}>
  <input type="text" name="name" required />
  <input type="email" name="email" required />
  <input type="password" name="password" required />
  <input type="password" name="confirmPassword" required />
  <button type="submit">Sign Up</button>
</form>
```

---

## Build Verification

- ✅ TypeScript compilation successful
- ✅ All four pages created
- ✅ Routes integrated
- ✅ AuthContext connected
- ✅ Build size: +23KB
- ✅ No runtime errors

---

## Testing Checklist

### LoginPage
- ✅ Email validation
- ✅ Password required
- ✅ Error display
- ✅ Loading state
- ✅ Successful login redirects
- ✅ Forgot password link works
- ✅ Signup link works

### SignupPage
- ✅ Name validation
- ✅ Email validation
- ✅ Password strength indicator
- ✅ Password match validation
- ✅ Successful signup auto-login
- ✅ Login link works

### ForgotPasswordPage
- ✅ Email validation
- ✅ Success message displays
- ✅ Error handling
- ✅ Back to login works

### ResetPasswordPage
- ✅ Token validation
- ✅ Password match check
- ✅ Success redirect to login
- ✅ Invalid token error

---

## Next Steps

The next branch will create the HomePage with hero section and featured books display.

---

## File Structure

```
src/
  pages/
    LoginPage.tsx           ← Login form
    SignupPage.tsx          ← Registration form
    ForgotPasswordPage.tsx  ← Reset request
    ResetPasswordPage.tsx   ← Reset completion
  App.tsx                   ← Routes added
```

---

## Notes

- All pages fully integrated with AuthContext
- Responsive design for mobile and desktop
- Form validation prevents invalid submissions
- Error messages are user-friendly
- Loading states prevent double-submission
- Auto-redirect improves UX
- Password reset flow is complete
- Ready for user authentication in production
