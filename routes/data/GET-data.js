const Data = require('../../models/data');

module.exports = (app) => {
    app.get('/device/getData', (req, res) => {
        if (!req.query.mac) return res.status(400).json({ error: 'No MAC address provided.' });
        if (!req.query.points) return res.status(400).json({ error: 'Please specify number of data points.' });
        mac = req.query.mac.replace(/(..)/g, '$1:').slice(0, -1);
        points = Number(req.query.points);
        Data.find({ deviceId: mac }).sort({timestamp: -1}).limit(points).exec((err, Data) => {
            if (err) return res.status(400).json({ error: 'Bad Request' });
            if (Data == null) return res.status(404).json({ error: 'Not found.' });
            return res.status(200).json({ Data });
        })
    });
};