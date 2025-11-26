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

const createUserBook = async (userBookData) => {
  try {
    const now = new Date();

    // Create custom book data for Firestore
    const firestoreData = {
      userId: userBookData.userId,
      bookId: userBookData.bookId || null,
      title: userBookData.title,
      author: userBookData.author,
      isbn: userBookData.isbn || null,
      genre: userBookData.genre || null,
      pages: userBookData.pages || null,
      publicationDate: userBookData.publicationDate || null,
      description: userBookData.description || null,
      coverImage: userBookData.coverImage || null,
      status: userBookData.status,
      personalRating: userBookData.personalRating || null,
      personalReview: userBookData.personalReview || null,
      dateAdded: userBookData.dateAdded ? new Date(userBookData.dateAdded) : now,
      dateStarted: userBookData.dateStarted ? new Date(userBookData.dateStarted) : null,
      dateFinished: userBookData.dateFinished ? new Date(userBookData.dateFinished) : null,
      progress: userBookData.progress || 0,
      isCustomBook: userBookData.isCustomBook !== undefined ? userBookData.isCustomBook : true,
      createdAt: now,
      updatedAt: now
    };

    // Add to Firebase
    const docRef = await db.collection('user_books').add(firestoreData);

    // Sync to PostgreSQL in background
    pool.query(`
      INSERT INTO user_books (
        user_id, book_id, title, author, isbn, genre, pages,
        publication_date, description, cover_image, status,
        personal_rating, personal_review, date_added, date_started,
        date_finished, progress, is_custom_book, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
    `, [
      firestoreData.userId,
      firestoreData.bookId,
      firestoreData.title,
      firestoreData.author,
      firestoreData.isbn,
      firestoreData.genre,
      firestoreData.pages,
      firestoreData.publicationDate,
      firestoreData.description,
      firestoreData.coverImage,
      firestoreData.status,
      firestoreData.personalRating,
      firestoreData.personalReview,
      firestoreData.dateAdded,
      firestoreData.dateStarted,
      firestoreData.dateFinished,
      firestoreData.progress,
      firestoreData.isCustomBook,
      firestoreData.createdAt,
      firestoreData.updatedAt
    ]).catch(err => {
      logger.warn('Failed to sync user_book to PostgreSQL:', err.message);
    });

    return {
      id: docRef.id,
      ...userBookData,
      dateAdded: firestoreData.dateAdded.toISOString(),
      dateStarted: firestoreData.dateStarted ? firestoreData.dateStarted.toISOString() : null,
      dateFinished: firestoreData.dateFinished ? firestoreData.dateFinished.toISOString() : null,
      createdAt: firestoreData.createdAt.toISOString(),
      updatedAt: firestoreData.updatedAt.toISOString()
    };
  } catch (error) {
    console.error('Error creating user book:', error);
    throw error;
  }
};

const getUserBookById = async (userBookId, userId) => {
  try {
    const doc = await db.collection('user_books').doc(userBookId).get();

    if (!doc.exists) {
      return null;
    }

    const data = doc.data();

    // Verify this belongs to the user
    if (data.userId !== userId) {
      return null;
    }

    return {
      id: doc.id,
      userId: data.userId,
      bookId: data.bookId || null,
      title: data.title,
      author: data.author,
      isbn: data.isbn || null,
      genre: data.genre || null,
      pages: data.pages || null,
      publicationDate: data.publicationDate || null,
      description: data.description || null,
      coverImage: data.coverImage || null,
      status: data.status,
      personalRating: data.personalRating || null,
      personalReview: data.personalReview || null,
      dateAdded: data.dateAdded?.toDate ? data.dateAdded.toDate().toISOString() : data.dateAdded,
      dateStarted: data.dateStarted?.toDate ? data.dateStarted.toDate().toISOString() : data.dateStarted,
      dateFinished: data.dateFinished?.toDate ? data.dateFinished.toDate().toISOString() : data.dateFinished,
      progress: data.progress || 0,
      isCustomBook: data.isCustomBook || false,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt
    };
  } catch (error) {
    console.error('Error getting user book by ID:', error);
    throw error;
  }
};

const deleteUserBook = async (userBookId, userId) => {
  try {
    const doc = await db.collection('user_books').doc(userBookId).get();

    if (!doc.exists) {
      return null;
    }

    const data = doc.data();

    // Verify this belongs to the user
    if (data.userId !== userId) {
      return null;
    }

    // Delete from Firebase
    await db.collection('user_books').doc(userBookId).delete();

    // Delete from PostgreSQL in background
    pool.query(`
      DELETE FROM user_books
      WHERE id = $1 AND user_id = $2
    `, [userBookId, userId])
      .catch(err => {
        logger.warn('Failed to delete user_book from PostgreSQL:', err.message);
      });

    return { success: true };
  } catch (error) {
    console.error('Error deleting user book:', error);
    throw error;
  }
};

const getUserBookStats = async (userId) => {
  try {
    const snapshot = await db.collection('user_books')
      .where('userId', '==', userId)
      .get();

    const userBooks = snapshot.docs.map(doc => doc.data());

    const stats = {
      totalBooks: userBooks.length,
      readBooks: userBooks.filter(b => b.status === 'read').length,
      currentlyReading: userBooks.filter(b => b.status === 'currently-reading').length,
      toReadBooks: userBooks.filter(b => b.status === 'to-read').length,
      averageRating: 0,
      totalPages: 0,
      readingStreak: 0
    };

    // Calculate average rating
    const ratedBooks = userBooks.filter(b => b.personalRating && b.personalRating > 0);
    if (ratedBooks.length > 0) {
      const totalRating = ratedBooks.reduce((sum, b) => sum + (b.personalRating || 0), 0);
      stats.averageRating = totalRating / ratedBooks.length;
    }

    // Calculate total pages
    stats.totalPages = userBooks.reduce((sum, b) => sum + (b.pages || 0), 0);

    return stats;
  } catch (error) {
    console.error('Error getting user book stats:', error);
    throw error;
  }
};

const updateUserBookById = async (userBookId, userId, updates) => {
  try {
    const doc = await db.collection('user_books').doc(userBookId).get();

    if (!doc.exists) {
      return null;
    }

    const data = doc.data();

    // Verify this belongs to the user
    if (data.userId !== userId) {
      return null;
    }

    const updateData = {
      ...updates,
      updatedAt: new Date()
    };

    // Convert date strings to Date objects if needed
    if (updateData.dateStarted && typeof updateData.dateStarted === 'string') {
      updateData.dateStarted = new Date(updateData.dateStarted);
    }
    if (updateData.dateFinished && typeof updateData.dateFinished === 'string') {
      updateData.dateFinished = new Date(updateData.dateFinished);
    }
    if (updateData.dateAdded && typeof updateData.dateAdded === 'string') {
      updateData.dateAdded = new Date(updateData.dateAdded);
    }

    // Update in Firebase
    await db.collection('user_books').doc(userBookId).update(updateData);

    // Get updated document
    const updatedDoc = await db.collection('user_books').doc(userBookId).get();
    const updatedData = updatedDoc.data();

    // Sync to PostgreSQL in background
    const pgData = {
      title: updatedData.title,
      author: updatedData.author,
      isbn: updatedData.isbn,
      genre: updatedData.genre,
      pages: updatedData.pages,
      publication_date: updatedData.publicationDate,
      description: updatedData.description,
      cover_image: updatedData.coverImage,
      status: updatedData.status,
      personal_rating: updatedData.personalRating,
      personal_review: updatedData.personalReview,
      date_started: updatedData.dateStarted?.toDate ? updatedData.dateStarted.toDate() : updatedData.dateStarted,
      date_finished: updatedData.dateFinished?.toDate ? updatedData.dateFinished.toDate() : updatedData.dateFinished,
      progress: updatedData.progress,
      updated_at: new Date()
    };

    pool.query(`
      UPDATE user_books
      SET title = $2, author = $3, isbn = $4, genre = $5, pages = $6,
          publication_date = $7, description = $8, cover_image = $9, status = $10,
          personal_rating = $11, personal_review = $12, date_started = $13,
          date_finished = $14, progress = $15, updated_at = $16
      WHERE id = $1 AND user_id = $17
    `, [
      userBookId,
      pgData.title,
      pgData.author,
      pgData.isbn,
      pgData.genre,
      pgData.pages,
      pgData.publication_date,
      pgData.description,
      pgData.cover_image,
      pgData.status,
      pgData.personal_rating,
      pgData.personal_review,
      pgData.date_started,
      pgData.date_finished,
      pgData.progress,
      pgData.updated_at,
      userId
    ]).catch(err => {
      logger.warn('Failed to sync updated user_book to PostgreSQL:', err.message);
    });

    return {
      id: updatedDoc.id,
      userId: updatedData.userId,
      bookId: updatedData.bookId || null,
      title: updatedData.title,
      author: updatedData.author,
      isbn: updatedData.isbn || null,
      genre: updatedData.genre || null,
      pages: updatedData.pages || null,
      publicationDate: updatedData.publicationDate || null,
      description: updatedData.description || null,
      coverImage: updatedData.coverImage || null,
      status: updatedData.status,
      personalRating: updatedData.personalRating || null,
      personalReview: updatedData.personalReview || null,
      dateAdded: updatedData.dateAdded?.toDate ? updatedData.dateAdded.toDate().toISOString() : updatedData.dateAdded,
      dateStarted: updatedData.dateStarted?.toDate ? updatedData.dateStarted.toDate().toISOString() : updatedData.dateStarted,
      dateFinished: updatedData.dateFinished?.toDate ? updatedData.dateFinished.toDate().toISOString() : updatedData.dateFinished,
      progress: updatedData.progress || 0,
      isCustomBook: updatedData.isCustomBook || false,
      createdAt: updatedData.createdAt?.toDate ? updatedData.createdAt.toDate().toISOString() : updatedData.createdAt,
      updatedAt: updatedData.updatedAt?.toDate ? updatedData.updatedAt.toDate().toISOString() : updatedData.updatedAt
    };
  } catch (error) {
    console.error('Error updating user book:', error);
    throw error;
  }
};

export {
  addUserBook,
  updateUserBook,
  getUserBooks,
  getUserBooksCount,
  removeUserBook,
  createUserBook,
  getUserBookById,
  deleteUserBook,
  getUserBookStats,
  updateUserBookById
};

// Provide a default export object for consumers that import the module as default
export default {
  addUserBook,
  updateUserBook,
  getUserBooks,
  getUserBooksCount,
  removeUserBook,
  createUserBook,
  getUserBookById,
  deleteUserBook,
  getUserBookStats,
  updateUserBookById
};
