const jwt = require('jsonwebtoken');
const uuidApiKey = require('uuid-apikey');

const Device = require('../../models/device');

module.exports = (app) => {
  app.post('/device/register', (req, res) => {
    const { token } = req.cookies || {};
    try {
      jwt.verify(token, process.env.JWT_KEY);
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) return res.status(401).json({ Error: 'Unauthorized 401' });
      return res.status(400).json({ Error: 'Bad Request 400' });
    }

    const { deviceId, friendlyName } = req.body;
    if (!deviceId || !deviceId.match(/([0-9A-Fa-f]{2}){6}/) || !friendlyName) return res.status(400).json({ error: 'Bad Request' });
    const { uuid, apiKey } = uuidApiKey.create();

    new Device({
      deviceId: deviceId.toLowerCase(),
      friendlyName,
      uuid,
      apiKey,
    }).save().then(() => res.status(200).json({ apiKey }));
  });
};
