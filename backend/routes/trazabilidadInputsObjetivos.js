const express = require('express');
const { getDb } = require('../db');

const router = express.Router();

router.get('/:planId', async (req, res) => {
  const pool = getDb();
  const planId = parseInt(req.params.planId, 10) || 1;
  const [inputs] = await pool.query(
    'SELECT id, codigo, titulo, descripcion FROM inputs'
  );
  const [objetivos] = await pool.query(
    'SELECT id, codigo, titulo, descripcion FROM objetivos_estrategicos WHERE plan_id=?',
    [planId]
  );
  const [relaciones] = await pool.query(
    'SELECT input_id, objetivoE_id, nivel FROM inputs_objetivosE_trazabilidad WHERE plan_id=?',
    [planId]
  );
  res.json({ inputs, objetivos, relaciones });
});

router.post('/', async (req, res) => {
  const pool = getDb();
  const planId = req.body.planId || 1;
  const inputId = req.body.inputId || 1;
  const objetivoEId = req.body.objetivoEId || 1;
  const nivel = req.body.nivel != null ? req.body.nivel : 0;
  await pool.query(
    `INSERT INTO inputs_objetivosE_trazabilidad (plan_id, input_id, objetivoE_id, nivel)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE nivel=VALUES(nivel)`,
    [planId, inputId, objetivoEId, nivel]
  );
  res.json({ planId, inputId, objetivoEId, nivel });
});

module.exports = router;
