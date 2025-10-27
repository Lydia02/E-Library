import { db } from '../config/firebase.js';

const reviewsCollection = db.collection('reviews');
const booksCollection = db.collection('books');

const createReview = async (bookId, userId, reviewData) => {
  try {
    const bookDoc = await booksCollection.doc(bookId).get();
    if (!bookDoc.exists) {
      const error = new Error('Book not found');
      error.statusCode = 404;
      throw error;
    }

    const existingReview = await reviewsCollection
      .where('bookId', '==', bookId)
      .where('userId', '==', userId)
      .limit(1)
      .get();

    if (!existingReview.empty) {
      const error = new Error('You have already reviewed this book');
      error.statusCode = 409;
      throw error;
    }

    const newReview = {
      bookId,
      userId,
      rating: reviewData.rating,
      comment: reviewData.comment || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await reviewsCollection.add(newReview);

    await updateBookRating(bookId);

    return {
      id: docRef.id,
      ...newReview,
    };
  } catch (error) {
    throw error;
  }
};

const getBookReviews = async (bookId) => {
  try {
    const snapshot = await reviewsCollection
      .where('bookId', '==', bookId)
      .orderBy('createdAt', 'desc')
      .get();

    if (snapshot.empty) {
      return [];
    }

    const reviews = [];
    snapshot.forEach((doc) => {
      reviews.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return reviews;
  } catch (error) {
    throw error;
  }
};

const updateReview = async (reviewId, userId, updateData) => {
  try {
    const reviewRef = reviewsCollection.doc(reviewId);
    const review = await reviewRef.get();

    if (!review.exists) {
      const error = new Error('Review not found');
      error.statusCode = 404;
      throw error;
    }

    if (review.data().userId !== userId) {
      const error = new Error('You can only update your own reviews');
      error.statusCode = 403;
      throw error;
    }

    const updates = {
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    await reviewRef.update(updates);

    if (updateData.rating) {
      await updateBookRating(review.data().bookId);
    }

    const updatedDoc = await reviewRef.get();
    return {
      id: updatedDoc.id,
      ...updatedDoc.data(),
    };
  } catch (error) {
    throw error;
  }
};

const deleteReview = async (reviewId, userId) => {
  try {
    const reviewRef = reviewsCollection.doc(reviewId);
    const review = await reviewRef.get();

    if (!review.exists) {
      const error = new Error('Review not found');
      error.statusCode = 404;
      throw error;
    }

    if (review.data().userId !== userId) {
      const error = new Error('You can only delete your own reviews');
      error.statusCode = 403;
      throw error;
    }

    const bookId = review.data().bookId;
    await reviewRef.delete();

    await updateBookRating(bookId);

    return { id: reviewId, deleted: true };
  } catch (error) {
    throw error;
  }
};

const updateBookRating = async (bookId) => {
  try {
    const snapshot = await reviewsCollection.where('bookId', '==', bookId).get();

    if (snapshot.empty) {
      await booksCollection.doc(bookId).update({
        rating: 0,
        ratingCount: 0,
      });
      return;
    }

    let totalRating = 0;
    let count = 0;

    snapshot.forEach((doc) => {
      totalRating += doc.data().rating;
      count++;
    });

    const averageRating = totalRating / count;

    await booksCollection.doc(bookId).update({
      rating: Math.round(averageRating * 10) / 10,
      ratingCount: count,
    });
  } catch (error) {
    throw error;
  }
};

export { createReview, getBookReviews, updateReview, deleteReview };
