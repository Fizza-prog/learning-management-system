const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");
const crypto = require("crypto");
const sanitizeUser = require("../utils/sanitizeUser");
const sendEmail = require("../utils/sendEmail");
const verificationEmail = require(
  "../utils/verificationEmail"
);

const registerUser = async (userData) => {
  const {
    schoolId,
    firstName,
    lastName,
    email,
    password,
    role,
  } = userData;

  const existingUser = await User.findOne({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const verificationToken = crypto.randomBytes(32).toString("hex");

  const verificationExpiry =
  new Date(Date.now() + 24 * 60 * 60 * 1000);

  const user = await User.create({
    schoolId,
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    isVerified: false,
    emailVerificationToken: verificationToken,
    emailVerificationExpiry: verificationExpiry,
  });

    const verificationLink =
    `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    const emailBody = verificationEmail(
    user.firstName,
    verificationLink
   );

  await sendEmail(
    user.email,
    "Verify your email",
    emailBody
  );

  return sanitizeUser(user);
};

const loginUser = async (userData) => {
  const { email, password } = userData;

  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  const isMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isMatch) {
    throw new Error("Invalid credentials.");
  }

  if(!user.isVerified) {
    throw new Error("Email not verified. Please verify your email before logging in.");
  }

  const accessToken = generateAccessToken(user);

const refreshToken = generateRefreshToken(user);

await user.update({
  refreshToken,
});

return {
  ...sanitizeUser(user),
  accessToken,
  refreshToken,
};
};

const refreshAccessToken = async (token) => {
  if (!token) {
    throw new Error("Refresh token required.");
  }

  const user = await User.findOne({
    where: {
      refreshToken: token,
    },
  });

  if (!user) {
    throw new Error("Invalid refresh token.");
  }

  jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET,
    (error) => {
      if (error) {
        throw new Error("Refresh token expired.");
      }
    }
  );

  const accessToken = generateAccessToken(user);

  return {
    accessToken,
  };
};

const logoutUser = async (token) => {
  if (!token) {
    throw new Error("Refresh token required.");
  }

  const user = await User.findOne({
    where: {
      refreshToken: token,
    },
  });

  if (!user) {
    throw new Error("Invalid refresh token.");
  }

  await user.update({
    refreshToken: null,
  });

  return true;
};

const forgotPasswordService = async (email) => {
  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  const resetToken = crypto.randomBytes(32).toString(
    "hex"
  );

  const resetTokenExpiry = new Date(
    Date.now() + 10 * 60 * 1000
  );

  await user.update({
    resetPasswordToken: resetToken,
    resetPasswordExpiry: resetTokenExpiry,
  });

  const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const message = `
Click the link below to reset your password:

${resetLink}

This link will expire in 10 minutes.
`;

  await sendEmail(
    user.email,
    "Password Reset Request",
    message
  );

  return "Password reset email sent successfully.";
};

const resetPasswordService = async (token, newPassword) => {
  const user = await User.findOne({
    where: {
      resetPasswordToken: token,
    },
  });

  if (!user) {
    throw new Error("Invalid reset token.");
  }

  if (user.resetPasswordExpiry < new Date()) {
    throw new Error("Reset token expired.");
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    10
  );

  await user.update({
    password: hashedPassword,
    resetPasswordToken: null,
    resetPasswordExpiry: null,
  });

  return "Password reset successfully.";
};

const verifyEmailService = async (token) => {

  const user = await User.findOne({
    where: {
      emailVerificationToken: token,
    },
  });

  if (!user) {
    throw new Error("Invalid verification token.");
  }


  if (user.emailVerificationExpiry < new Date()) {
    throw new Error("Verification token has expired.");
  }


  user.isVerified = true;

  user.emailVerificationToken = null;

  user.emailVerificationExpiry = null;


  await user.save();


  return {
    message: "Email verified successfully.",
  };
};
const resendVerificationEmailService = async (
  email
) => {
  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  if (user.isVerified) {
    throw new Error(
      "Email is already verified."
    );
  }

  const now = new Date();

  if (
    user.lastVerificationEmailSent &&
    now - user.lastVerificationEmailSent <
      60000
  ) {
    throw new Error(
      "Please wait before requesting another verification email."
    );
  }

  const verificationToken = crypto
    .randomBytes(32)
    .toString("hex");

  const verificationExpiry = new Date(
    Date.now() + 24 * 60 * 60 * 1000
  );

  await user.update({
    emailVerificationToken:
      verificationToken,

    emailVerificationExpiry:
      verificationExpiry,
  });

  const verificationLink = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

  const emailBody = verificationEmail(
    user.firstName,
    verificationLink
  );

  await sendEmail(
    user.email,
    "Verify your email",
    emailBody
  );

  await user.update({
    lastVerificationEmailSent:
      new Date(),
  });

  return {
    message:
      "Verification email sent successfully.",
  };
};
module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  forgotPasswordService,
  resetPasswordService,
  verifyEmailService,
  resendVerificationEmailService
};