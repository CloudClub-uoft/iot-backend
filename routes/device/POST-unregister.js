const Device = require('../../models/device');

module.exports = (app, db) => {
  app.post('/device/unregister', (req, res, next) => {
    
    // TODO
    // INPUT: deviceid (mac address)
    // Deletes the device associated with this deviceid (mac address)
    // OUTPUT: Success/failure
    
    const { deviceId } = req.body;

    //checks to ensure there is at least one matching device in the database
    Device.findOne({ deviceId: deviceId }, function (err, foundDevice) {
      if (err) {
        return res.status(400);
      }

      //if it is null, it was not found in the databse
      if(foundDevice == null){
        return res.status(404);
      }

    });

    //deletes the item with matching mac address
    Device.deleteOne({ deviceId: deviceId }, function (err) {
      if (err) {
        res.sendStatus(404);
      }
    });

    res.sendStatus(200);
  });
}