const forge = require('node-forge');
const fs = require('fs');

exports.mochaGlobalSetup = () => {
  process.env.JWT_KEY = 'test';

  // TLS server certificates setup
  const caCert = forge.pki.createCertificate();
  const caKeys = forge.pki.rsa.generateKeyPair(4096);
  caCert.publicKey = caKeys.publicKey;
  caCert.serialNumber = '01';
  caCert.validity.notBefore = new Date();
  caCert.validity.notAfter = new Date();
  caCert.validity.notAfter.setDate(caCert.validity.notBefore.getDate() + 365);

  const attributes = [{ name: 'countryName', value: 'CA' }];

  caCert.setSubject(attributes);
  caCert.setIssuer(attributes);
  caCert.sign(caKeys.privateKey, forge.md.sha256.create());

  const pem = {
    privateKey: forge.pki.privateKeyToPem(caKeys.privateKey),
    certificate: forge.pki.certificateToPem(caCert),
  };

  fs.writeFileSync('testKey.key', pem.privateKey);
  fs.writeFileSync('testCert.crt', pem.certificate);
  process.env.MQTT_SERVER_KEY_PATH = 'testKey.key';
  process.env.MQTT_SERVER_CA_PATH = 'testCert.crt';
};

exports.mochaGlobalTeardown = () => {
  fs.unlinkSync('testKey.key');
  fs.unlinkSync('testCert.crt');
};
