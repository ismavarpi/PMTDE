const express = require('express');
const { getDb } = require('../db');

const router = express.Router();

async function recalcObjetivos(planId) {
  const pool = getDb();
  const [[plan]] = await pool.query('SELECT codigo FROM planes_estrategicos WHERE id=?', [planId]);
  const planCode = plan ? plan.codigo : 'n/a';
  const [objs] = await pool.query('SELECT id FROM objetivos_estrategicos WHERE plan_id=? ORDER BY id', [planId]);
  for (let i = 0; i < objs.length; i++) {
    const objId = objs[i].id;
    const objCode = `${planCode}.OE${i + 1}`;
    await pool.query('UPDATE objetivos_estrategicos SET codigo=? WHERE id=?', [objCode, objId]);
    const [evs] = await pool.query(
      'SELECT id FROM objetivos_estrategicos_evidencias WHERE objetivo_id=? ORDER BY id',
      [objId]
    );
    for (let j = 0; j < evs.length; j++) {
      const evCode = `${objCode}.EV${j + 1}`;
      await pool.query(
        'UPDATE objetivos_estrategicos_evidencias SET codigo=? WHERE id=?',
        [evCode, evs[j].id]
      );
    }
  }
}

router.get('/', async (req, res) => {
  const pool = getDb();
  const [rows] = await pool.query(`
    SELECT o.id, o.codigo, o.titulo, o.descripcion, o.plan_id,
           p.codigo AS plan_codigo, p.nombre AS plan_nombre, p.descripcion AS plan_desc
    FROM objetivos_estrategicos o
    JOIN planes_estrategicos p ON o.plan_id = p.id
  `);
  if (rows.length === 0) return res.json([]);
  const ids = rows.map(r => r.id);
  const [counts] = await pool.query(
    'SELECT objetivo_id, COUNT(*) AS cnt FROM objetivos_estrategicos_evidencias WHERE objetivo_id IN (?) GROUP BY objetivo_id',
    [ids]
  );
  const countMap = {};
  counts.forEach(c => { countMap[c.objetivo_id] = c.cnt; });
  const result = rows.map(r => ({
    id: r.id,
    codigo: r.codigo,
    titulo: r.titulo,
    descripcion: r.descripcion,
    plan: { id: r.plan_id, codigo: r.plan_codigo, nombre: r.plan_nombre, descripcion: r.plan_desc },
    evidencias: countMap[r.id] || 0,
  }));
  res.json(result);
});

async function saveObjetivo(req, res) {
  const pool = getDb();
  const planId = req.body.plan && req.body.plan.id ? req.body.plan.id : 1;
  const titulo = req.body.titulo || 'n/a';
  const descripcion = req.body.descripcion || 'n/a';
  const id = req.body.id;
  if (id) {
    const [[old]] = await pool.query('SELECT plan_id FROM objetivos_estrategicos WHERE id=?', [id]);
    await pool.query('UPDATE objetivos_estrategicos SET plan_id=?, titulo=?, descripcion=? WHERE id=?', [planId, titulo, descripcion, id]);
    if (old && old.plan_id !== planId) {
      await recalcObjetivos(old.plan_id);
      await recalcObjetivos(planId);
    } else {
      await recalcObjetivos(planId);
    }
    const [[obj]] = await pool.query('SELECT codigo FROM objetivos_estrategicos WHERE id=?', [id]);
    return res.json({ id, codigo: obj ? obj.codigo : 'n/a', plan: { id: planId }, titulo, descripcion });
  }
  const [[plan]] = await pool.query('SELECT codigo FROM planes_estrategicos WHERE id=?', [planId]);
  const planCode = plan ? plan.codigo : 'n/a';
  const [countRows] = await pool.query('SELECT COUNT(*) AS cnt FROM objetivos_estrategicos WHERE plan_id=?', [planId]);
  const seq = countRows[0].cnt + 1;
  const codigo = `${planCode}.OE${seq}`;
  const [result] = await pool.query(
    'INSERT INTO objetivos_estrategicos (plan_id, codigo, titulo, descripcion) VALUES (?, ?, ?, ?)',
    [planId, codigo, titulo, descripcion]
  );
  return res.json({ id: result.insertId, codigo, plan: { id: planId }, titulo, descripcion });
}

router.post('/', saveObjetivo);

router.put('/:id', async (req, res) => {
  req.body.id = parseInt(req.params.id, 10);
  return saveObjetivo(req, res);
});

router.delete('/:id', async (req, res) => {
  const pool = getDb();
  const id = req.params.id;
  const [[obj]] = await pool.query('SELECT plan_id FROM objetivos_estrategicos WHERE id=?', [id]);
  if (!obj) return res.sendStatus(404);
  if (req.query.confirm !== 'true') {
    const [rows] = await pool.query(
      'SELECT COUNT(*) AS evidencias FROM objetivos_estrategicos_evidencias WHERE objetivo_id=?',
      [id]
    );
    return res.status(400).json({
      message: 'Confirmar eliminación',
      cascades: { evidencias: rows[0].evidencias },
    });
  }
  await pool.query('DELETE FROM objetivos_estrategicos_evidencias WHERE objetivo_id=?', [id]);
  await pool.query('DELETE FROM objetivos_estrategicos WHERE id=?', [id]);
  await recalcObjetivos(obj.plan_id);
  res.sendStatus(204);
});

module.exports = router;
