module.exports = {
  name: 'message',

  execute(topic, message, packet, client) {
    console.log(message.toString());
    client.end();
  },
};
