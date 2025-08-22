const crypto = require('crypto');

function signToken(raw) {
  const hmac = crypto.createHmac('sha256', process.env.SESSION_SECRET || '');
  hmac.update(raw);
  const signature = hmac.digest('hex');
  return `${raw}.${signature}`;
}

function generateToken() {
  const raw = crypto.randomBytes(32).toString('hex');
  return signToken(raw);
}

function verifyToken(token) {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [raw, signature] = parts;
  const expected = crypto
    .createHmac('sha256', process.env.SESSION_SECRET || '')
    .update(raw)
    .digest('hex');
  return signature === expected ? raw : false;
}

module.exports = { signToken, generateToken, verifyToken };
