import dotenv from 'dotenv';
import app from './server.js';
import { testConnection } from './config/database.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
  // Server start messages removed to avoid noisy console output in production
  // Test PostgreSQL connection
    const dbConnected = await testConnection();
    

    if (!dbConnected) {
      console.error('Warning: PostgreSQL connection failed, but server will start anyway');
    }

    app.listen(PORT, () => {
      // Keep only essential error logging; avoid info-level console output here
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
