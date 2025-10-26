import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FilterState } from '../types/index';

const initialState: FilterState = {
  searchQuery: '',
  selectedGenres: [],
  minRating: 0,
  sortBy: 'title',
  sortOrder: 'asc',
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedGenres: (state, action: PayloadAction<string[]>) => {
      state.selectedGenres = action.payload;
    },
    toggleGenre: (state, action: PayloadAction<string>) => {
      const genre = action.payload;
      if (state.selectedGenres.includes(genre)) {
        state.selectedGenres = state.selectedGenres.filter(g => g !== genre);
      } else {
        state.selectedGenres.push(genre);
      }
    },
    setMinRating: (state, action: PayloadAction<number>) => {
      state.minRating = action.payload;
    },
    setSortBy: (state, action: PayloadAction<FilterState['sortBy']>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<FilterState['sortOrder']>) => {
      state.sortOrder = action.payload;
    },
    resetFilters: (state) => {
      state.searchQuery = '';
      state.selectedGenres = [];
      state.minRating = 0;
      state.sortBy = 'title';
      state.sortOrder = 'asc';
    },
  },
});

export const {
  setSearchQuery,
  setSelectedGenres,
  toggleGenre,
  setMinRating,
  setSortBy,
  setSortOrder,
  resetFilters,
} = filterSlice.actions;

export default filterSlice.reducer;
