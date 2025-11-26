import pool from '../config/database.js';
import { db } from '../config/firebase.js';
import logger from '../utils/logger.js';

const addUserBook = async (userId, bookId, status = 'to-read', progress = 0) => {
  try {
    const existingSnapshot = await db.collection('user_books')
      .where('userId', '==', userId)
      .where('bookId', '==', bookId)
      .get();

    const now = new Date();
    const userBookData = {
      userId,
      bookId,
      status,
      progress,
      startedAt: status === 'reading' ? now : null,
      completedAt: status === 'completed' ? now : null,
      updatedAt: now
    };

    if (!existingSnapshot.empty) {
      // Update existing user book in Firebase
      const docRef = existingSnapshot.docs[0].ref;
      await docRef.update(userBookData);

      const updatedDoc = await docRef.get();
      const data = updatedDoc.data();

      // Sync to PostgreSQL in background
      pool.query(`
        INSERT INTO user_books (user_id, book_id, status, progress, started_at, completed_at, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (user_id, book_id) DO UPDATE SET
          status = EXCLUDED.status,
          progress = EXCLUDED.progress,
          started_at = EXCLUDED.started_at,
          completed_at = EXCLUDED.completed_at,
          updated_at = CURRENT_TIMESTAMP
      `, [
        data.userId,
        data.bookId,
        data.status,
        data.progress,
        data.startedAt?.toDate ? data.startedAt.toDate() : data.startedAt,
        data.completedAt?.toDate ? data.completedAt.toDate() : data.completedAt,
        data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        now
      ]).catch(err => {
        logger.warn('Failed to sync user_book to PostgreSQL:', err.message);
      });

      return {
        id: updatedDoc.id,
        userId: data.userId,
        bookId: data.bookId,
        status: data.status,
        progress: data.progress,
        startedAt: data.startedAt?.toDate ? data.startedAt.toDate() : data.startedAt,
        completedAt: data.completedAt?.toDate ? data.completedAt.toDate() : data.completedAt,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt
      };
    } else {
      // Add new user book to Firebase
      userBookData.createdAt = now;
      const docRef = await db.collection('user_books').add(userBookData);

      // Sync to PostgreSQL in background
      pool.query(`
        INSERT INTO user_books (user_id, book_id, status, progress, started_at, completed_at, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (user_id, book_id) DO NOTHING
      `, [
        userId,
        bookId,
        status,
        progress,
        userBookData.startedAt,
        userBookData.completedAt,
        userBookData.createdAt,
        userBookData.updatedAt
      ]).catch(err => {
        logger.warn('Failed to sync user_book to PostgreSQL:', err.message);
      });

      return {
        id: docRef.id,
        userId,
        bookId,
        status,
        progress,
        startedAt: userBookData.startedAt,
        completedAt: userBookData.completedAt,
        createdAt: userBookData.createdAt,
        updatedAt: userBookData.updatedAt
      };
    }
  } catch (error) {
    console.error('Error adding user book:', error);
    throw error;
  }
};

const updateUserBook = async (userId, bookId, updates) => {
  try {
    const snapshot = await db.collection('user_books')
      .where('userId', '==', userId)
      .where('bookId', '==', bookId)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const docRef = snapshot.docs[0].ref;
    const updateData = {
      updatedAt: new Date()
    };

    if (updates.status !== undefined) {
      updateData.status = updates.status;

      if (updates.status === 'reading' && !updates.startedAt) {
        updateData.startedAt = new Date();
      } else if (updates.status === 'completed' && !updates.completedAt) {
        updateData.completedAt = new Date();
        updateData.progress = 100;
      }
    }

    if (updates.progress !== undefined) {
      updateData.progress = updates.progress;
    }

    if (updates.startedAt !== undefined) {
      updateData.startedAt = updates.startedAt;
    }

    if (updates.completedAt !== undefined) {
      updateData.completedAt = updates.completedAt;
    }

    await docRef.update(updateData);

    const updatedDoc = await docRef.get();
    const data = updatedDoc.data();

    // Sync to PostgreSQL in background
    pool.query(`
      INSERT INTO user_books (user_id, book_id, status, progress, started_at, completed_at, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (user_id, book_id) DO UPDATE SET
        status = EXCLUDED.status,
        progress = EXCLUDED.progress,
        started_at = EXCLUDED.started_at,
        completed_at = EXCLUDED.completed_at,
        updated_at = CURRENT_TIMESTAMP
    `, [
      data.userId,
      data.bookId,
      data.status,
      data.progress,
      data.startedAt?.toDate ? data.startedAt.toDate() : data.startedAt,
      data.completedAt?.toDate ? data.completedAt.toDate() : data.completedAt,
      data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
      new Date()
    ]).catch(err => {
      logger.warn('Failed to sync updated user_book to PostgreSQL:', err.message);
    });

    return {
      id: updatedDoc.id,
      userId: data.userId,
      bookId: data.bookId,
      status: data.status,
      progress: data.progress,
      startedAt: data.startedAt?.toDate ? data.startedAt.toDate() : data.startedAt,
      completedAt: data.completedAt?.toDate ? data.completedAt.toDate() : data.completedAt,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt
    };
  } catch (error) {
    console.error('Error updating user book:', error);
    throw error;
  }
};

const getUserBooks = async (userId, filters = {}) => {
  try {
    let userBooksQuery = db.collection('user_books')
      .where('userId', '==', userId);

    if (filters.status) {
      userBooksQuery = userBooksQuery.where('status', '==', filters.status);
    }

    userBooksQuery = userBooksQuery.orderBy('updatedAt', 'desc');

    const limit = parseInt(filters.limit) || 20;
    userBooksQuery = userBooksQuery.limit(limit);

    const userBooksSnapshot = await userBooksQuery.get();

    if (userBooksSnapshot.empty) {
      return [];
    }

    // Get book details for each user book
    const userBooks = await Promise.all(
      userBooksSnapshot.docs.map(async (userBookDoc) => {
        const userBookData = userBookDoc.data();
        const bookDoc = await db.collection('books').doc(userBookData.bookId).get();

        if (!bookDoc.exists) {
          return null;
        }

        const bookData = bookDoc.data();
        return {
          id: userBookDoc.id,
          bookId: bookDoc.id,
          status: userBookData.status,
          progress: userBookData.progress,
          startedAt: userBookData.startedAt?.toDate ? userBookData.startedAt.toDate() : userBookData.startedAt,
          completedAt: userBookData.completedAt?.toDate ? userBookData.completedAt.toDate() : userBookData.completedAt,
          book: {
            id: bookDoc.id,
            title: bookData.title || 'Untitled',
            author: bookData.author || 'Unknown Author',
            coverImage: bookData.coverImage || null,
            pageCount: bookData.pageCount || null,
            genres: bookData.genres || []
          },
          createdAt: userBookData.createdAt?.toDate ? userBookData.createdAt.toDate() : userBookData.createdAt,
          updatedAt: userBookData.updatedAt?.toDate ? userBookData.updatedAt.toDate() : userBookData.updatedAt
        };
      })
    );

    // Filter out null entries (books that don't exist)
    return userBooks.filter(ub => ub !== null);
  } catch (error) {
    console.error('Error getting user books:', error);
    throw error;
  }
};

const getUserBooksCount = async (userId, filters = {}) => {
  try {
    let userBooksQuery = db.collection('user_books')
      .where('userId', '==', userId);

    if (filters.status) {
      userBooksQuery = userBooksQuery.where('status', '==', filters.status);
    }

    const snapshot = await userBooksQuery.get();
    return snapshot.size;
  } catch (error) {
    console.error('Error getting user books count:', error);
    throw error;
  }
};

const removeUserBook = async (userId, bookId) => {
  try {
    const snapshot = await db.collection('user_books')
      .where('userId', '==', userId)
      .where('bookId', '==', bookId)
      .get();

    if (snapshot.empty) {
      return null;
    }

    // Delete all matching user books from Firebase (should only be one)
    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    // Delete from PostgreSQL in background
    pool.query(`
      DELETE FROM user_books
      WHERE user_id = $1 AND book_id = $2
    `, [userId, bookId])
      .catch(err => {
        logger.warn('Failed to delete user_book from PostgreSQL:', err.message);
      });

    return { success: true };
  } catch (error) {
    console.error('Error removing user book:', error);
    throw error;
  }
};

export {
  addUserBook,
  updateUserBook,
  getUserBooks,
  getUserBooksCount,
  removeUserBook
};
