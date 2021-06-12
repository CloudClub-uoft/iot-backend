const express = require ('express');
const routes = require('./routes/device'); // import the routes
require('./util/env').configure() //configure the environment variables
require('./util/connection');

const app = express();

app.use(express.json());

app.use('/device', routes); //to use the routes

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})