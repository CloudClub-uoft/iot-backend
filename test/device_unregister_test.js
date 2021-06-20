const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');

const app = require('../app');
const Device = require('../models/device');

const { expect } = chai;
chai.use(chaiHttp);

describe('/POST device/unregister', () => {
  const tempMac = faker.internet.mac();

  before(() => {
    // Register temporary device
    new Device({
      deviceId: tempMac,
      friendlyName: 'friendlyName',
      uuid: 'test',
      apiKey: 'test',
    }).save();
  });

  it('it should use POST to remove the information', (done) => {
    chai.request(app)
      .post('/device/unregister')
      .send({ deviceId: tempMac })
      .end((_, res) => {
        expect(res.statusCode).to.equal(200);
        Device.findOne({ deviceId: tempMac }, (__, count) => {
          expect(count).to.equal(0);
        });
        done();
      });
  });
});
