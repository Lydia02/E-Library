import express from 'express';
import * as bookController from '../controllers/bookController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import reviewRoutes from './reviewRoutes.js';

const router = express.Router();

// Public routes
router.get('/', optionalAuth, bookController.getBooks);

// Protected routes (require authentication) - specific routes first
router.get('/my-books', authenticate, bookController.getUserBooks);
router.post('/', authenticate, bookController.createBook);
router.put('/:id', authenticate, bookController.updateBook);
router.delete('/:id', authenticate, bookController.deleteBook);

// Public routes with parameters (must come after specific routes)
router.get('/:id', optionalAuth, bookController.getBook);

// Admin routes for database management
router.get('/admin/stats', authenticate, bookController.getBooksStats);
router.delete('/admin/clear-all', authenticate, bookController.clearAllBooksData);

// Review routes nested under books
router.use('/:bookId/reviews', reviewRoutes);

export default router;
