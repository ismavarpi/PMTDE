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
  await pool.query(
    `CREATE TABLE IF NOT EXISTS usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL DEFAULT 'n/a',
      apellidos VARCHAR(255) NOT NULL DEFAULT 'n/a',
      email VARCHAR(255) NOT NULL DEFAULT 'n/a'
    )`
  );

  const [oldUsers] = await pool.query(
    'SELECT id, data FROM entities WHERE entity="usuarios"'
  );
  for (const row of oldUsers) {
    const data = row.data || {};
    const nombre = data.nombre || 'n/a';
    const apellidos = data.apellidos || 'n/a';
    const email = data.email || 'n/a';
    await pool.query(
      'INSERT INTO usuarios (id, nombre, apellidos, email) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE nombre=VALUES(nombre), apellidos=VALUES(apellidos), email=VALUES(email)',
      [row.id, nombre, apellidos, email]
    );
    await pool.query('DELETE FROM entities WHERE id=?', [row.id]);
  }
}

function getDb() {
  if (!pool) throw new Error('DB not initialized');
  return pool;
}

module.exports = { initDb, getDb };
