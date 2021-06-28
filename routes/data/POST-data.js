const Data = require('../../models/data');
const Device = require('../../models/device');

module.exports = (app) => {
    app.post('/data/new', (req, res) => {
        const { apiKey, deviceId, temperature, location } = req.body;
        const newData = { deviceId:deviceId, temperature: temperature, location: location, timestamp: Date.now() };
        Device.findOne({ apiKey: apiKey }, (err, foundDevice) => {
            if (err) return res.status(400).json({ error: 'Bad Request' });
            if (foundDevice == null) return res.status(401).json({ error: 'Unauthorized' });
            Data.create( newData, (err, Data) =>{
                if (err) return res.status(400).json({ error: 'Bad Request' });
                return res.sendStatus(201);
            });
        });
    });
};