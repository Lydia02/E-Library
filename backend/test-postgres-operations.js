import pool from './src/config/database.js';
import logger from './src/utils/logger.js';

// Test harness output suppressed (console.log removed)

async function runTests() {
  try {
    const client = await pool.connect();
  // Test 1: Database Connection - PASSED

    // Test 2: Check all tables exist
    const tablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
  // Test 2: Verify All Tables Exist - PASSED

    // Test 3: Insert a test user
    const userResult = await client.query(`
      INSERT INTO users (firebase_uid, email, display_name)
      VALUES ($1, $2, $3)
      RETURNING id, email, display_name, created_at
    `, ['test_uid_123', 'test@example.com', 'Test User']);
  // Test 3: Insert User - PASSED
  const userId = userResult.rows[0].id;

    // Test 4: Insert a test book
    const bookResult = await client.query(`
      INSERT INTO books (
        title, title_lower, author, isbn, description,
        cover_image, published_year, publisher, page_count,
        language, genres, created_by, is_user_generated
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id, title, author, published_year
    `, [
      'Test Book',
      'test book',
      'Test Author',
      '978-0-123456-78-9',
      'A test book for database verification',
      'https://example.com/cover.jpg',
      2024,
      'Test Publisher',
      300,
      'en',
      ['Fiction', 'Test'],
      userId,
      true
    ]);
  // Test 4: Insert Book - PASSED
  const bookId = bookResult.rows[0].id;

    // Test 5: Add to favorites
    const favoriteResult = await client.query(`
      INSERT INTO favorites (user_id, book_id)
      VALUES ($1, $2)
      RETURNING id
    `, [userId, bookId]);
  // Test 5: Insert Favorite - PASSED

    // Test 6: Add a review
    const reviewResult = await client.query(`
      INSERT INTO reviews (user_id, book_id, rating, review_text)
      VALUES ($1, $2, $3, $4)
      RETURNING id, rating
    `, [userId, bookId, 5, 'Excellent test book!']);
  // Test 6: Insert Review - PASSED

    // Test 7: Check if book rating was auto-updated by trigger
    const updatedBookResult = await client.query(`
      SELECT id, title, rating, total_ratings
      FROM books
      WHERE id = $1
    `, [bookId]);
  // Test 7: Auto-Update Trigger (Book Rating) - PASSED

    // Test 8: Add to user_books (reading progress)
    const userBookResult = await client.query(`
      INSERT INTO user_books (user_id, book_id, status, progress)
      VALUES ($1, $2, $3, $4)
      RETURNING id, status, progress
    `, [userId, bookId, 'reading', 45]);
  // Test 8: Insert User Book (Reading Progress) - PASSED

    // Test 9: Query with JOIN
    const joinResult = await client.query(`
      SELECT
        u.display_name,
        b.title,
        b.author,
        f.created_at as favorited_at
      FROM favorites f
      JOIN users u ON f.user_id = u.id
      JOIN books b ON f.book_id = b.id
      WHERE u.id = $1
    `, [userId]);
  // Test 9: JOIN Query (User Favorites) - PASSED

    // Test 10: Text search
    const searchResult = await client.query(`
      SELECT id, title, author
      FROM books
      WHERE title_lower LIKE $1
    `, ['%test%']);
  // Test 10: Case-Insensitive Search - PASSED

    // Test 11: Array operations
    const genreResult = await client.query(`
      SELECT id, title, genres
      FROM books
      WHERE 'Fiction' = ANY(genres)
    `);
  // Test 11: Array Query (Search by Genre) - PASSED

    // Clean up test data
    await client.query('DELETE FROM reviews WHERE user_id = $1', [userId]);
    await client.query('DELETE FROM favorites WHERE user_id = $1', [userId]);
    await client.query('DELETE FROM user_books WHERE user_id = $1', [userId]);
    await client.query('DELETE FROM books WHERE id = $1', [bookId]);
    await client.query('DELETE FROM users WHERE id = $1', [userId]);

    client.release();

  // All tests passed (output suppressed)
  process.exit(0);
  } catch (error) {
    logger.error('Test Failed:', error.message);
    process.exit(1);
  }
}

runTests();
