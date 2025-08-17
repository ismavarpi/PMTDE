const mysql = require('mysql2/promise');

let pool;

async function initDb() {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  await pool.query(
    'CREATE TABLE IF NOT EXISTS entities (id INT AUTO_INCREMENT PRIMARY KEY, entity VARCHAR(255) NOT NULL, data JSON NOT NULL)'
  );
}

function getDb() {
  if (!pool) throw new Error('DB not initialized');
  return pool;
}

module.exports = { initDb, getDb };
