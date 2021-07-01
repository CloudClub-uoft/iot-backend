const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema ({
    deviceId: {
        type: String,
        required: true,
      },
      temperature: {
          type: String,
      },
      location: {
            type: {
                type: String,
                default: 'Point',
            },
            coordinates: [Number],
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
});

const Data = mongoose.model('Data', dataSchema);
module.exports = Data;

