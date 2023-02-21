const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log('Uncaught Rejection! Shuting down...');
  console.log(err.name, err.message);
  process.exit(1); // shuts down abruptly
});

const env = require('./config/env');
const app = require('./app');

mongoose.set('strictQuery', false);

mongoose.connect(env.db).then(() => console.log('db connection successful!'));

const port = env.port || 3000;
const server = app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});

// Unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection! Shuting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
