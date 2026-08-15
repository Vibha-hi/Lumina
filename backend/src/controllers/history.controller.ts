import type { Request, Response } from "express";
import Analysis from "../models/Analysis.js";
import { sendSuccess, sendPaginated } from "../utils/apiResponse.js";
import { catchAsync, AppError } from "../middleware/errorHandler.js";

/**
 * GET /api/history
 * List user's analysis history with pagination.
 */
export const listHistory = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  const skip = (page - 1) * limit;

  const [analyses, total] = await Promise.all([
    Analysis.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Analysis.countDocuments({ userId }),
  ]);

  const totalPages = Math.ceil(total / limit);

  sendPaginated(res, analyses, {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  });
});

/**
 * GET /api/history/:id
 * Get a single analysis by ID.
 */
export const getAnalysis = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { id } = req.params;

  const analysis = await Analysis.findOne({ _id: id, userId }).lean();
  if (!analysis) {
    throw new AppError("Analysis not found", 404);
  }

  sendSuccess(res, analysis);
});

/**
 * DELETE /api/history/:id
 * Delete an analysis.
 */
export const deleteAnalysis = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { id } = req.params;

  const analysis = await Analysis.findOneAndDelete({ _id: id, userId });
  if (!analysis) {
    throw new AppError("Analysis not found", 404);
  }

  sendSuccess(res, null, "Analysis deleted successfully");
});
