const express = require('express');
const { getDb } = require('../db');

const router = express.Router();

router.get('/:tabla', async (req, res) => {
  const db = getDb();
  const usuario = 'anonimo';
  const [rows] = await db.query(
    'SELECT columnas FROM preferencias_usuario WHERE usuario=? AND tabla=?',
    [usuario, req.params.tabla]
  );
  if (rows.length) {
    return res.json(JSON.parse(rows[0].columnas || '[]'));
  }
  res.json(null);
});

router.post('/', async (req, res) => {
  const { tabla, columns } = req.body || {};
  const db = getDb();
  const usuario = 'anonimo';
  await db.query(
    'INSERT INTO preferencias_usuario (usuario, tabla, columnas) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE columnas=VALUES(columnas)',
    [usuario, tabla || 'n/a', JSON.stringify(columns || [])]
  );
  res.json({ ok: true });
});

module.exports = router;
