const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');

const app = require('../app');
const Device = require('../models/device');

const { expect } = chai;
chai.use(chaiHttp);

describe('/POST device/register', () => {
  it('it should POST the information', (done) => {
    chai.request(app)
      .post('/device/register')
      .send({ deviceId: faker.internet.mac(), friendlyName: faker.internet.userName() })
      .end((_, res) => {
        Device.findOneAndDelete({ apiKey: res.body.apiKey }, (__, doc) => {
          expect(doc);
        });
        done();
      });
  });
});
