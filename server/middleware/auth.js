const { verifyToken } = require('../utils/auth');

const requireAuth = (req, res, next) => {
  const authorization = req.headers.authorization || '';
  const claims = authorization.startsWith('Bearer ')
    ? verifyToken(authorization.slice(7))
    : null;

  if (!claims) {
    return res.status(401).json({ message: 'Please sign in to continue' });
  }

  req.user = claims;
  next();
};

const requireAdmin = (req, res, next) => {
  requireAuth(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Administrator access is required' });
    }
    next();
  });
};

module.exports = { requireAuth, requireAdmin };