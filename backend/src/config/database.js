import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
    // Azure PostgreSQL requires SSL
    sslmode: 'require'
  },
  // Connection pool settings - adjusted for better Azure compatibility
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // Increased timeout for Azure
});

// Test connection function
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('PostgreSQL Connected successfully!');
    console.log('Database:', process.env.DB_NAME);
    console.log('Host:', process.env.DB_HOST);

    // Test query to verify connection
    const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
    console.log('Server Time:', result.rows[0].current_time);
    console.log('PostgreSQL Version:', result.rows[0].pg_version.split(' ')[0] + ' ' + result.rows[0].pg_version.split(' ')[1]);

    client.release();
    return true;
  } catch (err) {
    console.error('Error connecting to PostgreSQL:');
    console.error('Message:', err.message);
    if (err.code) console.error('Code:', err.code);
    return false;
  }
};

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on PostgreSQL client:', err.message);
});

export default pool;