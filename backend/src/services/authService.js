const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");
const crypto = require("crypto");
const sanitizeUser = require("../utils/sanitizeUser");

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

  const user = await User.create({
    schoolId,
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
  });

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

  const accessToken = generateAccessToken(user);

const refreshToken = generateRefreshToken(user);

await user.update({
  refreshToken,
});

return {
  user: sanitizeUser(user),
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

  const resetToken = crypto.randomBytes(32).toString("hex");

  const resetTokenExpiry = new Date(
    Date.now() + 10 * 60 * 1000
  );

  await user.update({
    resetPasswordToken: resetToken,
    resetPasswordExpiry: resetTokenExpiry,
  });

  return resetToken;
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

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  forgotPasswordService,
  resetPasswordService,
};