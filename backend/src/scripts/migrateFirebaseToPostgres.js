import { db } from '../config/firebase.js';
import pool from '../config/database.js';
import logger from '../utils/logger.js';

/**
 * Migrate books from Firebase Firestore to PostgreSQL
 */
const migrateBooks = async () => {
  try {
    logger.info('📦 Starting migration from Firebase to PostgreSQL...');

    // Get all books from Firebase
    const booksSnapshot = await db.collection('books').get();

    if (booksSnapshot.empty) {
      logger.info('️  No books found in Firebase to migrate');
      return { success: true, migrated: 0 };
    }

    logger.info(` Found ${booksSnapshot.size} books in Firebase`);

    let migrated = 0;
    let skipped = 0;
    let errors = 0;

    for (const doc of booksSnapshot.docs) {
      try {
        const bookData = doc.data();

        // Check if book already exists in PostgreSQL
        const existCheck = await pool.query(
          'SELECT id FROM books WHERE title_lower = $1 AND author = $2',
          [bookData.title?.toLowerCase(), bookData.author]
        );

        if (existCheck.rows.length > 0) {
          logger.info(`⏭️  Skipping "${bookData.title}" - already exists in PostgreSQL`);
          skipped++;
          continue;
        }

        // Insert book into PostgreSQL
        await pool.query(`
          INSERT INTO books (
            title, title_lower, author, isbn, description, cover_image,
            published_year, publisher, page_count, language, genres,
            rating, total_ratings, created_by, is_user_generated, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        `, [
          bookData.title || 'Untitled',
          bookData.title?.toLowerCase() || 'untitled',
          bookData.author || 'Unknown Author',
          bookData.isbn || null,
          bookData.description || null,
          bookData.coverImage || null,
          bookData.publishedYear || null,
          bookData.publisher || null,
          bookData.pageCount || null,
          bookData.language || 'en',
          bookData.genres || [],
          bookData.rating || 0,
          bookData.totalRatings || 0,
          bookData.createdBy || null,
          bookData.isUserGenerated || false,
          bookData.createdAt?.toDate() || new Date(),
          bookData.updatedAt?.toDate() || new Date()
        ]);

        logger.info(` Migrated: "${bookData.title}" by ${bookData.author}`);
        migrated++;
      } catch (error) {
        logger.error(` Error migrating book ${doc.id}:`, error.message);
        errors++;
      }
    }

    logger.info(`\n📊 Migration Summary:`);
    logger.info(`    Migrated: ${migrated} books`);
    logger.info(`   ⏭️  Skipped: ${skipped} books (already exist)`);
    logger.info(`    Errors: ${errors} books`);
    logger.info(`   📈 Total processed: ${booksSnapshot.size} books\n`);

    return { success: true, migrated, skipped, errors, total: booksSnapshot.size };
  } catch (error) {
    logger.error(' Migration failed:', error);
    throw error;
  }
};

/**
 * Run migration if executed directly
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateBooks()
    .then((result) => {
      logger.info('🎉 Migration completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

export default migrateBooks;
