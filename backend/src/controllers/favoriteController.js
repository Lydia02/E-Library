import * as favoriteService from '../services/favoriteService.js';
import { sendSuccess, sendCreated, sendNotFound, sendBadRequest } from '../utils/response.js';

const addToFavorites = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.uid;

    const favorite = await favoriteService.addFavorite(userId, bookId);

    return sendCreated(res, { favorite }, 'Book added to favorites');
  } catch (error) {
    // Friendly 409 for duplicate favorites
    if (error && (error.statusCode === 409 || (error.message && error.message.toLowerCase().includes('favorite already')))) {
      return res.status(409).json({ success: false, error: { message: error.message } });
    }

    // If Firestore complains about missing composite index, return a helpful message
    if (error && error.message && typeof error.message === 'string' && error.message.toLowerCase().includes('index')) {
      return sendBadRequest(res, 'Favorites query requires a Firestore composite index. See backend/FIRESTORE_INDEXES_README.md and deploy the provided indexes.');
    }

    next(error);
  }
};

const removeFromFavorites = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.uid;

    const result = await favoriteService.removeFavorite(userId, bookId);

    return sendSuccess(res, 200, result, 'Book removed from favorites');
  } catch (error) {
    if (error.statusCode === 404) {
      return sendNotFound(res, error.message);
    }
    next(error);
  }
};

const getFavorites = async (req, res, next) => {
  try {
    const userId = req.user.uid;

    const favorites = await favoriteService.getUserFavorites(userId);

    return sendSuccess(res, 200, { favorites, count: favorites.length });
  } catch (error) {
    // If Firestore requires an index, return a helpful message instead of generic 500
    if (error && error.message && typeof error.message === 'string' && error.message.toLowerCase().includes('index')) {
      return sendBadRequest(res, 'Favorites query requires a Firestore composite index. See backend/FIRESTORE_INDEXES_README.md and deploy the provided indexes.');
    }
    next(error);
  }
};

const checkIsFavorite = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.uid;

    const isFavorite = await favoriteService.isFavorite(userId, bookId);

    return sendSuccess(res, 200, { isFavorite });
  } catch (error) {
    next(error);
  }
};

export { addToFavorites, removeFromFavorites, getFavorites, checkIsFavorite };
