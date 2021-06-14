const chaiHttp = require('chai-http');
const chai = require('chai');
const { assert } = require('chai');
const mongoose = require('mongoose');
const server = require('../app');
const app = require('../app');

chai.use(chaiHttp);
const faker = require('faker');

const temp_mac = faker.internet.mac();

//register a temp device
chai.request(app)
      .post('/device/register')
      .send({ deviceId: temp_mac, friendlyName: faker.internet.userName() })
      .end((err, res) => {
      })

//test case: attempt to remove the device
describe('/POST device/unregister', () => {
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

//test case: verify the device is gone
//should return 404 indicating the db entry is not found
describe('/GET /device/info verify the entry is gone', () => {
  it('it should use GET to verify the device is gone', (done) => {
    chai.request(server)
      .get('/device/info')
      .end((err, res) => {
        assert.equal(res.statusCode, 404);
        done();
      });
  });
});

