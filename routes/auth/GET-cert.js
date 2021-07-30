const Archiver = require('archiver');

const jwtVerify = require('../../middleware/jwtVerify');
const genCert = require('../../util/genCert');

module.exports = (app) => {
  app.get('/auth/cert', jwtVerify, (req, res) => {
    const { download } = req.query || {};
    const pem = genCert(res.locals?.jwtPayload);

    if (download) {
      res.attachment('auth.zip');

      const archive = Archiver('zip');
      archive.pipe(res);
      archive
        .append(pem.privateKey, { name: 'clientKey.key' })
        .append(pem.certificate, { name: 'clientCert.crt' })
        .finalize();
    } else return res.status(200).json(pem);
  });
};
