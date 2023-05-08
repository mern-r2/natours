require('dotenv').config({ path: `${__dirname}/dev.env` });

const dayInMillisecs = 24 * 60 * 60 * 1000;

const db = process.env.DB.replace('<password>', process.env.DB_PASSWORD);

const env = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  db,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpires: parseInt(process.env.JWT_EXPIRES_IN, 10) * dayInMillisecs,
  emailHost: process.env.EMAIL_HOST,
  emailPort: process.env.EMAIL_PORT,
  emailUser: process.env.EMAIL_USER,
  emailPassword: process.env.EMAIL_PASSWORD,
  emailFrom: process.env.EMAIL_FROM,
  emailUserPrd: process.env.SENDGRID_USERNAME,
  emailPasswordPrd: process.env.SENDGRID_PASSWORD,
  stripeKey: process.env.STRIPE_SECRET_KEY,
};

module.exports = env;
