const express = require('express');
const { getDb } = require('../db');

const router = express.Router();

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
  const propietarioId = req.body.propietario && req.body.propietario.id ? req.body.propietario.id : 1;
  const [existing] = await pool.query(
    'SELECT id FROM pmtde WHERE nombre=? AND descripcion=? AND propietario_id=?',
    [nombre, descripcion, propietarioId]
  );
  let id;
  if (existing.length > 0) {
    id = existing[0].id;
    await pool.query('UPDATE pmtde SET nombre=?, descripcion=?, propietario_id=? WHERE id=?', [nombre, descripcion, propietarioId, id]);
  } else {
    const [result] = await pool.query('INSERT INTO pmtde (nombre, descripcion, propietario_id) VALUES (?, ?, ?)', [nombre, descripcion, propietarioId]);
    id = result.insertId;
  }
  const [ownerRows] = await pool.query('SELECT id, nombre, apellidos, email FROM usuarios WHERE id=?', [propietarioId]);
  const propietario = ownerRows[0] || null;
  res.json({ id, nombre, descripcion, propietario });
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
  await pool.query('DELETE FROM pmtde WHERE id=?', [req.params.id]);
  res.sendStatus(204);
});

module.exports = router;

