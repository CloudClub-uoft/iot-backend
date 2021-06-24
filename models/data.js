const mongoose = require('mongoose');

const dataScehma = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
  },
  temperature: {
      type: String,
  },
  location: {
        type: Latitude,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Data = mongoose.model('Device', deviceSchema);
module.exports = Data;


/// { temparture: 12, humidity: , pressure, windepsseed  }