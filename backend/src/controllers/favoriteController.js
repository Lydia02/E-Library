import * as favoriteService from '../services/favoriteService.js';
import { sendSuccess, sendCreated, sendNotFound } from '../utils/response.js';

const addToFavorites = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.uid;

    const favorite = await favoriteService.addFavorite(userId, bookId);

    return sendCreated(res, { favorite }, 'Book added to favorites');
  } catch (error) {
    if (error.statusCode === 409) {
      return res.status(409).json({
        success: false,
        error: { message: error.message },
      });
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
