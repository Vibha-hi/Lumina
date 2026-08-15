# Grammar Model — Interface Documentation

## Interface

```typescript
interface IGrammarService {
  check(input: { text: string; platform: Platform }): Promise<GrammarResult>;
}

interface GrammarResult {
  score: number; // 0-100 (100 = perfect grammar)
  readabilityScore: number; // 0-100
  toneLabel: string; // "Professional" | "Casual" | "Informal" | "Academic"
  professionalismScore: number; // 0-100
  issues: GrammarIssue[];
}

interface GrammarIssue {
  type: "grammar" | "spelling" | "punctuation" | "tone" | "professionalism";
  original: string;
  suggestion: string;
  position: { start: number; end: number };
  explanation: string;
}
```

## Expected Request

```json
{
  "text": "i gonna tell u about somthing rly cool",
  "platform": "LinkedIn"
}
```

## Expected Response

```json
{
  "score": 35,
  "readabilityScore": 60,
  "toneLabel": "Informal",
  "professionalismScore": 25,
  "issues": [
    {
      "type": "grammar",
      "original": "i",
      "suggestion": "I",
      "position": { "start": 0, "end": 1 },
      "explanation": "The pronoun 'I' should always be capitalized."
    },
    {
      "type": "tone",
      "original": "gonna",
      "suggestion": "going to",
      "position": { "start": 2, "end": 7 },
      "explanation": "\"gonna\" is informal. Use \"going to\" for professional contexts."
    }
  ]
}
```

## Integration Notes

- Positions are character-based (0-indexed)
- Consider using LanguageTool API as an alternative to LLM-based grammar checking
- Platform context should influence tone expectations (LinkedIn = formal, X = casual)
