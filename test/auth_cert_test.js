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
  const caCert = forge.pki.certificateFromPem(fs.readFileSync(process.env.MQTT_SERVER_CA_PATH));
  const email = faker.internet.email();
  const token = jwt.sign({ email }, process.env.JWT_KEY, {
    algorithm: 'HS256',
    expiresIn: 60,
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
});
