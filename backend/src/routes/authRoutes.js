const express = require("express");
const { register,loginUser } = require("../controllers/authController");
const authMiddleware=require("../middleware/authMiddleware");

const router = express.Router();
router.post("/register", register);
router.post("/login",loginUser);
router.get("/profile",authMiddleware,getProfile);

module.exports = router;