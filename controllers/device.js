var express = requre('express');

const registerDevice = (req, res, next) => {
    //TODO
    //INPUT: HARDWARE ID, friendly-name
    //the device information is stored
    //OUTPUT: success/failure           
};

const deviceInfo = (req, res, next) => {
    //TODO
    //INPUT: API key
    //the device information is provided
    //OUTPUT: firendly name    
};

const unregisterDevice = (req, res, next) => {
    //TODO
    //INPUT: deviceid
    //Deletes the device associated with this deviceid
    //OUTPUT: Success/failure
};

//export controller functions
module.exports = {
    registerDevice,
    deviceInfo,
    unregisterDevice
};