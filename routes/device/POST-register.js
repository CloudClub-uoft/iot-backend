const jwtVerify = require('../../middleware/jwtVerify');
const Device = require('../../models/device');

module.exports = (app) => {
  app.post('/device/register', jwtVerify, (req, res) => {
    const userEmail = res.locals.jwtPayload.email;
    const { deviceId, friendlyName } = req.body;
    if (!deviceId || !deviceId.match(/([0-9A-Fa-f]{2}){6}/) || !friendlyName) return res.status(400).json({ error: 'Bad Request' });
    Device.findOne({ deviceId }, (err, foundDevice) => {
      if (err) return res.status(400).json({ error: 'Bad Request' });
      if (foundDevice) return res.status(409).json({ error: 'Already Registered' });
      new Device({
        deviceId: deviceId.toLowerCase(),
        friendlyName,
        userEmail,
      }).save();
      return res.status(200).json({ 'Status:': 'Success' });
    });
  });
};
