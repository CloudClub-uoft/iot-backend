const Device = require('../../models/device');
module.exports = (app, db) => {
  app.get('/device/info', (req, res, next) => {
    // TODO
    // INPUT: API key
    // the device information is provided
    // OUTPUT: firendly name
    const apiKey = req.body.apiKey;
    Device.findOne({apiKey: apiKey}, 'friendlyName', function (err, foundDevice) {
      if (err) {
        return res.status(400);
      }
      else if (foundDevice == null) {
        return res.status(404);
      }
      else {
        return res.status(200).json({ friendlyName: foundDevice.friendlyName });
      }
    });
  });
}