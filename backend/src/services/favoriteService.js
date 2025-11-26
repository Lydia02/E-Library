import { db } from '../config/firebase.js';
import logger from '../utils/logger.js';
import pool, { syncToPostgres, deleteFromPostgres } from '../config/database.js';

const addFavorite = async (userId, bookId) => {
  try {
    // Check if favorite already exists
    const existingFavorite = await db.collection('favorites')
      .where('userId', '==', userId)
      .where('bookId', '==', bookId)
      .get();

    if (!existingFavorite.empty) {
      const err = new Error('Favorite already exists');
      err.statusCode = 409;
      throw err;
    }

    // Add new favorite to Firebase
    const favoriteData = {
      userId,
      bookId,
      createdAt: new Date()
    };

    const docRef = await db.collection('favorites').add(favoriteData);

    // Sync to PostgreSQL in background (don't fail if it errors)
    const postgresData = {
      user_id: userId,
      book_id: bookId,
      created_at: favoriteData.createdAt
    };

    // Use a composite key for favorites (user_id, book_id)
    pool.query(`
      INSERT INTO favorites (user_id, book_id, created_at)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, book_id) DO NOTHING
    `, [postgresData.user_id, postgresData.book_id, postgresData.created_at])
      .catch(err => {
        logger.warn('Failed to sync favorite to PostgreSQL:', err.message);
      });

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

    // Delete all matching favorites from Firebase (should only be one)
    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    // Delete from PostgreSQL in background (don't fail if it errors)
    pool.query(`
      DELETE FROM favorites
      WHERE user_id = $1 AND book_id = $2
    `, [userId, bookId])
      .catch(err => {
        logger.warn('Failed to delete favorite from PostgreSQL:', err.message);
      });

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

    let favoritesSnapshot;
    try {
      favoritesSnapshot = await favoritesQuery.get();
    } catch (idxErr) {
      // Firestore may require a composite index for this query. Fall back to Postgres favorites table
      logger.warn('Firestore favorites query failed, attempting Postgres fallback:', idxErr.message || idxErr);

      try {
        const res = await pool.query(`SELECT * FROM favorites WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2`, [userId, limit]);
        if (!res || !res.rows || res.rows.length === 0) return [];

        // Map Postgres favorites to the same shape as Firestore favorite entries
        const mapped = await Promise.all(res.rows.map(async (row) => {
          const fav = {
            favoriteId: row.id ? row.id.toString() : `${row.user_id}-${row.book_id}`,
            favoritedAt: row.created_at,
            bookId: row.book_id
          };

          // Prefer Postgres book data if available
          try {
            const bookRes = await pool.query('SELECT * FROM books WHERE id = $1', [row.book_id]);
            if (bookRes && bookRes.rows && bookRes.rows.length > 0) {
              const book = bookRes.rows[0];
              return {
                favoriteId: fav.favoriteId,
                favoritedAt: fav.favoritedAt,
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
                  rating: parseFloat(book.rating) || 0,
                  totalRatings: book.total_ratings || 0
                }
              };
            }
          } catch (pgErr) {
            logger.warn('Postgres book lookup failed during favorites fallback:', pgErr.message || pgErr);
          }

          // As a last resort try Firestore book doc
          try {
            const bookDoc = await db.collection('books').doc(row.book_id).get();
            if (bookDoc && bookDoc.exists) {
              const bookData = bookDoc.data();
              return {
                favoriteId: fav.favoriteId,
                favoritedAt: fav.favoritedAt,
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
          } catch (fsErr) {
            logger.warn('Firestore book lookup failed during favorites fallback:', fsErr.message || fsErr);
          }

          // If everything fails, skip this favorite
          return null;
        }));

        return mapped.filter(f => f !== null);
      } catch (pgFallbackErr) {
        logger.error('Postgres fallback for favorites failed:', pgFallbackErr.message || pgFallbackErr);
        throw idxErr; // rethrow original index error if fallback fails
      }
    }

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
