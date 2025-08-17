const express = require('express');
const { getDb } = require('../db');

const router = express.Router();

async function recalcEvidencias(objetivoId) {
  const pool = getDb();
  const [[obj]] = await pool.query(
    'SELECT codigo FROM objetivos_estrategicos WHERE id=?',
    [objetivoId]
  );
  const objCode = obj ? obj.codigo : 'n/a';
  const [evs] = await pool.query(
    'SELECT id FROM objetivos_estrategicos_evidencias WHERE objetivo_id=? ORDER BY id',
    [objetivoId]
  );
  for (let i = 0; i < evs.length; i++) {
    const evCode = `${objCode}.EV${i + 1}`;
    await pool.query(
      'UPDATE objetivos_estrategicos_evidencias SET codigo=? WHERE id=?',
      [evCode, evs[i].id]
    );
  }
}

router.get('/', async (req, res) => {
  const objetivoId = parseInt(req.query.objetivoId, 10);
  const pool = getDb();
  const [rows] = await pool.query(
    'SELECT id, codigo, descripcion FROM objetivos_estrategicos_evidencias WHERE objetivo_id=?',
    [objetivoId]
  );
  res.json(rows);
});

router.post('/', async (req, res) => {
  const pool = getDb();
  const objetivoId =
    req.body.objetivo && req.body.objetivo.id ? req.body.objetivo.id : 1;
  const descripcion = req.body.descripcion || 'n/a';
  const id = req.body.id;
  if (id) {
    await pool.query(
      'UPDATE objetivos_estrategicos_evidencias SET descripcion=? WHERE id=?',
      [descripcion, id]
    );
    return res.json({ id, descripcion });
  }
  const [[obj]] = await pool.query(
    'SELECT codigo FROM objetivos_estrategicos WHERE id=?',
    [objetivoId]
  );
  const objCode = obj ? obj.codigo : 'n/a';
  const [countRows] = await pool.query(
    'SELECT COUNT(*) AS cnt FROM objetivos_estrategicos_evidencias WHERE objetivo_id=?',
    [objetivoId]
  );
  const seq = countRows[0].cnt + 1;
  const codigo = `${objCode}.EV${seq}`;
  const [result] = await pool.query(
    'INSERT INTO objetivos_estrategicos_evidencias (objetivo_id, codigo, descripcion) VALUES (?, ?, ?)',
    [objetivoId, codigo, descripcion]
  );
  return res.json({ id: result.insertId, codigo, descripcion });
});

router.put('/:id', async (req, res) => {
  req.body.id = parseInt(req.params.id, 10);
  return router.handle({ ...req, method: 'POST', url: '/' }, res);
});

router.delete('/:id', async (req, res) => {
  const pool = getDb();
  const id = req.params.id;
  const [[row]] = await pool.query(
    'SELECT objetivo_id FROM objetivos_estrategicos_evidencias WHERE id=?',
    [id]
  );
  if (!row) return res.sendStatus(404);
  if (req.query.confirm !== 'true') {
    return res.status(400).json({ message: 'Confirmar eliminación' });
  }
  await pool.query('DELETE FROM objetivos_estrategicos_evidencias WHERE id=?', [id]);
  await recalcEvidencias(row.objetivo_id);
  res.sendStatus(204);
});

module.exports = router;
