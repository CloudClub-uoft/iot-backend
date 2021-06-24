const fs = require('fs');
const path = require('path');

const routePath = path.resolve('./routes');

exports.boot = (app) => {
  (function traverse(dir) {
    fs.readdirSync(dir).forEach((file) => {
      const dirPath = path.join(dir, file);
      const isDirectory = fs.lstatSync(dirPath).isDirectory();
      if (isDirectory) traverse(dirPath);
      if (!isDirectory) {
        // routes/filename, slicing off '.js'
        const cleanPath = `${dir}/${file.substr(0, file.indexOf('.'))}`;
        const route = path.resolve(cleanPath);
        // eslint-disable-next-line import/no-dynamic-require, global-require
        require(route)(app);
      }
    });
  }(routePath));
};
