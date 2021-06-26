const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const path = require('path');
const md5 = require('md5');
const fs = require('fs');

const app = require('../app');

const { expect } = chai;
chai.use(chaiHttp);

// declare constants needed to carry out the test
const fakeMac = faker.internet.mac();

// this defines the file that will be uploaded to simulate a real POST request
const checkFile = './README.md';
const deviceId = fakeMac.replace(/:/g, '-').replace(/\./g, '-');

describe('/POST data/blob', () => {
  // after execution, remove the directory that contained the test files
  after(() => {
    fs.rmSync(path.join(__dirname, '..', 'uploads', deviceId), { recursive: true });
  });

  it('it should POST the blob', (done) => {
    chai.request(app)
      .post('/data/blob')
      .field('deviceId', fakeMac)
      .attach('file', checkFile)
      .end((_, res) => {
        // Verify that the files were not modified in any way by comparing md5 hashes
        const originalHash = md5(fs.readFileSync(checkFile));
        const uploadedHash = md5(fs.readFileSync(path.join(__dirname, '..', 'uploads', deviceId, path.basename(checkFile))));
        expect(uploadedHash).to.equal(originalHash);
        expect(res.statusCode).to.equal(204);
        done();
      });
  });
});
