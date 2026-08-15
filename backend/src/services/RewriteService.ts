import type { IRewriteService, ServiceInput } from "../types/service.types.js";
import type { RewriteResult } from "../types/analysis.types.js";

/**
 * Mock Rewrite Service.
 * Generates alternative versions preserving intent until a real LLM is connected.
 */
export class RewriteService implements IRewriteService {
  async rewrite(input: ServiceInput): Promise<RewriteResult> {
    await this.delay(150);

    const text = input.text;
    const hasNegativeLanguage = /useless|stupid|hate|terrible|worst|joke|trash|garbage/i.test(text);
    const originalRisk = hasNegativeLanguage ? 72 : 35;

    return {
      variants: [
        {
          type: "safer",
          text: this.makeSafer(text),
          changesExplanation:
            "Removed emotionally charged language and personal attacks. Replaced with objective observations while keeping your core message intact.",
          riskReduction: hasNegativeLanguage ? 40 : 10,
        },
        {
          type: "professional",
          text: this.makeProfessional(text),
          changesExplanation:
            "Restructured for professional tone. Used formal language appropriate for workplace contexts and removed informal expressions.",
          riskReduction: hasNegativeLanguage ? 50 : 15,
        },
        {
          type: "friendly",
          text: this.makeFriendly(text),
          changesExplanation:
            "Softened the tone with empathetic language. Added constructive framing while preserving the underlying concern.",
          riskReduction: hasNegativeLanguage ? 35 : 8,
        },
        {
          type: "neutral",
          text: this.makeNeutral(text),
          changesExplanation:
            "Stripped emotional language and opinion markers. Presented the information factually without personal bias.",
          riskReduction: hasNegativeLanguage ? 55 : 20,
        },
      ],
      preservedIntent: true,
      originalRisk,
    };
  }

  private makeSafer(text: string): string {
    return text
      .replace(/useless|stupid/gi, "could improve")
      .replace(/hate/gi, "am frustrated with")
      .replace(/terrible|worst/gi, "concerning")
      .replace(/joke|trash|garbage/gi, "disappointing")
      .replace(/completely |totally |absolutely /gi, "");
  }

  private makeProfessional(text: string): string {
    const safer = this.makeSafer(text);
    return `I would like to share some professional observations: ${safer}`;
  }

  private makeFriendly(text: string): string {
    const safer = this.makeSafer(text);
    return `I wanted to share my thoughts on something — ${safer}. I appreciate the opportunity to discuss this.`;
  }

  private makeNeutral(text: string): string {
    return text
      .replace(/useless|stupid|hate|terrible|worst|joke|trash|garbage/gi, "[concern noted]")
      .replace(/completely |totally |absolutely |very |extremely /gi, "")
      .replace(/my manager|my boss/gi, "management")
      .replace(/this company/gi, "the organization");
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const rewriteService = new RewriteService();
