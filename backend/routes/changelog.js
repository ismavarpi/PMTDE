const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const CHANGELOG_PATH = path.join(__dirname, '..', 'changelog.json');
const PAGE_SIZE = 25;

router.get('/', (req, res) => {
  const offset = parseInt(req.query.offset || '0', 10);
  fs.readFile(CHANGELOG_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'No se pudo leer el changelog' });
    let entries = [];
    try {
      entries = JSON.parse(data);
    } catch (e) {
      return res.status(500).json({ error: 'Changelog inválido' });
    }
    entries.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    const slice = entries.slice(offset, offset + PAGE_SIZE);
    res.json({ items: slice, hasMore: offset + PAGE_SIZE < entries.length });
  });
});

module.exports = router;
