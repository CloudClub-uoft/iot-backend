require('./util/env').configure(); // configure the environment variables
require('./util/connection'); // configure mongoose db connection
const express = require('express');

// Express config
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Dynamic route loading
require('./routes/routing').boot(app);

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});

if (!process.env.PRODUCTION) module.exports = app; // export for testing
