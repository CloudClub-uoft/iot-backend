const mongoose = require('mongoose');

const BlobLogSchema = new mongoose.Schema({
  // ETag holds information related to file checksums
  ETag: {
    type: String,
    required: true,
  },
  versionId: {
    type: String,
    required: true,
  },
  // location is the url
  location: {
    type: String,
    required: true,
  },
  // key is the full object name in s3
  key: {
    type: String,
    required: true,
  },
  // the name of the bucket the blob was stored in
  bucket: {
    type: String,
    required: true,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
});

const BlobLog = mongoose.model('BlobTransaction', BlobLogSchema);
module.exports = BlobLog;
