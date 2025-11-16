import { rateLimit } from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 6 * 60 * 60 * 1000, // 6 hours
  max: 10, // Max 10 attempts per 6-hour window
  message: {
    error:
      "Too many login attempts from this IP. You are locked out for 6 hours.",
  },
  standardHeaders: "draft-6", // Send "RateLimit-*" headers
  legacyHeaders: false, // Disable "X-RateLimit-*" headers
});
