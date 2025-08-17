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
    `CREATE TABLE IF NOT EXISTS programas_guardarrail (
      id INT AUTO_INCREMENT PRIMARY KEY,
      pmtde_id INT NOT NULL,
      nombre VARCHAR(255) NOT NULL,
      descripcion TEXT NOT NULL,
      responsable_id INT NOT NULL,
      FOREIGN KEY (pmtde_id) REFERENCES entities(id),
      FOREIGN KEY (responsable_id) REFERENCES entities(id)
    )`
  );

  await pool.query(
    `CREATE TABLE IF NOT EXISTS programa_guardarrail_expertos (
      programa_id INT NOT NULL,
      usuario_id INT NOT NULL,
      PRIMARY KEY (programa_id, usuario_id),
      FOREIGN KEY (programa_id) REFERENCES programas_guardarrail(id) ON DELETE CASCADE,
      FOREIGN KEY (usuario_id) REFERENCES entities(id)
    )`
  );

  const [legacy] = await pool.query(
    'SELECT id, data FROM entities WHERE entity = "programasGuardarrail"'
  );

  for (const row of legacy) {
    const data = JSON.parse(row.data || '{}');
    const pmtdeId = data.pmtde && data.pmtde.id ? data.pmtde.id : 1;
    const nombre = data.nombre || 'n/a';
    const descripcion = data.descripcion || 'n/a';
    const responsableId = data.responsable && data.responsable.id ? data.responsable.id : 1;
    await pool.query(
      'INSERT IGNORE INTO programas_guardarrail (id, pmtde_id, nombre, descripcion, responsable_id) VALUES (?, ?, ?, ?, ?)',
      [row.id, pmtdeId, nombre, descripcion, responsableId]
    );
    if (Array.isArray(data.expertos)) {
      for (const exp of data.expertos) {
        const userId = exp && exp.id ? exp.id : 1;
        await pool.query(
          'INSERT IGNORE INTO programa_guardarrail_expertos (programa_id, usuario_id) VALUES (?, ?)',
          [row.id, userId]
        );
      }
    }
  }
}

function getDb() {
  if (!pool) throw new Error('DB not initialized');
  return pool;
}

module.exports = { initDb, getDb };
