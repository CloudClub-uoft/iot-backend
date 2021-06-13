const express = require('express');
const uuidApiKey = require('uuid-apikey');
const mongoose = require('mongoose');
require('../models/device');

const registerDevice = (req, res, next) => {
  // TODO
  // INPUT: HARDWARE ID, friendly-name
  // the device information is stored
  // OUTPUT: success/failure
  const { mac, name } = req.body;
  const { uuid, apiKey } = uuidApiKey.create();

  const Device = mongoose.model('Device');
  new Device({
    deviceId: mac,
    friendlyName: name,
    uuid,
    apikey: apiKey,
  }).save();

  return res.status(200).json({ apiKey });
};

const deviceInfo = (req, res, next) => {
  // TODO
  // INPUT: API key
  // the device information is provided
  // OUTPUT: firendly name
  res.sendStatus(404);
};

const unregisterDevice = (req, res, next) => {
  // TODO
  // INPUT: deviceid
  // Deletes the device associated with this deviceid
  // OUTPUT: Success/failure
  res.sendStatus(404);
};

// export controller functions
module.exports = {
  registerDevice,
  deviceInfo,
  unregisterDevice,
};
