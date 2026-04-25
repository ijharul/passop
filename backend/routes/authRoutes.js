const express = require("express");
const router = express.Router();

const { signup, login, forgotPassword, resetPassword, googleLogin } = require("../controllers/authController");
const { validateAuth } = require("../middleware/validate");
const { authLimiter } = require("../middleware/rateLimiter");

router.post("/signup", authLimiter, validateAuth, signup);
router.post("/login", authLimiter, validateAuth, login);
router.post("/google-login", authLimiter, googleLogin);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;