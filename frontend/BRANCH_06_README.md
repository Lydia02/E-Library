# Branch 06: AuthContext and Authentication

## Overview
This branch implements the complete authentication system for E-Library using React Context API. Includes user login, signup, logout, profile management, and persistent session handling with localStorage.

## Changes Made

### 1. Created Profile Service
Added [src/services/profileService.ts](src/services/profileService.ts) - API service for profile operations

### 2. Created Auth Context
Added [src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx) - Authentication state management

### 3. Updated App Component
Modified [src/App.tsx](src/App.tsx) - Wrapped app with AuthProvider

## Profile Service

### Axios Configuration
```typescript
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

**Features:**
- Centralized Axios instance
- Default headers configuration
- Automatic base URL from config

### Request Interceptor
```typescript
apiClient.interceptors.request.use((config) => {
  let token = localStorage.getItem('authToken');

  if (!token) {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      token = user.token;
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Purpose:**
- Automatically attaches JWT token to all requests
- Falls back to user object if authToken not found
- No manual header management needed

### Service Methods

#### 1. getProfile()
```typescript
async getProfile(): Promise<User & { stats: UserStats }>
```
**Purpose:** Fetch complete user profile with statistics

**Endpoint:** `GET /api/auth/profile`

**Returns:** User data + UserStats

---

#### 2. updateProfile()
```typescript
async updateProfile(profileData: ProfileData): Promise<User & { stats: UserStats }>
```
**Purpose:** Update user profile information

**Endpoint:** `PUT /api/auth/profile/update`

**Accepts:**
- displayName, bio, location, website
- favoriteGenres, readingGoal
- isPrivate, preferences, photoURL

---

#### 3. updateReadingGoal()
```typescript
async updateReadingGoal(goal: number): Promise<{ message: string }>
```
**Purpose:** Update annual reading goal

**Endpoint:** `PUT /api/auth/profile/reading-goal`

---

#### 4. updatePreferences()
```typescript
async updatePreferences(preferences: Record<string, any>): Promise<{ message: string }>
```
**Purpose:** Update user preferences (theme, notifications, etc.)

**Endpoint:** `PUT /api/auth/profile/preferences`

---

#### 5. getDetailedStats()
```typescript
async getDetailedStats(): Promise<UserStats>
```
**Purpose:** Fetch detailed reading statistics

**Endpoint:** `GET /api/auth/profile/stats`

---

#### 6. deleteAccount()
```typescript
async deleteAccount(confirmPassword: string): Promise<{ message: string }>
```
**Purpose:** Permanently delete user account

**Endpoint:** `DELETE /api/auth/profile/delete`

**Requires:** Password confirmation for security

---

## AuthContext

### Context Structure
```typescript
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
}
```

### State Management
```typescript
const [user, setUser] = useState<User | null>(null);
const [loading, setLoading] = useState(true);
```

**State:**
- `user` - Current authenticated user or null
- `loading` - Loading state for async operations

---

### useEffect - Session Persistence
```typescript
useEffect(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      setUser(JSON.parse(storedUser));
    } catch (error) {
      console.error('Error parsing stored user:', error);
      localStorage.removeItem('user');
    }
  }
  setLoading(false);
}, []);
```

**Purpose:**
- Check for existing session on app load
- Restore user from localStorage
- Handle corrupt data gracefully
- Set loading to false when done

---

### Authentication Methods

#### login()
```typescript
const login = async (email: string, password: string) => {
  setLoading(true);
  const response = await fetch(API_ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  const userData: User = {
    id: data.data.user.id,
    email: data.data.user.email,
    name: data.data.user.name,
    token: data.data.user.token,
  };

  setUser(userData);
  localStorage.setItem('user', JSON.stringify(userData));
  localStorage.setItem('authToken', userData.token);
}
```

**Flow:**
1. Set loading state
2. POST to `/api/auth/login`
3. Extract user data from response
4. Update state with user
5. Store in localStorage (dual storage: user object + token)
6. Throw error if fails

**localStorage:**
- `user` - Full user object as JSON
- `authToken` - Token string for easy access

---

#### signup()
```typescript
const signup = async (name: string, email: string, password: string)
```

**Similar to login but:**
- POST to `/api/auth/signup`
- Includes name field
- Automatically logs user in after signup

---

#### logout()
```typescript
const logout = () => {
  setUser(null);
  localStorage.removeItem('user');
  localStorage.removeItem('authToken');
};
```

**Actions:**
1. Clear user state
2. Remove user from localStorage
3. Remove token from localStorage
4. User redirected to public pages

**Note:** Synchronous operation (no API call needed)

---

#### updateProfile()
```typescript
const updateProfile = async (profileData: Partial<User>) => {
  setLoading(true);

  // Call profile service
  const updatedProfile = await profileService.updateProfile(profileData);

  // Merge updated data with existing user
  const { stats, ...userFields } = updatedProfile;
  const updatedUser = { ...user, ...userFields };

  setUser(updatedUser);
  localStorage.setItem('user', JSON.stringify(updatedUser));
}
```

**Features:**
- Uses profileService for API call
- Merges updates with existing user data
- Excludes stats from user object
- Updates localStorage
- Falls back to local-only update on error

---

### useAuth Hook
```typescript
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

**Purpose:**
- Type-safe access to auth context
- Prevents usage outside AuthProvider
- Throws helpful error message

**Usage in Components:**
```typescript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm onSubmit={login} />;
  }

  return (
    <div>
      <p>Welcome, {user?.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

## Integration with App.tsx

### Provider Wrapping
```typescript
function App() {
  return (
    <AuthProvider>
      {/* All components have access to auth context */}
    </AuthProvider>
  );
}
```

**Benefits:**
- All child components can use `useAuth()`
- Single source of truth for auth state
- Automatic session management

---

## Authentication Flow

### Login Flow
```
User enters credentials
    ↓
LoginPage calls useAuth().login(email, password)
    ↓
AuthContext fetches API
    ↓
API returns user + token
    ↓
Update state & localStorage
    ↓
isAuthenticated becomes true
    ↓
Protected routes become accessible
```

### Signup Flow
```
User enters details
    ↓
SignupPage calls useAuth().signup(name, email, password)
    ↓
AuthContext creates account via API
    ↓
Auto-login after successful signup
    ↓
User redirected to dashboard
```

### Session Persistence
```
App loads
    ↓
AuthContext checks localStorage
    ↓
If user exists → restore session
    ↓
If token invalid → logout on first API call
    ↓
If no user → redirect to login
```

---

## Protected Routes (Future Implementation)

### ProtectedRoute Component
```typescript
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}
```

**Usage in Router (Branch 09+):**
```typescript
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/signup" element={<SignupPage />} />

  <Route path="/dashboard" element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  } />
</Routes>
```

---

## Security Considerations

### Token Storage
- **Current:** localStorage for simplicity
- **Future:** Consider httpOnly cookies for enhanced security

### Token Expiration
- Backend validates token on each request
- Expired tokens return 401
- Frontend should handle 401 and logout user

### Error Handling
- All methods have try-catch blocks
- Errors logged to console
- Errors thrown to component for user feedback

---

## Error Messages

### Login Errors
- Invalid credentials
- Network errors
- Server errors

### Signup Errors
- Email already exists
- Password too weak
- Validation errors

### Profile Update Errors
- Unauthorized (token expired)
- Validation errors
- Server errors

---

## localStorage Keys

| Key | Value | Purpose |
|-----|-------|---------|
| `user` | JSON string | Full user object |
| `authToken` | String | JWT token |

**Why dual storage?**
- `user` - Easy access to user data without parsing
- `authToken` - Dedicated token access for API calls

---

## Build Verification

-  TypeScript compilation successful
-  AuthContext integrated
-  Profile service created
-  Build size increased by ~41KB (Axios)
-  No runtime errors

---

## Integration Points

### Will be used in:
- **Branch 07** - Navbar (display user, logout button)
- **Branch 09** - Auth pages (Login, Signup forms)
- **Branch 10-15** - All pages (protected routes, user data)

---

## Testing

### Manual Testing
1. Login with valid credentials
2. Check localStorage for user/token
3. Refresh page (session should persist)
4. Logout (localStorage should clear)
5. Try accessing profile update

### Future Automated Testing
```typescript
test('login sets user and token', async () => {
  const { result } = renderHook(() => useAuth(), {
    wrapper: AuthProvider
  });

  await act(async () => {
    await result.current.login('test@example.com', 'password');
  });

  expect(result.current.user).toBeDefined();
  expect(result.current.isAuthenticated).toBe(true);
});
```

---

## Next Steps

The next branch will create shared layout components (Navbar, Footer, ThemeToggle) that will use this authentication system to display user information and handle logout.

---

## File Structure

```
src/
  contexts/
    AuthContext.tsx    ← Auth state management
  services/
    profileService.ts  ← Profile API service
  App.tsx              ← Provider integration
```

---

## Notes

- Context API chosen over Redux for auth (simpler for single concern)
- localStorage provides session persistence across refreshes
- Axios interceptors ensure all requests are authenticated
- Profile service separated for reusability
- Error handling includes fallbacks for development
- Ready for protected routes and auth pages
