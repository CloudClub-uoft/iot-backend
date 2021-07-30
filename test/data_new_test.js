const chai = require('chai');
const jwt = require('jsonwebtoken');
const chaiHttp = require('chai-http');
const faker = require('faker');
const uuidApiKey = require('uuid-apikey');

const app = require('../app');
const Device = require('../models/device');
const Data = require('../models/data');

const { expect } = chai;
chai.use(chaiHttp);

describe('/POST data/new', () => {
  const tempMac = faker.internet.mac();
  const tempName = faker.internet.userName();
  const tempTemperature = faker.datatype.number();
  const tempLocation = {
    type: 'Point',
    coordinates: [Number(faker.address.latitude()), Number(faker.address.longitude())],
  };
  const { uuid, apiKey } = uuidApiKey.create();
  let token = '';
  before((done) => {
    const email = faker.internet.email();
    token = jwt.sign({ email }, process.env.JWT_KEY, {
      algorithm: 'HS256',
      expiresIn: 60,
    });

    // Register a temp device
    new Device({
      deviceId: tempMac,
      friendlyName: tempName,
      uuid,
      apiKey,
    }).save().then(() => done());
  });

  it('it should POST the data', (done) => {
    chai.request(app)
      .post('/data/new')
      .set('Cookie', `token=${token}`)

      .send({
        apiKey, deviceId: tempMac, temperature: tempTemperature, location: tempLocation,
      })
      .end((_, res) => {
        expect(res.statusCode).to.equal(201);
        Data.findOne({ deviceId: tempMac }, (__, doc) => {
          expect(Number(doc.temperature)).to.equal(Number(tempTemperature));
          expect(doc.location.coordinates).to.deep.equal(tempLocation.coordinates);
        }).then(() => done());
      });
  });

  after((done) => {
    // Delete temp device and temp data
    Data.deleteOne({ deviceId: tempMac }).then(() => {
      Device.deleteOne({ deviceId: tempMac }).then(() => done());
    });
  });
});
