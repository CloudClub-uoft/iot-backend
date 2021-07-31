const forge = require('node-forge');
const fs = require('fs');

module.exports = (email, format) => {
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
    value: email,
  }];

  clientCert.setSubject(attributes);
  clientCert.setIssuer(caCert.subject.attributes);

  clientCert.sign(caKey, forge.md.sha256.create());

  let privateKey;
  let certificate;
  switch (format) {
    case 'der':
      privateKey = forge.asn1.toDer(forge.pki.privateKeyToAsn1(clientKeys.privateKey));
      certificate = forge.asn1.toDer(forge.pki.certificateToAsn1(clientCert));
      break;
    case 'pem':
    default:
      privateKey = forge.pki.privateKeyToPem(clientKeys.privateKey);
      certificate = forge.pki.certificateToPem(clientCert);
  }

  const keyCert = {
    privateKey,
    certificate,
  };
  return keyCert;
};
