const jwt = require('jsonwebtoken');
const { secret } = require('../config/jwt');
const ar = require('../utils/ar');

const protect = (roles = []) => (req, res, next) => {
  const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: ar.unauthorized });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;

    if (roles.length && !roles.includes(decoded.role)) {
      return res.status(403).json({ success: false, message: ar.forbidden });
    }

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: ar.unauthorized });
  }
};

module.exports = protect;