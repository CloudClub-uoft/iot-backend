const express = require('express');

module.exports = (app) => {
  app.use('/',express.static(process.env.FRONTEND_BUILD_DIRECTORY));
};
