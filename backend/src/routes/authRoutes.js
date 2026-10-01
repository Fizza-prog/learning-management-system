/**
 * @file authRoutes.js
 * @description Registers authentication, recovery, and verification endpoints.
 *
 * Responsibilities:
 * - Route login, logout, profile, and refresh requests.
 * - Route password and email verification workflows.
 */
import express from "express";

import {
  login,
  getProfile,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
  changePassword,
  changeEmail,
  verifyEmailChange,
} from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/verify-email/:token",
  verifyEmail
);

router.post("/login", login);

router.get(
  "/profile",
  protect,
  getProfile
);

router.get(
  "/admin",
  protect,
  authorize("admin"),
  getProfile
);

router.post(
  "/refresh-token",
  refreshToken
);

router.post(
  "/logout",
  logout
);

router.post(
  "/forgot-password",
  forgotPassword
);

router.post(
  "/reset-password/:token",
  resetPassword
);

router.post(
  "/resend-verification-email",
  resendVerificationEmail
);

router.post(
  "/change-password",
  protect,
  changePassword
);

router.get(
  "/verify-email-change/:token",
  verifyEmailChange
);

router.post(
  "/change-email",
  protect,
  changeEmail
);


export default router;