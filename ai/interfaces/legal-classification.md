# Legal Classification — Interface Documentation

## Interface

```typescript
interface ILegalService {
  analyze(input: { text: string; platform: Platform }): Promise<LegalResult>;
}

interface LegalResult {
  riskScore: number;
  concerns: LegalConcern[];
  recommendations: string[];
}

interface LegalConcern {
  type:
    | "defamation"
    | "copyright"
    | "threats"
    | "harassment"
    | "hate_speech"
    | "discrimination"
    | "false_claims"
    | "privacy_violations"
    | "professional_risks";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  affectedText: string;
  explanation: string;
}
```

## Expected Request

```json
{
  "text": "My boss John Smith is a fraud who steals from the company. Everyone should know the truth!",
  "platform": "LinkedIn"
}
```

## Expected Response

```json
{
  "riskScore": 82,
  "concerns": [
    {
      "type": "defamation",
      "severity": "critical",
      "description": "Accusation of criminal behavior without evidence.",
      "affectedText": "is a fraud who steals",
      "explanation": "Calling someone a 'fraud' and accusing them of theft without evidence could constitute defamation."
    },
    {
      "type": "professional_risks",
      "severity": "high",
      "description": "Publicly naming an employer/colleague with negative claims.",
      "affectedText": "My boss John Smith",
      "explanation": "Naming specific individuals in professional complaints can lead to termination and legal action."
    }
  ],
  "recommendations": [
    "Remove the person's name and avoid specific criminal accusations.",
    "Consider reporting concerns through proper HR channels instead.",
    "URGENT: This post could result in a defamation lawsuit."
  ]
}
```
