module.exports = (app) => {
    app.post('/data/blob', (req, res) => {
        res.sendStatus(404);
    });
};