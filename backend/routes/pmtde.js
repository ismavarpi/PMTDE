const express = require('express');
const { getDb } = require('../db');

const router = express.Router();
const entity = 'pmtde';

router.get('/', async (req, res) => {
  const pool = getDb();
  const [rows] = await pool.query('SELECT id, data FROM entities WHERE entity=?', [entity]);
  res.json(rows.map((r) => ({ id: r.id, ...r.data })));
});

router.post('/', async (req, res) => {
  const pool = getDb();
  const data = JSON.stringify(req.body);
  const [existing] = await pool.query('SELECT id FROM entities WHERE entity=? AND data=?', [entity, data]);
  if (existing.length > 0) {
    await pool.query('UPDATE entities SET data=? WHERE id=?', [data, existing[0].id]);
    res.json({ id: existing[0].id, ...req.body });
  } else {
    const [result] = await pool.query('INSERT INTO entities (entity, data) VALUES (?, ?)', [entity, data]);
    res.json({ id: result.insertId, ...req.body });
  }
});

router.put('/:id', async (req, res) => {
  const pool = getDb();
  await pool.query('UPDATE entities SET data=? WHERE entity=? AND id=?', [
    JSON.stringify(req.body),
    entity,
    req.params.id,
  ]);
  res.json({ id: parseInt(req.params.id, 10), ...req.body });
});

router.delete('/:id', async (req, res) => {
  const pool = getDb();
  await pool.query('DELETE FROM entities WHERE entity=? AND id=?', [entity, req.params.id]);
  res.sendStatus(204);
});

module.exports = router;
