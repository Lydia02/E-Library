import { db } from '../config/firebase.js';
import logger from '../utils/logger.js';

/**
 * Get books count from database
 */
export const getBooksCount = async () => {
  try {
    const booksCollection = db.collection('books');
    const snapshot = await booksCollection.get();
    return snapshot.size;
  } catch (error) {
    console.error('❌ Error getting books count:', error);
    return 0;
  }
};

/**
 * Clear all books from database
 */
export const clearAllBooks = async () => {
  logger.info('🗑️  Clearing all books from database...');

  try {
    const booksCollection = db.collection('books');
    const existingBooks = await booksCollection.get();
    const batch = db.batch();

    existingBooks.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

  await batch.commit();
  logger.info(`✅ Successfully deleted ${existingBooks.size} books from database`);
    return { success: true, deletedCount: existingBooks.size };
  } catch (error) {
    console.error('❌ Error clearing books:', error);
    throw error;
  }
};

/**
 * Check if database has any books
 */
export const isDatabaseEmpty = async () => {
  try {
    const booksCollection = db.collection('books');
    const snapshot = await booksCollection.limit(1).get();
    return snapshot.empty;
  } catch (error) {
    console.error('❌ Error checking database:', error);
    return true;
  }
};

/**
 * Initialize books if database is empty
 * Note: This now just logs a message since we rely on the database having books
 */
export const initializeBooksIfEmpty = async () => {
  try {
    const isEmpty = await isDatabaseEmpty();
    const count = await getBooksCount();

    if (isEmpty) {
          logger.info('📚 Database is empty. Please add books through the admin interface or API.');
    } else {
          logger.info(`📚 Database contains ${count} books`);
    }
  } catch (error) {
    console.error('❌ Error checking database:', error);
  }
};

/**
 * Refresh books (placeholder for admin functionality)
 */
export const refreshBooks = async () => {
  logger.info('🔄 Refreshing books...');

  try {
    const count = await getBooksCount();
  logger.info(`✅ Database currently has ${count} books`);

    return {
      success: true,
      message: 'Books refresh completed',
      booksCount: count
    };
  } catch (error) {
    console.error('❌ Error refreshing books:', error);
    throw error;
  }
};
