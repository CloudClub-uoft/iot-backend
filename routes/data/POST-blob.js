const formidable = require('formidable');
const { PassThrough } = require('stream');
const s3Client = require('../../util/s3'); // configure s3 client
const BlobLog = require('../../models/blobLog');

module.exports = (app) => {
  app.post('/data/blob', (req, res, next) => {
    const uploadStream = (file) => {
      const pass = new PassThrough();
      s3Client.upload(
        {
          Bucket: process.env.BUCKET_NAME,
          Key: file.originalFilename,
          Body: pass,
        },
        (err, objectInfo) => {
          if (err) {
            next(err);
            return res.status(500).json({ error: 'Server error while uploading file' });
          }

          // adds a record of the transaction to the mongo database if the upload succeeded
          new BlobLog({
            ETag: objectInfo.ETag,
            versionId: objectInfo.VersionId,
            location: objectInfo.Location,
            key: objectInfo.key,
            bucket: objectInfo.Bucket,
          }).save().then(() => {
            // once this callback is called, return status 201 with the
           // URI under the location field in objectInfo
            return res.status(201).json(objectInfo);
          });
        },
      );
      return pass;
    };

    const form = formidable({
      // allow multiple files to upload simultaneously
      multiples: true,
      // 1mb upload limit
      maxFileSize: 1024 * 1024 * 1,
      fileWriteStreamHandler: uploadStream,
    });

    // this needs to be in global scope, but must be defined inside the form.on('field') method
    let deviceId = '';

    // is called when a field is found in the form
    form.on('field', (fieldName, value) => {
      if (fieldName === 'deviceId') {
        // uses regex to replace all colons and periods with dashs
        // since mac addresses have several valid formats
        deviceId = value.replace(/:|\./g, '');
      } else {
        return res.status(400).json({ error: 'Only provide the device mac address under fieldname "deviceId"' });
      }
    }).on('fileBegin', (_, file) => {
      // this is called when a file upload is begining
      if (deviceId === '' || deviceId == null) {
        return res.status(400).json({ error: 'Could not find device mac address in request' });
      }

      // update the filename to include the device mac address for searching
      file.originalFilename = deviceId.concat('_', file.originalFilename);
    }).on('error', (err) => {
      // catches the error emmitted when the upload exceeds the max size
      if (err.httpCode === 413) {
        return res.status(413).json({ error: `The upload size is too large, must be under ${form.options.maxFileSize} bytes` });
      }

      // catch any other unexpected errors
      return res.sendStatus(err.httpCode);
    });

    form.parse(req, (err, fields) => {
      if (Object.keys(fields).length !== 1) {
        // Bad request return code
        return res.status(400).json({ error: 'Only provide the device mac address under fieldname "deviceId"' });
      }
      // let express handle other errors
      if (err) {
        next(err);
        return res.status(500).json({ error: 'An unexpected error occured' });
      }
    });
  });
};
