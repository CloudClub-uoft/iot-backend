const fs = require('fs');
const path = require('path');

const routePath = path.resolve(__dirname);

exports.boot = (app) => {
  (function traverse(dir) {
    fs.readdirSync(dir).forEach((file) => {
      const dirPath = path.join(dir, file);
      const isDirectory = fs.lstatSync(dirPath).isDirectory();
      if (isDirectory) traverse(dirPath);
      if (file !== 'routing.js' && !isDirectory) {
      // routes/filename, slicing off '.js'
        const cleanPath = `${dir}/${file.substr(0, file.indexOf('.'))}`;
        const route = path.resolve(cleanPath);
        // load the route
        // eslint-disable-next-line import/no-dynamic-require, global-require
        require(route)(app);
      }
    });
  }(routePath));
};
