require('./util/env').configure(); // configure the environment variables
require('./util/mongodb'); // configure mongoose db connection
require('./util/aedes'); // configure MQTT broker
const server = (process.env.NODE_ENV === 'production') ? require('https') : require('http');
const express = require('express');
const cors = require('cors');
const fs = require('fs');

// Express config
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Dynamic route loading
require('./util/router').boot(app);

if (process.env.NODE_ENV === 'production') {
  app.use(cors({ origin: `https://localhost:${process.env.WEBAPP_PORT}` }));
  const options = {
    key: fs.readFileSync(process.env.HTTPS_SERVER_KEY_PATH),
    cert: fs.readFileSync(process.env.HTTPS_SERVER_CERT_PATH),
    ca: fs.readFileSync(process.env.HTTPS_SERVER_CA_PATH),
  };

  server.createServer(options, app).listen(process.env.HTTPS_PORT || 443,
    function listen() {
      console.log(`HTTPS server started and listening on port ${this.address().port}`);
    });

  // eslint-disable-next-line global-require
  require('http').createServer((req, res) => {
    res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
    res.end();
  }).listen(process.env.HTTP_PORT || 80);
} else {
  app.use(cors({ origin: `http://localhost:${process.env.WEBAPP_PORT}` }));
  server.createServer(app).listen(process.env.HTTP_PORT || 80,
    function listen() {
      console.log(`HTTP server started and listening on port ${this.address().port}`);
    });
  module.exports = app; // export for testing
}
