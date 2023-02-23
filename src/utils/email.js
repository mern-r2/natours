const nodemailer = require('nodemailer');

const env = require('../config/env');

const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: env.emailHost,
    port: env.emailPort,
    auth: {
      user: env.emailUser,
      pass: env.emailPassword,
    },
  });

  // Define the email options
  const mailOptions = {
    from: 'Artur Aquino <hello@artur.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  // Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
