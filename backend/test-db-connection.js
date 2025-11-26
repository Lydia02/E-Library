import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// PostgreSQL Connection Diagnostics (informational console output suppressed)

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 10000,
});

// Attempting connection (logs suppressed)

client.connect()
  .then(async () => {
  // Successfully connected (logs suppressed)

    // Test query
    const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
  // Database info obtained (logs suppressed)

    // Check database size
    const dbSize = await client.query(`
      SELECT pg_size_pretty(pg_database_size($1)) as size
    `, [process.env.DB_NAME]);
  // Database size obtained (logs suppressed)

    // List tables
    const tables = await client.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename
    `);

    // Tables in database (output suppressed)

    await client.end();
  // Connection test completed
  process.exit(0);
  })
  .catch(err => {
    console.error('❌ Connection failed!\n');
    console.error('Error Details:');
    console.error('  Message:', err.message);
    console.error('  Code:', err.code);

    if (err.code === 'ETIMEDOUT' || err.message.includes('timeout')) {
      console.error('\n💡 Troubleshooting:');
      console.error('  This is a timeout error. Possible causes:');
      console.error('  1. 🔥 Firewall: Your IP is not allowed in Azure PostgreSQL');
      console.error('  2. 🌐 Network: Check your internet connection');
      console.error('  3. 🏷️  Wrong host: Verify the server hostname');
      console.error('\n  ⚡ Quick Fix:');
      console.error('     → Go to Azure Portal');
      console.error('     → Navigate to your PostgreSQL server');
      console.error('     → Go to "Networking" or "Connection security"');
      console.error('     → Add your current IP address');
      console.error('     → Save changes and retry');
    } else if (err.code === 'ENOTFOUND') {
      console.error('\n💡 The hostname could not be found.');
      console.error('   Check DB_HOST in your .env file');
    } else if (err.message.includes('password authentication failed')) {
      console.error('\n💡 Wrong username or password.');
      console.error('   Check DB_USER and DB_PASSWORD in your .env file');
    }

    console.error('');
    process.exit(1);
  });
