import { auth, db } from '../config/firebase.js';
import { sendCreated, sendSuccess, sendNotFound, sendBadRequest, sendError } from '../utils/response.js';
import ProfileService from '../services/profileService.js';
import bcrypt from 'bcrypt';

// Login function
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendBadRequest(res, 'Email and password are required');
    }

    // Check if user exists
    const existingUser = await ProfileService.findUserByEmail(email);

    if (!existingUser) {
      return sendBadRequest(res, 'Invalid email or password');
    }

    // Validate password using bcrypt
    if (!existingUser.password) {
      return sendBadRequest(res, 'Invalid email or password');
    }

    const isPasswordValid = await ProfileService.verifyPassword(password, existingUser.password);
    if (!isPasswordValid) {
      return sendBadRequest(res, 'Invalid email or password');
    }

    // User exists and password is correct
    const authenticatedUser = {
      id: existingUser.id || existingUser.uid,
      email: existingUser.email,
      name: existingUser.name || existingUser.displayName,
      token: existingUser.token || 'mock-jwt-token-' + (existingUser.id || existingUser.uid)
    };

    return sendSuccess(res, 200, {
      user: authenticatedUser,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    return sendError(res, 500, 'Login failed');
  }
};

// Signup function
const signup = async (req, res, next) => {
  try {
    const { email, password, name, fullName } = req.body;
    const userName = name || fullName;

    if (!email || !password || !userName) {
      return sendBadRequest(res, 'Email, password, and name are required');
    }

    // Basic password validation
    if (password.length < 6) {
      return sendBadRequest(res, 'Password must be at least 6 characters long');
    }

    // Check if user with this email already exists
    const existingUser = await ProfileService.findUserByEmail(email);
    if (existingUser) {
      return sendBadRequest(res, 'An account with this email already exists');
    }

    // Create consistent user ID based on email hash
    const userId = 'user-' + Buffer.from(email).toString('base64').replace(/[^a-zA-Z0-9]/g, '');
    const userToken = 'mock-jwt-token-' + userId;

    // Create user profile in database using ProfileService, INCLUDING the password
    const userProfile = await ProfileService.createUserProfile({
      uid: userId,
      email: email,
      name: userName,
      displayName: userName,
      password: password, // Store password for validation
      token: userToken
    });

    const newUser = {
      id: userId,
      email: email,
      name: userName,
      token: userToken
    };

    return sendSuccess(res, 201, {
      user: newUser,
      message: 'Account created successfully'
    });
  } catch (error) {
    console.error('Signup error:', error);
    return sendError(res, 500, 'Signup failed');
  }
};

const createUserProfile = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const { displayName, photoURL } = req.body;

    const existingUser = await db.collection('users').doc(uid).get();
    if (existingUser.exists) {
      return sendBadRequest(res, 'User profile already exists');
    }

    // Use ProfileService to create user profile with all required fields
    const userProfile = await ProfileService.createUserProfile({
      uid: uid,
      email: req.user.email,
      name: displayName || req.user.email.split('@')[0],
      displayName: displayName || req.user.email.split('@')[0],
      token: req.user.token || 'firebase-token-' + uid
    });

    // Note: userProfile is already saved to database by ProfileService.createUserProfile

    return sendCreated(res, { user: { uid, ...userProfile } }, 'User profile created successfully');
  } catch (error) {
    console.error('Create profile error:', error);
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();

    if (!userDoc.exists) {
      return sendNotFound(res, 'User not found');
    }

    return sendSuccess(res, 200, { user: { uid: req.user.uid, ...userDoc.data() } });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { uid } = req.user;

    await auth.deleteUser(uid);
    await db.collection('users').doc(uid).delete();

    return sendSuccess(res, 200, null, 'User account deleted successfully');
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const { displayName, photoURL, bio, location, favoriteGenres, readingGoal } = req.body;

    const updates = {};
    if (displayName !== undefined) updates.displayName = displayName;
    if (photoURL !== undefined) updates.photoURL = photoURL;
    if (bio !== undefined) updates.bio = bio;
    if (location !== undefined) updates.location = location;
    if (favoriteGenres !== undefined) updates.favoriteGenres = favoriteGenres;
    if (readingGoal !== undefined) updates.readingGoal = readingGoal;
    updates.updatedAt = new Date().toISOString();

    // Only update Firebase Auth for displayName and photoURL
    const authUpdates = {};
    if (displayName !== undefined) authUpdates.displayName = displayName;
    if (photoURL !== undefined) authUpdates.photoURL = photoURL;

    if (Object.keys(authUpdates).length > 0) {
      await auth.updateUser(uid, authUpdates);
    }

    await db.collection('users').doc(uid).update(updates);

    return sendSuccess(res, 200, { user: updates }, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

const getUserStats = async (req, res, next) => {
  try {
    const { uid } = req.user;

    // Get user profile
    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      return sendNotFound(res, 'User not found');
    }

    const userData = userDoc.data();

    // Get user books statistics
    const stats = {
      totalBooksRead: userData.booksRead || 0,
      currentlyReading: userData.currentlyReading || 0,
      toRead: 0,
      favoriteGenres: userData.favoriteGenres || [],
      readingGoalProgress: {
        goal: userData.readingGoal || 50,
        current: userData.booksRead || 0,
        percentage: Math.round(((userData.booksRead || 0) / (userData.readingGoal || 50)) * 100)
      },
      averageRating: 0,
      booksAddedThisMonth: 0
    };

    return sendSuccess(res, 200, { stats });
  } catch (error) {
    next(error);
  }
};

// Get complete user profile with statistics
const getProfile = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const profile = await ProfileService.getUserProfile(uid);
    return sendSuccess(res, 200, { profile });
  } catch (error) {
    console.error('Get profile error:', error);
    if (error.message === 'User not found') {
      return sendNotFound(res, 'User profile not found');
    }
    return sendError(res, 500, 'Failed to get profile');
  }
};

// Update user profile
const updateUserProfile = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const profileData = req.body;

    const updatedProfile = await ProfileService.updateUserProfile(uid, profileData);
    return sendSuccess(res, 200, {
      profile: updatedProfile,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    if (error.message.includes('must be')) {
      return sendBadRequest(res, error.message);
    }
    return sendError(res, 500, 'Failed to update profile');
  }
};

// Update reading goal
const updateReadingGoal = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const { goal } = req.body;

    if (!goal || isNaN(goal) || goal < 0 || goal > 1000) {
      return sendBadRequest(res, 'Reading goal must be a number between 0 and 1000');
    }

    await ProfileService.updateReadingGoal(uid, goal);
    return sendSuccess(res, 200, { message: 'Reading goal updated successfully' });
  } catch (error) {
    console.error('Update reading goal error:', error);
    return sendError(res, 500, 'Failed to update reading goal');
  }
};

// Update user preferences
const updatePreferences = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const { preferences } = req.body;

    await ProfileService.updatePreferences(uid, preferences);
    return sendSuccess(res, 200, { message: 'Preferences updated successfully' });
  } catch (error) {
    console.error('Update preferences error:', error);
    return sendError(res, 500, 'Failed to update preferences');
  }
};

// Get detailed user statistics
const getDetailedStats = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const stats = await ProfileService.calculateUserStats(uid);
    return sendSuccess(res, 200, { stats });
  } catch (error) {
    console.error('Get detailed stats error:', error);
    return sendError(res, 500, 'Failed to get user statistics');
  }
};

// Delete user account
const deleteUserAccount = async (req, res, next) => {
  try {
    const { uid } = req.user;
    const { confirmPassword } = req.body;

    if (!confirmPassword) {
      return sendBadRequest(res, 'Password confirmation required');
    }

    // In a real app, you would verify the password here
    await ProfileService.deleteUserProfile(uid);

    return sendSuccess(res, 200, { message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    return sendError(res, 500, 'Failed to delete account');
  }
};

// Forgot password endpoint
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return sendBadRequest(res, 'Email is required');
    }

    // Check if user exists
    const user = await ProfileService.findUserByEmail(email);
    if (!user) {
      return sendBadRequest(res, 'No account found with this email address');
    }

    // Generate reset token (for mock purposes, we'll use a simple token)
    const resetToken = 'reset-token-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    const resetExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    // Store reset token in user profile
    await db.collection('users').doc(user.uid).update({
      resetPasswordToken: resetToken,
      resetPasswordExpiry: resetExpiry,
      updatedAt: new Date()
    });


    // For development, we'll just return the token
    console.log(`Password reset token for ${email}: ${resetToken}`);

    return sendSuccess(res, 200, {
      message: 'Password reset instructions have been sent to your email',
      // In development only - remove in production
      resetToken: resetToken
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return sendError(res, 500, 'Failed to process password reset request');
  }
};

// Reset password endpoint
const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return sendBadRequest(res, 'Token and new password are required');
    }

    if (newPassword.length < 6) {
      return sendBadRequest(res, 'Password must be at least 6 characters long');
    }

    // Find user with this reset token
    const usersSnapshot = await db.collection('users')
      .where('resetPasswordToken', '==', token)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      return sendBadRequest(res, 'Invalid or expired reset token');
    }

    const userDoc = usersSnapshot.docs[0];
    const userData = userDoc.data();

    // Check if token is expired
    if (userData.resetPasswordExpiry && new Date() > userData.resetPasswordExpiry.toDate()) {
      return sendBadRequest(res, 'Reset token has expired');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    await db.collection('users').doc(userDoc.id).update({
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpiry: null,
      updatedAt: new Date()
    });

    return sendSuccess(res, 200, {
      message: 'Password has been reset successfully. You can now login with your new password.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return sendError(res, 500, 'Failed to reset password');
  }
};

export {
  login,
  signup,
  createUserProfile,
  getCurrentUser,
  deleteUser,
  updateProfile,
  getUserStats,
  getProfile,
  updateUserProfile,
  updateReadingGoal,
  forgotPassword,
  resetPassword,
  updatePreferences,
  getDetailedStats,
  deleteUserAccount
};
