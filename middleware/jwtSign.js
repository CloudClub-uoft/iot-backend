const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const email = res.locals?.email;
  const jwtExpiry = 24 * 60 * 60; // 1 day in seconds
  const token = jwt.sign({ email }, process.env.JWT_KEY, {
    algorithm: 'HS256',
    expiresIn: jwtExpiry,
  });

  res.cookie('token', token, { maxAge: jwtExpiry * 1000 });
  next();
};
