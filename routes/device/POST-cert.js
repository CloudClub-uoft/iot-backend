const login = require('../../middleware/login');
const genCert = require('../../util/genCert');

module.exports = (deviceApp) => {
  deviceApp.post('/device/cert', login, (req, res) => {
    const der = genCert(res.locals?.email, 'der');
    return res.status(200).json(der);
  });
};
