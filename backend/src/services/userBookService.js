import pool from '../config/database.js';

const addUserBook = async (userId, bookId, status = 'to-read', progress = 0) => {
  try {
    const result = await pool.query(`
      INSERT INTO user_books (user_id, book_id, status, progress)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, book_id)
      DO UPDATE SET status = $3, progress = $4, updated_at = NOW()
      RETURNING id, status, progress, started_at, completed_at, created_at, updated_at
    `, [userId, bookId, status, progress]);

    return {
      id: result.rows[0].id.toString(),
      userId,
      bookId,
      status: result.rows[0].status,
      progress: result.rows[0].progress,
      startedAt: result.rows[0].started_at,
      completedAt: result.rows[0].completed_at,
      createdAt: result.rows[0].created_at,
      updatedAt: result.rows[0].updated_at
    };
  } catch (error) {
    console.error('Error adding user book:', error);
    throw error;
  }
};

const updateUserBook = async (userId, bookId, updates) => {
  try {
    const setClause = [];
    const params = [];
    let paramCount = 1;

    if (updates.status !== undefined) {
      setClause.push(`status = $` + paramCount);
      params.push(updates.status);
      paramCount++;

      if (updates.status === 'reading' && !updates.startedAt) {
        setClause.push(`started_at = NOW()`);
      } else if (updates.status === 'completed' && !updates.completedAt) {
        setClause.push(`completed_at = NOW()`, `progress = 100`);
      }
    }

    if (updates.progress !== undefined) {
      setClause.push(`progress = $` + paramCount);
      params.push(updates.progress);
      paramCount++;
    }

    if (updates.startedAt !== undefined) {
      setClause.push(`started_at = $` + paramCount);
      params.push(updates.startedAt);
      paramCount++;
    }

    if (updates.completedAt !== undefined) {
      setClause.push(`completed_at = $` + paramCount);
      params.push(updates.completedAt);
      paramCount++;
    }

    setClause.push('updated_at = NOW()');
    params.push(userId, bookId);

    const result = await pool.query(`
      UPDATE user_books
      SET ` + setClause.join(', ') + `
      WHERE user_id = $` + paramCount + ` AND book_id = $` + (paramCount + 1) + `
      RETURNING *
    `, params);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id.toString(),
      userId: row.user_id,
      bookId: row.book_id,
      status: row.status,
      progress: row.progress,
      startedAt: row.started_at,
      completedAt: row.completed_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  } catch (error) {
    console.error('Error updating user book:', error);
    throw error;
  }
};

const getUserBooks = async (userId, filters = {}) => {
  try {
    let query = `
      SELECT
        ub.*,
        b.title,
        b.author,
        b.cover_image,
        b.page_count,
        b.genres
      FROM user_books ub
      INNER JOIN books b ON ub.book_id = b.id
      WHERE ub.user_id = $1
    `;
    const params = [userId];
    let paramCount = 2;

    if (filters.status) {
      query += ` AND ub.status = $` + paramCount;
      params.push(filters.status);
      paramCount++;
    }

    query += ` ORDER BY ub.updated_at DESC`;

    const limit = parseInt(filters.limit) || 20;
    const offset = parseInt(filters.offset) || 0;
    query += ` LIMIT $` + paramCount + ` OFFSET $` + (paramCount + 1);
    params.push(limit, offset);

    const result = await pool.query(query, params);

    return result.rows.map(row => ({
      id: row.id.toString(),
      bookId: row.book_id,
      status: row.status,
      progress: row.progress,
      startedAt: row.started_at,
      completedAt: row.completed_at,
      book: {
        id: row.book_id.toString(),
        title: row.title,
        author: row.author,
        coverImage: row.cover_image,
        pageCount: row.page_count,
        genres: row.genres
      },
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  } catch (error) {
    console.error('Error getting user books:', error);
    throw error;
  }
};

const getUserBooksCount = async (userId, filters = {}) => {
  try {
    let query = 'SELECT COUNT(*) FROM user_books WHERE user_id = $1';
    const params = [userId];
    let paramCount = 2;

    if (filters.status) {
      query += ` AND status = $` + paramCount;
      params.push(filters.status);
      paramCount++;
    }

    const result = await pool.query(query, params);
    return parseInt(result.rows[0].count);
  } catch (error) {
    console.error('Error getting user books count:', error);
    throw error;
  }
};

const removeUserBook = async (userId, bookId) => {
  try {
    const result = await pool.query(`
      DELETE FROM user_books
      WHERE user_id = $1 AND book_id = $2
      RETURNING id
    `, [userId, bookId]);

    if (result.rows.length === 0) {
      return null;
    }

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