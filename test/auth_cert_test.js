const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const jwt = require('jsonwebtoken');
const forge = require('node-forge');
const fs = require('fs');

const { webApp } = require('../app');

const { expect } = chai;
chai.use(chaiHttp);

describe('/GET api/auth/cert', () => {
  it('it should authenticate the user and return a client certificate and key', (done) => {
    const caCert = forge.pki.certificateFromPem(fs.readFileSync(process.env.MQTT_SERVER_CA_PATH));
    const email = faker.internet.email();
    const token = jwt.sign({ email }, process.env.JWT_KEY, {
      algorithm: 'HS256',
      expiresIn: 60,
    });
    chai.request(webApp)
      .get('/api/auth/cert')
      .set('Cookie', `token=${token}`)
      .end((_, res) => {
        expect(res).to.have.status(200);
        forge.pki.privateKeyFromPem(res.body.privateKey);
        const cert = forge.pki.certificateFromPem(res.body.certificate);
        expect(caCert.verify(cert)).to.equal(true);
        done();
      });
  });
});
