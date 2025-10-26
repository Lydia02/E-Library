import axios from 'axios';
import type { User, UserStats } from '../types';
import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/api`;

interface ProfileData {
  displayName?: string;
  bio?: string;
  location?: string;
  website?: string;
  favoriteGenres?: string[];
  readingGoal?: number;
  isPrivate?: boolean;
  preferences?: Record<string, any>;
  photoURL?: string;
}

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  // First try to get token from authToken key
  let token = localStorage.getItem('authToken');

  // If not found, try to get it from the user object
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

export const profileService = {
  /**
   * Get complete user profile with statistics
   */
  async getProfile(): Promise<User & { stats: UserStats }> {
    try {
      const response = await apiClient.get('/auth/profile');
      return response.data.profile;
    } catch (error: any) {
      console.error('Get profile error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get profile');
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(profileData: ProfileData): Promise<User & { stats: UserStats }> {
    try {
      console.log('Sending profile update request with data:', profileData);
      const response = await apiClient.put('/auth/profile/update', profileData);
      console.log('Profile update response:', response.data);

      return response.data.data.profile;
    } catch (error: any) {
      console.error('Update profile error:', error);
      console.error('Error response:', error.response?.data);
      throw new Error(error.response?.data?.message || error.response?.data?.error?.message || 'Failed to update profile');
    }
  },

  /**
   * Update reading goal
   */
  async updateReadingGoal(goal: number): Promise<{ message: string }> {
    try {
      const response = await apiClient.put('/auth/profile/reading-goal', { goal });
      return response.data;
    } catch (error: any) {
      console.error('Update reading goal error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update reading goal');
    }
  },

  /**
   * Update user preferences
   */
  async updatePreferences(preferences: Record<string, any>): Promise<{ message: string }> {
    try {
      const response = await apiClient.put('/auth/profile/preferences', { preferences });
      return response.data;
    } catch (error: any) {
      console.error('Update preferences error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update preferences');
    }
  },

  /**
   * Get detailed user statistics
   */
  async getDetailedStats(): Promise<UserStats> {
    try {
      const response = await apiClient.get('/auth/profile/stats');
      return response.data.stats;
    } catch (error: any) {
      console.error('Get detailed stats error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get statistics');
    }
  },

  /**
   * Delete user account
   */
  async deleteAccount(confirmPassword: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete('/auth/profile/delete', {
        data: { confirmPassword }
      });
      return response.data;
    } catch (error: any) {
      console.error('Delete account error:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete account');
    }
  },


};

export default profileService;
