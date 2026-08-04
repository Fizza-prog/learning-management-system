const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");

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

  return user;
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
  user,
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

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
};