import { db } from '../config/firebase.js';

const favoritesCollection = db.collection('favorites');
const booksCollection = db.collection('books');

const addFavorite = async (userId, bookId) => {
  try {
    const bookDoc = await booksCollection.doc(bookId).get();
    if (!bookDoc.exists) {
      const error = new Error('Book not found');
      error.statusCode = 404;
      throw error;
    }

    const favoriteRef = favoritesCollection.doc(`${userId}_${bookId}`);
    const existingFavorite = await favoriteRef.get();

    if (existingFavorite.exists) {
      const error = new Error('Book already in favorites');
      error.statusCode = 409;
      throw error;
    }

    await favoriteRef.set({
      userId,
      bookId,
      addedAt: new Date().toISOString(),
    });

    return {
      id: favoriteRef.id,
      userId,
      bookId,
      addedAt: new Date().toISOString(),
    };
  } catch (error) {
    throw error;
  }
};

const removeFavorite = async (userId, bookId) => {
  try {
    const favoriteRef = favoritesCollection.doc(`${userId}_${bookId}`);
    const favorite = await favoriteRef.get();

    if (!favorite.exists) {
      const error = new Error('Favorite not found');
      error.statusCode = 404;
      throw error;
    }

    await favoriteRef.delete();
    return { id: `${userId}_${bookId}`, deleted: true };
  } catch (error) {
    throw error;
  }
};

const getUserFavorites = async (userId) => {
  try {
    const snapshot = await favoritesCollection
      .where('userId', '==', userId)
      .get();

    if (snapshot.empty) {
      return [];
    }

    const favorites = [];
    const bookPromises = [];

    snapshot.forEach((doc) => {
      const favoriteData = doc.data();
      bookPromises.push(
        booksCollection.doc(favoriteData.bookId).get().then((bookDoc) => {
          if (bookDoc.exists) {
            favorites.push({
              favoriteId: doc.id,
              addedAt: favoriteData.addedAt,
              book: {
                id: bookDoc.id,
                ...bookDoc.data(),
              },
            });
          }
        })
      );
    });

    await Promise.all(bookPromises);

    return favorites;
  } catch (error) {
    throw error;
  }
};

const isFavorite = async (userId, bookId) => {
  try {
    const favoriteRef = favoritesCollection.doc(`${userId}_${bookId}`);
    const favorite = await favoriteRef.get();
    return favorite.exists;
  } catch (error) {
    throw error;
  }
};

export { addFavorite, removeFavorite, getUserFavorites, isFavorite };
