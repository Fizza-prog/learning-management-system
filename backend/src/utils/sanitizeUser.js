/**
 * @file sanitizeUser.js
 * @description Removes sensitive fields before returning user data.
 *
 * Responsibilities:
 * - Convert a user model to a plain object.
 * - Exclude credentials and verification secrets from the result.
 */
const sanitizeUser = (user) => {
  const userData = user.toJSON();

  delete userData.password;

  // Authentication / security fields
  delete userData.refreshToken;

  // Email verification fields
  delete userData.emailVerificationToken;
  delete userData.emailVerificationExpiry;
  delete userData.lastVerificationEmailSent;

  // Email change fields
  delete userData.pendingEmail;
  delete userData.emailChangeToken;
  delete userData.emailChangeExpiry;

  // Password reset fields
  delete userData.resetPasswordToken;
  delete userData.resetPasswordExpiry;

  return userData;
};

export default sanitizeUser;