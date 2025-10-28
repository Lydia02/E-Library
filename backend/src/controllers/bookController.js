import * as bookService from '../services/bookService.js';
import { sendSuccess, sendCreated, sendNotFound, sendBadRequest } from '../utils/response.js';
import { getPaginationParams, createPaginationMeta } from '../utils/pagination.js';
import { validateBookData } from '../utils/validation.js';
import { getBooksCount, clearAllBooks } from '../scripts/populateBooks.js';

const getBooks = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);

    const filters = {
      genre: req.query.genre,
      author: req.query.author,
      search: req.query.search,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      limit,
      offset,
    };

    const books = await bookService.getAllBooks(filters);
    const totalCount = await bookService.getBooksCount(filters);

    const pagination = createPaginationMeta(totalCount, page, limit);

    return sendSuccess(res, 200, {
      books,
      pagination,
    });
  } catch (error) {
    next(error);
  }
};

const getBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await bookService.getBookById(id);

    if (!book) {
      return sendNotFound(res, 'Book not found');
    }

    return sendSuccess(res, 200, { book });
  } catch (error) {
    next(error);
  }
};

const createBook = async (req, res, next) => {
  try {
    const bookData = req.body;
    const userId = req.user?.uid; // Get user ID from authenticated request

    const validationErrors = validateBookData(bookData);
    if (validationErrors.length > 0) {
      return sendBadRequest(res, validationErrors.join(', '));
    }

    const newBook = await bookService.createBook(bookData, userId);

    return sendCreated(res, { book: newBook }, 'Book created successfully');
  } catch (error) {
    next(error);
  }
};

const updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const validationErrors = validateBookData(updateData);
    if (validationErrors.length > 0) {
      return sendBadRequest(res, validationErrors.join(', '));
    }

    const updatedBook = await bookService.updateBook(id, updateData);

    if (!updatedBook) {
      return sendNotFound(res, 'Book not found');
    }

    return sendSuccess(res, 200, { book: updatedBook }, 'Book updated successfully');
  } catch (error) {
    next(error);
  }
};

const deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await bookService.deleteBook(id);

    if (!result) {
      return sendNotFound(res, 'Book not found');
    }

    return sendSuccess(res, 200, result, 'Book deleted successfully');
  } catch (error) {
    next(error);
  }
};

const getBooksStats = async (req, res, next) => {
  try {
    const totalBooks = await getBooksCount();
    const stats = {
      totalBooks,
      message: 'Database-driven book management active'
    };
    return sendSuccess(res, 200, stats);
  } catch (error) {
    next(error);
  }
};

const clearAllBooksData = async (req, res, next) => {
  try {
    const result = await clearAllBooks();
    return sendSuccess(res, 200, result, 'All books cleared successfully');
  } catch (error) {
    next(error);
  }
};

const getUserBooks = async (req, res, next) => {
  try {
    const userId = req.user?.uid;

    if (!userId) {
      return sendBadRequest(res, 'User authentication required');
    }

    const { page = 1, limit = 12, searchQuery, genre } = req.query;
    const filters = { searchQuery, genre };

    const result = await bookService.getUserBooks(userId, {
      page: parseInt(page),
      limit: parseInt(limit),
      ...filters
    });

    return sendSuccess(res, 200, result, 'User books retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  getBooksStats,
  clearAllBooksData,
  getUserBooks,
};
