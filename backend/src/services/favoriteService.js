import pool from '../config/database.js';

const addFavorite = async (userId, bookId) => {
  try {
    const result = await pool.query(`
      INSERT INTO favorites (user_id, book_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, book_id) DO NOTHING
      RETURNING id, created_at
    `, [userId, bookId]);

    if (result.rows.length === 0) {
      throw new Error('Favorite already exists');
    }

    return {
      id: result.rows[0].id.toString(),
      userId,
      bookId,
      createdAt: result.rows[0].created_at
    };
  } catch (error) {
    console.error('Error adding favorite:', error);
    throw error;
  }
};

const removeFavorite = async (userId, bookId) => {
  try {
    const result = await pool.query(`
      DELETE FROM favorites
      WHERE user_id = $1 AND book_id = $2
      RETURNING id
    `, [userId, bookId]);

    if (result.rows.length === 0) {
      return null;
    }

    return { success: true };
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
};

const getUserFavorites = async (userId, filters = {}) => {
  try {
    const limit = parseInt(filters.limit) || 20;
    const offset = parseInt(filters.offset) || 0;

    const result = await pool.query(`
      SELECT
        f.id as favorite_id,
        f.created_at as favorited_at,
        b.*
      FROM favorites f
      INNER JOIN books b ON f.book_id = b.id
      WHERE f.user_id = $1
      ORDER BY f.created_at DESC
      LIMIT $2 OFFSET $3
    `, [userId, limit, offset]);

    return result.rows.map(row => ({
      favoriteId: row.favorite_id.toString(),
      favoritedAt: row.favorited_at,
      book: {
        id: row.id.toString(),
        title: row.title,
        author: row.author,
        isbn: row.isbn,
        description: row.description,
        coverImage: row.cover_image,
        publishedYear: row.published_year,
        publisher: row.publisher,
        pageCount: row.page_count,
        language: row.language,
        genres: row.genres,
        rating: parseFloat(row.rating),
        totalRatings: row.total_ratings
      }
    }));
  } catch (error) {
    console.error('Error getting user favorites:', error);
    throw error;
  }
};

const getUserFavoritesCount = async (userId) => {
  try {
    const result = await pool.query(`
      SELECT COUNT(*) FROM favorites WHERE user_id = $1
    `, [userId]);

    return parseInt(result.rows[0].count);
  } catch (error) {
    console.error('Error getting favorites count:', error);
    throw error;
  }
};

const isFavorite = async (userId, bookId) => {
  try {
    const result = await pool.query(`
      SELECT id FROM favorites
      WHERE user_id = $1 AND book_id = $2
    `, [userId, bookId]);

    return result.rows.length > 0;
  } catch (error) {
    console.error('Error checking favorite status:', error);
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