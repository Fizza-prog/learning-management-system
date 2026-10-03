/**
 * @file emailChangeVerificationEmail.js
 * @description Builds the email-change verification message body.
 *
 * Responsibilities:
 * - Personalize the confirmation message and verification link.
 */
const emailChangeVerificationEmail = (
  firstName,
  newEmail,
  verificationLink
) => {
  return `
    <h2>Hello ${firstName},</h2>

    <p>
      You requested to change the email address
      associated with your LMS account.
    </p>

    <p>
      Your new email address is:
      <strong>${newEmail}</strong>
    </p>

    <p>
      Please click the button below to confirm this change.
    </p>

    <a
      href="${verificationLink}"
      style="
        display:inline-block;
        padding:10px 20px;
        background:#2563eb;
        color:white;
        text-decoration:none;
        border-radius:6px;
      "
    >
      Confirm Email Change
    </a>

    <p>
      This link will expire in 10 minutes.
    </p>
  `;
};

export default emailChangeVerificationEmail;