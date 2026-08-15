import type { Request, Response } from "express";
import { rewriteService } from "../services/RewriteService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { catchAsync } from "../middleware/errorHandler.js";
import type { Platform } from "../types/analysis.types.js";

/**
 * POST /api/rewrite
 */
export const rewriteText = catchAsync(async (req: Request, res: Response) => {
  const { text, platform } = req.body;
  const result = await rewriteService.rewrite({ text, platform: platform as Platform });
  sendSuccess(res, result, "Rewrite suggestions generated");
});
