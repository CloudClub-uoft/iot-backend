const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const jwt = require('jsonwebtoken');

const { webApp } = require('../app');
const Device = require('../models/device');
const Data = require('../models/data');

const { expect } = chai;
chai.use(chaiHttp);

describe('/GET /api/data/getData', function test() {  
  const email = faker.internet.email();
  const tempMac = faker.internet.mac();
  const tempName = faker.internet.userName();
  const tempTemperature = faker.datatype.number();
  const tempLocation = {
    type: 'Point',
    coordinates: [Number(faker.address.latitude()), Number(faker.address.longitude())],
  };

  let token='';
  this.timeout(5000);
  before((done) => {    
    token = jwt.sign({ email }, process.env.JWT_KEY, {
      algorithm: 'HS256',
      expiresIn: 60,
    });
    // Register a temp device and Post temporary data
    new Device({
      deviceId: tempMac,
      friendlyName: tempName,
      userEmail: email,
    }).save().then(() => {
      new Data({
        deviceId: tempMac,
        temperature: tempTemperature,
        location: tempLocation,
      }).save().then(() => done());
    });
  });

  it('it should GET the data', (done) => {
    chai.request(webApp)
      .get(`/api/data/getData?mac=${tempMac.replace(/:/g, '')}&points=1`)
      .set('Cookie', `token=${token}`)
      .end((_, res) => {
        expect(res.statusCode).to.equal(200);
        const parseData = JSON.parse(JSON.stringify(res.body.doc));
        expect(parseData[0].location.coordinates).to.deep.equal(tempLocation.coordinates);
        expect(Number(parseData[0].temperature)).to.equal(Number(tempTemperature));
        done();
      });
  });

  after((done) => {
    // Delete temp device and temp data
    Data.deleteOne({ deviceId: tempMac }).then(() => {
      Device.deleteOne({ deviceId: tempMac }).then(() => done());
    });
  });
});
