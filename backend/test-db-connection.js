import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 PostgreSQL Connection Diagnostics');
console.log('=====================================\n');

console.log('📋 Configuration:');
console.log('  Host:', process.env.DB_HOST);
console.log('  Port:', process.env.DB_PORT || 5432);
console.log('  Database:', process.env.DB_NAME);
console.log('  User:', process.env.DB_USER);
console.log('  Password:', process.env.DB_PASSWORD ? '****' + process.env.DB_PASSWORD.slice(-4) : 'NOT SET');
console.log('');

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

console.log('🔌 Attempting connection...');
console.log('⏱️  Timeout set to 10 seconds\n');

client.connect()
  .then(async () => {
    console.log('✅ Successfully connected to PostgreSQL!');
    console.log('');

    // Test query
    const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
    console.log('📊 Database Info:');
    console.log('  Current Time:', result.rows[0].current_time);
    console.log('  PostgreSQL Version:', result.rows[0].pg_version.split('\n')[0]);
    console.log('');

    // Check database size
    const dbSize = await client.query(`
      SELECT pg_size_pretty(pg_database_size($1)) as size
    `, [process.env.DB_NAME]);
    console.log('  Database Size:', dbSize.rows[0].size);
    console.log('');

    // List tables
    const tables = await client.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename
    `);

    console.log('📋 Tables in database:');
    if (tables.rows.length === 0) {
      console.log('  (No tables found - database is empty)');
    } else {
      tables.rows.forEach(row => {
        console.log('  -', row.tablename);
      });
    }
    console.log('');

    await client.end();
    console.log('✨ Connection test completed successfully!');
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
