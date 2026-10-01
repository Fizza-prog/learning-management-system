/**
 * @file supportService.js
 * @description Processes authenticated support contact requests.
 *
 * Responsibilities:
 * - Validate the submitted support subject and message.
 * - Send the request through the configured email service.
 */
import sendEmail from "../utils/sendEmail.js";
import AppError from "../utils/AppError.js";
import User from "../models/User.js";

const contactSupportService = async (
  userId,
  subject,
  message
) => {
  if (!subject || !message) {
    throw new AppError(
      "Subject and message are required.",
      400
    );
  }

  const user = await User.findByPk(userId);

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  const emailSubject = `LMS Support: ${subject}`;

  const emailBody = `
    <h2>New Support Request</h2>

    <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>

    <p><strong>Email:</strong> ${user.email}</p>

    <p><strong>Role:</strong> ${user.role}</p>

    <p><strong>Subject:</strong> ${subject}</p>

    <p><strong>Message:</strong></p>

    <p>${message}</p>
  `;

  await sendEmail(
    process.env.SUPPORT_EMAIL,
    emailSubject,
    emailBody
  );

  return {
    message:
      "Your message has been sent to support successfully.",
  };
};

export { contactSupportService };