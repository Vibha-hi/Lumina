import type { IClickbaitDetectionService, ServiceInput } from "../types/service.types.js";
import type { ClickbaitResult } from "../types/analysis.types.js";

/**
 * Mock Clickbait Detection Service.
 * Pattern-based clickbait detection until a real classifier is connected.
 */
export class ClickbaitDetectionService implements IClickbaitDetectionService {
  async detect(input: ServiceInput): Promise<ClickbaitResult> {
    await this.delay(80);

    const text = input.text.toLowerCase();
    const techniques: string[] = [];
    let score = 0;

    // Check for clickbait patterns
    const patterns: Array<{ regex: RegExp; technique: string; weight: number }> = [
      { regex: /you won't believe/i, technique: "Exaggerated curiosity gap", weight: 25 },
      { regex: /this (?:one|simple) trick/i, technique: "Promise of secret knowledge", weight: 20 },
      {
        regex: /\b(?:shocking|mind-blowing|unbelievable|insane|crazy)\b/i,
        technique: "Sensational language",
        weight: 15,
      },
      { regex: /click here|tap to/i, technique: "Direct click solicitation", weight: 15 },
      {
        regex: /\d+ (?:things|ways|reasons|tips|secrets)/i,
        technique: "Listicle format",
        weight: 10,
      },
      { regex: /what happens next/i, technique: "Cliffhanger technique", weight: 20 },
      {
        regex: /(?:doctors|scientists|experts) (?:hate|don't want you)/i,
        technique: "Authority appeal manipulation",
        weight: 25,
      },
      {
        regex: /\b(?:literally|actually|seriously)\b/i,
        technique: "Intensifier overuse",
        weight: 5,
      },
      { regex: /(?:BREAKING|URGENT|ALERT)/i, technique: "False urgency", weight: 20 },
      { regex: /[!]{2,}|[?]{2,}/i, technique: "Excessive punctuation", weight: 10 },
    ];

    for (const { regex, technique, weight } of patterns) {
      if (regex.test(text)) {
        techniques.push(technique);
        score += weight;
      }
    }

    // Cap for ALL CAPS detection
    const words = input.text.split(/\s+/);
    const capsRatio =
      words.filter((w) => w === w.toUpperCase() && w.length > 2).length / words.length;
    if (capsRatio > 0.3) {
      techniques.push("Excessive capitalization");
      score += 15;
    }

    score = Math.min(100, score);

    return {
      score,
      techniques,
      explanation:
        score > 60
          ? `This content uses ${techniques.length} clickbait technique(s) and scores ${score}% on the clickbait scale. The manipulative patterns may reduce audience trust.`
          : score > 30
            ? `Some clickbait elements detected (${techniques.length} technique(s)). Consider toning down sensational language for a more credible impression.`
            : "This content appears authentic and doesn't rely on clickbait techniques.",
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const clickbaitDetectionService = new ClickbaitDetectionService();
