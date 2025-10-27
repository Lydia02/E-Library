import express from 'express';
import * as favoriteController from '../controllers/favoriteController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.post('/:bookId', authenticate, favoriteController.addToFavorites);
router.delete('/:bookId', authenticate, favoriteController.removeFromFavorites);
router.get('/', authenticate, favoriteController.getFavorites);
router.get('/check/:bookId', authenticate, favoriteController.checkIsFavorite);

export default router;
