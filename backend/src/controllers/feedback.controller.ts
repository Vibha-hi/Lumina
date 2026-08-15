import type { Request, Response } from "express";
import FeedbackModel from "../models/Feedback.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { catchAsync } from "../middleware/errorHandler.js";

/**
 * POST /api/feedback
 * Submit feedback. Works for both authenticated and anonymous users.
 */
export const submitFeedback = catchAsync(async (req: Request, res: Response) => {
  const { name, email, message } = req.body;

  const feedback = await FeedbackModel.create({
    name,
    email,
    message,
    userId: req.user?.userId || null,
  });

  sendSuccess(res, { id: feedback._id.toString() }, "Thank you for your feedback!", 201);
});
