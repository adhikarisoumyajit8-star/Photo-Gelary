const crypto = require('crypto');

let tokenSecret = null;

const getTokenSecret = () => {
  if (tokenSecret) return tokenSecret;
  tokenSecret = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');
  if (!process.env.JWT_SECRET) {
    console.warn('JWT_SECRET is not set; sessions will be invalidated when the server restarts.');
  }
  return tokenSecret;
};

const hashPassword = (password) => new Promise((resolve, reject) => {
  const salt = crypto.randomBytes(16).toString('hex');
  crypto.scrypt(password, salt, 64, (error, derivedKey) => {
    if (error) return reject(error);
    resolve(`${salt}:${derivedKey.toString('hex')}`);
  });
});

const verifyPassword = (password, storedHash) => new Promise((resolve, reject) => {
  const [salt, key] = (storedHash || '').split(':');
  if (!salt || !key) return resolve(false);

  crypto.scrypt(password, salt, 64, (error, derivedKey) => {
    if (error) return reject(error);
    const expectedKey = Buffer.from(key, 'hex');
    resolve(expectedKey.length === derivedKey.length && crypto.timingSafeEqual(expectedKey, derivedKey));
  });
});

const createToken = (user) => {
  const payload = Buffer.from(JSON.stringify({
    id: String(user._id || user.id),
    name: user.name,
    email: user.email,
    role: user.role,
    expiresAt: Date.now() + 8 * 60 * 60 * 1000,
  })).toString('base64url');
  const signature = crypto.createHmac('sha256', getTokenSecret()).update(payload).digest('base64url');
  return `${payload}.${signature}`;
};

const verifyToken = (token) => {
  const [payload, signature] = (token || '').split('.');
  if (!payload || !signature) return null;

  const expectedSignature = crypto.createHmac('sha256', getTokenSecret()).update(payload).digest();
  let receivedSignature;
  try {
    receivedSignature = Buffer.from(signature, 'base64url');
  } catch {
    return null;
  }

  if (receivedSignature.length !== expectedSignature.length || !crypto.timingSafeEqual(receivedSignature, expectedSignature)) {
    return null;
  }

  try {
    const claims = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return claims.expiresAt > Date.now() ? claims : null;
  } catch {
    return null;
  }
};

module.exports = { hashPassword, verifyPassword, createToken, verifyToken };