const express = require('express');
const { getDb } = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  const pool = getDb();
  const [rows] = await pool.query('SELECT id, nombre, apellidos, email FROM usuarios');
  res.json(rows);
});

router.post('/', async (req, res) => {
  const pool = getDb();
  const { nombre = 'n/a', apellidos = 'n/a', email = 'n/a' } = req.body;
  const [result] = await pool.query(
    'INSERT INTO usuarios (nombre, apellidos, email) VALUES (?, ?, ?)',
    [nombre, apellidos, email]
  );
  res.json({ id: result.insertId, nombre, apellidos, email });
});

router.put('/:id', async (req, res) => {
  const pool = getDb();
  const { nombre = 'n/a', apellidos = 'n/a', email = 'n/a' } = req.body;
  await pool.query(
    'UPDATE usuarios SET nombre=?, apellidos=?, email=? WHERE id=?',
    [nombre, apellidos, email, req.params.id]
  );
  res.json({ id: parseInt(req.params.id, 10), nombre, apellidos, email });
});

router.delete('/:id', async (req, res) => {
  const pool = getDb();
  await pool.query('DELETE FROM usuarios WHERE id=?', [req.params.id]);
  res.sendStatus(204);
});

module.exports = router;
