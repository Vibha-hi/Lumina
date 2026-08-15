# LLM Rewrite — Interface Documentation

## Interface

```typescript
interface IRewriteService {
  rewrite(input: { text: string; platform: Platform }): Promise<RewriteResult>;
}

interface RewriteResult {
  variants: RewriteVariant[];
  preservedIntent: boolean;
  originalRisk: number;
}

interface RewriteVariant {
  type: "safer" | "professional" | "friendly" | "neutral";
  text: string;
  changesExplanation: string;
  riskReduction: number; // How many risk points this variant reduces
}
```

## Expected Request

```json
{
  "text": "My manager is completely useless and has no idea what they're doing. This company is a total joke.",
  "platform": "LinkedIn"
}
```

## Expected Response

```json
{
  "variants": [
    {
      "type": "safer",
      "text": "I've noticed some management decisions I disagree with, and I feel the company could improve in certain areas.",
      "changesExplanation": "Replaced personal attacks with constructive criticism. Removed emotionally charged words.",
      "riskReduction": 45
    },
    {
      "type": "professional",
      "text": "I'd like to share some observations about areas where I believe our team and organization could improve.",
      "changesExplanation": "Restructured as a professional observation using 'I' statements.",
      "riskReduction": 55
    },
    {
      "type": "friendly",
      "text": "Having a tough time at work lately. I wish things were managed differently, but I'm hopeful things can improve.",
      "changesExplanation": "Softened tone with personal feelings rather than accusations.",
      "riskReduction": 40
    },
    {
      "type": "neutral",
      "text": "There are aspects of current management and company direction that could benefit from review and improvement.",
      "changesExplanation": "Removed all personal language and emotional content. Presented as objective observation.",
      "riskReduction": 60
    }
  ],
  "preservedIntent": true,
  "originalRisk": 72
}
```

## Integration Notes

- **Never simply remove content** — always preserve the user's intent
- Each variant must include an explanation of what changed
- `riskReduction` is relative to `originalRisk`
- Use system prompts that emphasize intent preservation
