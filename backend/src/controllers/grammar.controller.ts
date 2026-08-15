import type { Request, Response } from "express";
import { grammarService } from "../services/GrammarService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { catchAsync } from "../middleware/errorHandler.js";
import type { Platform } from "../types/analysis.types.js";

/**
 * POST /api/grammar
 */
export const checkGrammar = catchAsync(async (req: Request, res: Response) => {
  const { text, platform } = req.body;
  const result = await grammarService.check({ text, platform: platform as Platform });
  sendSuccess(res, result, "Grammar check complete");
});
