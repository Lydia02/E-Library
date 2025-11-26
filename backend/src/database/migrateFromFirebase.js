import pool from '../config/database.js';
import { db } from '../config/firebase.js';
import logger from '../utils/logger.js';

const migrateBooks = async () => {
  try {
    logger.info(' Starting books migration...');
    const booksSnapshot = await db.collection('books').get();
    let count = 0;
    let skipped = 0;

    for (const doc of booksSnapshot.docs) {
      try {
        const data = doc.data();

        const genres = data.genres || (data.category ? [data.category] : []);

        const query = `
          INSERT INTO books (
            title, title_lower, author, isbn, description, cover_image,
            published_year, publisher, page_count, language, genres, rating, total_ratings,
            is_user_generated, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
          ON CONFLICT (isbn) DO UPDATE SET
            title = EXCLUDED.title,
            title_lower = EXCLUDED.title_lower,
            author = EXCLUDED.author,
            description = EXCLUDED.description,
            cover_image = EXCLUDED.cover_image,
            updated_at = CURRENT_TIMESTAMP
          RETURNING id
        `;

        const values = [
          data.title || 'Untitled',
          (data.title || 'Untitled').toLowerCase(),
          data.author || 'Unknown',
          data.isbn || `firebase-${doc.id}`,
          data.description || null,
          data.coverImage || null,
          data.publishedYear || data.published_year || null,
          data.publisher || null,
          data.pageCount || data.page_count || null,
          data.language || 'en',
          genres,
          parseFloat(data.rating || 0),
          parseInt(data.totalRatings || data.total_ratings || 0),
          data.isUserGenerated || data.is_user_generated || false,
          data.createdAt?._seconds ? new Date(data.createdAt._seconds * 1000) : new Date(),
          data.updatedAt?._seconds ? new Date(data.updatedAt._seconds * 1000) : new Date()
        ];

        const result = await pool.query(query, values);
        logger.info(`  ✓ Migrated: ${data.title} (ID: ${result.rows[0].id})`);
        count++;
      } catch (error) {
        logger.warn(`   Skipped book ${doc.id}:`, error.message);
        skipped++;
      }
    }

    logger.info(` Migrated ${count} books (${skipped} skipped)`);
    return count;
  } catch (error) {
    logger.error(' Books migration failed:', error);
    throw error;
  }
};

const migrateFavorites = async () => {
  try {
    logger.info('⭐ Starting favorites migration...');
    const favoritesSnapshot = await db.collection('favorites').get();
    let count = 0;

    for (const doc of favoritesSnapshot.docs) {
      const data = doc.data();

      const query = `
        INSERT INTO favorites (user_id, book_id, created_at)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, book_id) DO NOTHING
      `;

      const values = [
        parseInt(data.userId || data.user_id),
        parseInt(data.bookId || data.book_id),
        data.createdAt?._seconds ? new Date(data.createdAt._seconds * 1000) : new Date()
      ];

      await pool.query(query, values);
      count++;
    }

    logger.info(` Migrated ${count} favorites`);
    return count;
  } catch (error) {
    logger.error(' Favorites migration failed:', error);
    throw error;
  }
};

const migrateUserBooks = async () => {
  try {
    logger.info(' Starting user_books migration...');
    const userBooksSnapshot = await db.collection('user_books').get();
    let count = 0;

    for (const doc of userBooksSnapshot.docs) {
      const data = doc.data();

      const query = `
        INSERT INTO user_books (user_id, book_id, status, progress, started_at, completed_at, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (user_id, book_id) DO UPDATE SET
          status = EXCLUDED.status,
          progress = EXCLUDED.progress,
          started_at = EXCLUDED.started_at,
          completed_at = EXCLUDED.completed_at,
          updated_at = CURRENT_TIMESTAMP
      `;

      const values = [
        parseInt(data.userId || data.user_id),
        parseInt(data.bookId || data.book_id),
        data.status || 'to-read',
        parseInt(data.progress || 0),
        data.startedAt?._seconds ? new Date(data.startedAt._seconds * 1000) : null,
        data.completedAt?._seconds ? new Date(data.completedAt._seconds * 1000) : null,
        data.createdAt?._seconds ? new Date(data.createdAt._seconds * 1000) : new Date(),
        data.updatedAt?._seconds ? new Date(data.updatedAt._seconds * 1000) : new Date()
      ];

      await pool.query(query, values);
      count++;
    }

    logger.info(` Migrated ${count} user_books`);
    return count;
  } catch (error) {
    logger.error(' UserBooks migration failed:', error);
    throw error;
  }
};

const runFullMigration = async () => {
  logger.info(' Starting full Firebase → PostgreSQL migration...');
  logger.info('================================================');

  const results = {
    books: 0,
    favorites: 0,
    userBooks: 0
  };

  try {
    results.books = await migrateBooks();
    results.favorites = await migrateFavorites();
    results.userBooks = await migrateUserBooks();

    logger.info('================================================');
    logger.info(' Migration completed successfully!');
    logger.info(`   Books: ${results.books}`);
    logger.info(`   Favorites: ${results.favorites}`);
    logger.info(`   User Books: ${results.userBooks}`);
    logger.info('================================================');

    return results;
  } catch (error) {
    logger.error('================================================');
    logger.error(' Migration failed!');
    logger.error(error);
    logger.error('================================================');
    throw error;
  }
};

if (import.meta.url === `file://${process.argv[1]}`) {
  runFullMigration()
    .then(() => {
      logger.info('Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Migration script failed:', error);
      process.exit(1);
    });
}

export { migrateBooks, migrateFavorites, migrateUserBooks, runFullMigration };
