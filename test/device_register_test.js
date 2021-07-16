const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');

const app = require('../app');
const Device = require('../models/device');

const { expect } = chai;
chai.use(chaiHttp);

describe('/POST device/register', () => {
  const tempMac = faker.internet.mac().replace(/:/g, '');
  const friendlyName = faker.internet.userName();
  it('it should POST the information', (done) => {
    chai.request(app)
      .post('/device/register')
      .send({ deviceId: tempMac, friendlyName: friendlyName })
      .end((_, res) => {
        Device.findOne({ apiKey: res.body.apiKey }, (__, doc) => {
          expect(doc.apiKey).to.equal(res.body.apiKey);
          expect(doc.deviceId).to.equal(tempMac);
          expect(doc.friendlyName).to.equal(friendlyName);
        }).then(() => done());
      });
  });

  after((done) => { Device.deleteOne({ deviceId: tempMac }).then(() => done()); });
});
