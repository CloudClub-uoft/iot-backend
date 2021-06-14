const chaiHttp = require('chai-http');
const chai = require('chai');
const { assert } = require('chai');
const mongoose = require('mongoose');
const app = require('../app');
const faker = require('faker')

chai.use(chaiHttp);

describe('/POST device/register', () => {
  it('it should POST the information', (done) => {
    chai.request(app)
      .post('/device/register')
      .send({ deviceId: faker.internet.mac(), friendlyName: faker.internet.userName() })
      .end((err, res) => {
        mongoose.model('Device').findOneAndDelete({ apiKey: res.body.apiKey }, (err, doc) => {
          if (err) return done(err);
          assert(doc).done();
        })
      });
  });
});
