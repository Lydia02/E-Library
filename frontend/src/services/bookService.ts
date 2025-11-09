import axios from 'axios';
import type { Book } from '../types';
import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/api`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
   let token = localStorage.getItem('authToken');
  
  if (!token) {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        token = user.token;
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const bookService = {
  /**
   * Get all books with optional filters
   */
  async getBooks(params?: {
    page?: number;
    limit?: number;
    genre?: string;
    author?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) {
    try {
      const response = await apiClient.get('/books', { params });
      return response.data;
    } catch (error: unknown) {
      console.error('Get books error:', error);
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(err.response?.data?.message || 'Failed to get books');
    }
  },

  /**
   * Get a single book by ID
   */
  async getBook(id: string) {
    try {
      const response = await apiClient.get(`/books/${id}`);
      return response.data;
    } catch (error: unknown) {
      console.error('Get book error:', error);
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(err.response?.data?.message || 'Failed to get book');
    }
  },

  /**
   * Create a new book (requires authentication)
   */
  async createBook(bookData: Omit<Book, 'id'>) {
    try {
      const response = await apiClient.post('/books', bookData);
      return response.data;
    } catch (error: unknown) {
      console.error('Create book error:', error);
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(err.response?.data?.message || 'Failed to create book');
    }
  },

  /**
   * Update an existing book (requires authentication)
   */
  async updateBook(id: string, bookData: Partial<Book>) {
    try {
      const response = await apiClient.put(`/books/${id}`, bookData);
      return response.data;
    } catch (error: unknown) {
      console.error('Update book error:', error);
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(err.response?.data?.message || 'Failed to update book');
    }
  },

  /**
   * Delete a book (requires authentication)
   */
  async deleteBook(id: string) {
    try {
      const response = await apiClient.delete(`/books/${id}`);
      return response.data;
    } catch (error: unknown) {
      console.error('Delete book error:', error);
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(err.response?.data?.message || 'Failed to delete book');
    }
  },

  /**
   * Get books added by current user
   */
  async getMyBooks(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    try {
      const response = await apiClient.get('/books/my-books', { params });
      return response.data;
    } catch (error: unknown) {
      console.error('Get my books error:', error);
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(err.response?.data?.message || 'Failed to get user books');
    }
  }
};