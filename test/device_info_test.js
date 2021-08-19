const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');

const { deviceApp } = require('../app');
const Device = require('../models/device');

const { expect } = chai;
chai.use(chaiHttp);

describe('/GET device/info', () => {
  const tempMac = faker.internet.mac().replace(/:/g, '');
  const tempName = faker.internet.userName();

  before((done) => {
    // Register a temp device
    new Device({
      deviceId: tempMac,
      friendlyName: tempName,
    }).save().then(() => done());
  });

  it('it should GET the device information', (done) => {
    chai.request(deviceApp)
      .get(`/device/info?mac=${tempMac}`)
      .end((_, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.friendlyName).to.equal(tempName);
        done();
      });
  });

  after((done) => { Device.deleteOne({ deviceId: tempMac }).then(() => done()); });
});
