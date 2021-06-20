const Device = require('../../models/device');

module.exports = (app) => {
  app.post('/device/unregister', (req, res) => {
    // TODO
    // INPUT: deviceid (mac address)
    // Deletes the device associated with this deviceid (mac address)
    // OUTPUT: Success/failure
    const { deviceId } = req.body;

    Device.findOneAndDelete({ deviceId }, (err, foundDevice) => {
      if (err) return res.status(400);
      if (foundDevice == null) return res.status(404);
      return res.sendStatus(200);
    });
  });
};
