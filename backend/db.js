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
      valor VARCHAR(255) NOT NULL,
      valor_defecto VARCHAR(255) NOT NULL
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
      nombre VARCHAR(255) NOT NULL,
      apellidos VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL
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
      nombre VARCHAR(255) NOT NULL,
      descripcion TEXT,
      propietario_id INT NOT NULL,
      FOREIGN KEY (propietario_id) REFERENCES usuarios(id)
    )`
  );

  await pool.query(
    "ALTER TABLE pmtde MODIFY COLUMN descripcion TEXT"
  );

  const [defaultPmtde] = await pool.query('SELECT id FROM pmtde WHERE id=1');
  if (defaultPmtde.length === 0) {
    await pool.query(
      "INSERT INTO pmtde (id, nombre, descripcion, propietario_id) VALUES (1, 'n/a', 'n/a', 1)"
    );
  }

  await pool.query(
    `CREATE TABLE IF NOT EXISTS organizaciones (
      id INT AUTO_INCREMENT PRIMARY KEY,
      pmtde_id INT NOT NULL,
      nombre VARCHAR(255) NOT NULL,
      FOREIGN KEY (pmtde_id) REFERENCES pmtde(id) ON DELETE CASCADE
    )`
  );

  const [defaultOrg] = await pool.query('SELECT id FROM organizaciones WHERE id=1');
  if (defaultOrg.length === 0) {
    await pool.query("INSERT INTO organizaciones (id, pmtde_id, nombre) VALUES (1, 1, 'n/a')");
  }
  await pool.query(
    `CREATE TABLE IF NOT EXISTS normativas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      pmtde_id INT NOT NULL,
      organizacion_id INT NOT NULL,
      nombre VARCHAR(255) NOT NULL,
      url VARCHAR(255),
      FOREIGN KEY (pmtde_id) REFERENCES pmtde(id) ON DELETE CASCADE,
      FOREIGN KEY (organizacion_id) REFERENCES organizaciones(id) ON DELETE CASCADE
    )`
  );

  const [defaultNorm] = await pool.query('SELECT id FROM normativas WHERE id=1');
  if (defaultNorm.length === 0) {
    await pool.query("INSERT INTO normativas (id, pmtde_id, organizacion_id, nombre, url) VALUES (1, 1, 1, 'n/a', 'n/a')");
  }


  await pool.query(
    `CREATE TABLE IF NOT EXISTS programas_guardarrail (
      id INT AUTO_INCREMENT PRIMARY KEY,
      codigo VARCHAR(8) NOT NULL,
      pmtde_id INT NOT NULL,
      nombre VARCHAR(255) NOT NULL,
      descripcion TEXT,
      responsable_id INT NOT NULL,
      FOREIGN KEY (pmtde_id) REFERENCES pmtde(id) ON DELETE CASCADE,
      FOREIGN KEY (responsable_id) REFERENCES usuarios(id)
    )`
  );

  await pool.query(
    "ALTER TABLE programas_guardarrail MODIFY COLUMN descripcion TEXT"
  );

  await pool.query(
    "ALTER TABLE programas_guardarrail ADD COLUMN IF NOT EXISTS codigo VARCHAR(8) NOT NULL"
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
    `CREATE TABLE IF NOT EXISTS dafo_pgr (
      id INT AUTO_INCREMENT PRIMARY KEY,
      programa_id INT NOT NULL,
      tipo ENUM('D','A','F','O') NOT NULL,
      titulo VARCHAR(255) NOT NULL,
      descripcion TEXT,
      FOREIGN KEY (programa_id) REFERENCES programas_guardarrail(id) ON DELETE CASCADE
    )`
  );
  await pool.query(
    "ALTER TABLE dafo_pgr MODIFY COLUMN descripcion TEXT"
  );

  await pool.query(
    `CREATE TABLE IF NOT EXISTS principios_guardarrail (
      id INT AUTO_INCREMENT PRIMARY KEY,
      programa_id INT NOT NULL,
      codigo VARCHAR(255) NOT NULL,
      titulo VARCHAR(255) NOT NULL,
      descripcion TEXT,
      FOREIGN KEY (programa_id) REFERENCES programas_guardarrail(id) ON DELETE CASCADE
    )`
  );
  await pool.query(
    "ALTER TABLE principios_guardarrail MODIFY COLUMN descripcion TEXT"
  );
  await pool.query(
    "ALTER TABLE principios_guardarrail ADD COLUMN IF NOT EXISTS codigo VARCHAR(255) NOT NULL"
  );
  await pool.query(
    "UPDATE principios_guardarrail SET codigo='n/a' WHERE codigo IS NULL OR codigo=''"
  );

  await pool.query(
    `CREATE TABLE IF NOT EXISTS planes_estrategicos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      codigo VARCHAR(8) NOT NULL,
      pmtde_id INT NOT NULL,
      nombre VARCHAR(255) NOT NULL,
      descripcion TEXT,
      responsable_id INT NOT NULL,
      FOREIGN KEY (pmtde_id) REFERENCES pmtde(id) ON DELETE CASCADE,
      FOREIGN KEY (responsable_id) REFERENCES usuarios(id)
    )`
  );

  await pool.query(
    "ALTER TABLE planes_estrategicos MODIFY COLUMN descripcion TEXT"
  );

  await pool.query(
    `ALTER TABLE planes_estrategicos
      ADD COLUMN IF NOT EXISTS codigo VARCHAR(8) NOT NULL`
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
    `CREATE TABLE IF NOT EXISTS objetivos_guardarrail (
      id INT AUTO_INCREMENT PRIMARY KEY,
      programa_id INT NOT NULL,
      codigo VARCHAR(255) NOT NULL,
      titulo VARCHAR(255) NOT NULL,
      descripcion TEXT NOT NULL,
      FOREIGN KEY (programa_id) REFERENCES programas_guardarrail(id) ON DELETE CASCADE
    )`
  );
  await pool.query(
    "ALTER TABLE objetivos_guardarrail MODIFY COLUMN descripcion TEXT"
  );

  await pool.query(
    `CREATE TABLE IF NOT EXISTS objetivo_guardarrail_planes (
      objetivo_id INT NOT NULL,
      plan_id INT NOT NULL,
      PRIMARY KEY (objetivo_id, plan_id),
      FOREIGN KEY (objetivo_id) REFERENCES objetivos_guardarrail(id) ON DELETE CASCADE,
      FOREIGN KEY (plan_id) REFERENCES planes_estrategicos(id) ON DELETE CASCADE
    )`
  );

  await pool.query(
    `CREATE TABLE IF NOT EXISTS objetivos_guardarrail_evidencias (
      id INT AUTO_INCREMENT PRIMARY KEY,
      objetivo_id INT NOT NULL,
      codigo VARCHAR(255) NOT NULL,
      descripcion TEXT NOT NULL,
      FOREIGN KEY (objetivo_id) REFERENCES objetivos_guardarrail(id) ON DELETE CASCADE
    )`
  );
  await pool.query(
    "ALTER TABLE objetivos_guardarrail_evidencias MODIFY COLUMN descripcion TEXT"
  );

  await pool.query(
    'RENAME TABLE principio_objetivo_trazabilidad TO principioGR_objetivoGR_trazabilidad'
  ).catch(() => {});
  await pool.query(
    'ALTER TABLE principioGR_objetivoGR_trazabilidad CHANGE COLUMN principio_id principioGR_id INT NOT NULL'
  ).catch(() => {});
  await pool.query(
    'ALTER TABLE principioGR_objetivoGR_trazabilidad CHANGE COLUMN objetivo_id objetivoGR_id INT NOT NULL'
  ).catch(() => {});
  await pool.query(
    `CREATE TABLE IF NOT EXISTS principioGR_objetivoGR_trazabilidad (
      programa_id INT NOT NULL,
      principioGR_id INT NOT NULL,
      objetivoGR_id INT NOT NULL,
      nivel INT NOT NULL,
      PRIMARY KEY (programa_id, principioGR_id, objetivoGR_id),
      FOREIGN KEY (programa_id) REFERENCES programas_guardarrail(id) ON DELETE CASCADE,
      FOREIGN KEY (principioGR_id) REFERENCES principios_guardarrail(id) ON DELETE CASCADE,
      FOREIGN KEY (objetivoGR_id) REFERENCES objetivos_guardarrail(id) ON DELETE CASCADE
    )`
  );

  await pool.query(

    `CREATE TABLE IF NOT EXISTS objetivos_estrategicos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      plan_id INT NOT NULL,
      codigo VARCHAR(255) NOT NULL,
      titulo VARCHAR(255) NOT NULL,
      descripcion TEXT NOT NULL,
      FOREIGN KEY (plan_id) REFERENCES planes_estrategicos(id) ON DELETE CASCADE
    )`
  );


  await pool.query(
    `CREATE TABLE IF NOT EXISTS principios_especificos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      plan_id INT NOT NULL,
      codigo VARCHAR(20) NOT NULL,
      titulo VARCHAR(255) NOT NULL,
      descripcion TEXT,
      FOREIGN KEY (plan_id) REFERENCES planes_estrategicos(id) ON DELETE CASCADE
    )`
  );
  await pool.query(
    "ALTER TABLE principios_especificos MODIFY COLUMN descripcion TEXT"
  );

  await pool.query(
    `CREATE TABLE IF NOT EXISTS objetivos_estrategicos_evidencias (
      id INT AUTO_INCREMENT PRIMARY KEY,
      objetivo_id INT NOT NULL,
      codigo VARCHAR(255) NOT NULL,
      descripcion TEXT NOT NULL,
      FOREIGN KEY (objetivo_id) REFERENCES objetivos_estrategicos(id) ON DELETE CASCADE
    )`
  );

  await pool.query(
    `CREATE TABLE IF NOT EXISTS dafo_pe (
      id INT AUTO_INCREMENT PRIMARY KEY,
      plan_id INT NOT NULL,
      tipo ENUM('D','A','F','O') NOT NULL,
      titulo VARCHAR(255) NOT NULL,
      descripcion TEXT,
      FOREIGN KEY (plan_id) REFERENCES planes_estrategicos(id) ON DELETE CASCADE
    )`
  );
  await pool.query(
    "ALTER TABLE dafo_pe MODIFY COLUMN descripcion TEXT"
  );

  await pool.query(
    `CREATE TABLE IF NOT EXISTS preferencias_usuario (
      usuario VARCHAR(255) NOT NULL DEFAULT 'anónimo',
      tabla VARCHAR(255) NOT NULL,
      columnas TEXT NOT NULL,
      PRIMARY KEY (usuario, tabla)
    )`
  );
  await pool.query(
    "ALTER TABLE preferencias_usuario MODIFY COLUMN usuario VARCHAR(255) NOT NULL DEFAULT 'anónimo'"
  );
  await pool.query(
    "UPDATE preferencias_usuario SET usuario='anónimo' WHERE usuario IS NULL OR usuario=''"
  );
}

function getDb() {
  if (!pool) throw new Error('DB not initialized');
  return pool;
}

module.exports = { initDb, getDb };
