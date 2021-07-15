const uuidApiKey = require('uuid-apikey');

const Device = require('../../models/device');

module.exports = (app) => {
  app.post('/device/register', (req, res) => {
    // TODO
    // INPUT: HARDWARE ID, friendly-name
    // the device information is stored
    // OUTPUT: success/failure
    const { deviceId, friendlyName } = req.body;
    if (!deviceId || !deviceId.match(/([0-9A-Fa-f]{2}){6}/) || !friendlyName) return res.status(400).json({ error: 'Bad Request' });
    const { uuid, apiKey } = uuidApiKey.create();

    new Device({
      deviceId: deviceId.toLowerCase(),
      friendlyName,
      uuid,
      apiKey,
    }).save();

    return res.status(200).json({ apiKey });
  });
};
