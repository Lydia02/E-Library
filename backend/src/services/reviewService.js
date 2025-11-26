import pool from '../config/database.js';

const addReview = async (userId, bookId, rating, reviewText) => {
  try {
    const result = await pool.query(`
      INSERT INTO reviews (user_id, book_id, rating, review_text)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, book_id) 
      DO UPDATE SET rating = $3, review_text = $4, updated_at = NOW()
      RETURNING id, rating, review_text, created_at, updated_at
    `, [userId, bookId, rating, reviewText]);

    return {
      id: result.rows[0].id.toString(),
      userId,
      bookId,
      rating: result.rows[0].rating,
      reviewText: result.rows[0].review_text,
      createdAt: result.rows[0].created_at,
      updatedAt: result.rows[0].updated_at
    };
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};

const getBookReviews = async (bookId, filters = {}) => {
  try {
    const limit = parseInt(filters.limit) || 20;
    const offset = parseInt(filters.offset) || 0;

    const result = await pool.query(`
      SELECT
        r.*,
        u.display_name,
        u.photo_url
      FROM reviews r
      INNER JOIN users u ON r.user_id = u.id
      WHERE r.book_id = $1
      ORDER BY r.created_at DESC
      LIMIT $2 OFFSET $3
    `, [bookId, limit, offset]);

    return result.rows.map(row => ({
      id: row.id.toString(),
      userId: row.user_id,
      bookId: row.book_id,
      rating: row.rating,
      reviewText: row.review_text,
      user: {
        displayName: row.display_name,
        photoURL: row.photo_url
      },
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  } catch (error) {
    console.error('Error getting book reviews:', error);
    throw error;
  }
};

const getUserReviews = async (userId, filters = {}) => {
  try {
    const limit = parseInt(filters.limit) || 20;
    const offset = parseInt(filters.offset) || 0;

    const result = await pool.query(`
      SELECT
        r.*,
        b.title,
        b.author,
        b.cover_image
      FROM reviews r
      INNER JOIN books b ON r.book_id = b.id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC
      LIMIT $2 OFFSET $3
    `, [userId, limit, offset]);

    return result.rows.map(row => ({
      id: row.id.toString(),
      bookId: row.book_id,
      rating: row.rating,
      reviewText: row.review_text,
      book: {
        title: row.title,
        author: row.author,
        coverImage: row.cover_image
      },
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  } catch (error) {
    console.error('Error getting user reviews:', error);
    throw error;
  }
};

const deleteReview = async (userId, bookId) => {
  try {
    const result = await pool.query(`
      DELETE FROM reviews
      WHERE user_id = $1 AND book_id = $2
      RETURNING id
    `, [userId, bookId]);

    if (result.rows.length === 0) {
      return null;
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

export {
  addReview,
  getBookReviews,
  getUserReviews,
  deleteReview
};