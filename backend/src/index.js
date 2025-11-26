import dotenv from 'dotenv';
import app from './server.js';
import { testConnection } from './config/database.js';
import logger from './utils/logger.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    logger.info('E-Library API Server');
    logger.info('Digital Book Access for African Communities');

    // Test PostgreSQL connection
    logger.info('Testing PostgreSQL connection...');
    const dbConnected = await testConnection();

    if (!dbConnected) {
      logger.warn('Warning: PostgreSQL connection failed, but server will start anyway');
    }

    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
      logger.success('Ready to serve requests!');
    });
  } catch (error) {
    logger.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
