# Privacy Detection — Interface Documentation

## Interface

```typescript
interface IPrivacyService {
  detect(input: { text: string; platform: Platform }): Promise<PrivacyResult>;
}

interface PrivacyResult {
  riskScore: number; // 0-100
  detectedEntities: DetectedEntity[];
  highlightedText: string;
  recommendations: string[];
}

interface DetectedEntity {
  type:
    | "phone"
    | "email"
    | "address"
    | "bank_info"
    | "government_id"
    | "password"
    | "photo_reference"
    | "dob"
    | "sensitive_location";
  value: string;
  position: { start: number; end: number };
  riskLevel: "low" | "medium" | "high" | "critical";
}
```

## Expected Request

```json
{
  "text": "Hey everyone! My new number is 555-123-4567, reach me at john@email.com. Born on 03/15/1990.",
  "platform": "Facebook"
}
```

## Expected Response

```json
{
  "riskScore": 75,
  "detectedEntities": [
    {
      "type": "phone",
      "value": "555-123-4567",
      "position": { "start": 31, "end": 43 },
      "riskLevel": "high"
    },
    {
      "type": "email",
      "value": "john@email.com",
      "position": { "start": 57, "end": 71 },
      "riskLevel": "medium"
    },
    {
      "type": "dob",
      "value": "03/15/1990",
      "position": { "start": 81, "end": 91 },
      "riskLevel": "medium"
    }
  ],
  "highlightedText": "Hey everyone! My new number is [PHONE], reach me at [EMAIL]. Born on [DOB].",
  "recommendations": [
    "Remove phone number before posting publicly.",
    "Consider using a contact form instead of sharing your email.",
    "Never share your date of birth on social media."
  ]
}
```

## Integration Notes

- Use NER models (spaCy, Hugging Face) for entity recognition
- Regex is sufficient for structured PII (phone, email, SSN)
- Consider using Microsoft Presidio for comprehensive PII detection
- `highlightedText` should replace entities with bracketed labels
