import type { IGrammarService, ServiceInput } from "../types/service.types.js";
import type { GrammarResult } from "../types/analysis.types.js";

/**
 * Mock Grammar Service.
 * Returns realistic mock grammar analysis until a real model is connected.
 */
export class GrammarService implements IGrammarService {
  async check(input: ServiceInput): Promise<GrammarResult> {
    await this.delay(100);

    const text = input.text;
    const issues: GrammarResult["issues"] = [];

    // Simple mock checks
    if (text !== text.charAt(0).toUpperCase() + text.slice(1)) {
      issues.push({
        type: "grammar",
        original: text.substring(0, 20),
        suggestion: text.charAt(0).toUpperCase() + text.slice(1, 20),
        position: { start: 0, end: 1 },
        explanation: "Sentences should start with a capital letter.",
      });
    }

    if (!text.endsWith(".") && !text.endsWith("!") && !text.endsWith("?")) {
      issues.push({
        type: "punctuation",
        original: text.slice(-10),
        suggestion: text.slice(-10) + ".",
        position: { start: text.length - 1, end: text.length },
        explanation: "Sentences should end with proper punctuation.",
      });
    }

    // Check for common informal language
    const informalWords = ["gonna", "wanna", "gotta", "kinda", "sorta"];
    for (const word of informalWords) {
      const idx = text.toLowerCase().indexOf(word);
      if (idx >= 0) {
        const formalMap: Record<string, string> = {
          gonna: "going to",
          wanna: "want to",
          gotta: "got to",
          kinda: "kind of",
          sorta: "sort of",
        };
        issues.push({
          type: "tone",
          original: word,
          suggestion: formalMap[word] || word,
          position: { start: idx, end: idx + word.length },
          explanation: `"${word}" is informal. Consider using "${formalMap[word]}" in professional contexts.`,
        });
      }
    }

    // Check for double spaces
    const doubleSpaceIdx = text.indexOf("  ");
    if (doubleSpaceIdx >= 0) {
      issues.push({
        type: "grammar",
        original: "  ",
        suggestion: " ",
        position: { start: doubleSpaceIdx, end: doubleSpaceIdx + 2 },
        explanation: "Avoid double spaces between words.",
      });
    }

    const score = Math.max(0, 100 - issues.length * 15);
    const readabilityScore = Math.min(
      100,
      Math.max(30, 85 - text.length / 50 + Math.random() * 15),
    );
    const professionalismScore = issues.some((i) => i.type === "tone")
      ? Math.round(45 + Math.random() * 25)
      : Math.round(70 + Math.random() * 25);

    return {
      score,
      readabilityScore: Math.round(readabilityScore),
      toneLabel:
        professionalismScore > 70
          ? "Professional"
          : professionalismScore > 50
            ? "Casual"
            : "Informal",
      professionalismScore,
      issues,
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const grammarService = new GrammarService();
