import { db } from '../config/firebase.js';
import logger from '../utils/logger.js';
import pool from '../config/database.js';

const addFavorite = async (userId, bookId) => {
  try {
    // Check if favorite already exists
    const existingFavorite = await db.collection('favorites')
      .where('userId', '==', userId)
      .where('bookId', '==', bookId)
      .get();

    if (!existingFavorite.empty) {
      throw new Error('Favorite already exists');
    }

    // Add new favorite
    const favoriteData = {
      userId,
      bookId,
      createdAt: new Date()
    };

    const docRef = await db.collection('favorites').add(favoriteData);

    return {
      id: docRef.id,
      userId,
      bookId,
      createdAt: favoriteData.createdAt
    };
  } catch (error) {
    logger.error('Error adding favorite:', error);
    throw error;
  }
};

const removeFavorite = async (userId, bookId) => {
  try {
    const snapshot = await db.collection('favorites')
      .where('userId', '==', userId)
      .where('bookId', '==', bookId)
      .get();

    if (snapshot.empty) {
      return null;
    }

    // Delete all matching favorites (should only be one)
    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    return { success: true };
  } catch (error) {
    logger.error('Error removing favorite:', error);
    throw error;
  }
};

const getUserFavorites = async (userId, filters = {}) => {
  try {
    const limit = parseInt(filters.limit) || 20;

    // Get favorites for user
    let favoritesQuery = db.collection('favorites')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(limit);

    const favoritesSnapshot = await favoritesQuery.get();

    if (favoritesSnapshot.empty) {
      return [];
    }

    // Get book details for each favorite. If the app stores books in Postgres
    // (primary DB), attempt to fetch from Postgres as a fallback when Firestore
    // book documents don't exist.
    const favorites = await Promise.all(
      favoritesSnapshot.docs.map(async (favoriteDoc) => {
        try {
          const favoriteData = favoriteDoc.data();

          // First try Firestore book doc
          const bookDoc = await db.collection('books').doc(favoriteData.bookId).get().catch(() => null);

          if (bookDoc && bookDoc.exists) {
            const bookData = bookDoc.data();
            return {
              favoriteId: favoriteDoc.id,
              favoritedAt: favoriteData.createdAt?.toDate ? favoriteData.createdAt.toDate() : favoriteData.createdAt,
              book: {
                id: bookDoc.id,
                title: bookData.title || 'Untitled',
                author: bookData.author || 'Unknown Author',
                isbn: bookData.isbn || null,
                description: bookData.description || null,
                coverImage: bookData.coverImage || null,
                publishedYear: bookData.publishedYear || null,
                publisher: bookData.publisher || null,
                pageCount: bookData.pageCount || null,
                language: bookData.language || 'en',
                genres: bookData.genres || [],
                rating: parseFloat(bookData.rating) || 0,
                totalRatings: bookData.totalRatings || 0
              }
            };
          }

          // Firestore book not found — fallback to Postgres directly
          try {
            const res = await pool.query('SELECT * FROM books WHERE id = $1', [favoriteData.bookId]);
            if (!res || res.rows.length === 0) return null;
            const book = res.rows[0];
            return {
              favoriteId: favoriteDoc.id,
              favoritedAt: favoriteData.createdAt?.toDate ? favoriteData.createdAt.toDate() : favoriteData.createdAt,
              book: {
                id: book.id.toString(),
                title: book.title,
                author: book.author,
                isbn: book.isbn,
                description: book.description,
                coverImage: book.cover_image,
                publishedYear: book.published_year,
                publisher: book.publisher,
                pageCount: book.page_count,
                language: book.language,
                genres: book.genres,
                rating: parseFloat(book.rating),
                totalRatings: book.total_ratings,
                createdBy: book.created_by,
                isUserGenerated: book.is_user_generated,
                createdAt: book.created_at,
                updatedAt: book.updated_at
              }
            };
          } catch (pgErr) {
            // If Postgres lookup fails, log and skip this favorite
            logger.warn('Failed to fetch book from Postgres for favorite', favoriteDoc.id, pgErr.message);
            return null;
          }
        } catch (innerErr) {
          logger.error('Error resolving favorite entry:', innerErr);
          return null;
        }
      })
    );

    // Filter out null entries (books that don't exist)
    return favorites.filter(f => f !== null);
  } catch (error) {
    logger.error('Error getting user favorites:', error);
    throw error;
  }
};

const getUserFavoritesCount = async (userId) => {
  try {
    const snapshot = await db.collection('favorites')
      .where('userId', '==', userId)
      .get();

    return snapshot.size;
  } catch (error) {
    logger.error('Error getting favorites count:', error);
    throw error;
  }
};

const isFavorite = async (userId, bookId) => {
  try {
    const snapshot = await db.collection('favorites')
      .where('userId', '==', userId)
      .where('bookId', '==', bookId)
      .get();

    return !snapshot.empty;
  } catch (error) {
    logger.error('Error checking favorite status:', error);
    throw error;
  }
};

export {
  addFavorite,
  removeFavorite,
  getUserFavorites,
  getUserFavoritesCount,
  isFavorite
};
