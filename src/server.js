const mongoose = require('mongoose');

const env = require('./config/env');
const app = require('./app');

mongoose.set('strictQuery', false);

mongoose.connect(env.db).then(() => console.log('db connection successful!'));

const port = env.port || 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});
