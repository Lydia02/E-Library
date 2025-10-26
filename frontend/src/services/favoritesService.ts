import axios from 'axios';
import type { Book } from '../types';
import { API_BASE_URL } from '../config/api';

const API_BASE = `${API_BASE_URL}/api`;

// Create axios instance with interceptors
const api = axios.create({
  baseURL: API_BASE,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    // get token from localStorage
    let token = localStorage.getItem('authToken');

    if (!token) {
      // Fallback: get from user object
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          token = user.token;
        } catch (e) {
          console.warn('Failed to parse user from localStorage');
        }
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface FavoriteItem {
  favoriteId: string;
  addedAt: string;
  book: Book;
}

class FavoritesService {
  // Add a book to favorites
  static async addToFavorites(bookId: string): Promise<void> {
    try {
      await api.post(`/favorites/${bookId}`);
    } catch (error: any) {
      console.error('Error adding to favorites:', error);
      throw new Error(error.response?.data?.message || 'Failed to add to favorites');
    }
  }

  // Remove a book from favorites
  static async removeFromFavorites(bookId: string): Promise<void> {
    try {
      await api.delete(`/favorites/${bookId}`);
    } catch (error: any) {
      console.error('Error removing from favorites:', error);
      throw new Error(error.response?.data?.message || 'Failed to remove from favorites');
    }
  }

  // Get all user favorites
  static async getUserFavorites(): Promise<FavoriteItem[]> {
    try {
      const response = await api.get('/favorites');
      return response.data.data?.favorites || response.data.favorites || [];
    } catch (error: any) {
      console.error('Error fetching favorites:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch favorites');
    }
  }

  // Check if a book is favorited
  static async isFavorite(bookId: string): Promise<boolean> {
    try {
      const response = await api.get(`/favorites/check/${bookId}`);
      return response.data.data?.isFavorite || false;
    } catch (error: any) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  }
}

export default FavoritesService;
