const crypto = require('crypto');

function generateResetToken() {
  // RawToken will be emailed to user; we store only the hash
  const rawToken = crypto.randomBytes(32).toString('hex'); // 64 hex chars
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  return { rawToken, tokenHash };
}

module.exports = { generateResetToken };