import type { IEmotionAnalysisService, ServiceInput } from "../types/service.types.js";
import type { EmotionScore } from "../types/analysis.types.js";

/**
 * Mock Emotion Analysis Service.
 * Returns realistic mock emotion scores until a real model is connected.
 */
export class EmotionAnalysisService implements IEmotionAnalysisService {
  async analyze(input: ServiceInput): Promise<EmotionScore[]> {
    // Simulate processing delay
    await this.delay(100);

    const text = input.text.toLowerCase();

    // Simple keyword-based mock scoring
    const anger = this.scoreKeywords(text, [
      "angry",
      "furious",
      "hate",
      "stupid",
      "useless",
      "terrible",
      "worst",
    ]);
    const fear = this.scoreKeywords(text, [
      "afraid",
      "scared",
      "worried",
      "danger",
      "risk",
      "threat",
    ]);
    const joy = this.scoreKeywords(text, [
      "happy",
      "great",
      "wonderful",
      "amazing",
      "love",
      "excellent",
      "fantastic",
    ]);
    const curiosity = this.scoreKeywords(text, [
      "wonder",
      "curious",
      "interesting",
      "how",
      "why",
      "what if",
    ]);
    const sadness = this.scoreKeywords(text, [
      "sad",
      "unfortunately",
      "sorry",
      "regret",
      "miss",
      "lost",
    ]);
    const disgust = this.scoreKeywords(text, [
      "disgusting",
      "gross",
      "awful",
      "repulsive",
      "nasty",
    ]);
    const trust = this.scoreKeywords(text, [
      "trust",
      "reliable",
      "honest",
      "believe",
      "confident",
      "faith",
    ]);
    const neutral = Math.max(10, 100 - (anger + fear + joy + sadness) / 4);

    return [
      {
        emotion: "Anger",
        value: anger,
        highlightedWords: this.findWords(text, ["angry", "furious", "hate", "stupid", "useless"]),
      },
      {
        emotion: "Fear",
        value: fear,
        highlightedWords: this.findWords(text, ["afraid", "scared", "worried", "danger"]),
      },
      {
        emotion: "Joy",
        value: joy,
        highlightedWords: this.findWords(text, ["happy", "great", "wonderful", "amazing", "love"]),
      },
      {
        emotion: "Curiosity",
        value: curiosity,
        highlightedWords: this.findWords(text, ["wonder", "curious", "interesting"]),
      },
      {
        emotion: "Sadness",
        value: sadness,
        highlightedWords: this.findWords(text, ["sad", "unfortunately", "sorry", "regret"]),
      },
      {
        emotion: "Disgust",
        value: disgust,
        highlightedWords: this.findWords(text, ["disgusting", "gross", "awful"]),
      },
      {
        emotion: "Trust",
        value: trust,
        highlightedWords: this.findWords(text, ["trust", "reliable", "honest"]),
      },
      { emotion: "Neutral", value: Math.min(neutral, 100), highlightedWords: [] },
    ];
  }

  private scoreKeywords(text: string, keywords: string[]): number {
    const count = keywords.filter((k) => text.includes(k)).length;
    return Math.min(Math.round((count / keywords.length) * 80 + Math.random() * 20), 100);
  }

  private findWords(text: string, keywords: string[]): string[] {
    return keywords.filter((k) => text.includes(k));
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const emotionAnalysisService = new EmotionAnalysisService();
