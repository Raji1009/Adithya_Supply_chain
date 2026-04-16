const nodemailer = require('nodemailer');
const env = require('../config/env');

const transporter = nodemailer.createTransport({
  host: env.smtpHost,
  port: env.smtpPort,
  secure: env.smtpPort === 465,
  auth: env.smtpUser ? { user: env.smtpUser, pass: env.smtpPass } : undefined
});

exports.sendMail = async ({ to, subject, html }) => {
  if (!env.smtpHost) {
    console.log(`Email not sent (SMTP not configured). To: ${to}, Subject: ${subject}`);
    return;
  }

  await transporter.sendMail({
    from: env.smtpFrom,
    to,
    subject,
    html
  });
};
