const Agenda = require('agenda');
const nodemailer = require('nodemailer');
require('dotenv').config();

const agenda = new Agenda({ db: { address: process.env.MONGODB_URI, collection: 'agendaJobs' } });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

agenda.define('send-email', async (job) => {
  const { to, subject, body } = job.attrs.data;
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    text: body
  });
});

module.exports = { agenda };
