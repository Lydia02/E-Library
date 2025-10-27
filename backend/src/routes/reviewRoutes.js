import express from 'express';
import * as reviewController from '../controllers/reviewController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });

router.post('/', authenticate, reviewController.createReview);
router.get('/', reviewController.getReviews);
router.put('/:reviewId', authenticate, reviewController.updateReview);
router.delete('/:reviewId', authenticate, reviewController.deleteReview);

export default router;
