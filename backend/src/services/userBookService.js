import { db } from '../config/firebase.js';

const userBooksCollection = db.collection('userBooks');
const usersCollection = db.collection('users');

const createUserBook = async (userBookData) => {
  try {
    const docRef = await userBooksCollection.add(userBookData);

    // Update user statistics
    await updateUserStats(userBookData.userId);

    return {
      id: docRef.id,
      ...userBookData,
    };
  } catch (error) {
    throw error;
  }
};

const getUserBooks = async (userId, filters) => {
  try {
    // Simplified query to avoid index requirements
    let query = userBooksCollection.where('userId', '==', userId);

    // Only apply status filter if specified (single field filters don't need compound indexes)
    if (filters.status) {
      query = query.where('status', '==', filters.status);
    }

    // Get all matching documents first
    const snapshot = await query.get();
    const userBooks = [];

    snapshot.forEach((doc) => {
      const data = doc.data();

      // Apply search filter after fetching (Firestore doesn't support case-insensitive search)
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const title = (data.title || '').toLowerCase();
        const author = (data.author || '').toLowerCase();

        if (!title.includes(searchTerm) && !author.includes(searchTerm)) {
          return;
        }
      }

      // Apply genre filter if not already filtered by query
      if (filters.genre && !filters.status && data.genre !== filters.genre) {
        return;
      }

      userBooks.push({
        id: doc.id,
        ...data,
      });
    });

    // Sort the results in memory
    const sortField = filters.sortBy || 'dateAdded';
    const sortOrder = filters.sortOrder === 'asc' ? 'asc' : 'desc';

    userBooks.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      // Handle dates
      if (sortField.includes('date') || sortField.includes('Date')) {
        aVal = new Date(aVal || 0).getTime();
        bVal = new Date(bVal || 0).getTime();
      }

      // Handle strings
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      // Handle numbers
      if (sortOrder === 'asc') {
        return (aVal || 0) - (bVal || 0);
      } else {
        return (bVal || 0) - (aVal || 0);
      }
    });

    // Apply pagination
    const startIndex = filters.offset || 0;
    const endIndex = startIndex + (filters.limit || userBooks.length);

    return userBooks.slice(startIndex, endIndex);
  } catch (error) {
    throw error;
  }
};

const getUserBooksCount = async (userId, filters) => {
  try {
    // Simplified query to avoid index requirements
    let query = userBooksCollection.where('userId', '==', userId);

    // Only apply status filter if specified
    if (filters.status) {
      query = query.where('status', '==', filters.status);
    }

    const snapshot = await query.get();

    // If no additional filters, return direct count
    if (!filters.search && !filters.genre) {
      return snapshot.size;
    }

    // Apply additional filters and count
    let count = 0;
    snapshot.forEach((doc) => {
      const data = doc.data();

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const title = (data.title || '').toLowerCase();
        const author = (data.author || '').toLowerCase();

        if (!title.includes(searchTerm) && !author.includes(searchTerm)) {
          return;
        }
      }

      if (filters.genre && data.genre !== filters.genre) {
        return;
      }

      count++;
    });

    return count;
  } catch (error) {
    throw error;
  }
};

const getUserBookById = async (id, userId) => {
  try {
    const doc = await userBooksCollection.doc(id).get();

    if (!doc.exists) {
      return null;
    }

    const data = doc.data();

    // Verify ownership
    if (data.userId !== userId) {
      return null;
    }

    return {
      id: doc.id,
      ...data,
    };
  } catch (error) {
    throw error;
  }
};

const updateUserBook = async (id, userId, updates) => {
  try {
    const docRef = userBooksCollection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return null;
    }

    const data = doc.data();

    // Verify ownership
    if (data.userId !== userId) {
      return null;
    }

    await docRef.update(updates);

    // Update user statistics if status changed
    if (updates.status && updates.status !== data.status) {
      await updateUserStats(userId);
    }

    return {
      id,
      ...data,
      ...updates,
    };
  } catch (error) {
    throw error;
  }
};

const deleteUserBook = async (id, userId) => {
  try {
    const docRef = userBooksCollection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return false;
    }

    const data = doc.data();

    // Verify ownership
    if (data.userId !== userId) {
      return false;
    }

    await docRef.delete();

    // Update user statistics
    await updateUserStats(userId);

    return true;
  } catch (error) {
    throw error;
  }
};

const getUserBookStats = async (userId) => {
  try {
    const snapshot = await userBooksCollection.where('userId', '==', userId).get();

    let totalBooksRead = 0;
    let currentlyReading = 0;
    let toRead = 0;
    let totalRating = 0;
    let ratedBooks = 0;
    const genreCounts = {};

    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
    let booksAddedThisMonth = 0;

    snapshot.forEach((doc) => {
      const book = doc.data();

      // Count by status
      switch (book.status) {
        case 'read':
          totalBooksRead++;
          break;
        case 'currently-reading':
          currentlyReading++;
          break;
        case 'to-read':
          toRead++;
          break;
      }

      // Calculate average rating
      if (book.personalRating && book.status === 'read') {
        totalRating += book.personalRating;
        ratedBooks++;
      }

      // Count favorite genres
      if (book.genre) {
        genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
      }

      // Count books added this month
      if (book.dateAdded && book.dateAdded.startsWith(currentMonth)) {
        booksAddedThisMonth++;
      }
    });

    // Convert genre counts to sorted array
    const favoriteGenres = Object.entries(genreCounts)
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 genres

    const averageRating = ratedBooks > 0 ? +(totalRating / ratedBooks).toFixed(1) : 0;

    return {
      totalBooksRead,
      currentlyReading,
      toRead,
      favoriteGenres,
      averageRating,
      booksAddedThisMonth,
    };
  } catch (error) {
    throw error;
  }
};

const updateUserStats = async (userId) => {
  try {
    const stats = await getUserBookStats(userId);

    // Update user profile with current stats
    const userRef = usersCollection.doc(userId);
    await userRef.update({
      booksRead: stats.totalBooksRead,
      currentlyReading: stats.currentlyReading,
      updatedAt: new Date().toISOString(),
    });

    return stats;
  } catch (error) {
    console.error('Error updating user stats:', error);
    // Don't throw error to avoid breaking the main operation
  }
};

export {
  createUserBook,
  getUserBooks,
  getUserBooksCount,
  getUserBookById,
  updateUserBook,
  deleteUserBook,
  getUserBookStats,
  updateUserStats,
};
