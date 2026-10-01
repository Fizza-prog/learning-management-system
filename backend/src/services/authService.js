/**
 * @file authService.js
 * @description Implements authentication and account security workflows.
 *
 * Responsibilities:
 * - Authenticate users and manage access and refresh tokens.
 * - Handle password recovery, email verification, and account changes.
 */

import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import crypto from "crypto";
import sanitizeUser from "../utils/sanitizeUser.js";
import sendEmail from "../utils/sendEmail.js";
import verificationEmail from "../utils/verificationEmail.js";
import AppError from "../utils/AppError.js";
import { createAuditLog } from "./auditLogService.js";
import School from "../models/School.js";
import emailChangeVerificationEmail from "../utils/emailChangeVerificationEmail.js";
import { validatePassword } from "../utils/validatePassword.js";

const loginUser = async (userData, ipAddress) => {
  const { email, password } = userData;

  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    await createAuditLog({
      userId: null,
      schoolId: null,
      action: "FAILED_LOGIN",
      entity: "User",
      entityId: null,
      metadata: {
        email: email,
        reason: "USER_NOT_FOUND",
      },
      ipAddress,
    });

    throw new AppError("User not found.", 404);
  }

  const isMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isMatch) {
    await createAuditLog({
      userId: user.id,
      schoolId: user.schoolId,
      action: "FAILED_LOGIN",
      entity: "User",
      entityId: user.id,
      metadata: {
        reason: "INVALID_PASSWORD",
      },
      ipAddress,
    });

    throw new AppError("Invalid credentials.", 401);
  }

  if (user.schoolId) {
    const school = await School.findByPk(user.schoolId);

    if (school && !school.isActive) {
      throw new AppError(
        "Your school is currently inactive.",
        403
      );
    }
  }

  if (!user.isVerified) {
    throw new AppError(
      "Email not verified. Please verify your email before logging in.",
      403
    );
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
    throw new AppError(
      "Refresh token required.",
      401
    );
  }

  const user = await User.findOne({
    where: {
      refreshToken: token,
    },
  });

  if (!user) {
    throw new AppError(
      "Invalid refresh token.",
      401
    );
  }

  try {
    jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET
    );
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new AppError(
        "Refresh token expired.",
        401
      );
    }

    throw new AppError(
      "Invalid refresh token.",
      401
    );
  }

  if (user.schoolId) {
    const school = await School.findByPk(
      user.schoolId
    );

    if (school && !school.isActive) {
      throw new AppError(
        "Your school is currently inactive.",
        403
      );
    }
  }

  const accessToken = generateAccessToken(user);

  return {
    accessToken,
  };
};

const logoutUser = async (token) => {
  if (!token) {
    throw new AppError(
      "Refresh token required.",
      401
    );
  }

  const user = await User.findOne({
    where: {
      refreshToken: token,
    },
  });

  if (!user) {
    throw new AppError(
      "Invalid refresh token.",
      401
    );
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
    throw new AppError(
      "User not found.",
      404
    );
  }

  const resetToken = crypto
    .randomBytes(32)
    .toString("hex");

  const resetTokenExpiry = new Date(
    Date.now() + 10 * 60 * 1000
  );

  await user.update({
    resetPasswordToken: resetToken,
    resetPasswordExpiry: resetTokenExpiry,
  });

  const resetLink =
    `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const html = `
    <h2>Reset your password</h2>
    <p>
      Click the button below to reset your password.
    </p>
    <a
      href="${resetLink}"
      style="
        background-color: #4f46e5;
        color: white;
        padding: 12px 20px;
        text-decoration: none;
        border-radius: 6px;
        display: inline-block;
      "
    >
      Reset Password
    </a>
  `;

  await sendEmail(
    user.email,
    "Reset Password",
    html
  );

  return {
    message:
      "Password reset email sent successfully.",
  };
};

const resetPasswordService = async (
  token,
  newPassword,
  ipAddress
) => {
  const user = await User.findOne({
    where: {
      resetPasswordToken: token,
    },
  });

  if (!user) {
    throw new AppError(
      "Invalid reset token.",
      400
    );
  }

  if (user.resetPasswordExpiry < new Date()) {
    throw new AppError(
      "Reset token expired.",
      400
    );
  }

  validatePassword(newPassword);

  const hashedPassword = await bcrypt.hash(
    newPassword,
    10
  );

  await user.update({
    password: hashedPassword,
    resetPasswordToken: null,
    resetPasswordExpiry: null,
  });

  await createAuditLog({
    userId: user.id,
    schoolId: user.schoolId,
    action: "PASSWORD_RESET",
    entity: "User",
    entityId: user.id,
    metadata: {},
    ipAddress,
  });

  return "Password reset successfully.";
};

const changePasswordService = async (
  userId,
  currentPassword,
  newPassword,
  ipAddress
) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new AppError(
      "User not found.",
      404
    );
  }

  const isMatch = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!isMatch) {
    throw new AppError(
      "Current password is incorrect.",
      401
    );
  }

  const isSamePassword = await bcrypt.compare(
    newPassword,
    user.password
  );

  if (isSamePassword) {
    throw new AppError(
      "New password must be different from your current password.",
      400
    );
  }

  validatePassword(newPassword);

  const hashedPassword = await bcrypt.hash(
    newPassword,
    10
  );

  await user.update({
    password: hashedPassword,

    // Invalidate existing refresh token.
    refreshToken: null,
  });

  await createAuditLog({
    userId: user.id,
    schoolId: user.schoolId,
    action: "PASSWORD_CHANGED",
    entity: "User",
    entityId: user.id,
    metadata: {},
    ipAddress,
  });

  return {
    message:
      "Password changed successfully. Please log in again.",
  };
};

const changeEmailService = async (
  userId,
  newEmail,
  currentPassword,
  ipAddress
) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new AppError(
      "User not found.",
      404
    );
  }

  // 60-second cooldown
  const now = new Date();

  if (
    user.lastEmailChangeRequest &&
    now - user.lastEmailChangeRequest < 60000
  ) {
    throw new AppError(
      "Please wait before requesting another email change.",
      429
    );
  }

  const isMatch = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!isMatch) {
    throw new AppError(
      "Current password is incorrect.",
      401
    );
  }

  if (
    newEmail.toLowerCase() ===
    user.email.toLowerCase()
  ) {
    throw new AppError(
      "New email must be different from your current email.",
      400
    );
  }

  const existingUser = await User.findOne({
    where: {
      email: newEmail,
    },
  });

  if (existingUser) {
    throw new AppError(
      "This email is already in use.",
      409
    );
  }

  const emailChangeToken = crypto
    .randomBytes(32)
    .toString("hex");

  const emailChangeExpiry = new Date(
    Date.now() + 10 * 60 * 1000
  );

  await user.update({
    pendingEmail: newEmail,
    emailChangeToken,
    emailChangeExpiry,
  });

  const verificationLink =
    `${process.env.CLIENT_URL}/verify-email-change/${emailChangeToken}`;

  const emailBody = emailChangeVerificationEmail(
    user.firstName,
    newEmail,
    verificationLink
  );

  await sendEmail(
    newEmail,
    "Verify your new email address",
    emailBody
  );

  // Start cooldown only after email is successfully sent.
  await user.update({
    lastEmailChangeRequest: new Date(),
  });

  // Audit successful email-change request.
  await createAuditLog({
    userId: user.id,
    schoolId: user.schoolId,
    action: "EMAIL_CHANGE_REQUESTED",
    entity: "User",
    entityId: user.id,
    metadata: {},
    ipAddress,
  });

  return {
    message:
      "Verification email sent to your new email address.",
  };
};

const verifyEmailService = async (token) => {
  const user = await User.findOne({
    where: {
      emailVerificationToken: token,
    },
  });

  if (!user) {
    throw new AppError(
      "Invalid verification token.",
      400
    );
  }

  if (
    user.emailVerificationExpiry < new Date()
  ) {
    throw new AppError(
      "Verification token has expired.",
      400
    );
  }

  user.isVerified = true;
  user.emailVerificationToken = null;
  user.emailVerificationExpiry = null;

  await user.save();

  return {
    message:
      "Email verified successfully.",
  };
};

// RESEND VERIFICATION EMAIL
const resendVerificationEmailService =
  async (email) => {
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      throw new AppError(
        "User not found.",
        404
      );
    }

    if (user.isVerified) {
      throw new AppError(
        "Email is already verified.",
        400
      );
    }

    const now = new Date();

    if (
      user.lastVerificationEmailSent &&
      now -
        user.lastVerificationEmailSent <
        60000
    ) {
      throw new AppError(
        "Please wait before requesting another verification email.",
        429
      );
    }

    const verificationToken = crypto
      .randomBytes(32)
      .toString("hex");

    const verificationExpiry = new Date(
      Date.now() +
        24 * 60 * 60 * 1000
    );

    await user.update({
      emailVerificationToken:
        verificationToken,
      emailVerificationExpiry:
        verificationExpiry,
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

    await user.update({
      lastVerificationEmailSent:
        new Date(),
    });

    return {
      message:
        "Verification email sent successfully.",
    };
  };

const verifyEmailChangeService = async (
  token,
  ipAddress
) => {
  const user = await User.findOne({
    where: {
      emailChangeToken: token,
    },
  });

  if (!user) {
    throw new AppError(
      "Invalid email change token.",
      400
    );
  }

  if (
    user.emailChangeExpiry < new Date()
  ) {
    throw new AppError(
      "Email change token has expired.",
      400
    );
  }

  const existingUser = await User.findOne({
    where: {
      email: user.pendingEmail,
    },
  });

  if (existingUser) {
    throw new AppError(
      "This email is already in use.",
      409
    );
  }

  user.email = user.pendingEmail;
  user.pendingEmail = null;
  user.emailChangeToken = null;
  user.emailChangeExpiry = null;

  // Force login again after changing email.
  user.refreshToken = null;

  await user.save();

  // Audit actual email change.
  await createAuditLog({
    userId: user.id,
    schoolId: user.schoolId,
    action: "EMAIL_CHANGED",
    entity: "User",
    entityId: user.id,
    metadata: {},
    ipAddress,
  });

  return {
    message:
      "Email changed successfully. Please log in again.",
  };
};

export {
  loginUser,
  refreshAccessToken,
  logoutUser,
  forgotPasswordService,
  resetPasswordService,
  changePasswordService,
  changeEmailService,
  verifyEmailService,
  verifyEmailChangeService,
  resendVerificationEmailService,
};

