module.exports = {
  name: 'connect',

  execute(connack, client) {
    console.log('MQTT client connected');
  },
};
