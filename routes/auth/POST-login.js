const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = require('../../util/mysql');

module.exports = (app) => {
  app.post('/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (email === undefined || password === undefined) {
      return res.status(400).json({ error: 'Missing fields, check our API docs at cloudclub.ca/api' });
    }
    db.query(`SELECT * FROM cloudclub.logins WHERE email='${email}'`, (err1, result1) => {
      if (err1) return res.status(500).json({ error: 'Internal Server Error 500' });
      if (result1.length === 1) {
        bcrypt.compare(password, result1[0].password, (err2, result2) => {
          if (err2) return res.status(500).json({ error: 'Internal Server Error 500' });

          if (result2) {
            const jwtExpiry = 24 * 60 * 60; // 1 day in seconds
            const token = jwt.sign({ email }, process.env.JWT_KEY, {
              algorithm: 'HS256',
              expiresIn: jwtExpiry,
            });

            res.cookie('token', token, { maxAge: jwtExpiry * 1000 });
            return res.status(200).json({ message: 'Login Successful!' });
          }
          return res.status(401).json({ error: 'Password incorrect.' });
        });
      } else if (result1.length === 0) {
        return res.status(401).json({ error: 'Email not found.' });
      } else {
        console.log(`ERROR: Duplicate login entry under email '${email}'`);
        return res.status(500).json({ error: 'Internal Server Error 500' });
      }
    });
  });
};
