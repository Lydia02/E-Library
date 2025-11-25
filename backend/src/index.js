import dotenv from 'dotenv';
import app from './server.js';
import { testConnection } from './config/database.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    console.log('E-Library API Server');
    console.log('Digital Book Access for African Communities');
    console.log('');

    // Test PostgreSQL connection
    console.log('Testing PostgreSQL connection...');
    const dbConnected = await testConnection();
    console.log('');

    if (!dbConnected) {
      console.error('Warning: PostgreSQL connection failed, but server will start anyway');
      console.log('');
    }

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log('Ready to serve requests!');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
