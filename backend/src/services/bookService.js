import pool from '../config/database.js';
import { db } from '../config/firebase.js';

const getAllBooks = async (filters = {}) => {
  try {
    // Fetch from Firebase Firestore
    let booksQuery = db.collection('books');

    // Apply filters
    if (filters.genre) {
      booksQuery = booksQuery.where('genres', 'array-contains', filters.genre);
    }

    if (filters.author) {
      booksQuery = booksQuery.where('author', '==', filters.author);
    }

    // Apply sorting
    const sortBy = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder || 'desc';
    booksQuery = booksQuery.orderBy(sortBy, sortOrder.toLowerCase());

    // Apply limit
    const limit = parseInt(filters.limit) || 20;
    booksQuery = booksQuery.limit(limit);

    const snapshot = await booksQuery.get();

    let books = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || 'Untitled',
        author: data.author || 'Unknown Author',
        isbn: data.isbn || null,
        description: data.description || null,
        coverImage: data.coverImage || null,
        publishedYear: data.publishedYear || null,
        publisher: data.publisher || null,
        pageCount: data.pageCount || null,
        language: data.language || 'en',
        genres: data.genres || [],
        rating: parseFloat(data.rating) || 0,
        totalRatings: data.totalRatings || 0,
        createdBy: data.createdBy || null,
        isUserGenerated: data.isUserGenerated || false,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt || new Date()),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : (data.updatedAt || new Date())
      };
    });

    // Apply search filter (client-side since Firestore doesn't support LIKE)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      books = books.filter(book =>
        book.title.toLowerCase().includes(searchLower)
      );
    }

    // Apply offset
    const offset = parseInt(filters.offset) || 0;
    if (offset > 0) {
      books = books.slice(offset);
    }

    return books;
  } catch (error) {
    console.error('Error getting books from Firebase:', error);
    throw error;
  }
};

const getBookById = async (bookId) => {
  try {
    // Fetch from Firebase Firestore
    const doc = await db.collection('books').doc(bookId).get();

    if (!doc.exists) {
      return null;
    }

    const data = doc.data();
    return {
      id: doc.id,
      title: data.title || 'Untitled',
      author: data.author || 'Unknown Author',
      isbn: data.isbn || null,
      description: data.description || null,
      coverImage: data.coverImage || null,
      publishedYear: data.publishedYear || null,
      publisher: data.publisher || null,
      pageCount: data.pageCount || null,
      language: data.language || 'en',
      genres: data.genres || [],
      rating: parseFloat(data.rating) || 0,
      totalRatings: data.totalRatings || 0,
      createdBy: data.createdBy || null,
      isUserGenerated: data.isUserGenerated || false,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt || new Date()),
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : (data.updatedAt || new Date())
    };
  } catch (error) {
    console.error('Error getting book from Firebase:', error);
    throw error;
  }
};

const createBook = async (bookData, userId = null) => {
  try {
    if (bookData.isbn) {
      const isbnCheck = await pool.query(`
        SELECT id FROM books WHERE isbn = $1
      `, [bookData.isbn]);

      if (isbnCheck.rows.length > 0) {
        const error = new Error(`Book with ISBN ${bookData.isbn} already exists`);
        error.statusCode = 409;
        error.existingBook = await getBookById(isbnCheck.rows[0].id);
        throw error;
      }
    }

    const titleLower = bookData.title.toLowerCase();
    const duplicateCheck = await pool.query(`
      SELECT id FROM books WHERE title_lower = $1 AND author = $2
    `, [titleLower, bookData.author]);

    if (duplicateCheck.rows.length > 0) {
      const error = new Error(`Book "${bookData.title}" by ${bookData.author} already exists`);
      error.statusCode = 409;
      error.existingBook = await getBookById(duplicateCheck.rows[0].id);
      throw error;
    }

    const result = await pool.query(`
      INSERT INTO books (
        title, title_lower, author, isbn, description, cover_image,
        published_year, publisher, page_count, language, genres,
        rating, total_ratings, created_by, is_user_generated
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `, [
      bookData.title,
      titleLower,
      bookData.author,
      bookData.isbn || null,
      bookData.description || null,
      bookData.coverImage || null,
      bookData.publishedYear || null,
      bookData.publisher || null,
      bookData.pageCount || null,
      bookData.language || 'en',
      bookData.genres || [],
      bookData.rating || 0,
      bookData.totalRatings || 0,
      userId,
      !!userId
    ]);

    const book = result.rows[0];
    return {
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
    };
  } catch (error) {
    console.error('Error creating book:', error);
    throw error;
  }
};

const updateBook = async (bookId, updateData) => {
  try {
    const updates = [];
    const params = [];
    let paramCount = 1;

    if (updateData.title) {
      updates.push(`title = $${paramCount}`, `title_lower = $${paramCount + 1}`);
      params.push(updateData.title, updateData.title.toLowerCase());
      paramCount += 2;
    }
    if (updateData.author) {
      updates.push(`author = $${paramCount}`);
      params.push(updateData.author);
      paramCount++;
    }
    if (updateData.isbn !== undefined) {
      updates.push(`isbn = $${paramCount}`);
      params.push(updateData.isbn);
      paramCount++;
    }
    if (updateData.description !== undefined) {
      updates.push(`description = $${paramCount}`);
      params.push(updateData.description);
      paramCount++;
    }
    if (updateData.coverImage !== undefined) {
      updates.push(`cover_image = $${paramCount}`);
      params.push(updateData.coverImage);
      paramCount++;
    }
    if (updateData.publishedYear) {
      updates.push(`published_year = $${paramCount}`);
      params.push(updateData.publishedYear);
      paramCount++;
    }
    if (updateData.publisher) {
      updates.push(`publisher = $${paramCount}`);
      params.push(updateData.publisher);
      paramCount++;
    }
    if (updateData.pageCount) {
      updates.push(`page_count = $${paramCount}`);
      params.push(updateData.pageCount);
      paramCount++;
    }
    if (updateData.language) {
      updates.push(`language = $${paramCount}`);
      params.push(updateData.language);
      paramCount++;
    }
    if (updateData.genres) {
      updates.push(`genres = $${paramCount}`);
      params.push(updateData.genres);
      paramCount++;
    }

    if (updates.length === 0) {
      return await getBookById(bookId);
    }

    updates.push('updated_at = NOW()');
    params.push(bookId);

    const result = await pool.query(`
      UPDATE books SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `, params);

    if (result.rows.length === 0) {
      return null;
    }

    return await getBookById(bookId);
  } catch (error) {
    console.error('Error updating book:', error);
    throw error;
  }
};

const deleteBook = async (bookId) => {
  try {
    const result = await pool.query(`
      DELETE FROM books WHERE id = $1 RETURNING id
    `, [bookId]);

    if (result.rows.length === 0) {
      return null;
    }

    return { id: bookId, deleted: true };
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
};

const getBooksCount = async (filters = {}) => {
  try {
    // Fetch count from Firebase Firestore
    let booksQuery = db.collection('books');

    if (filters.genre) {
      booksQuery = booksQuery.where('genres', 'array-contains', filters.genre);
    }

    if (filters.author) {
      booksQuery = booksQuery.where('author', '==', filters.author);
    }

    const snapshot = await booksQuery.get();
    return snapshot.size;
  } catch (error) {
    console.error('Error getting books count from Firebase:', error);
    throw error;
  }
};

const getUserBooks = async (userId, filters = {}) => {
  try {
    let query = `
      SELECT b.* FROM books b
      INNER JOIN users u ON b.created_by = u.id
      WHERE u.id = $1
    `;
    const params = [userId];
    let paramCount = 2;

    if (filters.search) {
      query += ` AND b.title_lower LIKE $${paramCount}`;
      params.push(`%${filters.search.toLowerCase()}%`);
      paramCount++;
    }

    const sortBy = filters.sortBy || 'created_at';
    const sortOrder = filters.sortOrder || 'DESC';
    query += ` ORDER BY b.${sortBy} ${sortOrder}`;

    const limit = parseInt(filters.limit) || 20;
    const offset = parseInt(filters.offset) || 0;
    query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    return result.rows.map(book => ({
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
    }));
  } catch (error) {
    console.error('Error getting user books:', error);
    throw error;
  }
};

const getUserBooksCount = async (userId, filters = {}) => {
  try {
    let query = `
      SELECT COUNT(*) FROM books b
      INNER JOIN users u ON b.created_by = u.id
      WHERE u.id = $1
    `;
    const params = [userId];
    let paramCount = 2;

    if (filters.search) {
      query += ` AND b.title_lower LIKE $${paramCount}`;
      params.push(`%${filters.search.toLowerCase()}%`);
      paramCount++;
    }

    const result = await pool.query(query, params);
    return parseInt(result.rows[0].count);
  } catch (error) {
    console.error('Error getting user books count:', error);
    throw error;
  }
};

export {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getBooksCount,
  getUserBooks,
  getUserBooksCount,
};
