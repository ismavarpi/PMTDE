const express = require('express');
const { getDb } = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  const pool = getDb();
  const [rows] = await pool.query('SELECT id, plan_id, codigo, titulo, descripcion FROM principios_especificos');
  if (rows.length === 0) return res.json([]);
  const planIds = Array.from(new Set(rows.map((r) => r.plan_id)));
  const [planRows] = planIds.length
    ? await pool.query('SELECT id, codigo, nombre FROM planes_estrategicos WHERE id IN (?)', [planIds])
    : [[], []];
  const planMap = {};
  planRows.forEach((p) => {
    planMap[p.id] = { id: p.id, codigo: p.codigo, nombre: p.nombre };
  });
  const result = rows.map((r) => ({
    id: r.id,
    codigo: r.codigo,
    plan: planMap[r.plan_id] || null,
    titulo: r.titulo,
    descripcion: r.descripcion,
  }));
  res.json(result);
});

async function generateCode(pool, planId) {
  const [[plan]] = await pool.query('SELECT codigo FROM planes_estrategicos WHERE id=?', [planId]);
  const planCode = plan ? plan.codigo : 'n/a';
  const [[maxRow]] = await pool.query(
    "SELECT MAX(CAST(SUBSTRING_INDEX(codigo, '.P', -1) AS UNSIGNED)) AS max FROM principios_especificos WHERE plan_id=?",
    [planId]
  );
  const next = (maxRow.max || 0) + 1;
  return `${planCode}.P${String(next).padStart(2, '0')}`;
}

router.post('/', async (req, res) => {
  const pool = getDb();
  const planId = req.body.plan && req.body.plan.id ? req.body.plan.id : 1;
  const titulo = req.body.titulo || 'n/a';
  const descripcion = req.body.descripcion || 'n/a';
  const id = req.body.id;
  if (id) {
    const [[old]] = await pool.query('SELECT plan_id, codigo FROM principios_especificos WHERE id=?', [id]);
    let codigo = old ? old.codigo : '';
    if (!old || old.plan_id !== planId) {
      codigo = await generateCode(pool, planId);
    }
    await pool.query(
      'UPDATE principios_especificos SET plan_id=?, codigo=?, titulo=?, descripcion=? WHERE id=?',
      [planId, codigo, titulo, descripcion, id]
    );
    const [[plan]] = await pool.query('SELECT id, codigo, nombre FROM planes_estrategicos WHERE id=?', [planId]);
    return res.json({ id, plan, codigo, titulo, descripcion });
  }
  const codigo = await generateCode(pool, planId);
  const [result] = await pool.query(
    'INSERT INTO principios_especificos (plan_id, codigo, titulo, descripcion) VALUES (?, ?, ?, ?)',
    [planId, codigo, titulo, descripcion]
  );
  const [[plan]] = await pool.query('SELECT id, codigo, nombre FROM planes_estrategicos WHERE id=?', [planId]);
  res.json({ id: result.insertId, plan, codigo, titulo, descripcion });
});

router.put('/:id', async (req, res) => {
  const pool = getDb();
  const planId = req.body.plan && req.body.plan.id ? req.body.plan.id : 1;
  const titulo = req.body.titulo || 'n/a';
  const descripcion = req.body.descripcion || 'n/a';
  const id = req.params.id;
  const [[old]] = await pool.query('SELECT plan_id, codigo FROM principios_especificos WHERE id=?', [id]);
  let codigo = old ? old.codigo : '';
  if (!old || old.plan_id !== planId) {
    codigo = await generateCode(pool, planId);
  }
  await pool.query(
    'UPDATE principios_especificos SET plan_id=?, codigo=?, titulo=?, descripcion=? WHERE id=?',
    [planId, codigo, titulo, descripcion, id]
  );
  const [[plan]] = await pool.query('SELECT id, codigo, nombre FROM planes_estrategicos WHERE id=?', [planId]);
  res.json({ id: parseInt(id, 10), plan, codigo, titulo, descripcion });
});

router.delete('/:id', async (req, res) => {
  const pool = getDb();
  if (req.query.confirm !== 'true') {
    return res.status(400).json({ message: 'Confirmar eliminación', cascades: {} });
  }
  const [[current]] = await pool.query('SELECT plan_id FROM principios_especificos WHERE id=?', [req.params.id]);
  await pool.query('DELETE FROM principios_especificos WHERE id=?', [req.params.id]);
  if (current) {
    const [[plan]] = await pool.query('SELECT codigo FROM planes_estrategicos WHERE id=?', [current.plan_id]);
    const planCode = plan ? plan.codigo : 'n/a';
    const [rows] = await pool.query(
      "SELECT id FROM principios_especificos WHERE plan_id=? ORDER BY CAST(SUBSTRING_INDEX(codigo, '.P', -1) AS UNSIGNED)",
      [current.plan_id]
    );
    for (let i = 0; i < rows.length; i++) {
      const newCode = `${planCode}.P${String(i + 1).padStart(2, '0')}`;
      await pool.query('UPDATE principios_especificos SET codigo=? WHERE id=?', [newCode, rows[i].id]);
    }
  }
  res.sendStatus(204);
});

module.exports = router;
