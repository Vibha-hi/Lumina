# Clickbait Detection — Interface Documentation

## Interface

```typescript
interface IClickbaitDetectionService {
  detect(input: { text: string; platform: Platform }): Promise<ClickbaitResult>;
}

interface ClickbaitResult {
  score: number; // 0-100 (100 = highly clickbait)
  techniques: string[]; // List of detected clickbait techniques
  explanation: string;
}
```

## Expected Request

```json
{
  "text": "You WON'T BELIEVE what this CEO did!! 😱 Doctors HATE this one simple trick!!",
  "platform": "Facebook"
}
```

## Expected Response

```json
{
  "score": 92,
  "techniques": [
    "Exaggerated curiosity gap",
    "Sensational language",
    "Authority appeal manipulation",
    "Excessive capitalization",
    "Excessive punctuation"
  ],
  "explanation": "This content uses 5 clickbait techniques and scores 92% on the clickbait scale. The manipulative patterns significantly reduce audience trust and credibility."
}
```

## Integration Notes

- Fine-tuned BERT/RoBERTa classifiers work well for clickbait detection
- Consider training on the Clickbait Challenge dataset
- Pattern matching can complement ML for high-confidence detections
