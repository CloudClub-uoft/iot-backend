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
        // creates the directory if it does not exist
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir);
        }

        // ensures the storage directory for the device's id exists
        const storageDir = path.join(__dirname, '..', '..', 'uploads', deviceId);
        if (!fs.existsSync(storageDir)) {
          fs.mkdirSync(storageDir);
        }
      }
    }).on('fileBegin', (name, file) => {
      // this is called when a file upload is begining
      // specify the location that the file is uploaded to
      file.path = path.join(__dirname, '..', '..', 'uploads', deviceId, file.name);
    });

    form.parse(req, (err) => {
      // let express handle the error
      if (err) {
        next(err);
        return res.sendStatus(500);
      }

      return res.sendStatus(204);
    });
  });
};
