import type { IReachPredictionService, ServiceInput } from "../types/service.types.js";
import type { ReachPrediction } from "../types/analysis.types.js";

/**
 * Mock Reach Prediction Service.
 * Estimates virality and audience metrics until a real model is connected.
 */
export class ReachPredictionService implements IReachPredictionService {
  async predict(input: ServiceInput): Promise<ReachPrediction> {
    await this.delay(100);

    const text = input.text.toLowerCase();
    const wordCount = text.split(/\s+/).length;

    // Hashtag analysis
    const hashtags = text.match(/#\w+/g) || [];
    const hashtagStrength = Math.min(100, hashtags.length * 20 + Math.round(Math.random() * 15));

    // Controversy indicators
    const controversyKeywords = [
      "politics",
      "religion",
      "controversial",
      "debate",
      "unpopular opinion",
      "hot take",
    ];
    const controversyHits = controversyKeywords.filter((k) => text.includes(k)).length;
    const controversyScore = Math.min(100, controversyHits * 25 + Math.round(Math.random() * 20));

    // Shareability based on content characteristics
    const hasQuestion = /\?/.test(text);
    const hasCallToAction = /\b(?:share|repost|follow|subscribe|like|comment|tag)\b/i.test(text);
    const hasEmoji =
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/u.test(text);

    let shareabilityScore = 30;
    if (hasQuestion) shareabilityScore += 15;
    if (hasCallToAction) shareabilityScore += 20;
    if (hasEmoji) shareabilityScore += 10;
    if (hashtags.length > 0) shareabilityScore += 10;
    shareabilityScore = Math.min(100, shareabilityScore + Math.round(Math.random() * 15));

    // Platform-specific reach multipliers
    const platformMultipliers: Record<string, number> = {
      LinkedIn: 0.7,
      Instagram: 1.2,
      X: 1.5,
      Reddit: 0.9,
      Facebook: 0.8,
      YouTube: 1.0,
      General: 0.6,
    };
    const multiplier = platformMultipliers[input.platform] || 0.6;

    const viralityScore = Math.min(
      100,
      Math.round(
        (shareabilityScore * 0.3 +
          controversyScore * 0.3 +
          hashtagStrength * 0.2 +
          (wordCount > 50 ? 20 : wordCount * 0.4)) *
          multiplier,
      ),
    );

    // Audience size estimation
    const audienceSizes = [
      "< 100",
      "100-500",
      "500-1K",
      "1K-5K",
      "5K-10K",
      "10K-50K",
      "50K-100K",
      "100K+",
    ];
    const sizeIndex = Math.min(audienceSizes.length - 1, Math.floor(viralityScore / 13));

    const trendInfluence = Math.round(30 + Math.random() * 40);

    return {
      viralityScore,
      shareabilityScore,
      estimatedAudienceSize: audienceSizes[sizeIndex],
      trendInfluence,
      hashtagStrength,
      controversyScore,
      explanation: `This post has ${viralityScore > 60 ? "high" : viralityScore > 30 ? "moderate" : "low"} viral potential on ${input.platform}. ${
        hashtags.length > 0
          ? `The ${hashtags.length} hashtag(s) may increase visibility.`
          : "Adding relevant hashtags could boost reach."
      } ${
        controversyScore > 40
          ? "The controversial nature may drive engagement but also polarize the audience."
          : ""
      } Estimated audience reach: ${audienceSizes[sizeIndex]} viewers.`,
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const reachPredictionService = new ReachPredictionService();
