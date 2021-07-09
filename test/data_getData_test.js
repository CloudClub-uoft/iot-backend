const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const uuidApiKey = require('uuid-apikey');

const app = require('../app');
const Device = require('../models/device');
const Data = require('../models/data');

const { expect } = chai;
chai.use(chaiHttp);

describe('/GET data/getData', () => {
  const tempMac = faker.internet.mac();
  const tempName = faker.internet.userName();
  const tempTemperature = faker.datatype.number();
  const tempLocation = {
    type: "Point",
    coordinates: [Number(faker.address.latitude()), Number(faker.address.longitude())]
  };
  const { uuid, apiKey } = uuidApiKey.create();

  before(() => {
    // Register a temp device and Post temporary data
    new Device({
      deviceId: tempMac,
      friendlyName: tempName,
      uuid,
      apiKey,
    }).save();
    new Data({
        apiKey: apiKey,
        deviceId: tempMac,
        temperature: tempTemperature,
        location: tempLocation
    }).save();
  });

  it('it should GET the data', (done) => {
    chai.request(app)
      .get(`/data/getData?mac=${tempMac.replace(/:/g, '')}&points=1`)
      .end((_, res) => {
        expect(res.statusCode).to.equal(200);
        parseData = JSON.parse(JSON.stringify(res.body.Data));
        expect(parseData[0].location.coordinates).to.deep.equal(tempLocation.coordinates);
        expect(Number(parseData[0].temperature)).to.equal(Number(tempTemperature));
        done();
      });
  });

  after(() => { 
    //Delete temp device and temp data
    Data.deleteOne({ deviceId: tempMac });
    Device.deleteOne({ deviceId: tempMac }); 
    });
});
