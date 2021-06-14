const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
  },
  friendlyName: {
    type: String,
    required: true,
  },
  uuid: {
    type: String,
    required: true,
  },
  apiKey: {
    type: String,
    required: true,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
});

const Device = mongoose.model('Device', deviceSchema);
module.exports = Device;
