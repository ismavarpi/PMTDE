const express = require('express');
const { getDb } = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  const pool = getDb();
  const [rows] = await pool.query(
    'SELECT i.id, i.codigo, i.titulo, i.descripcion, i.pmtde_id, p.nombre AS pmtde_nombre, i.normativa_id, n.nombre AS normativa_nombre, n.codigo AS normativa_codigo, n.organizacion_id, o.nombre AS organizacion_nombre, o.codigo AS organizacion_codigo FROM inputs i LEFT JOIN pmtde p ON i.pmtde_id=p.id LEFT JOIN normativas n ON i.normativa_id=n.id LEFT JOIN organizaciones o ON n.organizacion_id=o.id'
  );
  const result = rows.map((r) => ({
    id: r.id,
    codigo: r.codigo,
    titulo: r.titulo,
    descripcion: r.descripcion,
    pmtde: r.pmtde_id ? { id: r.pmtde_id, nombre: r.pmtde_nombre } : null,
    normativa: r.normativa_id
      ? {
          id: r.normativa_id,
          nombre: r.normativa_nombre,
          codigo: r.normativa_codigo,
          organizacion: r.organizacion_id
            ? { id: r.organizacion_id, nombre: r.organizacion_nombre, codigo: r.organizacion_codigo }
            : null,
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

  const [[codes]] = await pool.query(
    'SELECT n.codigo AS norm_codigo, o.codigo AS org_codigo FROM normativas n JOIN organizaciones o ON n.organizacion_id=o.id WHERE n.id=?',
    [normativaId]
  );
  const [existing] = await pool.query('SELECT codigo FROM inputs WHERE normativa_id=?', [normativaId]);
  const next = existing.reduce((m, r) => {
    const num = parseInt(r.codigo.split('.').pop(), 10) || 0;
    return Math.max(m, num);
  }, 0) + 1;
  const codigo = `${codes.org_codigo}.${codes.norm_codigo}.${next}`;

  const [result] = await pool.query(
    'INSERT INTO inputs (pmtde_id, normativa_id, codigo, titulo, descripcion) VALUES (?, ?, ?, ?, ?)',
    [pmtdeId, normativaId, codigo, titulo, descripcion]
  );
  res.json({ id: result.insertId, codigo, titulo, descripcion, pmtde: req.body.pmtde, normativa: req.body.normativa });
});

router.put('/:id', async (req, res) => {
  const pool = getDb();
  const pmtdeId = req.body.pmtde && req.body.pmtde.id ? req.body.pmtde.id : 1;
  const normativaId = req.body.normativa && req.body.normativa.id ? req.body.normativa.id : 1;
  const titulo = req.body.titulo || 'n/a';
  const descripcion = req.body.descripcion || 'n/a';

  const [[prev]] = await pool.query(
    'SELECT normativa_id, codigo FROM inputs WHERE id=?',
    [req.params.id]
  );
  let codigo = prev.codigo;
  if (prev.normativa_id !== normativaId) {
    const [[codes]] = await pool.query(
      'SELECT n.codigo AS norm_codigo, o.codigo AS org_codigo FROM normativas n JOIN organizaciones o ON n.organizacion_id=o.id WHERE n.id=?',
      [normativaId]
    );
    const [existing] = await pool.query('SELECT codigo FROM inputs WHERE normativa_id=?', [normativaId]);
    const next = existing.reduce((m, r) => {
      const num = parseInt(r.codigo.split('.').pop(), 10) || 0;
      return Math.max(m, num);
    }, 0) + 1;
    codigo = `${codes.org_codigo}.${codes.norm_codigo}.${next}`;
  }

  await pool.query(
    'UPDATE inputs SET pmtde_id=?, normativa_id=?, codigo=?, titulo=?, descripcion=? WHERE id=?',
    [pmtdeId, normativaId, codigo, titulo, descripcion, req.params.id]
  );
  res.json({ id: parseInt(req.params.id, 10), codigo, titulo, descripcion, pmtde: req.body.pmtde, normativa: req.body.normativa });
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
