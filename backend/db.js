const mysql = require('mysql2/promise');

let pool;

async function connectWithRetry(retries = 10, delay = 2000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      pool = mysql.createPool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });
      await pool.query('SELECT 1');
      return;
    } catch (err) {
      if (attempt === retries) throw err;
      console.log(`Esperando BD (${attempt}/${retries})...`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

async function initDb() {
  await connectWithRetry();

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

  const [defaultUser] = await pool.query('SELECT id FROM usuarios WHERE id=1');
  if (defaultUser.length === 0) {
    await pool.query(
      "INSERT INTO usuarios (id, nombre, apellidos, email) VALUES (1, 'n/a', 'n/a', 'n/a')"
    );
  }

  await pool.query(
    `CREATE TABLE IF NOT EXISTS pmtde (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL DEFAULT 'n/a',
      descripcion TEXT NOT NULL DEFAULT 'n/a',
      propietario_id INT NOT NULL DEFAULT 1,
      FOREIGN KEY (propietario_id) REFERENCES usuarios(id)
    )`
  );

  const [defaultPmtde] = await pool.query('SELECT id FROM pmtde WHERE id=1');
  if (defaultPmtde.length === 0) {
    await pool.query(
      "INSERT INTO pmtde (id, nombre, descripcion, propietario_id) VALUES (1, 'n/a', 'n/a', 1)"
    );
  }

  await pool.query(
    `CREATE TABLE IF NOT EXISTS programas_guardarrail (
      id INT AUTO_INCREMENT PRIMARY KEY,
      codigo VARCHAR(8) NOT NULL DEFAULT 'n/a',
      pmtde_id INT NOT NULL DEFAULT 1,
      nombre VARCHAR(255) NOT NULL DEFAULT 'n/a',
      descripcion TEXT NOT NULL DEFAULT 'n/a',
      responsable_id INT NOT NULL DEFAULT 1,
      FOREIGN KEY (pmtde_id) REFERENCES pmtde(id) ON DELETE CASCADE,
      FOREIGN KEY (responsable_id) REFERENCES usuarios(id)
    )`
  );

  await pool.query(
    "ALTER TABLE programas_guardarrail ADD COLUMN IF NOT EXISTS codigo VARCHAR(8) NOT NULL DEFAULT 'n/a'"
  );
  await pool.query(
    "UPDATE programas_guardarrail SET codigo='n/a' WHERE codigo IS NULL OR codigo=''"
  );

  await pool.query(
    `CREATE TABLE IF NOT EXISTS programa_guardarrail_expertos (
      programa_id INT NOT NULL,
      usuario_id INT NOT NULL,
      PRIMARY KEY (programa_id, usuario_id),
      FOREIGN KEY (programa_id) REFERENCES programas_guardarrail(id) ON DELETE CASCADE,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    )`
  );

  await pool.query(
    `CREATE TABLE IF NOT EXISTS planes_estrategicos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      codigo VARCHAR(8) NOT NULL DEFAULT 'n/a',
      pmtde_id INT NOT NULL DEFAULT 1,
      nombre VARCHAR(255) NOT NULL DEFAULT 'n/a',
      descripcion TEXT NOT NULL DEFAULT 'n/a',
      responsable_id INT NOT NULL DEFAULT 1,
      FOREIGN KEY (pmtde_id) REFERENCES pmtde(id) ON DELETE CASCADE,
      FOREIGN KEY (responsable_id) REFERENCES usuarios(id)
    )`
  );

  await pool.query(
    `ALTER TABLE planes_estrategicos
      ADD COLUMN IF NOT EXISTS codigo VARCHAR(8) NOT NULL DEFAULT 'n/a'`
  );
  await pool.query(
    "UPDATE planes_estrategicos SET codigo='n/a' WHERE codigo IS NULL OR codigo=''"
  );

  await pool.query(
    `CREATE TABLE IF NOT EXISTS plan_estrategico_expertos (
      plan_id INT NOT NULL,
      usuario_id INT NOT NULL,
      PRIMARY KEY (plan_id, usuario_id),
      FOREIGN KEY (plan_id) REFERENCES planes_estrategicos(id) ON DELETE CASCADE,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    )`
  );

  await pool.query(
    `CREATE TABLE IF NOT EXISTS preferencias_usuario (
      usuario VARCHAR(255) NOT NULL DEFAULT 'anonimo',
      tabla VARCHAR(255) NOT NULL DEFAULT 'n/a',
      columnas TEXT NOT NULL DEFAULT '[]',
      PRIMARY KEY (usuario, tabla)
    )`
  );
}

function getDb() {
  if (!pool) throw new Error('DB not initialized');
  return pool;
}

module.exports = { initDb, getDb };
