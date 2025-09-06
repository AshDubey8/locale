const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'locale_db',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

let dbConnected = false;

async function createTables() {
  try {
    const client = await pool.connect();
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id SERIAL PRIMARY KEY,
        event_id VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        date VARCHAR(100),
        location VARCHAR(255),
        city VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    client.release();
    dbConnected = true;
    console.log('✅ Database connected and tables created');
  } catch (error) {
    console.log('⚠️  Database not available, using memory storage');
    console.log('To use PostgreSQL: Install PostgreSQL and update .env file');
  }
}

createTables();

module.exports = { pool, dbConnected };
