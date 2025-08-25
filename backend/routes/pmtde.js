const express = require('express');
const { getDb } = require('../db');

const router = express.Router();

// Active PMTDE management
router.get('/active', async (req, res) => {
  if (!req.session.activePmtdeId) {
    if (process.env.USE_AUTH !== 'true') {
      const pool = getDb();
      const [rows] = await pool.query('SELECT id, nombre FROM pmtde ORDER BY id LIMIT 1');
      const first = rows[0] || null;
      if (first) req.session.activePmtdeId = first.id;
      return res.json(first);
    }
    return res.json(null);
  }
  const pool = getDb();
  const [rows] = await pool.query('SELECT id, nombre FROM pmtde WHERE id=?', [req.session.activePmtdeId]);
  res.json(rows[0] || null);
});

router.post('/active', (req, res) => {
  req.session.activePmtdeId = req.body.id;
  res.json({ ok: true });
});

router.get('/', async (req, res) => {
  const pool = getDb();
  const [rows] = await pool.query(
    `SELECT p.id, p.nombre, p.descripcion, u.id AS propietario_id, u.nombre AS propietario_nombre, u.apellidos AS propietario_apellidos, u.email AS propietario_email
     FROM pmtde p LEFT JOIN usuarios u ON p.propietario_id = u.id`
  );
  res.json(
    rows.map((r) => ({
      id: r.id,
      nombre: r.nombre,
      descripcion: r.descripcion,
      propietario: r.propietario_id
        ? {
            id: r.propietario_id,
            nombre: r.propietario_nombre,
            apellidos: r.propietario_apellidos,
            email: r.propietario_email,
          }
        : null,
    }))
  );
});

router.post('/', async (req, res) => {
  const pool = getDb();
  const nombre = req.body.nombre || 'n/a';
  const descripcion = req.body.descripcion || 'n/a';
  const propietarioId =
    req.body.propietario && req.body.propietario.id ? req.body.propietario.id : 1;
  const id = req.body.id;
  if (id) {
    await pool.query(
      'UPDATE pmtde SET nombre=?, descripcion=?, propietario_id=? WHERE id=?',
      [nombre, descripcion, propietarioId, id]
    );
    const [ownerRows] = await pool.query(
      'SELECT id, nombre, apellidos, email FROM usuarios WHERE id=?',
      [propietarioId]
    );
    const propietario = ownerRows[0] || null;
    return res.json({ id, nombre, descripcion, propietario });
  }
  const [result] = await pool.query(
    'INSERT INTO pmtde (nombre, descripcion, propietario_id) VALUES (?, ?, ?)',
    [nombre, descripcion, propietarioId]
  );
  const [ownerRows] = await pool.query(
    'SELECT id, nombre, apellidos, email FROM usuarios WHERE id=?',
    [propietarioId]
  );
  const propietario = ownerRows[0] || null;
  res.json({ id: result.insertId, nombre, descripcion, propietario });
});

router.put('/:id', async (req, res) => {
  const pool = getDb();
  const nombre = req.body.nombre || 'n/a';
  const descripcion = req.body.descripcion || 'n/a';
  const propietarioId = req.body.propietario && req.body.propietario.id ? req.body.propietario.id : 1;
  await pool.query('UPDATE pmtde SET nombre=?, descripcion=?, propietario_id=? WHERE id=?', [nombre, descripcion, propietarioId, req.params.id]);
  const [ownerRows] = await pool.query('SELECT id, nombre, apellidos, email FROM usuarios WHERE id=?', [propietarioId]);
  const propietario = ownerRows[0] || null;
  res.json({ id: parseInt(req.params.id, 10), nombre, descripcion, propietario });
});

router.delete('/:id', async (req, res) => {
  const pool = getDb();
  const id = req.params.id;
  if (req.query.confirm !== 'true') {
    const [pgCountRows] = await pool.query(
      'SELECT COUNT(*) AS programas FROM programas_guardarrail WHERE pmtde_id=?',
      [id]
    );
    const programas = pgCountRows[0].programas;
    const [planCountRows] = await pool.query(
      'SELECT COUNT(*) AS planes FROM planes_estrategicos WHERE pmtde_id=?',
      [id]
    );
    const planes = planCountRows[0].planes;
    return res.status(400).json({
      message: 'Confirmar eliminación',
      cascades: { programas, planes },
    });
  }
  const [pgRows] = await pool.query('SELECT id FROM programas_guardarrail WHERE pmtde_id=?', [id]);
  if (pgRows.length) {
    const pgIds = pgRows.map((r) => r.id);
    await pool.query('DELETE FROM programa_guardarrail_expertos WHERE programa_id IN (?)', [pgIds]);
    await pool.query('DELETE FROM programas_guardarrail WHERE id IN (?)', [pgIds]);
  }
  const [planRows] = await pool.query('SELECT id FROM planes_estrategicos WHERE pmtde_id=?', [id]);
  if (planRows.length) {
    const planIds = planRows.map((r) => r.id);
    await pool.query('DELETE FROM plan_estrategico_expertos WHERE plan_id IN (?)', [planIds]);
    await pool.query('DELETE FROM planes_estrategicos WHERE id IN (?)', [planIds]);
  }
  await pool.query('DELETE FROM pmtde WHERE id=?', [id]);
  res.sendStatus(204);
});

module.exports = router;

