import express from 'express';
import * as userBookController from '../controllers/userBookController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All user book routes require authentication
router.use(authenticate);

// User book CRUD operations
router.post('/', userBookController.addUserBook);
router.get('/', userBookController.getUserBooks);
router.get('/stats', userBookController.getUserBookStats);
router.get('/:id', userBookController.getUserBook);
router.put('/:id', userBookController.updateUserBook);
router.delete('/:id', userBookController.deleteUserBook);

export default router;
