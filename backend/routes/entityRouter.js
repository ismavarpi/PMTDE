const express = require('express');
const { getDb } = require('../db');

function createEntityRouter(entity) {
  const router = express.Router();

  router.get('/', async (req, res) => {
    const pool = getDb();
    const [rows] = await pool.query('SELECT id, data FROM entities WHERE entity=?', [entity]);
    res.json(rows.map((r) => ({ id: r.id, ...r.data })));
  });

  router.post('/', async (req, res) => {
    const pool = getDb();
    const [result] = await pool.query('INSERT INTO entities (entity, data) VALUES (?, ?)', [
      entity,
      JSON.stringify(req.body),
    ]);
    res.json({ id: result.insertId, ...req.body });
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

  return router;
}

module.exports = createEntityRouter;
