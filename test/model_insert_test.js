require('../util/env').configure()
require('../util/connection');
require('../models/device')
var assert = require('chai').assert;
const mongoose = require('mongoose')
const faker = require('faker')

describe('Insert Device', () => {

    it('First should describe this function.', function () {

        var Device = mongoose.model('Device');
        const device = new Device({
            deviceId: faker.name.findName(),
            friendlyName: faker.name.findName()
        }).save().catch((e) => {
            console.log(e);                    
        }).finally(() => {
            mongoose.connection.close(); //close connection once test is over 
        });
                     
        assert(!device.isNew);

    })

})
