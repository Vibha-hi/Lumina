import type { IManipulationDetectionService, ServiceInput } from "../types/service.types.js";
import type { ManipulationResult } from "../types/analysis.types.js";

/**
 * Mock Manipulation Detection Service.
 * Pattern-based manipulation technique detection until a real model is connected.
 */
export class ManipulationDetectionService implements IManipulationDetectionService {
  async detect(input: ServiceInput): Promise<ManipulationResult> {
    await this.delay(80);

    const text = input.text.toLowerCase();
    const techniques: ManipulationResult["techniques"] = [];

    const manipulationPatterns: Array<{
      keywords: RegExp;
      name: string;
      description: string;
    }> = [
      {
        keywords: /\b(?:everyone is|people are saying|many believe|the masses)\b/i,
        name: "Bandwagon Effect",
        description: "Implies widespread agreement to pressure conformity.",
      },
      {
        keywords: /\b(?:fear|scared|terrified|alarming|catastrophe|disaster|emergency)\b/i,
        name: "Fear Appeal",
        description: "Uses fear to override rational decision-making.",
      },
      {
        keywords:
          /\b(?:limited time|act now|before it's too late|running out|last chance|hurry)\b/i,
        name: "Artificial Scarcity",
        description: "Creates false urgency to pressure quick action without reflection.",
      },
      {
        keywords: /\b(?:guilt|ashamed|should feel|how dare|selfish|irresponsible)\b/i,
        name: "Guilt Trip",
        description: "Leverages guilt to influence behavior or opinion.",
      },
      {
        keywords: /\b(?:if you really|a real .* would|true .* believe)\b/i,
        name: "Identity Appeal",
        description: "Ties beliefs or actions to personal identity to prevent disagreement.",
      },
      {
        keywords: /\b(?:just asking questions|I'm not saying.*but|some people think)\b/i,
        name: "Plausible Deniability (JAQing off)",
        description: "Raises inflammatory points while maintaining deniability.",
      },
      {
        keywords: /\b(?:whatabout|what about|but they also|both sides)\b/i,
        name: "Whataboutism",
        description: "Deflects from the topic by pointing to others' behavior.",
      },
    ];

    for (const pattern of manipulationPatterns) {
      if (pattern.keywords.test(text)) {
        techniques.push({
          name: pattern.name,
          confidence: Math.round(55 + Math.random() * 35),
          description: pattern.description,
        });
      }
    }

    const score =
      techniques.length > 0
        ? Math.min(
            100,
            Math.round(
              (techniques.reduce((sum, t) => sum + t.confidence, 0) / techniques.length) *
                (1 + techniques.length * 0.15),
            ),
          )
        : Math.round(5 + Math.random() * 10);

    return {
      score,
      techniques,
      explanation:
        techniques.length > 0
          ? `${techniques.length} manipulation technique(s) detected. This content may influence readers through psychological pressure rather than sound reasoning.`
          : "No significant manipulation techniques detected. The content appears to rely on straightforward communication.",
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const manipulationDetectionService = new ManipulationDetectionService();
