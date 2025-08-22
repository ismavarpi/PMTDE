const express = require('express');
const ldap = require('ldapjs');
const crypto = require('crypto');

const router = express.Router();
const tokens = new Map();
const sessionTtl = parseInt(process.env.SESSION_TTL, 10) || 3600;

function cleanupTokens() {
  const now = Date.now();
  for (const [token, info] of tokens.entries()) {
    if (now - info.createdAt > sessionTtl * 1000) {
      tokens.delete(token);
    }
  }
}

router.get('/me', (req, res) => {
  cleanupTokens();
  if (process.env.USE_AUTH === 'true') {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');
    const data = tokens.get(token);
    if (data && Date.now() - data.createdAt <= sessionTtl * 1000) {
      return res.json({ user: data.user, useAuth: true });
    }
    return res.json({ user: null, useAuth: true });
  }
  res.json({ user: { username: 'anon' }, useAuth: false });
});

router.post('/login', (req, res) => {
  cleanupTokens();
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
          const user = { username };
          const token = crypto.randomBytes(16).toString('hex');
          tokens.set(token, { user, createdAt: Date.now() });
          req.session.user = user;
          res.json({ user, token, useAuth: true });
        });
      });
    });
  });
});

router.post('/logout', (req, res) => {
  cleanupTokens();
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (token) tokens.delete(token);
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

module.exports = router;
