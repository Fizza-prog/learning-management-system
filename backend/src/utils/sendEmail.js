const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (
  email,
  subject,
  message
) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html: message,
  });
};

module.exports = sendEmail;