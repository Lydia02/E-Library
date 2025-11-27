import * as userBookService from '../services/userBookService.js';
import { sendSuccess, sendCreated, sendNotFound, sendBadRequest } from '../utils/response.js';
import { getPaginationParams, createPaginationMeta } from '../utils/pagination.js';

const addUserBook = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const {
      title,
      author,
      isbn,
      genre,
      pages,
      publicationDate,
      description,
      status,
      personalRating,
      personalReview,
      dateStarted,
      dateFinished,
      progress,
      coverImage,
      bookId // Optional reference to existing book
    } = req.body;

    // Validate required fields
    if (!title || !author || !status) {
      return sendBadRequest(res, 'Title, author, and status are required');
    }

    // Validate reading status
    const validStatuses = ['to-read', 'currently-reading', 'read'];
    if (!validStatuses.includes(status)) {
      return sendBadRequest(res, 'Invalid reading status');
    }

    // Validate rating if provided
    if (personalRating && (personalRating < 1 || personalRating > 5)) {
      return sendBadRequest(res, 'Rating must be between 1 and 5');
    }

    const userBookData = {
      userId,
      bookId: bookId || null,
      title,
      author,
      isbn: isbn || null,
      genre: genre || null,
      pages: pages ? parseInt(pages) : null,
      publicationDate: publicationDate || null,
      description: description || null,
      status,
      personalRating: personalRating || null,
      personalReview: personalReview || null,
      dateAdded: new Date().toISOString(),
      dateStarted: dateStarted || null,
      dateFinished: dateFinished || null,
      progress: progress || 0,
      coverImage: coverImage || null,
      isCustomBook: !bookId
    };

    const userBook = await userBookService.createUserBook(userBookData);

    return sendCreated(res, { userBook }, 'Book added to library successfully');
  } catch (error) {
    console.error('Error adding user book:', error);
    next(error);
  }
};

const getUserBooks = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const { page, limit, offset } = getPaginationParams(req.query);

    const filters = {
      status: req.query.status,
      search: req.query.search,
      genre: req.query.genre,
      sortBy: req.query.sortBy || 'dateAdded',
      sortOrder: req.query.sortOrder || 'desc',
      limit,
      offset,
    };

    const userBooks = await userBookService.getUserBooks(userId, filters);
    const totalCount = await userBookService.getUserBooksCount(userId, filters);

    const pagination = createPaginationMeta(totalCount, page, limit);

    return sendSuccess(res, 200, {
      userBooks,
      pagination,
    });
  } catch (error) {
    next(error);
  }
};

const getUserBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    const userBook = await userBookService.getUserBookById(id, userId);

    if (!userBook) {
      return sendNotFound(res, 'Book not found in your library');
    }

    return sendSuccess(res, 200, { userBook });
  } catch (error) {
    next(error);
  }
};

const updateUserBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;
    const updates = req.body;

    // Validate rating if provided
    if (updates.personalRating && (updates.personalRating < 1 || updates.personalRating > 5)) {
      return sendBadRequest(res, 'Rating must be between 1 and 5');
    }

    // Validate status if provided
    if (updates.status) {
      const validStatuses = ['to-read', 'currently-reading', 'read'];
      if (!validStatuses.includes(updates.status)) {
        return sendBadRequest(res, 'Invalid reading status');
      }
    }

    const userBook = await userBookService.updateUserBookById(id, userId, {
      ...updates,
      updatedAt: new Date().toISOString()
    });

    if (!userBook) {
      return sendNotFound(res, 'Book not found in your library');
    }

    return sendSuccess(res, 200, { userBook }, 'Book updated successfully');
  } catch (error) {
    next(error);
  }
};

const deleteUserBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    const deleted = await userBookService.deleteUserBook(id, userId);

    if (!deleted) {
      return sendNotFound(res, 'Book not found in your library');
    }

    return sendSuccess(res, 200, null, 'Book removed from library successfully');
  } catch (error) {
    next(error);
  }
};

const getUserBookStats = async (req, res, next) => {
  try {
    const userId = req.user.uid;
    const stats = await userBookService.getUserBookStats(userId);

    return sendSuccess(res, 200, { stats });
  } catch (error) {
    next(error);
  }
};

export {
  addUserBook,
  getUserBooks,
  getUserBook,
  updateUserBook,
  deleteUserBook,
  getUserBookStats
};
