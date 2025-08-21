const express = require('express');
const { getDb } = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  const pool = getDb();
  const [rows] = await pool.query(
    'SELECT o.id, o.nombre, o.codigo, o.pmtde_id, p.nombre AS pmtde_nombre FROM organizaciones o LEFT JOIN pmtde p ON o.pmtde_id=p.id'
  );
  const result = rows.map((r) => ({
    id: r.id,
    nombre: r.nombre,
    codigo: r.codigo,
    pmtde: r.pmtde_id ? { id: r.pmtde_id, nombre: r.pmtde_nombre } : null,
  }));
  res.json(result);
});

router.post('/', async (req, res) => {
  const pool = getDb();
  const pmtdeId = req.body.pmtde && req.body.pmtde.id ? req.body.pmtde.id : 1;
  const nombre = req.body.nombre || 'n/a';
  const codigo = req.body.codigo
    ? req.body.codigo.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10)
    : 'n/a';
  const [result] = await pool.query(
    'INSERT INTO organizaciones (pmtde_id, codigo, nombre) VALUES (?, ?, ?)',
    [pmtdeId, codigo, nombre]
  );
  res.json({ id: result.insertId, nombre, codigo, pmtde: req.body.pmtde });
});

router.put('/:id', async (req, res) => {
  const pool = getDb();
  const pmtdeId = req.body.pmtde && req.body.pmtde.id ? req.body.pmtde.id : 1;
  const nombre = req.body.nombre || 'n/a';
  const codigo = req.body.codigo
    ? req.body.codigo.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10)
    : 'n/a';
  await pool.query(
    'UPDATE organizaciones SET pmtde_id=?, codigo=?, nombre=? WHERE id=?',
    [pmtdeId, codigo, nombre, req.params.id]
  );
  res.json({ id: parseInt(req.params.id, 10), nombre, codigo, pmtde: req.body.pmtde });
});

router.delete('/:id', async (req, res) => {
  const pool = getDb();
  if (req.query.confirm !== 'true') {
    return res.status(400).json({ message: 'Confirmar eliminación', cascades: {} });
  }
  await pool.query('DELETE FROM organizaciones WHERE id=?', [req.params.id]);
  res.sendStatus(204);
});

module.exports = router;
