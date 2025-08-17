const express = require('express');
const ldap = require('ldapjs');

const router = express.Router();

router.get('/me', (req, res) => {
  if (process.env.USE_AUTH === 'true') {
    res.json({ user: req.session.user || null, useAuth: true });
  } else {
    res.json({ user: { username: 'anon' }, useAuth: false });
  }
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
          req.session.user = { username };
          res.json({ user: { username }, useAuth: true });
        });
      });
    });
  });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

module.exports = router;
