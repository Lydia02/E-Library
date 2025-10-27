import * as reviewService from '../services/reviewService.js';
import { sendSuccess, sendCreated, sendNotFound, sendBadRequest } from '../utils/response.js';
import { validateReviewData } from '../utils/validation.js';

const createReview = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.uid;
    const { rating, comment } = req.body;

    const validationErrors = validateReviewData({ rating, comment });
    if (validationErrors.length > 0) {
      return sendBadRequest(res, validationErrors.join(', '));
    }

    const review = await reviewService.createReview(bookId, userId, {
      rating,
      comment,
    });

    return sendCreated(res, { review }, 'Review created successfully');
  } catch (error) {
    if (error.statusCode === 404) {
      return sendNotFound(res, error.message);
    }
    if (error.statusCode === 409) {
      return res.status(409).json({
        success: false,
        error: { message: error.message },
      });
    }
    next(error);
  }
};

const getReviews = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    const reviews = await reviewService.getBookReviews(bookId);

    return sendSuccess(res, 200, { reviews, count: reviews.length });
  } catch (error) {
    next(error);
  }
};

const updateReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.uid;
    const { rating, comment } = req.body;

    if (rating !== undefined || comment !== undefined) {
      const validationErrors = validateReviewData({ rating, comment });
      if (validationErrors.length > 0) {
        return sendBadRequest(res, validationErrors.join(', '));
      }
    }

    const updateData = {};
    if (rating) updateData.rating = rating;
    if (comment !== undefined) updateData.comment = comment;

    const review = await reviewService.updateReview(reviewId, userId, updateData);

    return sendSuccess(res, 200, { review }, 'Review updated successfully');
  } catch (error) {
    if (error.statusCode === 404) {
      return sendNotFound(res, error.message);
    }
    if (error.statusCode === 403) {
      return res.status(403).json({
        success: false,
        error: { message: error.message },
      });
    }
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.uid;

    const result = await reviewService.deleteReview(reviewId, userId);

    return sendSuccess(res, 200, result, 'Review deleted successfully');
  } catch (error) {
    if (error.statusCode === 404) {
      return sendNotFound(res, error.message);
    }
    if (error.statusCode === 403) {
      return res.status(403).json({
        success: false,
        error: { message: error.message },
      });
    }
    next(error);
  }
};

export { createReview, getReviews, updateReview, deleteReview };
