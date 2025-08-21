const express = require('express');
const { getDb } = require('../db');

const router = express.Router();

async function recalcObjetivos(programaId) {
  const pool = getDb();
  const [[prog]] = await pool.query('SELECT codigo FROM programas_guardarrail WHERE id=?', [programaId]);
  const progCode = prog ? prog.codigo : 'n/a';
  const [objs] = await pool.query('SELECT id FROM objetivos_guardarrail WHERE programa_id=? ORDER BY id', [programaId]);
  for (let i = 0; i < objs.length; i++) {
    const objId = objs[i].id;
    const objCode = `${progCode}.OE${String(i + 1).padStart(2, '0')}`;
    await pool.query('UPDATE objetivos_guardarrail SET codigo=? WHERE id=?', [objCode, objId]);
    const [evs] = await pool.query(
      'SELECT id FROM objetivos_guardarrail_evidencias WHERE objetivo_id=? ORDER BY id',
      [objId]
    );
    for (let j = 0; j < evs.length; j++) {
      const evCode = `${objCode}.EV${String(j + 1).padStart(2, '0')}`;
      await pool.query(
        'UPDATE objetivos_guardarrail_evidencias SET codigo=? WHERE id=?',
        [evCode, evs[j].id]
      );
    }
  }
}

router.get('/', async (req, res) => {
  const pool = getDb();
  const [rows] = await pool.query(`
    SELECT o.id, o.codigo, o.titulo, o.descripcion, o.programa_id,
           p.codigo AS programa_codigo, p.nombre AS programa_nombre, p.descripcion AS programa_desc
    FROM objetivos_guardarrail o
    JOIN programas_guardarrail p ON o.programa_id = p.id
  `);
  if (rows.length === 0) return res.json([]);
  const ids = rows.map((r) => r.id);
  const [counts] = await pool.query(
    'SELECT objetivo_id, COUNT(*) AS cnt FROM objetivos_guardarrail_evidencias WHERE objetivo_id IN (?) GROUP BY objetivo_id',
    [ids]
  );
  const [planRows] = await pool.query(
    'SELECT op.objetivo_id, p.id, p.codigo, p.nombre FROM objetivo_guardarrail_planes op JOIN planes_estrategicos p ON op.plan_id=p.id WHERE op.objetivo_id IN (?)',
    [ids]
  );
  const countMap = {};
  counts.forEach((c) => {
    countMap[c.objetivo_id] = c.cnt;
  });
  const planMap = {};
  planRows.forEach((pr) => {
    if (!planMap[pr.objetivo_id]) planMap[pr.objetivo_id] = [];
    planMap[pr.objetivo_id].push({ id: pr.id, codigo: pr.codigo, nombre: pr.nombre });
  });
  const result = rows.map((r) => ({
    id: r.id,
    codigo: r.codigo,
    titulo: r.titulo,
    descripcion: r.descripcion,
    programa: {
      id: r.programa_id,
      codigo: r.programa_codigo,
      nombre: r.programa_nombre,
      descripcion: r.programa_desc,
    },
    evidencias: countMap[r.id] || 0,
    planes: planMap[r.id] || [],
  }));
  res.json(result);
});

async function saveObjetivo(req, res) {
  const pool = getDb();
  const programaId = req.body.programa && req.body.programa.id ? req.body.programa.id : 1;
  const titulo = req.body.titulo || 'n/a';
  const descripcion = req.body.descripcion || 'n/a';
  const planes = Array.isArray(req.body.planes) && req.body.planes.length ? req.body.planes : [{ id: 1 }];
  const id = req.body.id;
  if (id) {
    const [[old]] = await pool.query('SELECT programa_id FROM objetivos_guardarrail WHERE id=?', [id]);
    await pool.query('UPDATE objetivos_guardarrail SET programa_id=?, titulo=?, descripcion=? WHERE id=?', [programaId, titulo, descripcion, id]);
    await pool.query('DELETE FROM objetivo_guardarrail_planes WHERE objetivo_id=?', [id]);
    for (const pl of planes) {
      const planId = pl && pl.id ? pl.id : 1;
      await pool.query('INSERT INTO objetivo_guardarrail_planes (objetivo_id, plan_id) VALUES (?, ?)', [id, planId]);
    }
    if (old && old.programa_id !== programaId) {
      await recalcObjetivos(old.programa_id);
      await recalcObjetivos(programaId);
    } else {
      await recalcObjetivos(programaId);
    }
    const [[obj]] = await pool.query('SELECT codigo FROM objetivos_guardarrail WHERE id=?', [id]);
    return res.json({ id, codigo: obj ? obj.codigo : 'n/a', programa: { id: programaId }, titulo, descripcion, planes });
  }
  const [[prog]] = await pool.query('SELECT codigo FROM programas_guardarrail WHERE id=?', [programaId]);
  const progCode = prog ? prog.codigo : 'n/a';
  const [countRows] = await pool.query('SELECT COUNT(*) AS cnt FROM objetivos_guardarrail WHERE programa_id=?', [programaId]);
  const seq = countRows[0].cnt + 1;
  const codigo = `${progCode}.OE${String(seq).padStart(2, '0')}`;
  const [result] = await pool.query('INSERT INTO objetivos_guardarrail (programa_id, codigo, titulo, descripcion) VALUES (?, ?, ?, ?)', [programaId, codigo, titulo, descripcion]);
  for (const pl of planes) {
    const planId = pl && pl.id ? pl.id : 1;
    await pool.query('INSERT INTO objetivo_guardarrail_planes (objetivo_id, plan_id) VALUES (?, ?)', [result.insertId, planId]);
  }
  return res.json({ id: result.insertId, codigo, programa: { id: programaId }, titulo, descripcion, planes });
}

router.post('/', saveObjetivo);

router.put('/:id', (req, res) => {
  req.body.id = parseInt(req.params.id, 10);
  return saveObjetivo(req, res);
});

router.delete('/:id', async (req, res) => {
  const pool = getDb();
  const id = req.params.id;
  const [[obj]] = await pool.query('SELECT programa_id FROM objetivos_guardarrail WHERE id=?', [id]);
  if (!obj) return res.sendStatus(404);
  if (req.query.confirm !== 'true') {
    const [[ev]] = await pool.query('SELECT COUNT(*) AS evidencias FROM objetivos_guardarrail_evidencias WHERE objetivo_id=?', [id]);
    const [[pl]] = await pool.query('SELECT COUNT(*) AS planes FROM objetivo_guardarrail_planes WHERE objetivo_id=?', [id]);
    return res.status(400).json({
      message: 'Confirmar eliminación',
      cascades: { evidencias: ev.evidencias, planes: pl.planes },
    });
  }
  await pool.query('DELETE FROM objetivos_guardarrail_evidencias WHERE objetivo_id=?', [id]);
  await pool.query('DELETE FROM objetivo_guardarrail_planes WHERE objetivo_id=?', [id]);
  await pool.query('DELETE FROM objetivos_guardarrail WHERE id=?', [id]);
  await recalcObjetivos(obj.programa_id);
  res.sendStatus(204);
});

module.exports = router;
