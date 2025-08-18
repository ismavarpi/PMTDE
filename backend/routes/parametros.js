const express = require('express');
const router = express.Router();
const { getDb } = require('../db');

// List all parameters
router.get('/', async (req, res) => {
  const [rows] = await getDb().query(
    'SELECT id, nombre, valor, valor_defecto FROM parametros'
  );
  res.json(rows);
});

// Update parameter value
router.put('/:id', async (req, res) => {
  const { valor } = req.body;
  if (valor == null) {
    return res.status(400).json({ message: 'Valor es obligatorio' });
  }
  await getDb().query('UPDATE parametros SET valor=? WHERE id=?', [valor, req.params.id]);
  const [rows] = await getDb().query(
    'SELECT id, nombre, valor, valor_defecto FROM parametros WHERE id=?',
    [req.params.id]
  );
  res.json(rows[0]);
});

// Reset parameter to default
router.post('/:id/reset', async (req, res) => {
  await getDb().query(
    'UPDATE parametros SET valor=valor_defecto WHERE id=?',
    [req.params.id]
  );
  const [rows] = await getDb().query(
    'SELECT id, nombre, valor, valor_defecto FROM parametros WHERE id=?',
    [req.params.id]
  );
  res.json(rows[0]);
});

module.exports = router;
