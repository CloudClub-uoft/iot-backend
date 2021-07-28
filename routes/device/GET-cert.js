const login = require('../../util/login');
const genCert = require('../../util/genCert');

module.exports = (app) => {
  app.get('/device/cert', (req, res) => {
    login(req, res, (email) => {
      const der = genCert(email, 'der');
      return res.status(200).json(der);
    });
  });
};
