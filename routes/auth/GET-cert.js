const jwt = require('jsonwebtoken');
const forge = require('node-forge');
const fs = require('fs');
const Archiver = require('archiver');

module.exports = (app) => {
  app.get('/auth/cert', (req, res) => {
    const { token } = req.cookies || {};
    const { download } = req.query || {};

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_KEY);
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) return res.status(401).json({ Error: 'Unauthorized 401' });
      return res.status(400).json({ Error: 'Bad Request 400' });
    }

    const caCert = forge.pki.certificateFromPem(fs.readFileSync(process.env.MQTT_SERVER_CA_PATH));
    const caKey = forge.pki.privateKeyFromPem(fs.readFileSync(process.env.MQTT_SERVER_KEY_PATH));

    const clientKeys = forge.pki.rsa.generateKeyPair(4096);
    const clientCert = forge.pki.createCertificate();
    clientCert.publicKey = clientKeys.publicKey;
    clientCert.serialNumber = '01';
    clientCert.validity.notBefore = new Date();
    clientCert.validity.notAfter = new Date();
    clientCert.validity.notAfter.setDate(clientCert.validity.notBefore.getDate() + 365);

    const attributes = [{
      name: 'commonName',
      value: 'IoT Device',
    }, {
      name: 'countryName',
      value: 'CA',
    }, {
      name: 'localityName',
      value: 'Toronto',
    }, {
      name: 'stateOrProvinceName',
      value: 'ON',
    }, {
      name: 'organizationName',
      value: 'CloudClub',
    }, {
      name: 'organizationalUnitName',
      value: 'IoT-Project',
    }, {
      name: 'emailAddress',
      value: payload.email,
    }];

    clientCert.setSubject(attributes);
    clientCert.setIssuer(caCert.subject.attributes);

    clientCert.sign(caKey, forge.md.sha256.create());

    const pem = {
      privateKey: forge.pki.privateKeyToPem(clientKeys.privateKey),
      certificate: forge.pki.certificateToPem(clientCert),
    };

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
