/**
 * @file generateToken.js
 * @description Creates signed access and refresh tokens for user sessions.
 *
 * Responsibilities:
 * - Encode user identity and role claims in access tokens.
 * - Create refresh tokens with their configured lifetime.
 */
import jwt from "jsonwebtoken";

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

export {
  generateAccessToken,
  generateRefreshToken,
};