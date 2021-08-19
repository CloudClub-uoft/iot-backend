const jwtVerify = require('../../middleware/jwtVerify');
const Device = require('../../models/device');

module.exports = (app) => {
  app.post('/device/unregister', jwtVerify, (req, res) => {
    const deviceId = req.body.deviceId.toLowerCase();

    Device.findOneAndDelete({ deviceId }, (err, foundDevice) => {
      if (err) return res.status(400).json({ error: 'Bad Request' });
      if (foundDevice == null) return res.status(404).json({ error: 'No device found.' });
      return res.status(200).json({ message: 'Device successfully unregistered.' });
    });
  });
};
