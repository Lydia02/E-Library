import { auth } from '../config/firebase.js';
import { sendUnauthorized } from '../utils/response.js';

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendUnauthorized(res, 'No token provided. Please include Bearer token in Authorization header.');
    }

    const token = authHeader.split('Bearer ')[1];

    // Validate token format
    if (!token || token.trim() === '') {
      return sendUnauthorized(res, 'Invalid token format. Token cannot be empty.');
    }

    // For development: Handle mock tokens
    if (token.startsWith('mock-jwt-token-')) {
      const mockUid = token.replace('mock-jwt-token-', '') || 'mock-user-123';
      req.user = {
        uid: mockUid,
        email: 'user@example.com',
        emailVerified: true,
      };
      return next();
    }

    // For development: Handle jwt-token-user- format tokens
    if (token.startsWith('jwt-token-user-')) {
      const encodedData = token.replace('jwt-token-user-', '');
      try {
        // Decode the base64 encoded email
        const decodedEmail = atob(encodedData);
        req.user = {
          uid: encodedData, // Use the encoded data as UID
          email: decodedEmail,
          emailVerified: true,
        };
        return next();
      } catch (error) {
        console.error('Error decoding jwt-token-user token:', error);
        return sendUnauthorized(res, 'Invalid token format.');
      }
    }

    // Validate JWT format (should have dots)
    if (!token.includes('.') || token.split('.').length !== 3) {
      return sendUnauthorized(res, 'Invalid JWT token format. Please login again.');
    }

    // Production: Verify Firebase tokens
    try {
      const decodedToken = await auth.verifyIdToken(token);
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified,
      };
      next();
    } catch (firebaseError) {
      console.error('Firebase auth error:', firebaseError.message);

      // Provide specific error messages based on Firebase error codes
      if (firebaseError.code === 'auth/argument-error') {
        return sendUnauthorized(res, 'Invalid token format. Please login again.');
      } else if (firebaseError.code === 'auth/id-token-expired') {
        return sendUnauthorized(res, 'Token has expired. Please login again.');
      } else if (firebaseError.code === 'auth/id-token-revoked') {
        return sendUnauthorized(res, 'Token has been revoked. Please login again.');
      } else {
        return sendUnauthorized(res, 'Authentication failed. Please login again.');
      }
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return sendUnauthorized(res, 'Authentication failed.');
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1];

      // Handle mock tokens in development
      if (token && token.startsWith('mock-jwt-token-')) {
        const mockUid = token.replace('mock-jwt-token-', '') || 'mock-user-123';
        req.user = {
          uid: mockUid,
          email: 'user@example.com',
          emailVerified: true,
        };
        return next();
      }

      // Handle jwt-token-user- format tokens
      if (token && token.startsWith('jwt-token-user-')) {
        const encodedData = token.replace('jwt-token-user-', '');
        try {
          // Decode the base64 encoded email
          const decodedEmail = atob(encodedData);
          req.user = {
            uid: encodedData, // Use the encoded data as UID
            email: decodedEmail,
            emailVerified: true,
          };
          return next();
        } catch (error) {
          console.warn('Optional auth failed decoding jwt-token-user, continuing without user:', error);
          // Continue without setting user for optional auth
        }
      }

      // Only try to decode if token looks like a valid JWT (has dots)
      if (token && token.includes('.')) {
        try {
          const decodedToken = await auth.verifyIdToken(token);
          req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            emailVerified: decodedToken.email_verified,
          };
        } catch (firebaseError) {
          console.warn('Optional auth failed, continuing without user:', firebaseError.message);
          // Continue without setting user for optional auth
        }
      }
    }

    next();
  } catch (error) {
    console.warn('Optional auth error, continuing without user:', error.message);
    next();
  }
};

export { authenticate, optionalAuth };
