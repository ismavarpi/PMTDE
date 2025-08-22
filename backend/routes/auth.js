const express = require('express');
const ldap = require('ldapjs');
const crypto = require('crypto');
const { getDb } = require('../db');

const TOKEN_EXPIRATION_MS = (parseInt(process.env.SESSION_TTL, 10) || 3600) * 1000;

const router = express.Router();

router.get('/me', async (req, res) => {
  if (process.env.USE_AUTH === 'true') {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: 'No autorizado' });
    const db = getDb();
    const [rows] = await db.query('SELECT time FROM sesiones WHERE token=?', [token]);
    if (rows.length === 0) return res.status(401).json({ error: 'No autorizado' });
    const age = Date.now() - new Date(rows[0].time).getTime();
    if (age > TOKEN_EXPIRATION_MS) {
      await db.query('DELETE FROM sesiones WHERE token=?', [token]);
      return res.status(401).json({ error: 'Token caducado' });
    }
    return res.json({ user: null, useAuth: true });
  }
  res.json({ user: { username: 'anon' }, useAuth: false });
});

router.post('/login', (req, res) => {
  if (process.env.USE_AUTH !== 'true') {
    return res.status(200).json({ user: { username: 'anon' }, useAuth: false });
  }
  const { username, password } = req.body;
  const client = ldap.createClient({ url: process.env.LDAP_URL });
  client.bind(process.env.LDAP_BIND_DN, process.env.LDAP_BIND_PASSWORD, (err) => {
    if (err) return res.status(500).json({ error: 'LDAP bind failed' });
    const opts = {
      filter: `(uid=${username})`,
      scope: 'sub',
    };
    client.search(process.env.LDAP_BASE_DN, opts, (err, search) => {
      if (err) return res.status(500).json({ error: 'LDAP search failed' });
      let userDn = null;
      search.on('searchEntry', (entry) => {
        userDn = entry.object.dn;
      });
      search.on('end', () => {
        if (!userDn) return res.status(401).json({ error: 'Invalid credentials' });
        const userClient = ldap.createClient({ url: process.env.LDAP_URL });
        userClient.bind(userDn, password, (err) => {
          if (err) return res.status(401).json({ error: 'Invalid credentials' });
          const token = crypto.randomBytes(32).toString('hex');
          const db = getDb();
          const expirationThreshold = new Date(Date.now() - TOKEN_EXPIRATION_MS);
          db.query('DELETE FROM sesiones WHERE time < ?', [expirationThreshold])
            .then(() => db.query('INSERT INTO sesiones (token, `time`) VALUES (?, ?)', [token, new Date()]))
            .then(() => {
              res.json({ token, user: { username }, useAuth: true });
            });
        });
      });
    });
  });
});

router.post('/logout', async (req, res) => {
  const token = req.headers['authorization'];
  if (token) {
    const db = getDb();
    await db.query('DELETE FROM sesiones WHERE token=?', [token]);
  }
  res.json({ ok: true });
});

module.exports = router;
