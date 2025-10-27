import dotenv from 'dotenv';
import app from './server.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 E-Library API Server`);
      console.log(`📚 Server running on http://localhost:${PORT}`);
      console.log(`🌍 Digital Book Access for African Communities`);
      console.log(`🔥 Firebase Project: ${process.env.FIREBASE_PROJECT_ID || 'Not configured'}`);
      console.log(`✅ Status: Ready`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
