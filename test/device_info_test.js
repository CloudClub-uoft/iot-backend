const chaiHttp = require('chai-http');
const chai = require('chai');
const { assert } = require('chai');
const mongoose = require('mongoose');
const server = require('../app');
const faker = require('faker');
const uuidApiKey = require('uuid-apikey');
const Device = require('../models/device');

chai.use(chaiHttp);

const temp_mac = faker.internet.mac();
const temp_name = faker.internet.userName();
const { uuid, apiKey } = uuidApiKey.create();

//register a temp device
new mongoose.model('Device') ({
  deviceId: temp_mac,
  friendlyName: temp_name,
  uuid: uuid,
  apiKey: apiKey,
}).save();
    
//test
describe('/GET device/info', () => {
  it('it should GET the information', (done) => {
    chai.request(server)
      .get('/device/info')
      .send({apiKey: apiKey})
      .end((err, res) => {
        assert.equal(res.statusCode, 200);
        done();
      });
  });
});

//delete temp device
Device.deleteOne({ deviceId: temp_mac });