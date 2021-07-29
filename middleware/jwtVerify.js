const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { token } = req.cookies || {};
  try {
    jwt.verify(token, process.env.JWT_KEY);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) return res.status(401).json({ Error: 'Unauthorized 401' });
    return res.status(400).json({ Error: 'Bad Request 400' });
  }
  next();
};