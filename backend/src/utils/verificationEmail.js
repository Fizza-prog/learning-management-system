const verificationEmail = (
  firstName,
  verificationLink
) => {
  return `
    <h2>Hello ${firstName},</h2>

    <p>
      Thank you for registering.
    </p>

    <p>
      Please click the button below to verify your email.
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
      Verify Email
    </a>

    <p>
      This link will expire in 24 hours.
    </p>
  `;
};

module.exports = verificationEmail;