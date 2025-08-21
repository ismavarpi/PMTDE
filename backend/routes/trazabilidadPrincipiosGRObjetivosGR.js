const express = require('express');
const { getDb } = require('../db');

const router = express.Router();

router.get('/:programaId', async (req, res) => {
  const pool = getDb();
  const programaId = parseInt(req.params.programaId, 10) || 1;
  const [principiosGR] = await pool.query(
    'SELECT id, codigo, titulo FROM principios_guardarrail WHERE programa_id=?',
    [programaId]
  );
  const [objetivosGR] = await pool.query(
    'SELECT id, codigo, titulo FROM objetivos_guardarrail WHERE programa_id=?',
    [programaId]
  );
  const [relaciones] = await pool.query(
    'SELECT principioGR_id, objetivoGR_id, nivel FROM principioGR_objetivoGR_trazabilidad WHERE programa_id=?',
    [programaId]
  );
  res.json({ principiosGR, objetivosGR, relaciones });
});

router.post('/', async (req, res) => {
  const pool = getDb();
  const programaId = req.body.programaId || 1;
  const principioGRId = req.body.principioGRId || 1;
  const objetivoGRId = req.body.objetivoGRId || 1;
  const nivel = req.body.nivel != null ? req.body.nivel : 0;
  await pool.query(
    `INSERT INTO principioGR_objetivoGR_trazabilidad (programa_id, principioGR_id, objetivoGR_id, nivel)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE nivel=VALUES(nivel)`,
    [programaId, principioGRId, objetivoGRId, nivel]
  );
  res.json({ programaId, principioGRId, objetivoGRId, nivel });
});

module.exports = router;
