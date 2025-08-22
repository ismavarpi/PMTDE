const express = require('express');
const { getDb } = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  const pool = getDb();
  const active = req.session.activePmtdeId;
  if (!active) return res.json([]);
  const [rows] = await pool.query(
    "SELECT n.id, n.nombre, n.codigo, n.tipo, n.url, n.pmtde_id, p.nombre AS pmtde_nombre, n.organizacion_id, o.nombre AS organizacion_nombre FROM normativas n LEFT JOIN pmtde p ON n.pmtde_id=p.id LEFT JOIN organizaciones o ON n.organizacion_id=o.id WHERE n.pmtde_id=?",
    [active]
  );
  const result = rows.map((r) => ({
    id: r.id,
    nombre: r.nombre,
    codigo: r.codigo,
    tipo: r.tipo,
    url: r.url,
    pmtde: r.pmtde_id ? { id: r.pmtde_id, nombre: r.pmtde_nombre } : null,
    organizacion: r.organizacion_id ? { id: r.organizacion_id, nombre: r.organizacion_nombre } : null,
  }));
  res.json(result);
});

router.post('/', async (req, res) => {
  const pool = getDb();
  const pmtdeId = req.body.pmtde && req.body.pmtde.id ? req.body.pmtde.id : 1;
  const organizacionId =
    req.body.organizacion && req.body.organizacion.id ? req.body.organizacion.id : 1;
  const nombre = req.body.nombre || 'n/a';
  const tipo = req.body.tipo || 'Normativa';
  const url = req.body.url || 'n/a';
  const codigo = (req.body.codigo || 'NA').toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 10);
  const [result] = await pool.query(
    'INSERT INTO normativas (pmtde_id, organizacion_id, codigo, nombre, tipo, url) VALUES (?, ?, ?, ?, ?, ?)',
    [pmtdeId, organizacionId, codigo, nombre, tipo, url]
  );
  res.json({ id: result.insertId, ...req.body });
});

router.put('/:id', async (req, res) => {
  const pool = getDb();
  const pmtdeId = req.body.pmtde && req.body.pmtde.id ? req.body.pmtde.id : 1;
  const organizacionId =
    req.body.organizacion && req.body.organizacion.id ? req.body.organizacion.id : 1;
  const nombre = req.body.nombre || 'n/a';
  const tipo = req.body.tipo || 'Normativa';
  const url = req.body.url || 'n/a';
  const codigo = (req.body.codigo || 'NA').toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 10);
  await pool.query(
    'UPDATE normativas SET pmtde_id=?, organizacion_id=?, codigo=?, nombre=?, tipo=?, url=? WHERE id=?',
    [pmtdeId, organizacionId, codigo, nombre, tipo, url, req.params.id]
  );
  res.json({ id: parseInt(req.params.id, 10), ...req.body });
});

router.delete('/:id', async (req, res) => {
  const pool = getDb();
  if (req.query.confirm !== 'true') {
    return res.status(400).json({ message: 'Confirmar eliminación', cascades: {} });
  }
  await pool.query('DELETE FROM normativas WHERE id=?', [req.params.id]);
  res.sendStatus(204);
});

module.exports = router;
