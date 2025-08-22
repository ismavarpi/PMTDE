const express = require('express');
const { getDb } = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  const db = getDb();
  const usuario = (req.session && req.session.user && req.session.user.username) || 'anonimo';
  const [rows] = await db.query('SELECT density FROM userPreferences WHERE usuario=?', [usuario]);
  if (rows.length) {
    return res.json({ density: rows[0].density });
  }
  res.json(null);
});

router.post('/', async (req, res) => {
  const { density } = req.body || {};
  const db = getDb();
  const usuario = (req.session && req.session.user && req.session.user.username) || 'anonimo';
  await db.query(
    'INSERT INTO userPreferences (usuario, density) VALUES (?, ?) ON DUPLICATE KEY UPDATE density=VALUES(density)',
    [usuario, density || 'Extendido']
  );
  res.json({ ok: true });
});

module.exports = router;
