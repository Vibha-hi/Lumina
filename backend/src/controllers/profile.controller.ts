import type { Request, Response } from "express";
import User from "../models/User.js";
import Analysis from "../models/Analysis.js";
import Settings from "../models/Settings.js";
import Usage from "../models/Usage.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { catchAsync, AppError } from "../middleware/errorHandler.js";

/**
 * GET /api/profile
 */
export const getProfile = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findById(req.user!.userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const settings = await Settings.findOne({ userId: user._id });

  sendSuccess(res, {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    dob: user.dob || null,
    avatar_url: user.avatar_url || null,
    provider: user.provider,
    isVerified: user.isVerified,
    settings: settings
      ? {
          darkMode: settings.darkMode,
          defaultPlatform: settings.defaultPlatform,
          notifications: settings.notifications,
          language: settings.language,
        }
      : null,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  });
});

import { validateRealEmail } from "../utils/emailValidator.js";

/**
 * PUT /api/profile
 */
export const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const { name, email, dob, avatar_url } = req.body;

  if (email !== undefined) {
    await validateRealEmail(email);
  }

  const user = await User.findById(req.user!.userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  if (dob !== undefined) user.dob = dob;
  if (avatar_url !== undefined) user.avatar_url = avatar_url;

  await user.save();

  sendSuccess(
    res,
    {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      dob: user.dob || null,
      avatar_url: user.avatar_url || null,
      provider: user.provider,
      isVerified: user.isVerified,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    },
    "Profile updated successfully",
  );
});

/**
 * DELETE /api/profile
 * Delete account and all associated data.
 */
export const deleteAccount = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  // Delete all user data in parallel
  await Promise.all([
    User.findByIdAndDelete(userId),
    Analysis.deleteMany({ userId }),
    Settings.findOneAndDelete({ userId }),
    Usage.deleteMany({ identifier: userId, identifierType: "user" }),
  ]);

  sendSuccess(res, null, "Account and all associated data deleted successfully");
});
