const express = require('express');
const { getDb } = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  const pool = getDb();
  const [rows] = await pool.query('SELECT id, codigo, pmtde_id, nombre, descripcion, responsable_id FROM programas_guardarrail');
  if (rows.length === 0) return res.json([]);

  const programaIds = rows.map((r) => r.id);
  const pmtdeIds = Array.from(new Set(rows.map((r) => r.pmtde_id)));
  const userIds = new Set(rows.map((r) => r.responsable_id));

  const [expertRows] = await pool.query(
    'SELECT programa_id, usuario_id FROM programa_guardarrail_expertos WHERE programa_id IN (?)',
    [programaIds]
  );
  expertRows.forEach((er) => userIds.add(er.usuario_id));

  const [usuariosRows] = userIds.size
    ? await pool.query('SELECT id, nombre, apellidos, email FROM usuarios WHERE id IN (?)', [Array.from(userIds)])
    : [[], []];
  const usuariosMap = {};
  usuariosRows.forEach((u) => {
    usuariosMap[u.id] = { id: u.id, nombre: u.nombre, apellidos: u.apellidos, email: u.email };
  });

  const [pmtdeRows] = pmtdeIds.length
    ? await pool.query('SELECT id, nombre, descripcion, propietario_id FROM pmtde WHERE id IN (?)', [pmtdeIds])
    : [[], []];
  const pmtdeMap = {};
  pmtdeRows.forEach((p) => {
    pmtdeMap[p.id] = {
      id: p.id,
      nombre: p.nombre,
      descripcion: p.descripcion,
      propietario: usuariosMap[p.propietario_id] || null,
    };
  });

  const result = rows.map((r) => ({
    id: r.id,
    codigo: r.codigo,
    pmtde: pmtdeMap[r.pmtde_id] || null,
    nombre: r.nombre,
    descripcion: r.descripcion,
    responsable: usuariosMap[r.responsable_id] || null,
    expertos: expertRows
      .filter((er) => er.programa_id === r.id)
      .map((er) => usuariosMap[er.usuario_id])
      .filter(Boolean),
  }));

  res.json(result);
});

router.post('/', async (req, res) => {
  const pool = getDb();
  const pmtdeId = req.body.pmtde && req.body.pmtde.id ? req.body.pmtde.id : 1;
  const codigo = (req.body.codigo || 'N/A').toUpperCase().slice(0, 8);
  const nombre = req.body.nombre || 'n/a';
  const descripcion = req.body.descripcion || 'n/a';
  const respId =
    req.body.responsable && req.body.responsable.id ? req.body.responsable.id : 1;
  const id = req.body.id;
  if (id) {
    await pool.query(
      'UPDATE programas_guardarrail SET codigo=?, pmtde_id=?, nombre=?, descripcion=?, responsable_id=? WHERE id=?',
      [codigo, pmtdeId, nombre, descripcion, respId, id]
    );
    await pool.query('DELETE FROM programa_guardarrail_expertos WHERE programa_id=?', [id]);
    if (Array.isArray(req.body.expertos)) {
      for (const exp of req.body.expertos) {
        const userId = exp && exp.id ? exp.id : 1;
        await pool.query(
          'INSERT INTO programa_guardarrail_expertos (programa_id, usuario_id) VALUES (?, ?)',
          [id, userId]
        );
      }
    }
    return res.json({ id, codigo, ...req.body });
  }
  const [result] = await pool.query(
    'INSERT INTO programas_guardarrail (codigo, pmtde_id, nombre, descripcion, responsable_id) VALUES (?, ?, ?, ?, ?)',
    [codigo, pmtdeId, nombre, descripcion, respId]
  );
  const newId = result.insertId;
  if (Array.isArray(req.body.expertos)) {
    for (const exp of req.body.expertos) {
      const userId = exp && exp.id ? exp.id : 1;
      await pool.query(
        'INSERT INTO programa_guardarrail_expertos (programa_id, usuario_id) VALUES (?, ?)',
        [newId, userId]
      );
    }
  }
  res.json({ id: newId, codigo, ...req.body });
});

router.put('/:id', async (req, res) => {
  const pool = getDb();
  const pmtdeId = req.body.pmtde && req.body.pmtde.id ? req.body.pmtde.id : 1;
  const codigo = (req.body.codigo || 'N/A').toUpperCase().slice(0, 8);
  const nombre = req.body.nombre || 'n/a';
  const descripcion = req.body.descripcion || 'n/a';
  const respId = req.body.responsable && req.body.responsable.id ? req.body.responsable.id : 1;
  await pool.query(
    'UPDATE programas_guardarrail SET codigo=?, pmtde_id=?, nombre=?, descripcion=?, responsable_id=? WHERE id=?',
    [codigo, pmtdeId, nombre, descripcion, respId, req.params.id]
  );
  await pool.query('DELETE FROM programa_guardarrail_expertos WHERE programa_id=?', [req.params.id]);
  if (Array.isArray(req.body.expertos)) {
    for (const exp of req.body.expertos) {
      const userId = exp && exp.id ? exp.id : 1;
      await pool.query('INSERT INTO programa_guardarrail_expertos (programa_id, usuario_id) VALUES (?, ?)', [req.params.id, userId]);
    }
  }
  res.json({ id: parseInt(req.params.id, 10), codigo, ...req.body });
});

router.delete('/:id', async (req, res) => {
  const pool = getDb();
  const id = req.params.id;
  if (req.query.confirm !== 'true') {
    const [rows] = await pool.query(
      'SELECT COUNT(*) AS expertos FROM programa_guardarrail_expertos WHERE programa_id=?',
      [id]
    );
    return res.status(400).json({
      message: 'Confirmar eliminación',
      cascades: { expertos: rows[0].expertos },
    });
  }
  await pool.query('DELETE FROM programa_guardarrail_expertos WHERE programa_id=?', [id]);
  await pool.query('DELETE FROM programas_guardarrail WHERE id=?', [id]);
  res.sendStatus(204);
});

module.exports = router;

