const jwt = require('jsonwebtoken');
const Archiver = require('archiver');

const genCert = require('../../util/genCert');

module.exports = (app) => {
  app.get('/auth/cert', (req, res) => {
    const { token } = req.cookies || {};
    if (!token) return res.status(401).json({ error: 'Not logged in.' });

    const { download } = req.query || {};

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_KEY);
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) return res.status(401).json({ Error: 'Unauthorized 401' });
      return res.status(400).json({ Error: 'Bad Request 400' });
    }

    const pem = genCert(payload.email, 'pem');

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
