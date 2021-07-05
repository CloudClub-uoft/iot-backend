require('./util/env').configure(); // configure the environment variables
require('./util/mongodb'); // configure mongoose db connection
require('./util/aedes'); // configure MQTT broker
const express = require('express');
const cookieParser = require('cookie-parser');

// Express config
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Dynamic route loading
require('./util/router').boot(app);

app.listen(process.env.PORT || 3000, function listen() {
  console.log(`Express server started and listening on port ${this.address().port}`);
});

if (!process.env.PRODUCTION) module.exports = app; // export for testing
