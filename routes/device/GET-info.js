const Device = require('../../models/device');
const jwtVerify = require('../../middleware/jwtVerify');

module.exports = (app) => {
  app.get('/device/info', jwtVerify, (req, res) => {
    if (!req.query.mac) return res.status(400).json({ error: 'No MAC address provided.' });
    // Take MAC address with no symbols as query parameter and reformat with colons
    const mac = req.query.mac.toLowerCase();
    Device.findOne({ deviceId: mac }, 'friendlyName', (err, foundDevice) => {
      if (err) return res.status(400).json({ error: 'Bad Request' });
      if (foundDevice == null) return res.status(404).json({ error: 'No device found.' });

      return res.status(200).json({ friendlyName: foundDevice.friendlyName });
    });
  });
};
