const rateLimit = require('express-rate-limit');

// General rate limiter for all API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { msg: "Too many requests from this IP, please try again after 15 minutes" }
});

// Stricter rate limiter for Authentication (Login/Signup/Reset)
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 attempts per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: { msg: "Too many login attempts, please try again after an hour" }
});

module.exports = { apiLimiter, authLimiter };
