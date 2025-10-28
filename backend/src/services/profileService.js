import { db } from '../config/firebase.js';
import { FieldValue } from 'firebase-admin/firestore';
import bcrypt from 'bcrypt';

class ProfileService {
  /**
   * Create a new user profile with default settings
   */
  static async createUserProfile(userData) {
    try {
      const { uid, email, name, displayName, token, password } = userData;

      // Hash password before storing
      const hashedPassword = await bcrypt.hash(password, 10);

      const userProfile = {
        id: uid,
        uid: uid,
        email: email,
        name: name || displayName || email.split('@')[0],
        displayName: displayName || name || email.split('@')[0],
        password: hashedPassword, // Store hashed password
        token: token,
        photoURL: null,
        bio: '',
        location: '',
        website: '',
        favoriteGenres: [],
        joinDate: new Date().toISOString(),
        readingGoal: 50,
        booksRead: 0,
        currentlyReading: 0,
        isPrivate: false,
        preferences: {
          emailNotifications: true,
          publicProfile: true
        },
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      };

      // Create user document
      await db.collection('users').doc(uid).set(userProfile);

      return userProfile;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  /**
   * Find user by email address
   */
  static async findUserByEmail(email) {
    try {
      const snapshot = await db.collection('users')
        .where('email', '==', email)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      return {
        uid: doc.id,
        ...doc.data()
      };
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  /**
   * Verify user password during login
   */
  static async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  }

  /**
   * Get complete user profile with calculated statistics
   */
  static async getUserProfile(uid) {
    try {
      const userDoc = await db.collection('users').doc(uid).get();
      if (!userDoc.exists) {
        throw new Error('User not found');
      }

      const userData = userDoc.data();
      const stats = await this.calculateUserStats(uid);

      return {
        ...userData,
        stats
      };
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  static async updateUserProfile(uid, profileData) {
    try {
      // Validate profile data
      const validatedData = this.validateProfileData(profileData);

      // If password is being updated, hash it
      if (validatedData.password) {
        validatedData.password = await bcrypt.hash(validatedData.password, 10);
      }

      // Add updated timestamp
      validatedData.updatedAt = FieldValue.serverTimestamp();

      // Update user document
      await db.collection('users').doc(uid).update(validatedData);

      // Return updated profile
      return await this.getUserProfile(uid);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Calculate comprehensive user reading statistics
   */
  static async calculateUserStats(uid) {
    try {
      // Get all user books
      const userBooksSnapshot = await db.collection('userBooks')
        .where('userId', '==', uid)
        .get();

      const userBooks = userBooksSnapshot.docs.map(doc => doc.data());

      // Calculate statistics
      const stats = {
        totalBooksRead: userBooks.filter(book => book.status === 'read').length,
        currentlyReading: userBooks.filter(book => book.status === 'currently-reading').length,
        toRead: userBooks.filter(book => book.status === 'to-read').length,
        totalBooks: userBooks.length,

        // Reading goal progress
        readingGoalProgress: {
          goal: 50, // Default goal, can be customized
          current: userBooks.filter(book => book.status === 'read').length,
          percentage: 0
        },

        // Average rating
        averageRating: this.calculateAverageRating(userBooks),

        // Favorite genres (top 5)
        favoriteGenres: this.calculateFavoriteGenres(userBooks),

        // Books added this month
        booksAddedThisMonth: this.getBooksAddedThisMonth(userBooks),

        // Reading streak
        currentStreak: await this.calculateReadingStreak(uid),

        // Pages read (if available)
        totalPagesRead: this.calculateTotalPages(userBooks),

        // Reading activity
        recentActivity: await this.getRecentActivity(uid, 10)
      };

      // Calculate reading goal percentage
      if (stats.readingGoalProgress.goal > 0) {
        stats.readingGoalProgress.percentage = Math.round(
          (stats.readingGoalProgress.current / stats.readingGoalProgress.goal) * 100
        );
      }

      return stats;
    } catch (error) {
      console.error('Error calculating user stats:', error);
      // Return default stats on error
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
  }

  /**
   * Validate profile data
   */
  static validateProfileData(data) {
    const allowedFields = [
      'displayName', 'bio', 'location', 'website', 'favoriteGenres',
      'readingGoal', 'isPrivate', 'preferences', 'photoURL', 'password'
    ];

    const validatedData = {};

    // Only include allowed fields
    Object.keys(data).forEach(key => {
      if (allowedFields.includes(key)) {
        validatedData[key] = data[key];
      }
    });

    // Validate specific fields
    if (validatedData.displayName !== undefined) {
      if (typeof validatedData.displayName !== 'string' || validatedData.displayName.length > 50) {
        throw new Error('Display name must be a string with max 50 characters');
      }
    }

    if (validatedData.bio !== undefined) {
      if (typeof validatedData.bio !== 'string' || validatedData.bio.length > 500) {
        throw new Error('Bio must be a string with max 500 characters');
      }
    }

    if (validatedData.readingGoal !== undefined) {
      const goal = parseInt(validatedData.readingGoal);
      if (isNaN(goal) || goal < 0 || goal > 1000) {
        throw new Error('Reading goal must be a number between 0 and 1000');
      }
      validatedData.readingGoal = goal;
    }

    if (validatedData.favoriteGenres !== undefined) {
      if (!Array.isArray(validatedData.favoriteGenres) || validatedData.favoriteGenres.length > 10) {
        throw new Error('Favorite genres must be an array with max 10 items');
      }
    }

    if (validatedData.password !== undefined) {
      if (typeof validatedData.password !== 'string' || validatedData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
    }

    return validatedData;
  }

  /**
   * Calculate average rating from user books
   */
  static calculateAverageRating(userBooks) {
    const ratedBooks = userBooks.filter(book =>
      book.personalRating && book.personalRating > 0
    );

    if (ratedBooks.length === 0) return 0;

    const sum = ratedBooks.reduce((total, book) => total + book.personalRating, 0);
    return Math.round((sum / ratedBooks.length) * 10) / 10; // Round to 1 decimal
  }

  /**
   * Calculate favorite genres based on reading history
   */
  static calculateFavoriteGenres(userBooks) {
    const genreCounts = {};

    userBooks.forEach(book => {
      if (book.genre) {
        genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
      }
    });

    return Object.entries(genreCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([genre, count]) => ({ genre, count }));
  }

  /**
   * Get books added this month
   */
  static getBooksAddedThisMonth(userBooks) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return userBooks.filter(book => {
      const addedDate = new Date(book.dateAdded);
      return addedDate >= startOfMonth;
    }).length;
  }

  /**
   * Calculate reading streak (consecutive days with reading activity)
   */
  static async calculateReadingStreak(uid) {
    // This would require tracking daily reading activity
    // For now, return a placeholder
    return 0;
  }

  /**
   * Calculate total pages read
   */
  static calculateTotalPages(userBooks) {
    return userBooks
      .filter(book => book.status === 'read' && book.pages)
      .reduce((total, book) => total + (book.pages || 0), 0);
  }

  /**
   * Get recent reading activity
   */
  static async getRecentActivity(uid, limit = 10) {
    try {
      const activitiesSnapshot = await db.collection('userBooks')
        .where('userId', '==', uid)
        .orderBy('dateAdded', 'desc')
        .limit(limit)
        .get();

      return activitiesSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          type: 'book_added',
          bookTitle: data.title,
          bookAuthor: data.author,
          status: data.status,
          date: data.dateAdded,
          rating: data.personalRating
        };
      });
    } catch (error) {
      console.error('Error getting recent activity:', error);
      return [];
    }
  }

  /**
   * Update user reading goal
   */
  static async updateReadingGoal(uid, goal) {
    try {
      await db.collection('users').doc(uid).update({
        readingGoal: parseInt(goal),
        updatedAt: FieldValue.serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating reading goal:', error);
      throw error;
    }
  }

  /**
   * Delete user profile and all associated data
   */
  static async deleteUserProfile(uid) {
    try {
      // Delete user books
      const userBooksSnapshot = await db.collection('userBooks')
        .where('userId', '==', uid)
        .get();

      const batch = db.batch();
      userBooksSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      // Delete user profile
      batch.delete(db.collection('users').doc(uid));

      await batch.commit();
      return true;
    } catch (error) {
      console.error('Error deleting user profile:', error);
      throw error;
    }
  }

  /**
   * Update user preferences
   */
  static async updatePreferences(uid, preferences) {
    try {
      await db.collection('users').doc(uid).update({
        preferences: preferences,
        updatedAt: FieldValue.serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }
}

export default ProfileService;
