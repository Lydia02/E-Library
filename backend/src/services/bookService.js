import { syncToPostgres, deleteFromPostgres } from '../config/database.js';
import { db } from '../config/firebase.js';
import logger from '../utils/logger.js';

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
        coverUrl: data.coverImage || null,
        publishedYear: data.publishedYear || null,
        publisher: data.publisher || null,
        pageCount: data.pageCount || null,
        pages: data.pages || data.pageCount || null,
        language: data.language || 'en',
        genres: data.genres || [],
        genre: data.genres && data.genres[0] ? data.genres[0] : null,
        rating: parseFloat(data.rating) || 0,
        totalRatings: data.totalRatings || 0,
        price: data.price || 0,
        publicationDate: data.publicationDate || null,
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
      coverUrl: data.coverImage || null,
      publishedYear: data.publishedYear || null,
      publisher: data.publisher || null,
      pageCount: data.pageCount || null,
      pages: data.pages || data.pageCount || null,
      language: data.language || 'en',
      genres: data.genres || [],
      genre: data.genres && data.genres[0] ? data.genres[0] : null,
      rating: parseFloat(data.rating) || 0,
      totalRatings: data.totalRatings || 0,
      price: data.price || 0,
      publicationDate: data.publicationDate || null,
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
    // Check for duplicates in Firebase
    if (bookData.isbn) {
      const isbnSnapshot = await db.collection('books')
        .where('isbn', '==', bookData.isbn)
        .limit(1)
        .get();

      if (!isbnSnapshot.empty) {
        const existingDoc = isbnSnapshot.docs[0];
        const error = new Error(`Book with ISBN ${bookData.isbn} already exists`);
        error.statusCode = 409;
        error.existingBook = await getBookById(existingDoc.id);
        throw error;
      }
    }

    const titleLower = bookData.title.toLowerCase();
    const duplicateSnapshot = await db.collection('books')
      .where('title', '==', bookData.title)
      .where('author', '==', bookData.author)
      .limit(1)
      .get();

    if (!duplicateSnapshot.empty) {
      const existingDoc = duplicateSnapshot.docs[0];
      const error = new Error(`Book "${bookData.title}" by ${bookData.author} already exists`);
      error.statusCode = 409;
      error.existingBook = await getBookById(existingDoc.id);
      throw error;
    }

    // Create book in Firebase (primary database)
    const newBook = {
      title: bookData.title,
      author: bookData.author,
      isbn: bookData.isbn || null,
      description: bookData.description || null,
      coverImage: bookData.coverImage || null,
      publishedYear: bookData.publishedYear || null,
      publisher: bookData.publisher || null,
      pageCount: bookData.pageCount || null,
      language: bookData.language || 'en',
      genres: bookData.genres || [],
      rating: bookData.rating || 0,
      totalRatings: bookData.totalRatings || 0,
      createdBy: userId,
      isUserGenerated: !!userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await db.collection('books').add(newBook);

    // Sync to PostgreSQL in background (don't fail if it errors)
    const postgresData = {
      title: newBook.title,
      title_lower: newBook.title.toLowerCase(),
      author: newBook.author,
      isbn: newBook.isbn,
      description: newBook.description,
      cover_image: newBook.coverImage,
      published_year: newBook.publishedYear,
      publisher: newBook.publisher,
      page_count: newBook.pageCount,
      language: newBook.language,
      genres: newBook.genres,
      rating: newBook.rating,
      total_ratings: newBook.totalRatings,
      created_by: newBook.createdBy,
      is_user_generated: newBook.isUserGenerated,
      created_at: newBook.createdAt,
      updated_at: newBook.updatedAt
    };

    syncToPostgres('books', postgresData, 'isbn').catch(err => {
      logger.warn('Failed to sync book to PostgreSQL:', err.message);
    });

    return {
      id: docRef.id,
      ...newBook
    };
  } catch (error) {
    console.error('Error creating book:', error);
    throw error;
  }
};

const updateBook = async (bookId, updateData) => {
  try {
    // Check if book exists in Firebase
    const docRef = db.collection('books').doc(bookId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return null;
    }

    // Build update object
    const updates = {
      updatedAt: new Date()
    };

    if (updateData.title !== undefined) updates.title = updateData.title;
    if (updateData.author !== undefined) updates.author = updateData.author;
    if (updateData.isbn !== undefined) updates.isbn = updateData.isbn;
    if (updateData.description !== undefined) updates.description = updateData.description;
    if (updateData.coverImage !== undefined) updates.coverImage = updateData.coverImage;
    if (updateData.publishedYear !== undefined) updates.publishedYear = updateData.publishedYear;
    if (updateData.publisher !== undefined) updates.publisher = updateData.publisher;
    if (updateData.pageCount !== undefined) updates.pageCount = updateData.pageCount;
    if (updateData.language !== undefined) updates.language = updateData.language;
    if (updateData.genres !== undefined) updates.genres = updateData.genres;

    // Update in Firebase
    await docRef.update(updates);

    // Get updated book
    const updatedBook = await getBookById(bookId);

    // Sync to PostgreSQL in background (don't fail if it errors)
    if (updatedBook) {
      const postgresData = {
        title: updatedBook.title,
        title_lower: updatedBook.title.toLowerCase(),
        author: updatedBook.author,
        isbn: updatedBook.isbn,
        description: updatedBook.description,
        cover_image: updatedBook.coverImage,
        published_year: updatedBook.publishedYear,
        publisher: updatedBook.publisher,
        page_count: updatedBook.pageCount,
        language: updatedBook.language,
        genres: updatedBook.genres,
        rating: updatedBook.rating,
        total_ratings: updatedBook.totalRatings,
        created_by: updatedBook.createdBy,
        is_user_generated: updatedBook.isUserGenerated,
        created_at: updatedBook.createdAt,
        updated_at: updatedBook.updatedAt
      };

      syncToPostgres('books', postgresData, 'isbn').catch(err => {
        logger.warn('Failed to sync updated book to PostgreSQL:', err.message);
      });
    }

    return updatedBook;
  } catch (error) {
    console.error('Error updating book:', error);
    throw error;
  }
};

const deleteBook = async (bookId) => {
  try {
    // Check if book exists in Firebase
    const docRef = db.collection('books').doc(bookId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return null;
    }

    const bookData = doc.data();

    // Delete from Firebase
    await docRef.delete();

    // Delete from PostgreSQL in background (don't fail if it errors)
    if (bookData.isbn) {
      deleteFromPostgres('books', bookData.isbn, 'isbn').catch(err => {
        logger.warn('Failed to delete book from PostgreSQL:', err.message);
      });
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
    // Fetch from Firebase Firestore
    let booksQuery = db.collection('books').where('createdBy', '==', userId);

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
        coverUrl: data.coverImage || null,
        publishedYear: data.publishedYear || null,
        publisher: data.publisher || null,
        pageCount: data.pageCount || null,
        pages: data.pages || data.pageCount || null,
        language: data.language || 'en',
        genres: data.genres || [],
        genre: data.genres && data.genres[0] ? data.genres[0] : null,
        rating: parseFloat(data.rating) || 0,
        totalRatings: data.totalRatings || 0,
        price: data.price || 0,
        publicationDate: data.publicationDate || null,
        createdBy: data.createdBy || null,
        isUserGenerated: data.isUserGenerated || false,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt || new Date()),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : (data.updatedAt || new Date())
      };
    });

    // Apply search filter (client-side)
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
    console.error('Error getting user books:', error);
    throw error;
  }
};

const getUserBooksCount = async (userId, filters = {}) => {
  try {
    // Fetch from Firebase Firestore
    let booksQuery = db.collection('books').where('createdBy', '==', userId);

    const snapshot = await booksQuery.get();
    let count = snapshot.size;

    // Apply search filter (client-side)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      count = snapshot.docs.filter(doc => {
        const data = doc.data();
        const title = (data.title || '').toLowerCase();
        return title.includes(searchLower);
      }).length;
    }

    return count;
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