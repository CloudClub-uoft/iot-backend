const chaiHttp = require('chai-http');
const chai = require('chai');
const { assert } = require('chai');
const mongoose = require('mongoose');
const server = require('../app');
const app = require('../app');
Device = require('../models/device');

chai.use(chaiHttp);
const faker = require('faker');

const temp_mac = faker.internet.mac();


//test case: attempt to remove the device
describe('/POST device/unregister', () => {

  //register temporary device
  before( function() {
    new mongoose.model('Device') ({
      deviceId: temp_mac,
      friendlyName: 'friendlyName',
      uuid: 'test',
      apiKey: 'test',
    }).save();
  });

  //verify the unregistration was successful
  after(function() {
    Device.findOne({deviceId: temp_mac}, function (err, foundDevice) {
      //catch errors
      assert(err == null, 'Error in finding device');

      //foundDevice should equal null when not found in db
      assert.isNull(foundDevice);
    });
  });

  it('it should use POST to remove the information', (done) => {
    chai.request(app)
      .post('/device/unregister')
      .send({ deviceId: temp_mac })
      .end((err, res) => {
        assert.equal(res.statusCode, 200);
        done();
      })
  });
});