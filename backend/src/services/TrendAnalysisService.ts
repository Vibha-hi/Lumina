import type { ITrendAnalysisService, ServiceInput } from "../types/service.types.js";
import type { TrendResult } from "../types/analysis.types.js";

/**
 * Mock Trend Analysis Service.
 * Returns simulated trending topics relevance until real trend APIs are connected.
 */
export class TrendAnalysisService implements ITrendAnalysisService {
  async analyze(input: ServiceInput): Promise<TrendResult> {
    await this.delay(80);

    const text = input.text.toLowerCase();

    // Simulated trending topics
    const mockTrends = [
      {
        topic: "AI and Machine Learning",
        popularity: 95,
        keywords: [
          "ai",
          "machine learning",
          "chatgpt",
          "artificial intelligence",
          "neural",
          "model",
        ],
      },
      {
        topic: "Climate Change",
        popularity: 88,
        keywords: ["climate", "environment", "carbon", "sustainability", "green", "renewable"],
      },
      {
        topic: "Remote Work",
        popularity: 82,
        keywords: ["remote", "work from home", "hybrid", "office", "wfh", "telecommute"],
      },
      {
        topic: "Mental Health",
        popularity: 79,
        keywords: ["mental health", "anxiety", "depression", "wellness", "self-care", "therapy"],
      },
      {
        topic: "Cryptocurrency",
        popularity: 72,
        keywords: ["crypto", "bitcoin", "blockchain", "ethereum", "web3", "nft"],
      },
      {
        topic: "Social Media Impact",
        popularity: 85,
        keywords: ["social media", "instagram", "tiktok", "digital", "online", "internet"],
      },
    ];

    const matchedTrends = mockTrends
      .filter((trend) => trend.keywords.some((k) => text.includes(k)))
      .map((trend) => ({
        topic: trend.topic,
        popularity: trend.popularity,
        relevance: Math.round(
          (trend.keywords.filter((k) => text.includes(k)).length / trend.keywords.length) * 100,
        ),
      }));

    const relevanceScore =
      matchedTrends.length > 0
        ? Math.round(matchedTrends.reduce((sum, t) => sum + t.relevance, 0) / matchedTrends.length)
        : Math.round(10 + Math.random() * 20);

    const recommendations: string[] = [];
    if (matchedTrends.length > 0) {
      recommendations.push(
        `Your content aligns with ${matchedTrends.length} trending topic(s), which may boost visibility.`,
      );
      recommendations.push("Consider using related hashtags to capitalize on these trends.");
    } else {
      recommendations.push("Your content doesn't strongly align with current trending topics.");
      recommendations.push(
        "Consider connecting your message to trending discussions for more reach.",
      );
    }

    return {
      relevanceScore,
      matchedTrends,
      recommendations,
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const trendAnalysisService = new TrendAnalysisService();
