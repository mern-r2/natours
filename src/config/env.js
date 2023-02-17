require('dotenv').config({ path: `${__dirname}/dev.env` });

const env = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
};

module.exports = env;
