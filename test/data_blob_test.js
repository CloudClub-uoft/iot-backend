const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const path = require('path');
const md5 = require('md5');
const fs = require('fs');
const AWS = require('aws-sdk');

const app = require('../app');

const { expect } = chai;
chai.use(chaiHttp);

// declare constants needed to carry out the test. Prepend mac with 'test'
// to ensure that even if a real mac address was selected by the faker,
// no data would be overwritten
const fakeMac = 'test_'.concat(faker.internet.mac());

// this defines the file that will be uploaded to simulate a real POST request
const checkFile = './README.md';
const deviceId = fakeMac.replace(/:|\./g, '-');

describe('/POST data/blob', () => {
  // removes the fake entry from the s3 bucket after the test
  after((done) => {
    // create new client
    const s3Client = new AWS.S3({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      },
    });

    // delete the object
    s3Client.deleteObject(
      {
        Bucket: process.env.BUCKET_NAME,
        Key: deviceId.concat('_', path.basename(checkFile)),
      },
      (err) => {
        if (err) {
          console.error(err);
        }
        // terminate this test once the s3 deletion callback is done
        done();
      },
    );
  });

  it('it should POST the blob', (done) => {
    // The checkfile MUST be under 5mb, otherwise it will be split into parts while
    // uploading. s3 returns a combined md5 for each part, which will result in a md5
    // verification failure
    if (fs.statSync(checkFile).size >= 5 * 1024 * 1024) {
      expect.fail('Cannot use files over 5mb in blob unit test');
    }

    chai.request(app)
      .post('/data/blob')
      .field('deviceId', fakeMac)
      .attach('testfile', checkFile)
      .end((_, res) => {
        // Verify that the files were not modified in any way by comparing md5 hashes
        const originalHash = md5(fs.readFileSync(checkFile));

        // aws returns hashes surrounded by quotes, this regex removes them
        const awsHash = res.body.ETag.replace(/"/g, '');
        expect(awsHash).to.equal(originalHash);
        expect(res.statusCode).to.equal(201);
        done();
      });
  });
});
