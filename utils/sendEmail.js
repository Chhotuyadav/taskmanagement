const nodemailer = require('nodemailer');

async function sendEmail(to, subject, text, html='') {
    console.log("in send email")
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.MAIL_USER,
    to,
    subject,
    text,
    html,
  };
  console.log("mail option", mailOptions);

  try {
    const info = await transporter.sendMail(mailOptions);
    //console.log('Email sent: ', info.messageId);
    return  info.messageId;
  } catch (error) {
    //console.error('Error sending email: ', error);
    return error;
  }
}

module.exports = {sendEmail};