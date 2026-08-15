import type { ILegalService, ServiceInput } from "../types/service.types.js";
import type { LegalResult, LegalConcern } from "../types/analysis.types.js";

/**
 * Mock Legal Service.
 * Keyword-based legal concern detection until a real classifier is connected.
 */
export class LegalService implements ILegalService {
  async analyze(input: ServiceInput): Promise<LegalResult> {
    await this.delay(100);

    const text = input.text.toLowerCase();
    const concerns: LegalConcern[] = [];

    // Defamation detection
    const defamationPatterns = [
      {
        pattern: /(?:is|are)\s+(?:a\s+)?(?:liar|fraud|criminal|thief|scammer)/i,
        word: "accusatory labeling",
      },
      { pattern: /(?:committed|guilty of)\s+\w+/i, word: "criminal accusation" },
    ];
    for (const { pattern, word } of defamationPatterns) {
      if (pattern.test(text)) {
        concerns.push({
          type: "defamation",
          severity: "high",
          description: `Potential defamation: "${word}" detected without evidence.`,
          affectedText: text.match(pattern)?.[0] || "",
          explanation:
            "Making unsubstantiated claims about someone's character or actions could constitute defamation. Ensure you have evidence to support such statements.",
        });
      }
    }

    // Threat detection
    if (/\b(?:kill|destroy|hurt|attack|beat up|punch|threat)\b/i.test(text)) {
      concerns.push({
        type: "threats",
        severity: "critical",
        description: "Language that could be interpreted as threatening.",
        affectedText:
          text.match(/\b(?:kill|destroy|hurt|attack|beat up|punch|threat)\w*/i)?.[0] || "",
        explanation:
          "Even casual use of threatening language can be taken seriously by platforms and potentially law enforcement.",
      });
    }

    // Harassment detection
    if (/\b(?:stalk|harass|bully|target|gang up)\b/i.test(text)) {
      concerns.push({
        type: "harassment",
        severity: "high",
        description: "Language associated with harassment or bullying.",
        affectedText: text.match(/\b(?:stalk|harass|bully|target|gang up)\w*/i)?.[0] || "",
        explanation:
          "This language could be flagged as harassment by platforms and may have legal implications.",
      });
    }

    // Hate speech detection
    if (
      /\b(?:hate|despise|inferior|subhuman)\b/i.test(text) &&
      /\b(?:race|gender|religion|ethnic|nationality)\b/i.test(text)
    ) {
      concerns.push({
        type: "hate_speech",
        severity: "critical",
        description: "Content that may constitute hate speech directed at a protected group.",
        affectedText: "",
        explanation:
          "Directing hateful language at protected groups violates platform policies and may violate hate speech laws.",
      });
    }

    // Copyright concerns
    if (/\b(?:copyright|©|all rights reserved|reproduced|pirated)\b/i.test(text)) {
      concerns.push({
        type: "copyright",
        severity: "medium",
        description: "Content references copyrighted material.",
        affectedText: text.match(/\b(?:copyright|©|all rights reserved)\b/i)?.[0] || "",
        explanation: "Ensure you have proper rights or permissions to share copyrighted content.",
      });
    }

    // False claims
    if (
      /\b(?:proven|confirmed|scientifically|studies show|everyone knows)\b/i.test(text) &&
      /\b(?:fake|hoax|conspiracy|coverup|they don't want you)\b/i.test(text)
    ) {
      concerns.push({
        type: "false_claims",
        severity: "medium",
        description: "Content may contain unverified claims presented as facts.",
        affectedText: "",
        explanation:
          "Presenting unverified information as established fact can spread misinformation and may have legal implications.",
      });
    }

    // Discrimination
    if (/\b(?:shouldn't be allowed|don't belong|go back)\b/i.test(text)) {
      concerns.push({
        type: "discrimination",
        severity: "high",
        description: "Language that could be interpreted as discriminatory.",
        affectedText: text.match(/\b(?:shouldn't be allowed|don't belong|go back)\b/i)?.[0] || "",
        explanation:
          "This language may be seen as discriminatory and could violate anti-discrimination laws and platform policies.",
      });
    }

    // Professional risk
    if (
      /\b(?:my boss|my manager|my company|my employer|coworker|colleague)\b/i.test(text) &&
      /\b(?:idiot|stupid|useless|incompetent|terrible|worst)\b/i.test(text)
    ) {
      concerns.push({
        type: "professional_risks",
        severity: "high",
        description: "Negative statements about employer or colleagues detected.",
        affectedText: "",
        explanation:
          "Publicly criticizing your employer or colleagues can lead to disciplinary action, termination, or legal claims for breach of employment agreements.",
      });
    }

    const riskScore = Math.min(
      100,
      concerns.reduce((sum, c) => {
        const weights = { critical: 35, high: 25, medium: 15, low: 5 };
        return sum + (weights[c.severity] || 10);
      }, 0),
    );

    const recommendations: string[] = [];
    if (concerns.length > 0) {
      recommendations.push("Consider revising the flagged content before publishing.");
      if (concerns.some((c) => c.severity === "critical")) {
        recommendations.push(
          "URGENT: This content contains critical legal risks. Strongly consider not posting this.",
        );
      }
    } else {
      recommendations.push("No significant legal concerns detected.");
    }

    return {
      riskScore,
      concerns,
      recommendations,
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const legalService = new LegalService();
