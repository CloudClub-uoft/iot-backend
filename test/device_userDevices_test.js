const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const jwt = require('jsonwebtoken');
const { webApp } = require('../app');
const Device = require('../models/device');

const { expect } = chai;
chai.use(chaiHttp);

describe('/GET api/userDevices', () => {
  const tempMac = faker.internet.mac().replace(/:/g, '');
  const tempName = faker.internet.userName();
  const email = faker.internet.email();
  let token;
  before((done) => {
    // Register a temp device
    token = jwt.sign({ email }, process.env.JWT_KEY, {
      algorithm: 'HS256',
      expiresIn: 60,
    });
    new Device({
      deviceId: tempMac,
      friendlyName: tempName,
      userEmail: email,
    }).save().then(() => done());
  });

  it('it should GET the registered devices by the user', (done) => {
    chai.request(webApp)
      .get('/api/userDevices')
      .set('Cookie', `token=${token}`)
      .end((_, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.userDevices[0].friendlyName).to.equal(tempName);
        done();
      });
  });
  after((done) => { Device.deleteOne({ deviceId: tempMac }).then(() => done()); });
});
