const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const port = process.env.NODEJS_SERVER_INSIDE_CONTAINER_PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

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

app.get('/api/:entity', async (req, res) => {
  const [rows] = await pool.query('SELECT id, data FROM entities WHERE entity=?', [req.params.entity]);
  res.json(rows.map((r) => ({ id: r.id, ...r.data })));
});

app.post('/api/:entity', async (req, res) => {
  const [result] = await pool.query('INSERT INTO entities (entity, data) VALUES (?, ?)', [
    req.params.entity,
    JSON.stringify(req.body),
  ]);
  res.json({ id: result.insertId, ...req.body });
});

app.put('/api/:entity/:id', async (req, res) => {
  await pool.query('UPDATE entities SET data=? WHERE entity=? AND id=?', [
    JSON.stringify(req.body),
    req.params.entity,
    req.params.id,
  ]);
  res.json({ id: parseInt(req.params.id, 10), ...req.body });
});

app.delete('/api/:entity/:id', async (req, res) => {
  await pool.query('DELETE FROM entities WHERE entity=? AND id=?', [
    req.params.entity,
    req.params.id,
  ]);
  res.sendStatus(204);
});

initDb().then(() => {
  app.listen(port, '0.0.0.0', () => {
    const url = `http://localhost:${process.env.FRONT_PORT || port}`;
    console.log(`PMTDE frontend disponible en ${url}`);
  });
});
