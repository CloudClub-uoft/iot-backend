//Set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = process.env.URI_MONGO;

class Connection {
   
    constructor() {
        this._connect();
    }

    _connect() {

        mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            console.log('MongoDB connected.');
        }).catch(() => {
            console.log('MongoDB connection error: Exiting.')
            process.exit(1);
        });
        var db = mongoose.connection;
        db.on('error', () => {
            console.error.bind(console, 'MongoDB connection error: Exiting.')
            process.exit(1);
        });        
    
    }

}

module.exports = new Connection();
