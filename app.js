/* eslint-disable global-require */
/* eslint-disable max-len */
require('./util/env').configure(); // configure the environment variables
require('./util/mongodb'); // configure mongoose db connection
require('./util/aedes'); // configure MQTT broker
require('./util/s3'); // configure s3 client
const https = (process.env.PRODUCTION) ? require('https') : {};
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Express config
const deviceApp = express();
deviceApp.use(express.urlencoded({ extended: true }));
deviceApp.use(express.json());
deviceApp.use(cookieParser());

const webApp = express();
webApp.use(express.urlencoded({ extended: true }));
webApp.use(express.json());
webApp.use(cookieParser());
const corsOptions = () => {
  const protocol = (process.env.DEBUG) ? 'http' : 'https';
  return {
    origin: `${protocol}://localhost:${process.env.WEBAPPPORT}`,
    credentials: true,
  };
};
webApp.use(cors(corsOptions()));

if (process.env.PRODUCTION) {
  const deviceAppOptions = {
    key: fs.readFileSync(process.env.WEB_SERVER_KEY_PATH),
    cert: fs.readFileSync(process.env.WEB_SERVER_CERT_PATH),
    ca: fs.readFileSync(process.env.WEB_SERVER_CA_PATH),
  };
  const webAppOptions = {
    key: fs.readFileSync(process.env.DEVICE_SERVER_KEY_PATH),
    cert: fs.readFileSync(process.env.DEVICE_SERVER_CERT_PATH),
    ca: fs.readFileSync(process.env.DEVICE_SERVER_CA_PATH),
    requestCert: true,
  };
  // Dynamic route loading
  require('./util/router').boot(deviceApp, 'device');
  https.createServer(deviceAppOptions, deviceApp).listen(process.env.PORT || 3000, function listen() {
    console.log(`Device HTTPS server started and listening on port ${this.address().port}`);
  });
  require('./util/router').boot(webApp, 'api');
  https.createServer(webAppOptions, webApp).listen(process.env.WEBPORT || 3001, function listen() {
    console.log(`Webapp HTTPS server started and listening on port ${this.address().port}`);
  });
} else {
  require('./util/router').boot(deviceApp, 'device');
  deviceApp.listen(process.env.PORT || 3000, function listen() {
    console.log(`Device HTTP server started and listening on port ${this.address().port}`);
  });
  require('./util/router').boot(webApp, 'api');
  webApp.listen(process.env.WEBPORT || 3001, function listen() {
    console.log(`Webapp HTTP server started and listening on port ${this.address().port}`);
  });
}
module.exports = { deviceApp, webApp };
