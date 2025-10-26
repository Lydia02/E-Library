# Branch 05: Redux Store and Filter Slice

## Overview
This branch implements Redux state management for E-Library, specifically focusing on book filtering and sorting functionality. Uses Redux Toolkit for modern, simplified Redux setup.

## Changes Made

### 1. Created Redux Store
Added [src/redux/store.ts](src/redux/store.ts) - Redux store configuration

### 2. Created Filter Slice
Added [src/redux/filterSlice.ts](src/redux/filterSlice.ts) - Filter state management

### 3. Created Typed Hooks
Added [src/redux/hooks.ts](src/redux/hooks.ts) - TypeScript-enhanced hooks

### 4. Updated Main Entry
Modified [src/main.tsx](src/main.tsx) - Wrapped app with Redux Provider

## Redux Store Configuration

### store.ts
```typescript
import { configureStore } from '@reduxjs/toolkit';
import filterReducer from './filterSlice';

export const store = configureStore({
  reducer: {
    filter: filterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

**Key Features:**
- Uses Redux Toolkit's `configureStore` (includes Redux DevTools by default)
- Single reducer: `filter` for book filtering
- Exports TypeScript types for type-safe access

**Type Exports:**
- `RootState` - Type of entire Redux state tree
- `AppDispatch` - Type of dispatch function

---

## Filter Slice

### Initial State
```typescript
const initialState: FilterState = {
  searchQuery: '',
  selectedGenres: [],
  minRating: 0,
  sortBy: 'title',
  sortOrder: 'asc',
};
```

**Default Values:**
- No search query
- No genre filters
- Show all ratings (0+)
- Sort by title, ascending

### Reducers (Actions)

#### 1. setSearchQuery
```typescript
setSearchQuery: (state, action: PayloadAction<string>) => {
  state.searchQuery = action.payload;
}
```
**Purpose:** Update search text for title/author filtering

**Usage:**
```typescript
dispatch(setSearchQuery('harry potter'));
```

---

#### 2. setSelectedGenres
```typescript
setSelectedGenres: (state, action: PayloadAction<string[]>) => {
  state.selectedGenres = action.payload;
}
```
**Purpose:** Replace entire genre filter array

**Usage:**
```typescript
dispatch(setSelectedGenres(['Fantasy', 'Adventure']));
```

---

#### 3. toggleGenre
```typescript
toggleGenre: (state, action: PayloadAction<string>) => {
  const genre = action.payload;
  if (state.selectedGenres.includes(genre)) {
    state.selectedGenres = state.selectedGenres.filter(g => g !== genre);
  } else {
    state.selectedGenres.push(genre);
  }
}
```
**Purpose:** Toggle individual genre on/off

**Usage:**
```typescript
dispatch(toggleGenre('Fantasy')); // Add Fantasy
dispatch(toggleGenre('Fantasy')); // Remove Fantasy
```

**Logic:**
- If genre exists → remove it
- If genre doesn't exist → add it

---

#### 4. setMinRating
```typescript
setMinRating: (state, action: PayloadAction<number>) => {
  state.minRating = action.payload;
}
```
**Purpose:** Set minimum rating threshold

**Usage:**
```typescript
dispatch(setMinRating(4)); // Show only 4+ star books
```

---

#### 5. setSortBy
```typescript
setSortBy: (state, action: PayloadAction<FilterState['sortBy']>) => {
  state.sortBy = action.payload;
}
```
**Purpose:** Change sort field

**Usage:**
```typescript
dispatch(setSortBy('rating'));
dispatch(setSortBy('title'));
dispatch(setSortBy('date'));
```

---

#### 6. setSortOrder
```typescript
setSortOrder: (state, action: PayloadAction<FilterState['sortOrder']>) => {
  state.sortOrder = action.payload;
}
```
**Purpose:** Change sort direction

**Usage:**
```typescript
dispatch(setSortOrder('asc'));  // Ascending
dispatch(setSortOrder('desc')); // Descending
```

**Type-Safe:** Only accepts `'asc'` or `'desc'`

---

#### 7. resetFilters
```typescript
resetFilters: (state) => {
  state.searchQuery = '';
  state.selectedGenres = [];
  state.minRating = 0;
  state.sortBy = 'title';
  state.sortOrder = 'asc';
}
```
**Purpose:** Clear all filters, return to defaults

**Usage:**
```typescript
dispatch(resetFilters());
```

---

## Typed Redux Hooks

### hooks.ts
```typescript
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

**Benefits:**
- Type-safe dispatch (autocomplete for actions)
- Type-safe selector (autocomplete for state)
- No manual typing needed in components

**Usage in Components:**
```typescript
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setSearchQuery, resetFilters } from '../redux/filterSlice';

function BooksPage() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(state => state.filter);

  const handleSearch = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  return (
    <div>
      <p>Search: {filters.searchQuery}</p>
      <button onClick={() => dispatch(resetFilters())}>
        Clear Filters
      </button>
    </div>
  );
}
```

---

## Provider Integration

### Updated main.tsx
```typescript
import { Provider } from 'react-redux'
import { store } from './redux/store'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
```

**Changes:**
- Import Redux `Provider` and `store`
- Wrap `<App />` with `<Provider store={store}>`
- Makes Redux state available to all components

---

## Redux DevTools

Redux Toolkit includes Redux DevTools Extension support by default.

**Features:**
- Time-travel debugging
- Action history
- State diff viewer
- Action replay

**Access:**
1. Install Redux DevTools browser extension
2. Open browser DevTools
3. Navigate to "Redux" tab
4. View actions and state changes in real-time

---

## State Structure

```typescript
{
  filter: {
    searchQuery: string,
    selectedGenres: string[],
    minRating: number,
    sortBy: string,
    sortOrder: 'asc' | 'desc'
  }
}
```

**Example State:**
```typescript
{
  filter: {
    searchQuery: 'harry',
    selectedGenres: ['Fantasy', 'Adventure'],
    minRating: 4,
    sortBy: 'rating',
    sortOrder: 'desc'
  }
}
```

---

## Immer Integration

Redux Toolkit uses Immer internally, allowing "mutating" syntax:

```typescript
// This looks like mutation, but Immer makes it immutable
state.searchQuery = action.payload;
state.selectedGenres.push(genre);
```

**Behind the scenes:** Immer creates immutable updates automatically.

---

## Use Cases

### BooksPage (Branch 11)
- Search bar updates `searchQuery`
- Genre checkboxes toggle genres
- Rating slider sets `minRating`
- Sort dropdown changes `sortBy`/`sortOrder`

### Filter Sidebar
- Display active filters
- Clear individual filters
- Reset all filters button

### URL Sync (Future)
- Persist filters in URL params
- Share filtered book views
- Browser back/forward navigation

---

## Performance Considerations

### Selector Optimization
Use `useAppSelector` efficiently:

```typescript
// Good - select only what you need
const searchQuery = useAppSelector(state => state.filter.searchQuery);

// Avoid - causes re-render on any filter change
const filters = useAppSelector(state => state.filter);
```

### Memoization (Future)
For complex filtering, use `reselect`:
```typescript
import { createSelector } from '@reduxjs/toolkit';

const selectFilteredBooks = createSelector(
  [state => state.books, state => state.filter],
  (books, filter) => {
    // Expensive filtering logic
  }
);
```

---

## Testing

### Action Creators
```typescript
import { setSearchQuery } from './filterSlice';

test('setSearchQuery action', () => {
  const action = setSearchQuery('test');
  expect(action.type).toBe('filter/setSearchQuery');
  expect(action.payload).toBe('test');
});
```

### Reducer
```typescript
import reducer, { setSearchQuery, resetFilters } from './filterSlice';

test('reducer updates search query', () => {
  const state = reducer(undefined, setSearchQuery('test'));
  expect(state.searchQuery).toBe('test');
});
```

---

## Integration Points

### Will be used in:
- **Branch 11 - BooksPage**: Main filtering UI
- **Branch 12 - BookDetailPage**: Related books filtering
- **Branch 13 - LibraryPage**: User's book filtering
- **Branch 15 - FavoritesPage**: Favorites filtering

---

## Build Verification

- ✅ TypeScript compilation successful
- ✅ Redux store created
- ✅ Provider integrated
- ✅ Build size increased by ~22KB (Redux Toolkit)
- ✅ No runtime errors

---

## File Structure

```
src/
  redux/
    store.ts         ← Store configuration
    filterSlice.ts   ← Filter state & actions
    hooks.ts         ← Typed hooks
  main.tsx           ← Provider setup
```

---

## Next Steps

The next branch will set up AuthContext for user authentication and session management.

---

## Notes

- Redux Toolkit simplifies Redux dramatically
- No action types/constants needed
- Immer allows "mutating" syntax
- DevTools included by default
- TypeScript fully integrated
- Ready for complex filtering logic
- Easily extensible for more slices
