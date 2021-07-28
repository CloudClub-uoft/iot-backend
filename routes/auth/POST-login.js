const jwt = require('jsonwebtoken');

const login = require('../../util/login');

module.exports = (app) => {
  app.post('/auth/login', (req, res) => {
    login(req, res, (email) => {
      const jwtExpiry = 24 * 60 * 60; // 1 day in seconds
      const token = jwt.sign({ email }, process.env.JWT_KEY, {
        algorithm: 'HS256',
        expiresIn: jwtExpiry,
      });

      res.cookie('token', token, { maxAge: jwtExpiry * 1000 });
      return res.status(200).json({ message: 'Login Successful!' });
    });
  });
};
