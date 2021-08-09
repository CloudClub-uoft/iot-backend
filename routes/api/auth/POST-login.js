const login = require('../../../middleware/login');
const jwtSign = require('../../../middleware/jwtSign');

module.exports = (webApp) => {
  webApp.post('/api/auth/login', login, jwtSign, (req, res) => {
    res.status(200).json({ message: 'Login Successful!' });
  });
};
