const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const bcrypt = require('bcrypt');
const forge = require('node-forge');
const fs = require('fs');

const apps = require('../app');
const db = require('../util/mysql');

const { expect } = chai;
chai.use(chaiHttp);

describe('/POST device/cert', () => {
  const email = faker.internet.email();
  const password = faker.internet.password();

  before((done) => {
    const first = faker.name.firstName();
    const last = faker.name.lastName();
    bcrypt.hash(password, 5, (_, hash) => {
      db.query(`INSERT INTO logins (\`first-name\`, \`last-name\`, email, password) VALUES ('${first}', '${last}', '${email}', '${hash}')`, done);
    });
  });

  it('it should authenticate the device and return a client certificate and key', (done) => {
    const caCert = forge.pki.certificateFromPem(fs.readFileSync(process.env.MQTT_SERVER_CA_PATH));
    chai.request(apps.deviceApp)
      .post('/device/cert')
      .send({ email, password })
      .end((_, res) => {
        expect(res).to.have.status(200);
        forge.pki.privateKeyFromAsn1(forge.asn1.fromDer(res.body.privateKey.data));
        const cert = forge.pki.certificateFromAsn1(forge.asn1.fromDer(res.body.certificate.data));
        expect(caCert.verify(cert)).to.equal(true);
        done();
      });
  });

  after((done) => {
    db.query(`DELETE FROM logins WHERE email='${email}'`, done);
  });
});
