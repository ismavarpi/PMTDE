const express = require('express');
const { getDb } = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  const pool = getDb();
  const [rows] = await pool.query(
    'SELECT id, pmtde_id, nombre, descripcion, responsable_id FROM planes_estrategicos'
  );
  if (rows.length === 0) return res.json([]);

  const planIds = rows.map((r) => r.id);
  const pmtdeIds = rows.map((r) => r.pmtde_id);
  const userIds = new Set(rows.map((r) => r.responsable_id));

  const [expertRows] = await pool.query(
    'SELECT plan_id, usuario_id FROM plan_estrategico_expertos WHERE plan_id IN (?)',
    [planIds]
  );
  expertRows.forEach((er) => userIds.add(er.usuario_id));

  const [usuariosRows] = userIds.size
    ? await pool.query('SELECT id, data FROM entities WHERE id IN (?)', [Array.from(userIds)])
    : [[], []];
  const usuariosMap = {};
  usuariosRows.forEach((u) => {
    usuariosMap[u.id] = { id: u.id, ...JSON.parse(u.data) };
  });

  const [pmtdeRows] = await pool.query('SELECT id, data FROM entities WHERE id IN (?)', [pmtdeIds]);
  const pmtdeMap = {};
  pmtdeRows.forEach((p) => {
    pmtdeMap[p.id] = { id: p.id, ...JSON.parse(p.data) };
  });

  const result = rows.map((r) => ({
    id: r.id,
    pmtde: pmtdeMap[r.pmtde_id] || null,
    nombre: r.nombre,
    descripcion: r.descripcion,
    responsable: usuariosMap[r.responsable_id] || null,
    expertos: expertRows
      .filter((er) => er.plan_id === r.id)
      .map((er) => usuariosMap[er.usuario_id])
      .filter(Boolean),
  }));

  res.json(result);
});

router.post('/', async (req, res) => {
  const pool = getDb();
  const pmtdeId = req.body.pmtde && req.body.pmtde.id ? req.body.pmtde.id : 1;
  const nombre = req.body.nombre || 'n/a';
  const descripcion = req.body.descripcion || 'n/a';
  const respId =
    req.body.responsable && req.body.responsable.id ? req.body.responsable.id : 1;
  const [result] = await pool.query(
    'INSERT INTO planes_estrategicos (pmtde_id, nombre, descripcion, responsable_id) VALUES (?, ?, ?, ?)',
    [pmtdeId, nombre, descripcion, respId]
  );
  const id = result.insertId;
  if (Array.isArray(req.body.expertos)) {
    for (const exp of req.body.expertos) {
      const userId = exp && exp.id ? exp.id : 1;
      await pool.query(
        'INSERT INTO plan_estrategico_expertos (plan_id, usuario_id) VALUES (?, ?)',
        [id, userId]
      );
    }
  }
  res.json({ id, ...req.body });
});

router.put('/:id', async (req, res) => {
  const pool = getDb();
  const pmtdeId = req.body.pmtde && req.body.pmtde.id ? req.body.pmtde.id : 1;
  const nombre = req.body.nombre || 'n/a';
  const descripcion = req.body.descripcion || 'n/a';
  const respId =
    req.body.responsable && req.body.responsable.id ? req.body.responsable.id : 1;
  await pool.query(
    'UPDATE planes_estrategicos SET pmtde_id=?, nombre=?, descripcion=?, responsable_id=? WHERE id=?',
    [pmtdeId, nombre, descripcion, respId, req.params.id]
  );
  await pool.query('DELETE FROM plan_estrategico_expertos WHERE plan_id=?', [
    req.params.id,
  ]);
  if (Array.isArray(req.body.expertos)) {
    for (const exp of req.body.expertos) {
      const userId = exp && exp.id ? exp.id : 1;
      await pool.query(
        'INSERT INTO plan_estrategico_expertos (plan_id, usuario_id) VALUES (?, ?)',
        [req.params.id, userId]
      );
    }
  }
  res.json({ id: parseInt(req.params.id, 10), ...req.body });
});

router.delete('/:id', async (req, res) => {
  const pool = getDb();
  await pool.query('DELETE FROM planes_estrategicos WHERE id=?', [req.params.id]);
  res.sendStatus(204);
});

module.exports = router;

