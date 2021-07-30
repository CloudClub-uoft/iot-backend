const jwt = require('jsonwebtoken');

const Device = require('../../models/device');

module.exports = (app) => {
  app.post('/device/unregister', (req, res) => {
    const { token } = req.cookies || {};
    try {
      jwt.verify(token, process.env.JWT_KEY);
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) return res.status(401).json({ Error: 'Unauthorized 401' });
      return res.status(400).json({ Error: 'Bad Request 400' });
    }

    const deviceId = req.body.deviceId.toLowerCase();

    Device.findOneAndDelete({ deviceId }, (err, foundDevice) => {
      if (err) return res.status(400).json({ error: 'Bad Request' });
      if (foundDevice == null) return res.status(404).json({ error: 'No device found.' });
      return res.status(200).json({ message: 'Device successfully unregistered.' });
    });
  });
};
