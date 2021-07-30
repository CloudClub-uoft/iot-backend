const Device = require('../../models/device');

module.exports = (app) => {
  app.post('/device/unregister', (req, res) => {
    // TODO
    // INPUT: deviceid (mac address)
    // Deletes the device associated with this deviceid (mac address)
    // OUTPUT: Success/failure
    const deviceId = req.body.deviceId.toLowerCase();

    Device.findOneAndDelete({ deviceId }, (err, foundDevice) => {
      if (err) return res.status(400).json({ error: 'Bad Request' });
      if (foundDevice == null) return res.status(404).json({ error: 'No device found.' });
      return res.status(200).json({ message: 'Device successfully unregistered.' });
    });
  });
};