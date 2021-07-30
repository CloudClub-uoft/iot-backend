const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const jwt = require('jsonwebtoken');

const app = require('../app');
const Device = require('../models/device');

const { expect } = chai;
chai.use(chaiHttp);

describe('/POST device/unregister', () => {
  const email = faker.internet.email();
  const token = jwt.sign({ email }, process.env.JWT_KEY, {
    algorithm: 'HS256',
    expiresIn: 60,
  });

  const tempMac = faker.internet.mac().replace(/:/g, '');

  before((done) => {
    // Register temporary device
    new Device({
      deviceId: tempMac,
      friendlyName: 'friendlyName',
      uuid: 'test',
      apiKey: 'test',
    }).save().then(() => done());
  });

  it('it should use POST to remove the information', (done) => {
    chai.request(app)
      .post('/device/unregister')
      .set('Cookie', `token=${token}`)
      .send({ deviceId: tempMac })
      .end((_, res) => {
        expect(res.statusCode).to.equal(200);
        Device.findOne({ deviceId: tempMac }, (__, count) => {
          expect(count).to.be.null;
        }).then(() => done());
      });
  });
});
