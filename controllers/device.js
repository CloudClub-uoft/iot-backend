var express = require('express');

const registerDevice = (req, res, next) => {
    //TODO
    //INPUT: HARDWARE ID, friendly-name
    //the device information is stored
    //OUTPUT: success/failure           
    res.sendStatus(404);
};

const deviceInfo = (req, res, next) => {
    //TODO
    //INPUT: API key
    //the device information is provided
    //OUTPUT: firendly name   
    res.sendStatus(404);
};

const unregisterDevice = (req, res, next) => {
    //TODO
    //INPUT: deviceid
    //Deletes the device associated with this deviceid
    //OUTPUT: Success/failure
    res.sendStatus(404);
};

//export controller functions
module.exports = {
    registerDevice,
    deviceInfo,
    unregisterDevice
};