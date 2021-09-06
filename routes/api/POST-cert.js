const login = require('../../middleware/login');
const genCert = require('../../util/genCert');

module.exports = (app) => {
  app.post('/api/cert', login, (req, res) => {
    const der = genCert(res.locals?.email, 'der');
    return res.status(200).json(der);
  });
};
