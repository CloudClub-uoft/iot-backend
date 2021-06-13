const chaiHttp = require('chai-http');
const chai = require('chai');
const { assert } = require('chai');
const mongoose = require('mongoose');
const server = require('../app');
const app = require('../app');

chai.use(chaiHttp);

describe('/GET device/info', () => {
  it('it should GET the information', (done) => {
    chai.request(server)
      .get('/device/info')
      .end((err, res) => {
        assert.equal(res.statusCode, 200);
      });
  });
});
