import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes (no authentication required)
router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Protected routes (require authentication)
router.post('/profile', authenticate, authController.createUserProfile);
router.get('/me', authenticate, authController.getCurrentUser);
router.get('/stats', authenticate, authController.getUserStats);
router.put('/profile', authenticate, authController.updateProfile);
router.delete('/account', authenticate, authController.deleteUser);

// Enhanced profile routes
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile/update', authenticate, authController.updateUserProfile);
router.put('/profile/reading-goal', authenticate, authController.updateReadingGoal);
router.put('/profile/preferences', authenticate, authController.updatePreferences);
router.get('/profile/stats', authenticate, authController.getDetailedStats);

router.delete('/profile/delete', authenticate, authController.deleteUserAccount);

export default router;
