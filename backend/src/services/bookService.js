import { db } from '../config/firebase.js';

const booksCollection = db.collection('books');

/**
 * Book Service - Handles all Firestore operations for books
 */

// Get all books with optional filtering, search, and pagination
const getAllBooks = async (filters = {}) => {
  try {
    let query = booksCollection;

    // Filter by genre
    if (filters.genre) {
      query = query.where('genres', 'array-contains', filters.genre);
    }

    // Filter by author
    if (filters.author) {
      query = query.where('author', '==', filters.author);
    }

    // Search by title (case-insensitive substring search)
    // Note: Firestore doesn't support full-text search natively
    // For production, consider using Algolia or Elasticsearch
    if (filters.search) {
      // This is a simplified search - matches beginning of title
      const searchLower = filters.search.toLowerCase();
      query = query
        .where('titleLower', '>=', searchLower)
        .where('titleLower', '<=', searchLower + '\uf8ff');
    }

    // Sorting
    const sortBy = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder || 'desc';
    query = query.orderBy(sortBy, sortOrder);

    // Pagination
    const limit = parseInt(filters.limit) || 20;
    const offset = parseInt(filters.offset) || 0;

    query = query.limit(limit).offset(offset);

    // Execute query
    const snapshot = await query.get();

    if (snapshot.empty) {
      return [];
    }

    const books = [];
    snapshot.forEach((doc) => {
      books.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return books;
  } catch (error) {
    console.error('Error getting books:', error);
    throw error;
  }
};

// Get a single book by ID
const getBookById = async (bookId) => {
  try {
    const doc = await booksCollection.doc(bookId).get();

    if (!doc.exists) {
      return null;
    }

    return {
      id: doc.id,
      ...doc.data(),
    };
  } catch (error) {
    console.error('Error getting book:', error);
    throw error;
  }
};

// Create a new book
const createBook = async (bookData, userId = null) => {
  try {
    // Check for duplicate by ISBN
    if (bookData.isbn) {
      const isbnQuery = await booksCollection.where('isbn', '==', bookData.isbn).limit(1).get();
      if (!isbnQuery.empty) {
        const existingBook = isbnQuery.docs[0];
        const error = new Error(`Book with ISBN ${bookData.isbn} already exists`);
        error.statusCode = 409;
        error.existingBook = { id: existingBook.id, ...existingBook.data() };
        throw error;
      }
    }

    // Check for duplicate by title and author
    const titleLower = bookData.title.toLowerCase();
    const duplicateQuery = await booksCollection
      .where('titleLower', '==', titleLower)
      .where('author', '==', bookData.author)
      .limit(1)
      .get();

    if (!duplicateQuery.empty) {
      const existingBook = duplicateQuery.docs[0];
      const error = new Error(`Book "${bookData.title}" by ${bookData.author} already exists`);
      error.statusCode = 409;
      error.existingBook = { id: existingBook.id, ...existingBook.data() };
      throw error;
    }

    const newBook = {
      ...bookData,
      titleLower,
      rating: bookData.rating || 0,
      totalRatings: bookData.totalRatings || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: userId, // Track who created the book
      isUserGenerated: !!userId, // Flag to identify user-added books
    };

    const docRef = await booksCollection.add(newBook);

    return {
      id: docRef.id,
      ...newBook,
    };
  } catch (error) {
    console.error('Error creating book:', error);
    throw error;
  }
};

// Update an existing book
const updateBook = async (bookId, updateData) => {
  try {
    const bookRef = booksCollection.doc(bookId);
    const doc = await bookRef.get();

    if (!doc.exists) {
      return null;
    }

    const updates = {
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    // Update titleLower if title is being updated
    if (updateData.title) {
      updates.titleLower = updateData.title.toLowerCase();
    }

    await bookRef.update(updates);

    const updatedDoc = await bookRef.get();
    return {
      id: updatedDoc.id,
      ...updatedDoc.data(),
    };
  } catch (error) {
    console.error('Error updating book:', error);
    throw error;
  }
};

// Delete a book
const deleteBook = async (bookId) => {
  try {
    const bookRef = booksCollection.doc(bookId);
    const doc = await bookRef.get();

    if (!doc.exists) {
      return null;
    }

    await bookRef.delete();
    return { id: bookId, deleted: true };
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
};

// Get total count of books (for pagination)
const getBooksCount = async (filters = {}) => {
  try {
    let query = booksCollection;

    if (filters.genre) {
      query = query.where('genres', 'array-contains', filters.genre);
    }

    if (filters.author) {
      query = query.where('author', '==', filters.author);
    }

    const snapshot = await query.get();
    return snapshot.size;
  } catch (error) {
    console.error('Error getting books count:', error);
    throw error;
  }
};

// Get books created by a specific user
const getUserBooks = async (userId, filters = {}) => {
  try {
    let query = booksCollection.where('createdBy', '==', userId);

    // Apply search filter if provided
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      query = query
        .where('titleLower', '>=', searchLower)
        .where('titleLower', '<=', searchLower + '\uf8ff');
    }

    // Apply sorting
    const sortBy = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder || 'desc';
    query = query.orderBy(sortBy, sortOrder);

    // Apply pagination
    const limit = parseInt(filters.limit) || 20;
    const offset = parseInt(filters.offset) || 0;
    query = query.limit(limit).offset(offset);

    const snapshot = await query.get();

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting user books:', error);
    throw error;
  }
};

// Get count of books created by a specific user
const getUserBooksCount = async (userId, filters = {}) => {
  try {
    let query = booksCollection.where('createdBy', '==', userId);

    // Apply search filter if provided
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      query = query
        .where('titleLower', '>=', searchLower)
        .where('titleLower', '<=', searchLower + '\uf8ff');
    }

    const snapshot = await query.get();
    return snapshot.size;
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
