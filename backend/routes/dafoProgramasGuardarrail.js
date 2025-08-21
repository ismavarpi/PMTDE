const express = require('express');
const { getDb } = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  const pool = getDb();
  const [rows] = await pool.query(`
    SELECT d.id, d.tipo, d.titulo, d.descripcion, d.programa_id,
           p.codigo AS programa_codigo, p.nombre AS programa_nombre
    FROM dafo_pgr d
    JOIN programas_guardarrail p ON d.programa_id = p.id
  `);
  const result = rows.map((r) => ({
    id: r.id,
    tipo: r.tipo,
    titulo: r.titulo,
    descripcion: r.descripcion,
    programa: {
      id: r.programa_id,
      codigo: r.programa_codigo,
      nombre: r.programa_nombre,
    },
  }));
  res.json(result);
});

async function saveDafo(req, res) {
  const pool = getDb();
  const programaId = req.body.programa && req.body.programa.id ? req.body.programa.id : 1;
  const tipo = ['D', 'A', 'F', 'O'].includes(req.body.tipo) ? req.body.tipo : 'D';
  const titulo = req.body.titulo || 'n/a';
  const descripcion = req.body.descripcion || 'n/a';
  const id = req.body.id;
  if (id) {
    await pool.query(
      'UPDATE dafo_pgr SET programa_id=?, tipo=?, titulo=?, descripcion=? WHERE id=?',
      [programaId, tipo, titulo, descripcion, id]
    );
    return res.json({ id, programa: { id: programaId }, tipo, titulo, descripcion });
  }
  const [result] = await pool.query(
    'INSERT INTO dafo_pgr (programa_id, tipo, titulo, descripcion) VALUES (?, ?, ?, ?)',
    [programaId, tipo, titulo, descripcion]
  );
  res.json({ id: result.insertId, programa: { id: programaId }, tipo, titulo, descripcion });
}

router.post('/', saveDafo);
router.put('/:id', (req, res) => {
  req.body.id = parseInt(req.params.id, 10);
  return saveDafo(req, res);
});

router.delete('/:id', async (req, res) => {
  const pool = getDb();
  const id = req.params.id;
  if (req.query.confirm !== 'true') {
    return res.status(400).json({ message: 'Confirmar eliminación', cascades: {} });
  }
  await pool.query('DELETE FROM dafo_pgr WHERE id=?', [id]);
  res.sendStatus(204);
});

module.exports = router;
