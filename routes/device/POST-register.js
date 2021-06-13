require('../../models/device');
const uuidApiKey = require('uuid-apikey');

module.exports = (app, db) => {
  app.post('/device/register', (req, res, next) => {
    // TODO
    // INPUT: HARDWARE ID, friendly-name
    // the device information is stored
    // OUTPUT: success/failure
    const { deviceId, friendlyName } = req.body;
    const { uuid, apiKey } = uuidApiKey.create();
  
    new db.model('Device') ({
      deviceId: deviceId,
      friendlyName: friendlyName,
      uuid: uuid,
      apiKey: apiKey,
    }).save();
  
    return res.status(200).json({ apiKey });
  });
}