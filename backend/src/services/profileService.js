import pool from '../config/database.js';
import { auth } from '../config/firebase.js';
import bcrypt from 'bcrypt';

class ProfileService {
  /**
   * Create user in both Firebase Auth and PostgreSQL
   * Firebase: Authentication
   * PostgreSQL: User profile data
   */
  static async createUserProfile(userData) {
    try {
      const { uid, email, name, displayName, password } = userData;

      // Store hashed password for PostgreSQL (backup authentication)
      const hashedPassword = await bcrypt.hash(password, 10);

      // Check if user already exists in PostgreSQL
      const existingUser = await pool.query(`
        SELECT id FROM users WHERE firebase_uid = $1 OR email = $2
      `, [uid, email]);

      if (existingUser.rows.length > 0) {
        throw new Error('User already exists');
      }

      // Insert into PostgreSQL
      const result = await pool.query(`
        INSERT INTO users (firebase_uid, email, display_name, photo_url, password)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, firebase_uid, email, display_name, photo_url, created_at
      `, [
        uid,
        email,
        displayName || name || email.split('@')[0],
        null,
        hashedPassword
      ]);

      const user = result.rows[0];
      return {
        id: user.id,
        uid: user.firebase_uid,
        email: user.email,
        displayName: user.display_name,
        photoURL: user.photo_url,
        createdAt: user.created_at
      };
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  static async findUserByEmail(email) {
    try {
      const result = await pool.query(`
        SELECT id, firebase_uid, email, display_name, photo_url, password, created_at
        FROM users
        WHERE email = $1
        LIMIT 1
      `, [email]);

      if (result.rows.length === 0) {
        return null;
      }

      const user = result.rows[0];
      return {
        id: user.id,
        uid: user.firebase_uid,
        email: user.email,
        displayName: user.display_name,
        photoURL: user.photo_url,
        password: user.password,
        createdAt: user.created_at
      };
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  }

  static async getUserProfile(uid) {
    try {
      const result = await pool.query(`
        SELECT id, firebase_uid, email, display_name, photo_url, created_at
        FROM users
        WHERE firebase_uid = $1
        LIMIT 1
      `, [uid]);

      if (result.rows.length === 0) {
        throw new Error('User not found');
      }

      const user = result.rows[0];
      return {
        id: user.id,
        uid: user.firebase_uid,
        email: user.email,
        displayName: user.display_name,
        photoURL: user.photo_url,
        createdAt: user.created_at
      };
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  static async updateUserProfile(uid, profileData) {
    try {
      const updates = [];
      const values = [];
      let paramCount = 1;

      if (profileData.displayName) {
        updates.push(`display_name = $${paramCount++}`);
        values.push(profileData.displayName);
      }
      if (profileData.photoURL) {
        updates.push(`photo_url = $${paramCount++}`);
        values.push(profileData.photoURL);
      }
      if (profileData.password) {
        const hashedPassword = await bcrypt.hash(profileData.password, 10);
        updates.push(`password = $${paramCount++}`);
        values.push(hashedPassword);
      }

      if (updates.length === 0) {
        return await this.getUserProfile(uid);
      }

      values.push(uid);
      const result = await pool.query(`
        UPDATE users
        SET ${updates.join(', ')}, updated_at = NOW()
        WHERE firebase_uid = $${paramCount}
        RETURNING id, firebase_uid, email, display_name, photo_url, created_at
      `, values);

      if (result.rows.length === 0) {
        throw new Error('User not found');
      }

      const user = result.rows[0];
      return {
        id: user.id,
        uid: user.firebase_uid,
        email: user.email,
        displayName: user.display_name,
        photoURL: user.photo_url,
        createdAt: user.created_at
      };
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  static async deleteUserProfile(uid) {
    try {
      await pool.query(`
        DELETE FROM users WHERE firebase_uid = $1
      `, [uid]);
      return true;
    } catch (error) {
      console.error('Error deleting user profile:', error);
      throw error;
    }
  }

  static async calculateUserStats(uid) {
    return {
      totalBooksRead: 0,
      currentlyReading: 0,
      toRead: 0,
      totalBooks: 0,
      readingGoalProgress: { goal: 50, current: 0, percentage: 0 },
      averageRating: 0,
      favoriteGenres: [],
      booksAddedThisMonth: 0,
      currentStreak: 0,
      totalPagesRead: 0,
      recentActivity: []
    };
  }

  static async updateReadingGoal(uid, goal) {
    return true;
  }

  static async updatePreferences(uid, preferences) {
    return true;
  }

  static validateProfileData(data) {
    return data;
  }
}

export default ProfileService;
