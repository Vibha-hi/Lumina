import type { Request, Response } from "express";
import Analysis from "../models/Analysis.js";
import Comparison from "../models/Comparison.js";
import Usage from "../models/Usage.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { catchAsync } from "../middleware/errorHandler.js";
import { analyzeWithGroq, compareWithGroq } from "../services/GroqService.js";

/**
 * POST /api/analyze
 * Full analysis — requires authentication. Calls Gemini for a unified analysis.
 */
export const analyzePost = catchAsync(async (req: Request, res: Response) => {
  const { text, platform, source } = req.body;
  const userId = req.user!.userId;

  // Call unified Groq analysis
  const result = await analyzeWithGroq(text, platform || "General");

  // Save to database
  const analysis = await Analysis.create({
    userId,
    platform: platform || "General",
    inputText: text,
    contentType: "general",
    source: source || "dashboard",
    overallRisk: result.overall_risk,
    privacyRisk: result.privacy_risk,
    professionalRisk: result.professional_risk,
    legalRisk: result.legal_risk,
    misunderstandingRisk: result.misunderstanding_risk,
    reachPotential: result.reach_potential,
    emotions: result.emotions,
    personas: result.personas,
    riskyPhrases: result.risky_phrases,
    rewrite: result.rewrite,
    rewriteVariants: result.rewrite_variants || {},
    summary: result.summary,
    misunderstanding_breakdown: result.misunderstanding_breakdown,
    // Fields not returned by unified prompt — set defaults
    grammarScore: 0,
    manipulationScore: 0,
    clickbaitScore: 0,
    biasScore: 0,
    sourceReliability: 0,
    detectedEntities: [],
    legalConcerns: [],
    grammarIssues:
      result.grammar_fixes?.map((g) => ({
        type: "Grammar",
        original: g.original,
        suggestion: g.corrected,
        explanation: g.explanation,
      })) || [],
    reachDetails: { viralityScore: result.reach_potential },
    tokensUsed: result._meta?.tokensUsed || 0,
    providerKey: result._meta?.providerKey || "unknown",
  });

  // Update usage tracking
  await Usage.findOneAndUpdate(
    { identifier: userId, identifierType: "user" },
    {
      $inc: { totalAnalyses: 1 },
      $set: { lastAnalysisAt: new Date() },
    },
    { upsert: true },
  );

  sendSuccess(
    res,
    {
      id: analysis._id.toString(),
      analysis: result,
    },
    "Analysis complete",
    201,
  );
});

/**
 * POST /api/analyze/guest
 * Guest analysis — no auth required, limited to 1 free analysis per IP.
 */
export const analyzeGuest = catchAsync(async (req: Request, res: Response) => {
  const { text, platform, source } = req.body;
  const ip = req.ip || req.socket.remoteAddress || "unknown";

  // Check usage limit
  const usage = await Usage.findOne({ identifier: ip, identifierType: "ip" });
  if (usage && usage.freeAnalysesUsed >= 3) {
    sendError(
      res,
      "You've used your free analysis. Create an account to continue analyzing content.",
      403,
    );
    return;
  }

  // Call unified Groq analysis
  const result = await analyzeWithGroq(text, platform || "General");

  // Save guest analysis to Analysis collection so it appears in Server Room stats
  await Analysis.create({
    userId: null,
    platform: platform || "General",
    inputText: text,
    contentType: "general",
    source: source || "dashboard",
    overallRisk: result.overall_risk,
    privacyRisk: result.privacy_risk,
    professionalRisk: result.professional_risk,
    legalRisk: result.legal_risk,
    misunderstandingRisk: result.misunderstanding_risk,
    reachPotential: result.reach_potential,
    emotions: result.emotions,
    personas: result.personas,
    riskyPhrases: result.risky_phrases,
    rewrite: result.rewrite,
    rewriteVariants: result.rewrite_variants || {},
    summary: result.summary,
    misunderstanding_breakdown: result.misunderstanding_breakdown,
    grammarScore: 0,
    manipulationScore: 0,
    clickbaitScore: 0,
    biasScore: 0,
    sourceReliability: 0,
    detectedEntities: [],
    legalConcerns: [],
    grammarIssues:
      result.grammar_fixes?.map((g) => ({
        type: "Grammar",
        original: g.original,
        suggestion: g.corrected,
        explanation: g.explanation,
      })) || [],
    reachDetails: { viralityScore: result.reach_potential },
    tokensUsed: result._meta?.tokensUsed || 0,
    providerKey: result._meta?.providerKey || "unknown",
  });

  // Track usage
  await Usage.findOneAndUpdate(
    { identifier: ip, identifierType: "ip" },
    {
      $inc: { freeAnalysesUsed: 1, totalAnalyses: 1 },
      $set: { lastAnalysisAt: new Date() },
    },
    { upsert: true },
  );

  sendSuccess(
    res,
    {
      analysis: result,
      guestLimitReached: true,
      message: "You've used your free analysis. Create an account to continue.",
    },
    "Guest analysis complete",
  );
});

/**
 * POST /api/analyze/compare
 * Compare two drafts — requires authentication.
 */
export const comparePost = catchAsync(async (req: Request, res: Response) => {
  const { draftA, draftB, platform } = req.body;
  const userId = req.user!.userId;

  // Call unified Groq comparison
  const result = await compareWithGroq(draftA, draftB, platform || "General");

  // Track usage (costs 2 analyses essentially, but let's increment by 1 for simplicity or 2 if desired)
  await Usage.findOneAndUpdate(
    { identifier: userId, identifierType: "user" },
    {
      $inc: { totalAnalyses: 2 },
      $set: { lastAnalysisAt: new Date() },
    },
    { upsert: true },
  );

  const comparison = await Comparison.create({
    userId,
    platform: platform || "General",
    draftA,
    draftB,
    winner: result.winner,
    winnerReasoning: result.winner_reasoning,
    analysisA: result.draft_a,
    analysisB: result.draft_b,
  });

  sendSuccess(
    res,
    {
      id: comparison._id.toString(),
      ...result,
    },
    "Comparison complete",
    201,
  );
});

/**
 * GET /api/analyze/compare
 * Get user's comparison history
 */
export const getComparisonsHistory = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const comparisons = await Comparison.find({ userId }).sort({ createdAt: -1 }).select("-__v");

  sendSuccess(res, comparisons, "Comparison history retrieved successfully");
});

/**
 * DELETE /api/analyze/compare/:id
 * Delete a saved comparison
 */
export const deleteComparison = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.userId;

  const comparison = await Comparison.findOneAndDelete({ _id: id, userId });

  if (!comparison) {
    sendError(res, "Comparison not found", 404);
    return;
  }

  sendSuccess(res, null, "Comparison deleted successfully");
});
