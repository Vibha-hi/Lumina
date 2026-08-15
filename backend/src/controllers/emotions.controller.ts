import type { Request, Response } from "express";
import { emotionAnalysisService } from "../services/EmotionAnalysisService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { catchAsync } from "../middleware/errorHandler.js";
import type { Platform } from "../types/analysis.types.js";

/**
 * POST /api/emotions
 */
export const detectEmotions = catchAsync(async (req: Request, res: Response) => {
  const { text, platform } = req.body;
  const result = await emotionAnalysisService.analyze({ text, platform: platform as Platform });
  sendSuccess(res, result, "Emotion analysis complete");
});
