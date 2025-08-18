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
    const objCode = `${progCode}.OE${i + 1}`;
    await pool.query('UPDATE objetivos_guardarrail SET codigo=? WHERE id=?', [objCode, objId]);
    const [evs] = await pool.query(
      'SELECT id FROM objetivos_guardarrail_evidencias WHERE objetivo_id=? ORDER BY id',
      [objId]
    );
    for (let j = 0; j < evs.length; j++) {
      const evCode = `${objCode}.EV${j + 1}`;
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
  const countMap = {};
  counts.forEach((c) => {
    countMap[c.objetivo_id] = c.cnt;
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
  }));
  res.json(result);
});

router.post('/', async (req, res) => {
  const pool = getDb();
  const programaId = req.body.programa && req.body.programa.id ? req.body.programa.id : 1;
  const titulo = req.body.titulo || 'n/a';
  const descripcion = req.body.descripcion || 'n/a';
  const id = req.body.id;
  if (id) {
    const [[old]] = await pool.query('SELECT programa_id FROM objetivos_guardarrail WHERE id=?', [id]);
    await pool.query('UPDATE objetivos_guardarrail SET programa_id=?, titulo=?, descripcion=? WHERE id=?', [programaId, titulo, descripcion, id]);
    if (old && old.programa_id !== programaId) {
      await recalcObjetivos(old.programa_id);
      await recalcObjetivos(programaId);
    } else {
      await recalcObjetivos(programaId);
    }
    const [[obj]] = await pool.query('SELECT codigo FROM objetivos_guardarrail WHERE id=?', [id]);
    return res.json({ id, codigo: obj ? obj.codigo : 'n/a', programa: { id: programaId }, titulo, descripcion });
  }
  const [[prog]] = await pool.query('SELECT codigo FROM programas_guardarrail WHERE id=?', [programaId]);
  const progCode = prog ? prog.codigo : 'n/a';
  const [countRows] = await pool.query('SELECT COUNT(*) AS cnt FROM objetivos_guardarrail WHERE programa_id=?', [programaId]);
  const seq = countRows[0].cnt + 1;
  const codigo = `${progCode}.OE${seq}`;
  const [result] = await pool.query('INSERT INTO objetivos_guardarrail (programa_id, codigo, titulo, descripcion) VALUES (?, ?, ?, ?)', [programaId, codigo, titulo, descripcion]);
  return res.json({ id: result.insertId, codigo, programa: { id: programaId }, titulo, descripcion });
});

router.put('/:id', async (req, res) => {
  req.body.id = parseInt(req.params.id, 10);
  return router.handle({ ...req, method: 'POST', url: '/' }, res);
});

router.delete('/:id', async (req, res) => {
  const pool = getDb();
  const id = req.params.id;
  const [[obj]] = await pool.query('SELECT programa_id FROM objetivos_guardarrail WHERE id=?', [id]);
  if (!obj) return res.sendStatus(404);
  if (req.query.confirm !== 'true') {
    const [rows] = await pool.query('SELECT COUNT(*) AS evidencias FROM objetivos_guardarrail_evidencias WHERE objetivo_id=?', [id]);
    return res.status(400).json({
      message: 'Confirmar eliminación',
      cascades: { evidencias: rows[0].evidencias },
    });
  }
  await pool.query('DELETE FROM objetivos_guardarrail_evidencias WHERE objetivo_id=?', [id]);
  await pool.query('DELETE FROM objetivos_guardarrail WHERE id=?', [id]);
  await recalcObjetivos(obj.programa_id);
  res.sendStatus(204);
});

module.exports = router;
