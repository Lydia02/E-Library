import { db } from '../config/firebase.js';

const addFavorite = async (userId, bookId) => {
  try {
    // Check if favorite already exists
    const existingFavorite = await db.collection('favorites')
      .where('userId', '==', userId)
      .where('bookId', '==', bookId)
      .get();

    if (!existingFavorite.empty) {
      throw new Error('Favorite already exists');
    }

    // Add new favorite
    const favoriteData = {
      userId,
      bookId,
      createdAt: new Date()
    };

    const docRef = await db.collection('favorites').add(favoriteData);

    return {
      id: docRef.id,
      userId,
      bookId,
      createdAt: favoriteData.createdAt
    };
  } catch (error) {
    console.error('Error adding favorite:', error);
    throw error;
  }
};

const removeFavorite = async (userId, bookId) => {
  try {
    const snapshot = await db.collection('favorites')
      .where('userId', '==', userId)
      .where('bookId', '==', bookId)
      .get();

    if (snapshot.empty) {
      return null;
    }

    // Delete all matching favorites (should only be one)
    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    return { success: true };
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
};

const getUserFavorites = async (userId, filters = {}) => {
  try {
    const limit = parseInt(filters.limit) || 20;

    // Get favorites for user
    let favoritesQuery = db.collection('favorites')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(limit);

    const favoritesSnapshot = await favoritesQuery.get();

    if (favoritesSnapshot.empty) {
      return [];
    }

    // Get book details for each favorite
    const favorites = await Promise.all(
      favoritesSnapshot.docs.map(async (favoriteDoc) => {
        const favoriteData = favoriteDoc.data();
        const bookDoc = await db.collection('books').doc(favoriteData.bookId).get();

        if (!bookDoc.exists) {
          return null;
        }

        const bookData = bookDoc.data();
        return {
          favoriteId: favoriteDoc.id,
          favoritedAt: favoriteData.createdAt?.toDate ? favoriteData.createdAt.toDate() : favoriteData.createdAt,
          book: {
            id: bookDoc.id,
            title: bookData.title || 'Untitled',
            author: bookData.author || 'Unknown Author',
            isbn: bookData.isbn || null,
            description: bookData.description || null,
            coverImage: bookData.coverImage || null,
            publishedYear: bookData.publishedYear || null,
            publisher: bookData.publisher || null,
            pageCount: bookData.pageCount || null,
            language: bookData.language || 'en',
            genres: bookData.genres || [],
            rating: parseFloat(bookData.rating) || 0,
            totalRatings: bookData.totalRatings || 0
          }
        };
      })
    );

    // Filter out null entries (books that don't exist)
    return favorites.filter(f => f !== null);
  } catch (error) {
    console.error('Error getting user favorites:', error);
    throw error;
  }
};

const getUserFavoritesCount = async (userId) => {
  try {
    const snapshot = await db.collection('favorites')
      .where('userId', '==', userId)
      .get();

    return snapshot.size;
  } catch (error) {
    console.error('Error getting favorites count:', error);
    throw error;
  }
};

const isFavorite = async (userId, bookId) => {
  try {
    const snapshot = await db.collection('favorites')
      .where('userId', '==', userId)
      .where('bookId', '==', bookId)
      .get();

    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking favorite status:', error);
    throw error;
  }
};

export {
  addFavorite,
  removeFavorite,
  getUserFavorites,
  getUserFavoritesCount,
  isFavorite
};
