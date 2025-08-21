const express = require('express');
const { getDb } = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  const pool = getDb();
  const [rows] = await pool.query('SELECT id, plan_id, tipo, titulo, descripcion FROM dafo_pe');
  if (rows.length === 0) return res.json([]);
  const planIds = Array.from(new Set(rows.map((r) => r.plan_id)));
  const [planRows] = planIds.length
    ? await pool.query('SELECT id, nombre FROM planes_estrategicos WHERE id IN (?)', [planIds])
    : [[], []];
  const planMap = {};
  planRows.forEach((p) => {
    planMap[p.id] = { id: p.id, nombre: p.nombre };
  });
  const result = rows.map((r) => ({
    id: r.id,
    plan: planMap[r.plan_id] || null,
    tipo: r.tipo,
    titulo: r.titulo,
    descripcion: r.descripcion,
  }));
  res.json(result);
});

router.post('/', async (req, res) => {
  const pool = getDb();
  const planId = req.body.plan && req.body.plan.id ? req.body.plan.id : 1;
  const tipo = req.body.tipo || 'n/a';
  const titulo = req.body.titulo || 'n/a';
  const descripcion = req.body.descripcion || 'n/a';
  const [result] = await pool.query(
    'INSERT INTO dafo_pe (plan_id, tipo, titulo, descripcion) VALUES (?, ?, ?, ?)',
    [planId, tipo, titulo, descripcion]
  );
  const [[plan]] = await pool.query('SELECT id, nombre FROM planes_estrategicos WHERE id=?', [planId]);
  res.json({ id: result.insertId, plan, tipo, titulo, descripcion });
});

router.put('/:id', async (req, res) => {
  const pool = getDb();
  const planId = req.body.plan && req.body.plan.id ? req.body.plan.id : 1;
  const tipo = req.body.tipo || 'n/a';
  const titulo = req.body.titulo || 'n/a';
  const descripcion = req.body.descripcion || 'n/a';
  await pool.query(
    'UPDATE dafo_pe SET plan_id=?, tipo=?, titulo=?, descripcion=? WHERE id=?',
    [planId, tipo, titulo, descripcion, req.params.id]
  );
  const [[plan]] = await pool.query('SELECT id, nombre FROM planes_estrategicos WHERE id=?', [planId]);
  res.json({ id: parseInt(req.params.id, 10), plan, tipo, titulo, descripcion });
});

router.delete('/:id', async (req, res) => {
  const pool = getDb();
  if (req.query.confirm !== 'true') {
    return res.status(400).json({ message: 'Confirmar eliminación', cascades: {} });
  }
  await pool.query('DELETE FROM dafo_pe WHERE id=?', [req.params.id]);
  res.sendStatus(204);
});

module.exports = router;
