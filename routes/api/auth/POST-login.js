const login = require('../../../middleware/login');
const jwtSign = require('../../../middleware/jwtSign');
const jwt = require("jsonwebtoken");

module.exports = (app) => {
  app.post('/api/auth/login', login, jwtSign, (req, res) => {
    const email = res.locals?.email;
    const jwtExpiry = 24 * 60 * 60; // 1 day in seconds
    const token = jwt.sign({ email }, process.env.JWT_KEY, {
      algorithm: 'HS256',
      expiresIn: jwtExpiry,
    });
    res.status(200).json({ message: 'Login Successful!', token_i: token });
  });
};
