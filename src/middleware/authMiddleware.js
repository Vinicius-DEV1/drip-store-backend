const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'drip_store_secret_key';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token de autorização não fornecido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token de autorização inválido ou expirado' });
  }
}

module.exports = authMiddleware;
