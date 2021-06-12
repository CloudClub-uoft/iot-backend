let chaiHttp = require('chai-http');
let server = require('../app');
let chai = require('chai');
const { assert } = require('chai');
const mongoose = require('mongoose');
const app = require('../app');

chai.use(chaiHttp);

describe('/GET device/register', () => {
    it('it should GET the information', (done) => {
      chai.request(server)
          .get('/device/register')
          .end((err, res) => {              
            assert.equal(res.statusCode,200);                                                        
          });
    });   
});