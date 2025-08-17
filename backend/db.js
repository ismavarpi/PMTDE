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
    `CREATE TABLE IF NOT EXISTS parametros (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL UNIQUE,
      valor VARCHAR(255) NOT NULL DEFAULT 'n/a',
      valor_defecto VARCHAR(255) NOT NULL DEFAULT 'n/a'
    )`
  );

  const [appName] = await pool.query(
    'SELECT id FROM parametros WHERE nombre="Nombre de la aplicación"'
  );
  if (appName.length === 0) {
    await pool.query(
      'INSERT INTO parametros (nombre, valor, valor_defecto) VALUES ("Nombre de la aplicación", "Aplicación", "Aplicación")'
    );
  }

  await pool.query(
    `CREATE TABLE IF NOT EXISTS usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL DEFAULT 'n/a',
      apellidos VARCHAR(255) NOT NULL DEFAULT 'n/a',
      email VARCHAR(255) NOT NULL DEFAULT 'n/a'
    )`
  );

  await pool.query(
    `CREATE TABLE IF NOT EXISTS pmtde (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL DEFAULT 'n/a',
      descripcion TEXT NOT NULL DEFAULT 'n/a',
      propietario_id INT NOT NULL DEFAULT 1,
      FOREIGN KEY (propietario_id) REFERENCES usuarios(id)
    )`
  );

  await pool.query(
    `CREATE TABLE IF NOT EXISTS programas_guardarrail (
      id INT AUTO_INCREMENT PRIMARY KEY,
      pmtde_id INT NOT NULL DEFAULT 1,
      nombre VARCHAR(255) NOT NULL DEFAULT 'n/a',
      descripcion TEXT NOT NULL DEFAULT 'n/a',
      responsable_id INT NOT NULL DEFAULT 1,
      FOREIGN KEY (pmtde_id) REFERENCES pmtde(id),
      FOREIGN KEY (responsable_id) REFERENCES usuarios(id)
    )`
  );

  await pool.query(
    `CREATE TABLE IF NOT EXISTS programa_guardarrail_expertos (
      programa_id INT NOT NULL,
      usuario_id INT NOT NULL,
      PRIMARY KEY (programa_id, usuario_id),
      FOREIGN KEY (programa_id) REFERENCES programas_guardarrail(id) ON DELETE CASCADE,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )`
  );

  await pool.query(
    `CREATE TABLE IF NOT EXISTS planes_estrategicos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      pmtde_id INT NOT NULL DEFAULT 1,
      nombre VARCHAR(255) NOT NULL DEFAULT 'n/a',
      descripcion TEXT NOT NULL DEFAULT 'n/a',
      responsable_id INT NOT NULL DEFAULT 1,
      FOREIGN KEY (pmtde_id) REFERENCES pmtde(id),
      FOREIGN KEY (responsable_id) REFERENCES usuarios(id)
    )`
  );

  await pool.query(
    `CREATE TABLE IF NOT EXISTS plan_estrategico_expertos (
      plan_id INT NOT NULL,
      usuario_id INT NOT NULL,
      PRIMARY KEY (plan_id, usuario_id),
      FOREIGN KEY (plan_id) REFERENCES planes_estrategicos(id) ON DELETE CASCADE,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )`
  );

  await pool.query(
    `CREATE TABLE IF NOT EXISTS preferencias_usuario (
      usuario VARCHAR(255) NOT NULL DEFAULT 'anonimo',
      tabla VARCHAR(255) NOT NULL DEFAULT 'n/a',
      columnas JSON NOT NULL DEFAULT '[]',
      PRIMARY KEY (usuario, tabla)
    )`
  );
}

function getDb() {
  if (!pool) throw new Error('DB not initialized');
  return pool;
}

module.exports = { initDb, getDb };
