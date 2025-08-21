const express = require('express');
const { getDb } = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  const pool = getDb();
  const [rows] = await pool.query(
    'SELECT i.id, i.titulo, i.descripcion, i.pmtde_id, p.nombre AS pmtde_nombre, i.normativa_id, n.nombre AS normativa_nombre, n.organizacion_id, o.nombre AS organizacion_nombre FROM inputs i LEFT JOIN pmtde p ON i.pmtde_id=p.id LEFT JOIN normativas n ON i.normativa_id=n.id LEFT JOIN organizaciones o ON n.organizacion_id=o.id'
  );
  const result = rows.map((r) => ({
    id: r.id,
    titulo: r.titulo,
    descripcion: r.descripcion,
    pmtde: r.pmtde_id ? { id: r.pmtde_id, nombre: r.pmtde_nombre } : null,
    normativa: r.normativa_id
      ? {
          id: r.normativa_id,
          nombre: r.normativa_nombre,
          organizacion: r.organizacion_id ? { id: r.organizacion_id, nombre: r.organizacion_nombre } : null,
        }
      : null,
  }));
  res.json(result);
});

router.post('/', async (req, res) => {
  const pool = getDb();
  const pmtdeId = req.body.pmtde && req.body.pmtde.id ? req.body.pmtde.id : 1;
  const normativaId = req.body.normativa && req.body.normativa.id ? req.body.normativa.id : 1;
  const titulo = req.body.titulo || 'n/a';
  const descripcion = req.body.descripcion || 'n/a';
  const [result] = await pool.query(
    'INSERT INTO inputs (pmtde_id, normativa_id, titulo, descripcion) VALUES (?, ?, ?, ?)',
    [pmtdeId, normativaId, titulo, descripcion]
  );
  res.json({ id: result.insertId, ...req.body });
});

router.put('/:id', async (req, res) => {
  const pool = getDb();
  const pmtdeId = req.body.pmtde && req.body.pmtde.id ? req.body.pmtde.id : 1;
  const normativaId = req.body.normativa && req.body.normativa.id ? req.body.normativa.id : 1;
  const titulo = req.body.titulo || 'n/a';
  const descripcion = req.body.descripcion || 'n/a';
  await pool.query(
    'UPDATE inputs SET pmtde_id=?, normativa_id=?, titulo=?, descripcion=? WHERE id=?',
    [pmtdeId, normativaId, titulo, descripcion, req.params.id]
  );
  res.json({ id: parseInt(req.params.id, 10), ...req.body });
});

router.delete('/:id', async (req, res) => {
  const pool = getDb();
  if (req.query.confirm !== 'true') {
    return res.status(400).json({ message: 'Confirmar eliminación', cascades: {} });
  }
  await pool.query('DELETE FROM inputs WHERE id=?', [req.params.id]);
  res.sendStatus(204);
});

module.exports = router;
