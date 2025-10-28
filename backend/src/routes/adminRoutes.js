import express from 'express';
import * as adminController from '../controllers/adminController.js';

const router = express.Router();

// Admin routes
router.post('/refresh-books', adminController.refreshBooks);

export default router;
