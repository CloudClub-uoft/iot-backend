const chai = require('chai');
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

  before(() => {
    // Register a temp device
    new Device({
      deviceId: tempMac,
      friendlyName: tempName,
      uuid,
      apiKey,
    }).save();
  });

  it('it should POST the data', (done) => {
    chai.request(app)
      .post('/data/new')
      .send({
        apiKey, deviceId: tempMac, temperature: tempTemperature, location: tempLocation,
      })
      .end((_, res) => {
        expect(res.statusCode).to.equal(201);
        Data.findOne({ deviceId: tempMac }, (__, doc) => {
          expect(Number(doc.temperature)).to.equal(Number(tempTemperature));
          expect(doc.location.coordinates).to.deep.equal(tempLocation.coordinates);
          done();
        });
      });
  });

  after(() => {
    // Delete temp device and temp data
    Data.deleteOne({ deviceId: tempMac });
    Device.deleteOne({ deviceId: tempMac });
  });
});
