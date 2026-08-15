import type { Request, Response } from "express";

import User from "../models/User.js";
import OtpSession from "../models/OtpSession.js";
import Settings from "../models/Settings.js";
import { signToken, signResetToken, verifyResetToken } from "../utils/jwt.js";
import { comparePassword } from "../utils/password.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { catchAsync, AppError } from "../middleware/errorHandler.js";
import { env } from "../config/env.js";
import { validateRealEmail } from "../utils/emailValidator.js";
import { sendVerificationEmail, sendPasswordResetEmail } from "../utils/mailer.js";

// Helper to generate 6 digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

/**
 * POST /api/auth/signup
 */
export const signup = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password, dob } = req.body;

  await validateRealEmail(email);

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("An account with this email already exists", 409);
  }

  // Generate OTP
  const verificationCode = generateOTP();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

  // Delete any existing OTP session for this email
  await OtpSession.deleteOne({ email });

  // Store in OTP Session
  await OtpSession.create({
    name,
    email,
    password,
    dob: dob || null,
    verificationCode,
    expiresAt,
  });

  // Send email
  await sendVerificationEmail(email, verificationCode);

  sendSuccess(res, null, "OTP sent successfully to your email.", 201);
});

/**
 * POST /api/auth/verify-email
 */
export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { email, code } = req.body;

  const session = await OtpSession.findOne({ email }).select("+password");
  if (!session) {
    throw new AppError("No pending registration found for this email. Please sign up again.", 404);
  }

  if (session.verificationCode !== code) {
    throw new AppError("Invalid verification code", 400);
  }

  // Code is valid. Create the actual User.
  const user = await User.create({
    name: session.name,
    email: session.email,
    password: session.password,
    dob: session.dob,
    provider: "email",
    isVerified: true,
  });

  // Create default settings
  await Settings.create({ userId: user._id });

  // Delete the OTP session
  await OtpSession.deleteOne({ _id: session._id });

  // Generate JWT
  const token = signToken({ userId: user._id.toString(), email: user.email });

  sendSuccess(
    res,
    {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url || null,
        provider: user.provider,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt.toISOString(),
      },
    },
    "Email verified and account created successfully",
    201,
  );
});

/**
 * POST /api/auth/resend-verification
 */
export const resendVerification = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;

  const session = await OtpSession.findOne({ email });
  if (!session) {
    throw new AppError("No pending registration found for this email. Please sign up again.", 404);
  }

  const verificationCode = generateOTP();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  session.verificationCode = verificationCode;
  session.expiresAt = expiresAt;
  await session.save();

  await sendVerificationEmail(session.email, verificationCode);

  sendSuccess(res, null, "Verification code sent to your email");
});

/**
 * POST /api/auth/login
 */
export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find user with password field included
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }



  if (!user.password) {
    throw new AppError("Invalid email or password", 401);
  }

  // Verify password
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  // Generate JWT
  const token = signToken({ userId: user._id.toString(), email: user.email });

  sendSuccess(
    res,
    {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url || null,
        provider: user.provider,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt.toISOString(),
      },
    },
    "Signed in successfully",
  );
});



/**
 * POST /api/auth/forgot-password
 * Generates a 6-digit OTP and emails it for password reset.
 */
export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal whether the email exists
    sendSuccess(res, null, "If an account exists with this email, a reset code has been sent.");
    return;
  }



  const resetCode = generateOTP();
  const resetCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  user.resetCode = resetCode;
  user.resetCodeExpires = resetCodeExpires;
  await user.save({ validateModifiedOnly: true });

  await sendPasswordResetEmail(email, resetCode);

  sendSuccess(res, null, "If an account exists with this email, a reset code has been sent.");
});

/**
 * POST /api/auth/verify-reset-code
 * Validates the 6-digit OTP and returns a short-lived reset token.
 */
export const verifyResetCode = catchAsync(async (req: Request, res: Response) => {
  const { email, code } = req.body;

  const user = await User.findOne({ email }).select("+resetCode +resetCodeExpires");
  if (!user) {
    throw new AppError("Invalid email or reset code", 400);
  }

  if (!user.resetCode || !user.resetCodeExpires) {
    throw new AppError("No password reset was requested for this account", 400);
  }

  if (user.resetCodeExpires < new Date()) {
    throw new AppError("Reset code has expired. Please request a new one.", 400);
  }

  if (user.resetCode !== code) {
    throw new AppError("Invalid reset code", 400);
  }

  // OTP is valid — generate a short-lived JWT reset token
  const resetToken = signResetToken(user._id.toString());

  // Store the JWT token for validation during actual reset
  user.resetToken = resetToken;
  user.resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  // Clear the OTP so it can't be reused
  user.resetCode = undefined;
  user.resetCodeExpires = undefined;
  await user.save({ validateModifiedOnly: true });

  sendSuccess(res, { resetToken }, "Code verified successfully. You can now reset your password.");
});

/**
 * POST /api/auth/reset-password
 */
export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { token, password } = req.body;

  const { userId } = verifyResetToken(token);

  const user = await User.findById(userId).select("+resetToken +resetExpires");
  if (!user) {
    throw new AppError("Invalid or expired reset token", 400);
  }

  if (!user.resetToken || !user.resetExpires || user.resetExpires < new Date()) {
    throw new AppError("Reset token has expired", 400);
  }

  user.password = password; // Will be hashed by pre-save hook
  user.resetToken = undefined;
  user.resetExpires = undefined;
  await user.save();

  sendSuccess(res, null, "Password reset successfully. You can now sign in.");
});

/**
 * POST /api/auth/logout
 * Client-side logout — just acknowledges the request.
 */
export const logout = catchAsync(async (_req: Request, res: Response) => {
  sendSuccess(res, null, "Signed out successfully");
});
