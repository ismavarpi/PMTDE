const express = require('express');
const { getDb } = require('../db');

const router = express.Router();

router.get('/:listId', async (req, res) => {
  const db = getDb();
  const usuario = (req.session && req.session.user && req.session.user.username) || 'anonimo';
  const [rows] = await db.query(
    'SELECT columnas FROM userListPreferences WHERE usuario=? AND lista=?',
    [usuario, req.params.listId]
  );
  if (rows.length) {
    return res.json(JSON.parse(rows[0].columnas || '[]'));
  }
  res.json(null);
});

router.post('/', async (req, res) => {
  const { listId, columns } = req.body || {};
  const db = getDb();
  const usuario = (req.session && req.session.user && req.session.user.username) || 'anonimo';
  await db.query(
    'INSERT INTO userListPreferences (usuario, lista, columnas) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE columnas=VALUES(columnas)',
    [usuario, listId || 'n/a', JSON.stringify(columns || [])]
  );
  res.json({ ok: true });
});

module.exports = router;
