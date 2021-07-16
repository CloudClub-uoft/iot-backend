const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const jwt = require('jsonwebtoken');
const forge = require('node-forge');
const fs = require('fs');

const app = require('../app');

const { expect } = chai;
chai.use(chaiHttp);

describe('/GET auth/cert', () => {
  process.env.JWT_KEY = 'test';
  const email = faker.internet.email();
  const token = jwt.sign({ email }, process.env.JWT_KEY, {
    algorithm: 'HS256',
    expiresIn: 60,
  });
  const caCert = forge.pki.createCertificate();

  before(() => {
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
  });

  it('it should authenticate the user and return a client certificate and key', (done) => {
    chai.request(app)
      .get('/auth/cert')
      .set('Cookie', `token=${token}`)
      .end((_, res) => {
        expect(res).to.have.status(200);
        forge.pki.privateKeyFromPem(res.body.privateKey);
        const cert = forge.pki.certificateFromPem(res.body.certificate);
        expect(caCert.verify(cert)).to.equal(true);
      });
    done();
  });

  after(() => {
    fs.unlinkSync('testKey.key');
    fs.unlinkSync('testCert.crt');
  });
});
