import pool from '../config/database.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runMigration() {
  logger.info('🔄 Starting database migration...');

  try {
    // Read the schema file
    const schemaPath = join(__dirname, 'schema.sql');
    const schemaSql = readFileSync(schemaPath, 'utf8');

  logger.info('📄 Running schema.sql...');

    // Execute the schema
    await pool.query(schemaSql);

  logger.info('✅ Schema created successfully!');

    // Verify tables were created
    const result = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    logger.info('📋 Tables created:');
    result.rows.forEach(row => {
      logger.info(`   ✓ ${row.table_name}`);
    });

    logger.info('✨ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

runMigration();
