const express = require('express');
const { getDb } = require('../db');

const router = express.Router();

router.get('/export', async (req, res) => {
  const db = getDb();
  const tables = [
    'parametros',
    'usuarios',
    'pmtde',
    'programas_guardarrail',
    'programa_guardarrail_expertos',
    'principios_guardarrail',
    'planes_estrategicos',
    'plan_estrategico_expertos',
    'principios_especificos',
    'objetivos_estrategicos',
    'objetivos_estrategicos_evidencias',
    'preferencias_usuario',
  ];
  let sql = '';
  for (const table of tables) {
    const [rows] = await db.query(`SELECT * FROM ${table}`);
    for (const row of rows) {
      const cols = Object.keys(row).map((c) => `\`${c}\``).join(', ');
      const vals = Object.values(row)
        .map((v) =>
          v === null
            ? 'NULL'
            : `'${(typeof v === 'object' ? JSON.stringify(v) : String(v)).replace(/'/g, "''")}'`
        )
        .join(', ');
      sql += `INSERT INTO ${table} (${cols}) VALUES (${vals});\n`;
    }
  }
  const [appNameRow] = await db.query(
    'SELECT valor FROM parametros WHERE nombre="Nombre de la aplicación"'
  );
  const appName = appNameRow[0] ? appNameRow[0].valor : 'aplicacion';
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const fileName = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())} ${pad(now.getHours())}${pad(now.getMinutes())} exportación de datos ${appName}.sql`;
  res.setHeader('Content-Type', 'application/sql');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
  res.send(sql);
});

router.post('/import', async (req, res) => {
  const { sql, tables } = req.body;
  const db = getDb();
  const summary = [];
  let logs = '';
  const importedIds = {};
  for (const t of tables) {
    importedIds[t] = new Set();
    summary.push({ entity: t, ok: 0, errors: 0 });
  }
  const insertRegex = /INSERT INTO `?(\w+)`? \(([^)]+)\) VALUES \(([^)]+)\);/g;
  let match;
  while ((match = insertRegex.exec(sql)) !== null) {
    const table = match[1];
    if (!tables.includes(table)) continue;
    const cols = match[2]
      .split(',')
      .map((c) => c.trim().replace(/`/g, ''));
    const rawVals = [];
    let buffer = '';
    let inString = false;
    for (let i = 0; i < match[3].length; i++) {
      const ch = match[3][i];
      if (ch === "'" && match[3][i + 1] === "'") {
        buffer += "''";
        i++;
        continue;
      }
      if (ch === "'") {
        inString = !inString;
      }
      if (ch === ',' && !inString) {
        rawVals.push(buffer);
        buffer = '';
        continue;
      }
      buffer += ch;
    }
    if (buffer) rawVals.push(buffer);
    const vals = rawVals.map((v) => {
      const trimmed = v.trim();
      if (trimmed === 'NULL') return null;
      return trimmed.replace(/^'(.*)'$/s, '$1').replace(/''/g, "'");
    });
    const obj = {};
    cols.forEach((c, i) => {
      obj[c] = vals[i];
    });
    const id = obj.id;
    if (id !== undefined) {
      importedIds[table].add(id);
    }
    try {
      const placeholders = cols.map(() => '?').join(', ');
      const updates = cols.map((c) => `${c}=VALUES(${c})`).join(', ');
      await db.query(
        `INSERT INTO ${table} (${cols.join(', ')}) VALUES (${placeholders}) ON DUPLICATE KEY UPDATE ${updates}`,
        Object.values(obj)
      );
      summary.find((s) => s.entity === table).ok++;
    } catch (e) {
      logs += `${table} id ${id}: ${e.message}\n`;
      summary.find((s) => s.entity === table).errors++;
    }
  }
  for (const t of tables) {
    const ids = Array.from(importedIds[t]);
    if (ids.length) {
      await db.query(
        `DELETE FROM ${t} WHERE id NOT IN (${ids.map(() => '?').join(',')})`,
        ids
      );
    }
  }
  res.json({ summary, logs });
});

module.exports = router;
