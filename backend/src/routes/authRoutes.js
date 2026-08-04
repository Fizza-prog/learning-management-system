const authorize = require("../middleware/roleMiddleware");
const express = require("express");
const {
  register,
  login,
  getProfile,
  refreshToken,
  logout
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

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



module.exports = router;