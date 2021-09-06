const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const jwt = require('jsonwebtoken');
const { webApp } = require('../app');
const Device = require('../models/device');

const { expect } = chai;
chai.use(chaiHttp);

describe('/POST api/register', () => {
  const email = faker.internet.email();
  let token;

  before(() => {
    token = jwt.sign({ email }, process.env.JWT_KEY, {
      algorithm: 'HS256',
      expiresIn: 60,
    });
  });

  const tempMac = faker.internet.mac().replace(/:/g, '');
  const friendlyName = faker.internet.userName();
  it('it should POST the information', (done) => {
    chai.request(webApp)
      .post('/api/register')
      .set('Cookie', `token=${token}`)
      .send({ deviceId: tempMac, friendlyName })
      .end(() => {
        Device.findOne({ deviceId: tempMac }, (__, doc) => {
          expect(doc.deviceId).to.equal(tempMac);
          expect(doc.friendlyName).to.equal(friendlyName);
        }).then(() => done());
      });
  });

  after((done) => { Device.deleteOne({ deviceId: tempMac }).then(() => done()); });
});
