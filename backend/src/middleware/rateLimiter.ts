import rateLimit from "express-rate-limit";

/**
 * General API rate limiter: 100 requests per 15 minutes.
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again in a few minutes.",
  },
});

/**
 * Auth route rate limiter: 20 requests per 15 minutes.
 * Protects against brute-force login attempts.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again later.",
  },
});

/**
 * OTP / verification code rate limiter: 5 attempts per 15 minutes.
 * Prevents brute-force guessing of 6-digit OTP codes.
 */
export const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many verification attempts. Please try again later.",
  },
});

/**
 * Analysis rate limiter: 25 requests per 15 minutes.
 * Prevents abuse of compute-intensive analysis endpoints.
 */
export const analysisLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Analysis rate limit reached. Please wait before submitting another analysis.",
  },
});
