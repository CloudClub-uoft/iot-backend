module.exports = (app, db) => {
  app.post('/device/unregister', (req, res, next) => {
    // TODO
    // INPUT: deviceid
    // Deletes the device associated with this deviceid
    // OUTPUT: Success/failure
    res.sendStatus(404)
  });
}