import pool from '../config/database.js';

const addUserBook = async (userId, bookId, status = 'to-read', progress = 0) => {
  try {
    // Check if user book already exists
    const existingSnapshot = await db.collection('user_books')
      .where('userId', '==', userId)
      .where('bookId', '==', bookId)
      .get();

    const now = new Date();
    const userBookData = {
      userId,
      bookId,
      status,
      progress,
      startedAt: status === 'reading' ? now : null,
      completedAt: status === 'completed' ? now : null,
      updatedAt: now
    };

    if (!existingSnapshot.empty) {
      // Update existing user book
      const docRef = existingSnapshot.docs[0].ref;
      await docRef.update(userBookData);

      const updatedDoc = await docRef.get();
      const data = updatedDoc.data();

      return {
        id: updatedDoc.id,
        userId: data.userId,
        bookId: data.bookId,
        status: data.status,
        progress: data.progress,
        startedAt: data.startedAt?.toDate ? data.startedAt.toDate() : data.startedAt,
        completedAt: data.completedAt?.toDate ? data.completedAt.toDate() : data.completedAt,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt
      };
    } else {
      // Add new user book
      userBookData.createdAt = now;
      const docRef = await db.collection('user_books').add(userBookData);

      return {
        id: docRef.id,
        userId,
        bookId,
        status,
        progress,
        startedAt: userBookData.startedAt,
        completedAt: userBookData.completedAt,
        createdAt: userBookData.createdAt,
        updatedAt: userBookData.updatedAt
      };
    }
  } catch (error) {
    console.error('Error adding user book:', error);
    throw error;
  }
};

const updateUserBook = async (userId, bookId, updates) => {
  try {
    const snapshot = await db.collection('user_books')
      .where('userId', '==', userId)
      .where('bookId', '==', bookId)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const docRef = snapshot.docs[0].ref;
    const updateData = {
      updatedAt: new Date()
    };

    if (updates.status !== undefined) {
      updateData.status = updates.status;

      if (updates.status === 'reading' && !updates.startedAt) {
        updateData.startedAt = new Date();
      } else if (updates.status === 'completed' && !updates.completedAt) {
        updateData.completedAt = new Date();
        updateData.progress = 100;
      }
    }

    if (updates.progress !== undefined) {
      updateData.progress = updates.progress;
    }

    if (updates.startedAt !== undefined) {
      updateData.startedAt = updates.startedAt;
    }

    if (updates.completedAt !== undefined) {
      updateData.completedAt = updates.completedAt;
    }

    await docRef.update(updateData);

    const updatedDoc = await docRef.get();
    const data = updatedDoc.data();

    return {
      id: updatedDoc.id,
      userId: data.userId,
      bookId: data.bookId,
      status: data.status,
      progress: data.progress,
      startedAt: data.startedAt?.toDate ? data.startedAt.toDate() : data.startedAt,
      completedAt: data.completedAt?.toDate ? data.completedAt.toDate() : data.completedAt,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt
    };
  } catch (error) {
    console.error('Error updating user book:', error);
    throw error;
  }
};

const getUserBooks = async (userId, filters = {}) => {
  try {
    let userBooksQuery = db.collection('user_books')
      .where('userId', '==', userId);

    if (filters.status) {
      userBooksQuery = userBooksQuery.where('status', '==', filters.status);
    }

    userBooksQuery = userBooksQuery.orderBy('updatedAt', 'desc');

    const limit = parseInt(filters.limit) || 20;
    userBooksQuery = userBooksQuery.limit(limit);

    const userBooksSnapshot = await userBooksQuery.get();

    if (userBooksSnapshot.empty) {
      return [];
    }

    // Get book details for each user book
    const userBooks = await Promise.all(
      userBooksSnapshot.docs.map(async (userBookDoc) => {
        const userBookData = userBookDoc.data();
        const bookDoc = await db.collection('books').doc(userBookData.bookId).get();

        if (!bookDoc.exists) {
          return null;
        }

        const bookData = bookDoc.data();
        return {
          id: userBookDoc.id,
          bookId: bookDoc.id,
          status: userBookData.status,
          progress: userBookData.progress,
          startedAt: userBookData.startedAt?.toDate ? userBookData.startedAt.toDate() : userBookData.startedAt,
          completedAt: userBookData.completedAt?.toDate ? userBookData.completedAt.toDate() : userBookData.completedAt,
          book: {
            id: bookDoc.id,
            title: bookData.title || 'Untitled',
            author: bookData.author || 'Unknown Author',
            coverImage: bookData.coverImage || null,
            pageCount: bookData.pageCount || null,
            genres: bookData.genres || []
          },
          createdAt: userBookData.createdAt?.toDate ? userBookData.createdAt.toDate() : userBookData.createdAt,
          updatedAt: userBookData.updatedAt?.toDate ? userBookData.updatedAt.toDate() : userBookData.updatedAt
        };
      })
    );

    // Filter out null entries (books that don't exist)
    return userBooks.filter(ub => ub !== null);
  } catch (error) {
    console.error('Error getting user books:', error);
    throw error;
  }
};

const getUserBooksCount = async (userId, filters = {}) => {
  try {
    let userBooksQuery = db.collection('user_books')
      .where('userId', '==', userId);

    if (filters.status) {
      userBooksQuery = userBooksQuery.where('status', '==', filters.status);
    }

    const snapshot = await userBooksQuery.get();
    return snapshot.size;
  } catch (error) {
    console.error('Error getting user books count:', error);
    throw error;
  }
};

const removeUserBook = async (userId, bookId) => {
  try {
    const snapshot = await db.collection('user_books')
      .where('userId', '==', userId)
      .where('bookId', '==', bookId)
      .get();

    if (snapshot.empty) {
      return null;
    }

    // Delete all matching user books (should only be one)
    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    return { success: true };
  } catch (error) {
    console.error('Error removing user book:', error);
    throw error;
  }
};

export {
  addUserBook,
  updateUserBook,
  getUserBooks,
  getUserBooksCount,
  removeUserBook
};
