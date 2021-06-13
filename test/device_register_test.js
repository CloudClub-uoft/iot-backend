const chaiHttp = require('chai-http');
const chai = require('chai');
const { assert } = require('chai');
const mongoose = require('mongoose');
const server = require('../app');
const app = require('../app');

chai.use(chaiHttp);

describe('/POST device/register', () => {
  it('it should POST the information', (done) => {
    chai.request(server)
      .post('/device/register')
      .end((err, res) => {
        assert.equal(res.statusCode, 200);
      });
  });
});
