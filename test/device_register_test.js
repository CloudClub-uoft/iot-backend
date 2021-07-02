const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');

const app = require('../app');
const Device = require('../models/device');

const { expect } = chai;
chai.use(chaiHttp);

describe('/POST device/register', () => {
  const tempMac = faker.internet.mac();
  it('it should POST the information', (done) => {
    chai.request(app)
      .post('/device/register')
      .send({ deviceId: tempMac, friendlyName: faker.internet.userName() })
      .end((_, res) => {
        Device.findOne({ apiKey: res.body.apiKey }, (__, doc) => {
          expect(doc);
        });
        done();
      });
  });

  after((done) => { Device.deleteOne({ deviceId: tempMac }).then(() => done()); });
});
