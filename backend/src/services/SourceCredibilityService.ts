import type { ISourceCredibilityService, ServiceInput } from "../types/service.types.js";
import type { SourceCredibilityResult } from "../types/analysis.types.js";

/**
 * Mock Source Credibility Service.
 * Evaluates content credibility signals until a real model is connected.
 */
export class SourceCredibilityService implements ISourceCredibilityService {
  async evaluate(input: ServiceInput): Promise<SourceCredibilityResult> {
    await this.delay(80);

    const text = input.text.toLowerCase();
    const factors: SourceCredibilityResult["factors"] = [];

    // Check for source citation indicators
    if (/(?:according to|source:|via|reported by|study by)/i.test(text)) {
      factors.push({
        factor: "Source citation present",
        impact: "positive",
        explanation: "The content references external sources, which adds credibility.",
      });
    } else {
      factors.push({
        factor: "No source citations",
        impact: "negative",
        explanation: "Claims are made without referencing any sources.",
      });
    }

    // Check for URLs/links
    if (/https?:\/\/\S+/i.test(text)) {
      factors.push({
        factor: "External links provided",
        impact: "positive",
        explanation: "Links to external resources allow readers to verify claims.",
      });
    }

    // Check for hedging language (good for credibility)
    if (/\b(?:may|might|could|suggests|indicates|approximately|roughly)\b/i.test(text)) {
      factors.push({
        factor: "Appropriate hedging language",
        impact: "positive",
        explanation: "Using measured language rather than absolute claims improves credibility.",
      });
    }

    // Check for emotional manipulation
    if (/\b(?:you must|wake up|open your eyes|sheeple|brainwashed)\b/i.test(text)) {
      factors.push({
        factor: "Emotional manipulation tactics",
        impact: "negative",
        explanation: "Using alarmist or condescending language undermines credibility.",
      });
    }

    // Check for data/statistics
    if (/\b\d+%|\b\d+\s*(?:million|billion|thousand)\b/i.test(text)) {
      factors.push({
        factor: "Statistical data included",
        impact: "positive",
        explanation: "Including specific data points adds factual weight to claims.",
      });
    }

    // Check for anecdotal evidence
    if (/\b(?:my friend|someone I know|I heard that|a guy I know)\b/i.test(text)) {
      factors.push({
        factor: "Relies on anecdotal evidence",
        impact: "negative",
        explanation: "Personal anecdotes should not be used as the sole basis for general claims.",
      });
    }

    const positiveCount = factors.filter((f) => f.impact === "positive").length;
    const negativeCount = factors.filter((f) => f.impact === "negative").length;
    const score = Math.min(100, Math.max(0, 50 + positiveCount * 15 - negativeCount * 20));

    return {
      score,
      factors,
      overallAssessment:
        score > 70
          ? "This content shows good credibility indicators. Sources are referenced and claims appear well-supported."
          : score > 40
            ? "Mixed credibility signals. Consider adding sources and reducing emotional language."
            : "Low credibility score. The content lacks source citations and relies on unverifiable claims.",
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const sourceCredibilityService = new SourceCredibilityService();
