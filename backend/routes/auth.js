const express = require('express');
const ldap = require('ldapjs');
const { getDb } = require('../db');
const { generateToken, verifyToken } = require('../token');

const TOKEN_EXPIRATION_MS = (parseInt(process.env.SESSION_TTL, 10) || 3600) * 1000;

const router = express.Router();

router.get('/me', async (req, res) => {
  if (process.env.USE_AUTH === 'true') {
    const token = req.headers['authorization'];
    const raw = verifyToken(token);
    if (!raw) return res.status(401).json({ error: 'No autorizado' });
    const db = getDb();
    const [rows] = await db.query('SELECT username, time FROM sesiones WHERE token=?', [token]);
    if (rows.length === 0) return res.status(401).json({ error: 'No autorizado' });
    const age = Date.now() - new Date(rows[0].time).getTime();
    if (age > TOKEN_EXPIRATION_MS) {
      await db.query('DELETE FROM sesiones WHERE token=?', [token]);
      return res.status(401).json({ error: 'Token caducado' });
    }
    return res.json({ user: { username: rows[0].username }, useAuth: true });
  }
  res.json({ user: { username: 'anon' }, useAuth: false });
});

router.post('/login', async (req, res) => {
  if (process.env.USE_AUTH !== 'true') {
    return res.status(200).json({ user: { username: 'anon' }, useAuth: false });
  }
  const { username, password, ssoToken } = req.body;
  const db = getDb();
  const expirationThreshold = new Date(Date.now() - TOKEN_EXPIRATION_MS);
  await db.query('DELETE FROM sesiones WHERE time < ?', [expirationThreshold]);

  if (ssoToken) {
    const raw = verifyToken(ssoToken);
    if (!raw) return res.status(401).json({ error: 'Invalid token' });
    const [rows] = await db.query('SELECT username, time FROM sesiones WHERE token=?', [ssoToken]);
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid token' });
    const age = Date.now() - new Date(rows[0].time).getTime();
    if (age > TOKEN_EXPIRATION_MS) {
      await db.query('DELETE FROM sesiones WHERE token=?', [ssoToken]);
      return res.status(401).json({ error: 'Token caducado' });
    }
    return res.json({ token: ssoToken, user: { username: rows[0].username }, useAuth: true });
  }

  if (!process.env.LDAP_URL || !process.env.LDAP_URL.startsWith('ldaps://')) {
    return res.status(500).json({ error: 'LDAP_URL must use LDAPS' });
  }

  const userDn = `uid=${username},${process.env.LDAP_BASE_DN}`;
  const client = ldap.createClient({ url: process.env.LDAP_URL, tlsOptions: { rejectUnauthorized: false } });
  client.bind(userDn, password, async (err) => {
    if (err) return res.status(401).json({ error: 'Invalid credentials' });
    const token = generateToken();
    await db.query('INSERT INTO sesiones (token, `time`, username) VALUES (?, ?, ?)', [token, new Date(), username]);
    res.json({ token, user: { username }, useAuth: true });
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
