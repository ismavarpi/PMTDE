const express = require('express');
const { getDb } = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  const pool = getDb();
  const [rows] = await pool.query('SELECT id, nombre, apellidos, email FROM usuarios');
  res.json(rows);
});

router.post('/', async (req, res) => {
  const pool = getDb();
  const { id, nombre = 'n/a', apellidos = 'n/a', email = 'n/a' } = req.body;
  if (id) {
    await pool.query(
      'UPDATE usuarios SET nombre=?, apellidos=?, email=? WHERE id=?',
      [nombre, apellidos, email, id]
    );
    return res.json({ id, nombre, apellidos, email });
  }
  const [result] = await pool.query(
    'INSERT INTO usuarios (nombre, apellidos, email) VALUES (?, ?, ?)',
    [nombre, apellidos, email]
  );
  res.json({ id: result.insertId, nombre, apellidos, email });
});

router.put('/:id', async (req, res) => {
  const pool = getDb();
  const { nombre = 'n/a', apellidos = 'n/a', email = 'n/a' } = req.body;
  await pool.query(
    'UPDATE usuarios SET nombre=?, apellidos=?, email=? WHERE id=?',
    [nombre, apellidos, email, req.params.id]
  );
  res.json({ id: parseInt(req.params.id, 10), nombre, apellidos, email });
});

router.delete('/:id', async (req, res) => {
  const pool = getDb();
  const id = req.params.id;
  if (id === '1') {
    return res.status(400).json({ message: 'Usuario por defecto no eliminable' });
  }
  if (req.query.confirm !== 'true') {
    const [pmtdeRows] = await pool.query(
      'SELECT COUNT(*) AS pmtde FROM pmtde WHERE propietario_id=?',
      [id]
    );
    const pmtde = pmtdeRows[0].pmtde;
    const [programasRespRows] = await pool.query(
      'SELECT COUNT(*) AS programasResp FROM programas_guardarrail WHERE responsable_id=?',
      [id]
    );
    const programasResp = programasRespRows[0].programasResp;
    const [planesRespRows] = await pool.query(
      'SELECT COUNT(*) AS planesResp FROM planes_estrategicos WHERE responsable_id=?',
      [id]
    );
    const planesResp = planesRespRows[0].planesResp;
    const [progExpRows] = await pool.query(
      'SELECT COUNT(*) AS progExp FROM programa_guardarrail_expertos WHERE usuario_id=?',
      [id]
    );
    const progExp = progExpRows[0].progExp;
    const [planExpRows] = await pool.query(
      'SELECT COUNT(*) AS planExp FROM plan_estrategico_expertos WHERE usuario_id=?',
      [id]
    );
    const planExp = planExpRows[0].planExp;
    return res.status(400).json({
      message: 'Confirmar eliminación',
      cascades: { pmtde, programasResp, planesResp, progExp, planExp },
    });
  }
  const [pmtdeRows] = await pool.query('SELECT id FROM pmtde WHERE propietario_id=?', [id]);
  for (const row of pmtdeRows) {
    const pmtdeId = row.id;
    const [pgRows] = await pool.query('SELECT id FROM programas_guardarrail WHERE pmtde_id=?', [pmtdeId]);
    if (pgRows.length) {
      const pgIds = pgRows.map((r) => r.id);
      await pool.query('DELETE FROM programa_guardarrail_expertos WHERE programa_id IN (?)', [pgIds]);
      await pool.query('DELETE FROM programas_guardarrail WHERE id IN (?)', [pgIds]);
    }
    const [planRows] = await pool.query('SELECT id FROM planes_estrategicos WHERE pmtde_id=?', [pmtdeId]);
    if (planRows.length) {
      const planIds = planRows.map((r) => r.id);
      await pool.query('DELETE FROM plan_estrategico_expertos WHERE plan_id IN (?)', [planIds]);
      await pool.query('DELETE FROM planes_estrategicos WHERE id IN (?)', [planIds]);
    }
    await pool.query('DELETE FROM pmtde WHERE id=?', [pmtdeId]);
  }
  await pool.query('DELETE FROM programa_guardarrail_expertos WHERE usuario_id=?', [id]);
  await pool.query('DELETE FROM plan_estrategico_expertos WHERE usuario_id=?', [id]);
  await pool.query('DELETE FROM programas_guardarrail WHERE responsable_id=?', [id]);
  await pool.query('DELETE FROM planes_estrategicos WHERE responsable_id=?', [id]);
  await pool.query('DELETE FROM usuarios WHERE id=?', [id]);
  res.sendStatus(204);
});

module.exports = router;
