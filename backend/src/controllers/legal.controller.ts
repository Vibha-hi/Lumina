import type { Request, Response } from "express";
import { legalService } from "../services/LegalService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { catchAsync } from "../middleware/errorHandler.js";
import type { Platform } from "../types/analysis.types.js";

/**
 * POST /api/legal
 */
export const checkLegal = catchAsync(async (req: Request, res: Response) => {
  const { text, platform } = req.body;
  const result = await legalService.analyze({ text, platform: platform as Platform });
  sendSuccess(res, result, "Legal analysis complete");
});
