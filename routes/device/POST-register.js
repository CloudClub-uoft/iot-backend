require('../../models/device');
const uuidApiKey = require('uuid-apikey');

module.exports = (app, db) => {
  app.post('/device/register', (req, res, next) => {
    // TODO
    // INPUT: HARDWARE ID, friendly-name
    // the device information is stored
    // OUTPUT: success/failure
    const { mac, name } = req.body;
    const { uuid, apiKey } = uuidApiKey.create();
  
    const Device = db.model('Device');
    new Device({
      deviceId: mac,
      friendlyName: name,
      uuid,
      apikey: apiKey,
    }).save();
  
    return res.status(200).json({ apiKey });
  });
}