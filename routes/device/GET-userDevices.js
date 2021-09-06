const jwtVerify = require('../../middleware/jwtVerify');
const Device = require('../../models/device');

module.exports = (app) => {
  app.get('/device/userDevices', jwtVerify, (req, res) => {
    const userEmail = res.locals.jwtPayload.email;
    Device.find({ userEmail }).sort({ timestamp: -1 }).exec((err, userDevices) => {
      if (err) return res.status(400).json({ error: 'Bad Request' });
      if (userDevices == null) return res.status(404).json({ error: 'No Devices Registered.' });
      return res.status(200).json({ userDevices });
    });
  });
};