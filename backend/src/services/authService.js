const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

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

  const token = generateToken(user);

  return {
    user,
    token,
  };
};

module.exports = {
  registerUser,
  loginUser,
};