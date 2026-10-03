/**
 * @file sendEmail.js
 * @description Sends application email through the configured SMTP provider.
 *
 * Responsibilities:
 * - Configure the Nodemailer transport from environment values.
 * - Deliver messages requested by account and support services.
 */
import nodemailer from "nodemailer";

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

export default sendEmail;