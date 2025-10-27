# E-Library Backend API

> RESTful API for E-Library - Digital Book Access for African Communities

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project (for database)

### Installation

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables**

   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY="your-private-key"
   FIREBASE_CLIENT_EMAIL=your-client-email
   FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:5000`

4. **Start production server**
   ```bash
   npm start
   ```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Custom middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Helper functions
│   ├── scripts/         # Database scripts
│   ├── server.js        # Express app setup
│   └── index.js         # Entry point
├── package.json
├── .env (not committed)
├── .gitignore
└── README.md
```

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express 5.1.0
- **Database**: Firebase Realtime Database
- **Authentication**: Firebase Auth + bcrypt
- **Middleware**: CORS, body-parser

## 📡 API Endpoints

### Base URL
```
http://localhost:5000
```

### Available Endpoints
(Endpoints will be added as branches are completed)

- `GET /` - API information
- `GET /health` - Health check

## 🔐 Authentication

Most endpoints require authentication via Bearer token:

```
Authorization: Bearer <your-jwt-token>
```

## 🌍 African Context

This API is designed to serve African communities with:
- Low-bandwidth optimization
- Efficient data structures
- Scalable architecture
- Mobile-first approach

## 📝 Development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Environment Variables
See `.env.example` for required variables

## 🔒 Security

- Environment variables for sensitive data
- JWT authentication
- Input validation
- Error handling
- CORS configuration

## 📄 License

MIT License - see LICENSE file for details

---

**Status:** Backend migration in progress (Branch 01/12)
