const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const uuidApiKey = require('uuid-apikey');

const app = require('../app');
const Device = require('../models/device');
const Data = require('../models/data');

const { expect } = chai;
chai.use(chaiHttp);

describe('/GET device/info', () => {
  const tempMac = faker.internet.mac();
  const tempName = faker.internet.userName();
  const tempTemperature = faker.datatype.number();
  const tempLocation = faker.datatype.number();
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
      .send({ apiKey: apiKey, deviceId: tempMac, temperature: tempTemperature, location: tempLocation  })
      .end((_, res) => {
        expect(res.statusCode).to.equal(201);
        Data.findOne({ deviceId: tempMac }, (__, doc) => {
            expect(doc.temperature).to.equal(tempTemperature);
            expect(doc.location).to.equal(tempLocation);
        });
      });
    done();
  });

  after(() => { 
    //Delete temp device and temp data
    Data.deleteOne({ deviceId: tempMac });
    Device.deleteOne({ deviceId: tempMac }); 
    });
});
