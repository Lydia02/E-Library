import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import errorHandler from './middleware/errorHandler.js';

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to E-Library API',
    description: 'Digital Book Access for African Communities',
    version: '1.0.0',
    status: 'operational',
    endpoints: {
      books: '/api/books',
      auth: '/api/auth',
      favorites: '/api/favorites',
      userBooks: '/api/user-books',
      admin: '/api/admin',
    },
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Routes will be added in subsequent branches
// app.use('/api/books', bookRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/favorites', favoriteRoutes);
// app.use('/api/user-books', userBookRoutes);
// app.use('/api/admin', adminRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
