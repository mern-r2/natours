require('dotenv').config({ path: `${__dirname}/dev.env` });

const db = process.env.DB.replace('<password>', process.env.DB_PASSWORD);

const env = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  db,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpires: process.env.JWT_EXPIRES_IN,
};

module.exports = env;
