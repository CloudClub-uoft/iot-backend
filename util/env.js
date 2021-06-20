const dotenv = require('dotenv');

exports.configure = () => {
  const result = dotenv.config();
  if (result.error) {
    if (result.error.code === 'ENOENT') return;
    throw result.error;
  }
  return 0;
};
