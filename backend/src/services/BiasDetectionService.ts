import type { IBiasDetectionService, ServiceInput } from "../types/service.types.js";
import type { BiasResult } from "../types/analysis.types.js";

/**
 * Mock Bias Detection Service.
 * Keyword-based bias detection until a real classifier is connected.
 */
export class BiasDetectionService implements IBiasDetectionService {
  async detect(input: ServiceInput): Promise<BiasResult> {
    await this.delay(80);

    const text = input.text.toLowerCase();
    const biasTypes: BiasResult["biasTypes"] = [];

    // Check for different bias types
    const biasPatterns: Array<{ keywords: string[]; type: string; explanation: string }> = [
      {
        keywords: ["always", "never", "everyone", "nobody", "all of them", "none of them"],
        type: "Absolute language bias",
        explanation:
          "Using absolute terms overgeneralizes and can misrepresent complex situations.",
      },
      {
        keywords: ["obviously", "clearly", "undeniably", "without question"],
        type: "Confirmation bias language",
        explanation: "These words assume agreement and discourage critical thinking.",
      },
      {
        keywords: ["they always", "those people", "that type of person"],
        type: "Stereotyping / Othering",
        explanation:
          "Grouping diverse individuals under generalizations can reinforce harmful stereotypes.",
      },
      {
        keywords: ["the real truth", "what they don't tell you", "mainstream narrative"],
        type: "Conspiratorial framing",
        explanation: "This framing suggests hidden knowledge and may undermine legitimate sources.",
      },
      {
        keywords: ["only option", "no choice", "must", "have to"],
        type: "False dichotomy",
        explanation: "Presenting limited options when more alternatives exist can be misleading.",
      },
      {
        keywords: ["studies show", "research proves", "science says"],
        type: "Authority bias",
        explanation:
          "Citing unnamed studies or vague authority can be misleading without specific references.",
      },
    ];

    for (const pattern of biasPatterns) {
      const matchCount = pattern.keywords.filter((k) => text.includes(k)).length;
      if (matchCount > 0) {
        biasTypes.push({
          type: pattern.type,
          confidence: Math.min(100, matchCount * 35 + Math.round(Math.random() * 20)),
          explanation: pattern.explanation,
        });
      }
    }

    const score =
      biasTypes.length > 0
        ? Math.min(
            100,
            Math.round(biasTypes.reduce((sum, b) => sum + b.confidence, 0) / biasTypes.length),
          )
        : Math.round(5 + Math.random() * 15);

    return {
      score,
      biasTypes,
      explanation:
        biasTypes.length > 0
          ? `${biasTypes.length} type(s) of bias detected in your content. Consider revising to present a more balanced perspective.`
          : "No significant bias patterns detected. Your content appears relatively balanced.",
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const biasDetectionService = new BiasDetectionService();
