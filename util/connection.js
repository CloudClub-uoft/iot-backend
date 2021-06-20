// Set up mongoose connection
const mongoose = require('mongoose');

const mongoDB = process.env.URI_MONGO;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).catch(() => {
  console.log('MongoDB connection error: Exiting.');
  process.exit(1);
});

// Error listener
mongoose.connection.on('error', () => {
  console.error.bind(console, 'MongoDB connection error: Exiting.');
  process.exit(1);
});
