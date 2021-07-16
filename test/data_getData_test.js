const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const uuidApiKey = require('uuid-apikey');

const app = require('../app');
const Device = require('../models/device');
const Data = require('../models/data');

const {expect} = chai;
chai.use(chaiHttp);

describe('/GET data/getData', () => {

    const tempMac = faker.internet.mac();
    const tempName = faker.internet.userName();
    const tempTemperature = faker.datatype.number();
    const tempLocation = {
        type: 'Point',
        coordinates: [Number(faker.address.latitude()), Number(faker.address.longitude())],
    };
    const {uuid, apiKey} = uuidApiKey.create();

    let putData =  function() {

        // Register a temp device and Post temporary data
        new Data({
            apiKey,
            deviceId: tempMac,
            temperature: tempTemperature,
            location: tempLocation,
        }).save().then(() => {
            //blank
        });

    }

    before(() => {

        putData();

    });

    it('it should GET the data', (done) => {

        //remove MAC Address colons
        const changedMac = tempMac.replace(/:/g, '');

        //Create New URL
        const requestURL = `/data/getData?mac=${changedMac}&points=1`;

        console.log(requestURL);

        chai.request(app)
            .get(requestURL)
            .end((_, res) => {
                expect(res.statusCode).to.equal(200);
                const parseData = JSON.parse(JSON.stringify(res.body.doc));
                expect(parseData[0].location.coordinates).to.deep.equal(tempLocation.coordinates);
                expect(Number(parseData[0].temperature)).to.equal(Number(tempTemperature));
                done();
            });
    });

    after(() => {
        // Delete temp device and temp data
        Data.deleteOne({deviceId: tempMac});
        Device.deleteOne({deviceId: tempMac});
    });
});
