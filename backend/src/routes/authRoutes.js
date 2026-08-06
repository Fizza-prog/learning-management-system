const authorize = require("../middleware/roleMiddleware");
const express = require("express");
const {
  register,
  login,
  getProfile,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail
} = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");
const router = express.Router();


router.get(
  "/verify-email/:token",
  verifyEmail
);
router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.get(
  "/admin",
  protect,
  authorize("admin"),
  getProfile
);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post(
  "/reset-password/:token",
  resetPassword
);
router.post(
  "/resend-verification-email",
  resendVerificationEmail
);



module.exports = router;