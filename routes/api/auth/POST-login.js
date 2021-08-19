const login = require('../../../middleware/login');
const jwtSign = require('../../../middleware/jwtSign');

module.exports = (app) => {
  app.post('/api/auth/login', login, jwtSign, (req, res) => {
    res.status(200).json({ message: 'Login Successful!' });
  });
};
