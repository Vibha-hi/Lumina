# Emotion Detection — Interface Documentation

## Interface

```typescript
interface IEmotionAnalysisService {
  analyze(input: { text: string; platform: Platform }): Promise<EmotionScore[]>;
}

interface EmotionScore {
  emotion: string; // "Anger" | "Fear" | "Joy" | "Curiosity" | "Sadness" | "Disgust" | "Trust" | "Neutral"
  value: number; // 0-100
  highlightedWords?: string[]; // Words that triggered this emotion
}
```

## Expected Request

```json
{
  "text": "I can't believe how terrible this service is! I've been waiting for hours.",
  "platform": "X"
}
```

## Expected Response

```json
[
  { "emotion": "Anger", "value": 82, "highlightedWords": ["terrible", "can't believe"] },
  { "emotion": "Fear", "value": 10, "highlightedWords": [] },
  { "emotion": "Joy", "value": 3, "highlightedWords": [] },
  { "emotion": "Curiosity", "value": 5, "highlightedWords": [] },
  { "emotion": "Sadness", "value": 35, "highlightedWords": ["waiting"] },
  { "emotion": "Disgust", "value": 45, "highlightedWords": ["terrible"] },
  { "emotion": "Trust", "value": 8, "highlightedWords": [] },
  { "emotion": "Neutral", "value": 12, "highlightedWords": [] }
]
```

## Integration Notes

- All 8 emotions must be returned in every response
- Values must sum to a reasonable total (not necessarily 100)
- `highlightedWords` should be exact substrings from the input text
- Consider using Plutchik's wheel of emotions for finer granularity
