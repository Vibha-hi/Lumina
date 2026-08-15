import type { Request, Response } from "express";
import { privacyService } from "../services/PrivacyService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { catchAsync } from "../middleware/errorHandler.js";
import type { Platform } from "../types/analysis.types.js";

/**
 * POST /api/privacy
 */
export const checkPrivacy = catchAsync(async (req: Request, res: Response) => {
  const { text, platform } = req.body;
  const result = await privacyService.detect({ text, platform: platform as Platform });
  sendSuccess(res, result, "Privacy analysis complete");
});
