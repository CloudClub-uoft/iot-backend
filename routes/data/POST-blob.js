const formidable = require('formidable');
const path = require('path');
const fs = require('fs');

module.exports = (app) => {
  app.post('/data/blob', (req, res, next) => {
    const form = formidable({
      // allow multiple files to upload simultaneously
      multiples: true,
      // 1mb upload limit
      maxFileSize: 1024 * 1024 * 1,
    });

    // this needs to be in global scope, but must be defined inside the form.on method
    let deviceId = '';

    // is called when a field is found in the form
    form.on('field', (fieldName, value) => {
      // if the field is named deviceId, extract the mac address
      if (fieldName === 'deviceId') {
        // uses regex to replace all colons and periods with dashs
        // since mac addresses have several valid formats
        deviceId = value.replace(/:|\./g, '-');

        // get the uploads directory path
        const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
        try {
          // creates the directory if it does not exist
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir);
          }

          // ensures the storage directory for the device's id exists
          const storageDir = path.join(__dirname, '..', '..', 'uploads', deviceId);
          if (!fs.existsSync(storageDir)) {
            fs.mkdirSync(storageDir);
          }
        } catch (err) {
          next(err);
          return res.status(500).json({ error: 'Server error while creating upload directory' });
        }
      } else {
        return res.status(400).json({ error: 'Only provide the device mac address under fieldname "deviceId"' });
      }
    }).on('fileBegin', (name, file) => {
      // this is called when a file upload is begining
      // specify the location that the file is uploaded to
      if (deviceId === '' || deviceId == null) {
        return res.status(400).json({ error: 'Server error: could not find device mac address in request' });
      }
      file.path = path.join(__dirname, '..', '..', 'uploads', deviceId, file.name);
    });

    form.parse(req, (err, fields) => {
      if (Object.keys(fields).length !== 1) {
        // Bad request return code
        return res.status(400).json({ error: 'Only provide the device mac address under fieldname "deviceId"' });
      }

      // let express handle the error
      if (err) {
        next(err);
        return res.status(500).json({ error: 'Server error while uploading file' });
      }
      return res.sendStatus(204);
    });
  });
};
