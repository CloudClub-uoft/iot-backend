const aedes = require('aedes')();
const server = (process.env.PRODUCTION) ? require('tls') : require('net');
const mqtt = require('mqtt');
const fs = require('fs');

function eventHandler(client) {
  fs.readdirSync('./events').filter((file) => file.endsWith('.js')).forEach((file) => {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const event = require(`../events/${file}`);
    client.on(event.name, (...args) => event.execute(...args, client));
  });
}

if (process.env.PRODUCTION) {
  const options = {
    key: fs.readFileSync(process.env.DEVICE_SERVER_KEY_PATH),
    cert: fs.readFileSync(process.env.DEVICE_SERVER_CERT_PATH),
    ca: fs.readFileSync(process.env.DEVICE_SERVER_CA_PATH),
    requestCert: true,
  };

  server.createServer(options, aedes.handle).listen(process.env.MQTT_PORT || 1883,
    function listen() {
      console.log(`MQTTS broker started and listening on port ${this.address().port}`);
    });

  const client = mqtt.connect({
    protocol: 'mqtts',
    host: 'localhost',
    port: process.env.MQTT_PORT || 1883,
    key: fs.readFileSync(process.env.MQTT_CLIENT_KEY_PATH),
    cert: fs.readFileSync(process.env.MQTT_CLIENT_CERT_PATH),
    rejectUnauthorized: false,
  });
  eventHandler(client);
} else {
  server.createServer(aedes.handle).listen(process.env.MQTT_PORT || 1883,
    function listen() {
      console.log(`MQTT broker started and listening on port ${this.address().port}`);
    });

  const client = mqtt.connect();
  eventHandler(client);
}
