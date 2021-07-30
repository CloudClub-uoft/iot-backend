const bcrypt = require('bcrypt');

const db = require('../util/mysql');

module.exports = (req, res, next) => {
  const { email, password } = req.body;
  if (email === undefined || password === undefined) {
    return res.status(400).json({ error: 'Missing fields, check our API docs at cloudclub.ca/api' });
  }
  db.query(`SELECT * FROM logins WHERE email='${email}'`, (err1, result1) => {
    if (err1) return res.status(500).json({ error: 'Internal Server Error 500' });
    if (result1.length === 1) {
      bcrypt.compare(password, result1[0].password, (err2, result2) => {
        if (err2) return res.status(500).json({ error: 'Internal Server Error 500' });
        if (result2) {
          res.locals.email = email;
          next();
        }
        if (!res.headersSent) res.status(401).json({ error: 'Password incorrect.' });
      });
    } else if (result1.length === 0) {
      return res.status(401).json({ error: 'Email not found.' });
    } else {
      console.log(`ERROR: Duplicate login entry under email '${email}'`);
      return res.status(500).json({ error: 'Internal Server Error 500' });
    }
  });
};
