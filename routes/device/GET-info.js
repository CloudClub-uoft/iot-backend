const Device = require('../../models/device');

module.exports = (app) => {
  app.get('/device/info', (req, res) => {
    if (!req.query.mac) return res.status(400);
    // Take MAC address with no symbols as query parameter and reformat with colons
    const mac = req.query.mac.replace(/(..)/g, '$1:').slice(0, -1);
    Device.findOne({ deviceId: mac }, 'friendlyName', (err, foundDevice) => {
      if (err) return res.status(400);
      if (foundDevice == null) return res.status(404);

      return res.status(200).json({ friendlyName: foundDevice.friendlyName });
    });
  });
};
