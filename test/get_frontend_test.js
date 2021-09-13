const chai = require('chai');
const chaiHttp = require('chai-http');
const { webApp } = require('../app');
const { expect } = chai;
const fs = require('fs');
const path = require('path');
chai.use(chaiHttp);
const file_name = path.join(process.env.FRONTEND_BUILD_DIRECTORY, 'TEST.md');

describe(`GET /TEST.md`, function test() {

    before(async () => {
        await fs.writeFile(file_name, __dirname, function (err) {
            if (err) throw err;
        });
    });

    //The test looks for the TEST.md file in the path pointed by the FRONTEND_BUILD_DIRECTORY environment variable.
    it('it should GET the static page', (done) => {
        var base_name = path.basename(file_name);
        chai.request(webApp)
            .get(`/${base_name}`)
            .end((_, res) => {
                expect(res.statusCode).to.equal(200);
                done();
            });
    });

    after(async () => {
        await fs.unlink(file_name, () => {
            if (err) throw err;
        });
    });

});
