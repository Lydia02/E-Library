import axios from 'axios';
import type { UserBook, ReadingStatus } from '../types';
import { API_BASE_URL } from '../config/api';

const API_BASE = `${API_BASE_URL}/api`;

// Create axios instance with interceptors
const api = axios.create({
  baseURL: API_BASE,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    // Try to get token from localStorage
    let token = localStorage.getItem('authToken');
    console.log('authToken from localStorage:', token);
    
    if (!token) {
      // Fallback: try to get from user object
      const userStr = localStorage.getItem('user');
      console.log('user string from localStorage:', userStr);
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          token = user.token;
          console.log('token from user object:', token);
        } catch {
          console.warn('Failed to parse user from localStorage');
        }
      }
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Setting Authorization header:', `Bearer ${token}`);
    } else {
      console.warn('No token found - using mock token for development');
      // For development: use a mock token if no real token is available
      config.headers.Authorization = `Bearer mock-jwt-token-dev-user-123`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface AddUserBookRequest {
  title: string;
  author: string;
  description?: string;
  genre?: string;
  pages?: number;
  publicationDate?: string;
  isbn?: string;
  coverImage?: string;
  status: ReadingStatus;
  personalRating?: number;
  personalReview?: string;
  dateStarted?: string;
  dateFinished?: string;
}

export interface UpdateUserBookRequest extends Partial<AddUserBookRequest> {
  id: string;
}

export interface UserBookStats {
  totalBooks: number;
  readBooks: number;
  currentlyReading: number;
  toReadBooks: number;
  averageRating: number;
  totalPages: number;
  readingStreak: number;
}

class UserBooksService {
  // Get all user books
  static async getUserBooks(): Promise<UserBook[]> {
    try {
      const response = await api.get('/user-books');
      // Handle the correct response structure from userBookController
      return response.data.data?.userBooks || response.data.userBooks || [];
    } catch (error: unknown) {
      console.error('Error fetching user books:', error);
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(err.response?.data?.message || 'Failed to fetch user books');
    }
  }

  // Get user book statistics
  static async getUserBookStats(): Promise<UserBookStats> {
    try {
      const response = await api.get('/user-books/stats');
      return response.data.data;
    } catch (error: unknown) {
      console.error('Error fetching user book stats:', error);
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(err.response?.data?.message || 'Failed to fetch user book stats');
    }
  }

  // Add a new user book
  static async addUserBook(bookData: AddUserBookRequest): Promise<UserBook> {
    try {
      console.log('Sending book data:', bookData);
      const response = await api.post('/user-books', bookData);
      console.log('Full response:', response);
      console.log('Response data:', response.data);
      console.log('Response data.data:', response.data.data);
      return response.data.data?.userBook || response.data.data || response.data;
    } catch (error: unknown) {
      console.error('Error adding user book:', error);
      const err = error as { response?: { data?: { message?: string } } };
      console.error('Error details:', err.response?.data);
      throw new Error(err.response?.data?.message || 'Failed to add book');
    }
  }

  // Get a specific user book
  static async getUserBook(bookId: string): Promise<UserBook> {
    try {
      const response = await api.get(`/user-books/${bookId}`);
      return response.data.data?.userBook || response.data.data || response.data;
    } catch (error: unknown) {
      console.error('Error fetching user book:', error);
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(err.response?.data?.message || 'Failed to fetch book');
    }
  }

  // Update a user book
  static async updateUserBook(bookId: string, updates: Partial<AddUserBookRequest>): Promise<UserBook> {
    try {
      const response = await api.put(`/user-books/${bookId}`, updates);
      return response.data.data?.userBook || response.data.data || response.data;
    } catch (error: unknown) {
      console.error('Error updating user book:', error);
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(err.response?.data?.message || 'Failed to update book');
    }
  }

  // Delete a user book
  static async deleteUserBook(bookId: string): Promise<void> {
    try {
      await api.delete(`/user-books/${bookId}`);
    } catch (error: unknown) {
      console.error('Error deleting user book:', error);
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(err.response?.data?.message || 'Failed to delete book');
    }
  }

  // Update reading status
  static async updateReadingStatus(bookId: string, status: ReadingStatus): Promise<UserBook> {
    try {
      const updates: Record<string, unknown> = { status };
      
      // Set dates based on status
      if (status === 'currently-reading') {
        updates.dateStarted = new Date().toISOString();
      } else if (status === 'read') {
        if (!updates.dateStarted) {
          updates.dateStarted = new Date().toISOString();
        }
        updates.dateFinished = new Date().toISOString();
      }

      return await this.updateUserBook(bookId, updates);
    } catch (error: unknown) {
      console.error('Error updating reading status:', error);
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(err.response?.data?.message || 'Failed to update reading status');
    }
  }

  // Update book rating
  static async updateBookRating(bookId: string, rating: number): Promise<UserBook> {
    try {
      return await this.updateUserBook(bookId, { personalRating: rating });
    } catch (error: unknown) {
      console.error('Error updating book rating:', error);
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(err.response?.data?.message || 'Failed to update rating');
    }
  }
}

export default UserBooksService;