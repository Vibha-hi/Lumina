import type { Request, Response } from "express";
import User from "../models/User.js";
import Analysis from "../models/Analysis.js";
import FeedbackModel from "../models/Feedback.js";
import Usage from "../models/Usage.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { catchAsync } from "../middleware/errorHandler.js";

/**
 * DELETE /api/admin/analysis/:id
 * Delete an analysis record (admin only).
 */
export const deleteAnalysis = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const analysis = await Analysis.findByIdAndDelete(id);
  if (!analysis) {
    return sendError(res, "Analysis not found", 404);
  }
  sendSuccess(res, null, "Analysis deleted successfully");
});

/**
 * GET /api/admin/users
 * List all users (admin only — placeholder auth check).
 */
export const listUsers = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find()
      .select("name email provider isVerified createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(),
  ]);

  sendSuccess(res, {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

/**
 * GET /api/admin/stats
 * Dashboard statistics.
 */
export const getStats = catchAsync(async (_req: Request, res: Response) => {
  const [
    totalUsers,
    totalAnalyses,
    totalFeedback,
    recentAnalyses,
    platformBreakdown,
    tokenUsageStats,
  ] = await Promise.all([
    User.countDocuments(),
    Analysis.countDocuments(),
    FeedbackModel.countDocuments(),
    Analysis.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    }),
    Analysis.aggregate([
      { $group: { _id: "$platform", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Analysis.aggregate([
      { $group: { _id: "$providerKey", totalTokens: { $sum: "$tokensUsed" } } },
      { $sort: { totalTokens: -1 } },
    ]),
  ]);

  const guestUsage = await Usage.countDocuments({ identifierType: "ip" });

  const totalTokens = tokenUsageStats.reduce((acc, curr) => acc + curr.totalTokens, 0);

  sendSuccess(res, {
    totalUsers,
    totalAnalyses,
    totalFeedback,
    analysesLast7Days: recentAnalyses,
    guestUsersCount: guestUsage,
    platformBreakdown: platformBreakdown.map((p) => ({
      platform: p._id,
      count: p.count,
    })),
    tokenUsage: {
      total: totalTokens,
      byProvider: tokenUsageStats.map((p) => ({
        providerKey: p._id || "unknown",
        tokens: p.totalTokens,
      })),
    },
  });
});

/**
 * GET /api/admin/history
 * List analysis history globally (admin only).
 */
export const getHistory = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
  const skip = (page - 1) * limit;

  const [analyses, total] = await Promise.all([
    Analysis.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Analysis.countDocuments(),
  ]);

  sendSuccess(res, {
    analyses,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

/**
 * GET /api/admin/users/:id/history
 * List analysis history for a specific user.
 */
export const getUserHistory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
  const skip = (page - 1) * limit;

  const [analyses, total] = await Promise.all([
    Analysis.find({ userId: id })
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Analysis.countDocuments({ userId: id }),
  ]);

  sendSuccess(res, {
    analyses,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});
