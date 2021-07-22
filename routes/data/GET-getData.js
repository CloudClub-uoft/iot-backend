const jwt = require('jsonwebtoken');

const Data = require('../../models/data');

module.exports = (app) => {
  app.get('/data/getData', (req, res) => {
    const { token } = req.cookies || {};
    try {
      jwt.verify(token, process.env.JWT_KEY);
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) return res.status(401).json({ Error: 'Unauthorized 401' });
      return res.status(400).json({ Error: 'Bad Request 400' });
    }

    if (!req.query.mac) return res.status(400).json({ error: 'No MAC address provided.' });
    if (!req.query.points) return res.status(400).json({ error: 'Please specify number of data points.' });
    const mac = req.query.mac.replace(/(..)/g, '$1:').slice(0, -1);
    const points = Number(req.query.points);
    Data.find({ deviceId: mac }).sort({ timestamp: -1 }).limit(points).exec((err, doc) => {
      if (err) return res.status(400).json({ error: 'Bad Request' });
      if (doc == null) return res.status(404).json({ error: 'Not found.' });
      return res.status(200).json({ doc });
    });
  });
};
