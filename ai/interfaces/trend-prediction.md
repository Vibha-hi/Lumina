# Trend Prediction — Interface Documentation

## Interface

```typescript
interface ITrendAnalysisService {
  analyze(input: { text: string; platform: Platform }): Promise<TrendResult>;
}

interface TrendResult {
  relevanceScore: number; // 0-100
  matchedTrends: Array<{
    topic: string;
    popularity: number; // 0-100
    relevance: number; // 0-100
  }>;
  recommendations: string[];
}
```

## Expected Request

```json
{
  "text": "Exploring how AI tools are transforming remote work productivity.",
  "platform": "LinkedIn"
}
```

## Expected Response

```json
{
  "relevanceScore": 78,
  "matchedTrends": [
    { "topic": "AI and Machine Learning", "popularity": 95, "relevance": 85 },
    { "topic": "Remote Work", "popularity": 82, "relevance": 70 }
  ],
  "recommendations": [
    "Your content aligns with 2 trending topics — great for visibility.",
    "Consider adding hashtags like #AIProductivity #FutureOfWork.",
    "LinkedIn audiences are highly engaged with AI + work topics right now."
  ]
}
```

## Integration Notes

- Connect to real trend APIs (Google Trends, X Trending, Reddit popular)
- Cache trend data (refresh every 6-12 hours)
- Platform-specific trends matter (LinkedIn trends ≠ X trends)
