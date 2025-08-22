const express = require('express');
const { getDb } = require('../db');

const router = express.Router();

async function generateCodigo(programaId) {
  const pool = getDb();
  const [progRows] = await pool.query('SELECT codigo FROM programas_guardarrail WHERE id=?', [programaId]);
  const progCode = progRows.length ? progRows[0].codigo : 'N/A';
  const [rows] = await pool.query(
    'SELECT MAX(CAST(SUBSTRING_INDEX(codigo, ".P", -1) AS UNSIGNED)) AS maxnum FROM principios_guardarrail WHERE programa_id=?',
    [programaId]
  );
  const next = (rows[0].maxnum || 0) + 1;
  return `${progCode}.P${String(next).padStart(2, '0')}`;
}

router.get('/', async (req, res) => {
  const pool = getDb();
  const active = req.session.activePmtdeId;
  if (!active) return res.json([]);
  const [rows] = await pool.query(
    `SELECT pg.id, pg.codigo, pg.titulo, pg.descripcion, pg.programa_id,
            pr.codigo AS programa_codigo, pr.nombre AS programa_nombre
       FROM principios_guardarrail pg
       JOIN programas_guardarrail pr ON pg.programa_id = pr.id
       WHERE pr.pmtde_id=?`,
    [active]
  );
  const result = rows.map((r) => ({
    id: r.id,
    codigo: r.codigo,
    titulo: r.titulo,
    descripcion: r.descripcion,
    programa: { id: r.programa_id, codigo: r.programa_codigo, nombre: r.programa_nombre },
  }));
  res.json(result);
});

router.post('/', async (req, res) => {
  const pool = getDb();
  const programaId = req.body.programa && req.body.programa.id ? req.body.programa.id : 1;
  const titulo = req.body.titulo || 'n/a';
  const descripcion = req.body.descripcion || 'n/a';
  const codigo = await generateCodigo(programaId);
  const [result] = await pool.query(
    'INSERT INTO principios_guardarrail (programa_id, codigo, titulo, descripcion) VALUES (?, ?, ?, ?)',
    [programaId, codigo, titulo, descripcion]
  );
  res.json({ id: result.insertId, codigo, ...req.body });
});

router.put('/:id', async (req, res) => {
  const pool = getDb();
  const programaId = req.body.programa && req.body.programa.id ? req.body.programa.id : 1;
  const titulo = req.body.titulo || 'n/a';
  const descripcion = req.body.descripcion || 'n/a';
  let codigo = req.body.codigo || 'n/a';
  const [current] = await pool.query('SELECT programa_id FROM principios_guardarrail WHERE id=?', [req.params.id]);
  const oldProg = current.length ? current[0].programa_id : programaId;
  if (programaId !== oldProg) {
    codigo = await generateCodigo(programaId);
  }
  await pool.query(
    'UPDATE principios_guardarrail SET programa_id=?, codigo=?, titulo=?, descripcion=? WHERE id=?',
    [programaId, codigo, titulo, descripcion, req.params.id]
  );
  res.json({ id: parseInt(req.params.id, 10), codigo, ...req.body });
});

router.delete('/:id', async (req, res) => {
  const pool = getDb();
  if (req.query.confirm !== 'true') {
    return res.status(400).json({ message: 'Confirmar eliminación' });
  }
  const [[current]] = await pool.query('SELECT programa_id FROM principios_guardarrail WHERE id=?', [req.params.id]);
  await pool.query('DELETE FROM principios_guardarrail WHERE id=?', [req.params.id]);
  if (current) {
    const [[prog]] = await pool.query('SELECT codigo FROM programas_guardarrail WHERE id=?', [current.programa_id]);
    const progCode = prog ? prog.codigo : 'n/a';
    const [rows] = await pool.query(
      "SELECT id FROM principios_guardarrail WHERE programa_id=? ORDER BY CAST(SUBSTRING_INDEX(codigo, '.P', -1) AS UNSIGNED)",
      [current.programa_id]
    );
    for (let i = 0; i < rows.length; i++) {
      const newCode = `${progCode}.P${String(i + 1).padStart(2, '0')}`;
      await pool.query('UPDATE principios_guardarrail SET codigo=? WHERE id=?', [newCode, rows[i].id]);
    }
  }
  res.sendStatus(204);
});

module.exports = router;
