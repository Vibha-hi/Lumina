import { Router } from "express";
import {
  signup,
  login,
  forgotPassword,
  verifyResetCode,
  resetPassword,
  logout,
  verifyEmail,
  resendVerification,
} from "../controllers/auth.controller.js";
import { validate } from "../middleware/validation.js";
import { authLimiter, otpLimiter } from "../middleware/rateLimiter.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../utils/validators.js";

const router = Router();

// Apply auth rate limiter to all auth routes
router.use(authLimiter);

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.post("/verify-email", otpLimiter, verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/verify-reset-code", otpLimiter, verifyResetCode);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.post("/logout", requireAuth, logout);

export default router;
