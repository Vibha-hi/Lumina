# LUMINA.AI — AI Model Integration Guide

This directory contains documentation for integrating real AI models into LUMINA.AI's backend services. Currently, all services return **mock data** using keyword-matching and regex patterns.

## Architecture Overview

Each service in `backend/src/services/` implements an interface defined in `backend/src/types/service.types.ts`. To integrate a real model:

1. Create a new implementation class (e.g., `EmotionAnalysisServiceGPT`)
2. Implement the same interface (`IEmotionAnalysisService`)
3. Replace the singleton export in the service file

```typescript
// Before (mock):
export const emotionAnalysisService = new EmotionAnalysisService();

// After (real):
export const emotionAnalysisService = new EmotionAnalysisServiceGPT({
  apiKey: process.env.OPENAI_API_KEY,
  model: "gpt-4o",
});
```

## Service Interfaces

| Service              | Interface                    | File                                                          |
| -------------------- | ---------------------------- | ------------------------------------------------------------- |
| Emotion Detection    | `IEmotionAnalysisService`    | [emotion-detection.md](interfaces/emotion-detection.md)       |
| Grammar Model        | `IGrammarService`            | [grammar-model.md](interfaces/grammar-model.md)               |
| Privacy Detection    | `IPrivacyService`            | [privacy-detection.md](interfaces/privacy-detection.md)       |
| Legal Classification | `ILegalService`              | [legal-classification.md](interfaces/legal-classification.md) |
| LLM Rewrite          | `IRewriteService`            | [llm-rewrite.md](interfaces/llm-rewrite.md)                   |
| Trend Prediction     | `ITrendAnalysisService`      | [trend-prediction.md](interfaces/trend-prediction.md)         |
| Clickbait Detection  | `IClickbaitDetectionService` | [clickbait-detection.md](interfaces/clickbait-detection.md)   |

## Integration Steps

### 1. Choose Your Model Provider

- **OpenAI** (GPT-4o, GPT-4o-mini)
- **Google** (Gemini 2.5 Flash/Pro)
- **Anthropic** (Claude)
- **Hugging Face** (open-source models)
- **Custom** (self-hosted models)

### 2. Add Provider SDK

```bash
cd backend
npm install openai          # For OpenAI
npm install @google/genai   # For Gemini
npm install @anthropic-ai/sdk  # For Anthropic
```

### 3. Create Environment Variables

```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
AI_MODEL=gpt-4o-mini
```

### 4. Implement the Service Interface

See individual interface docs in `interfaces/` for expected request/response formats.

### 5. Test with Sample Data

Use `examples/sample-requests.json` for testing.

## Recommended Model Assignments

| Service              | Recommended Approach                           |
| -------------------- | ---------------------------------------------- |
| Emotion Detection    | Fine-tuned classifier or LLM with JSON mode    |
| Grammar              | LanguageTool API or LLM with structured output |
| Privacy Detection    | Regex + NER model (spaCy/Hugging Face)         |
| Legal Classification | LLM with legal domain prompting                |
| Rewrite              | LLM (GPT-4o / Gemini) with role prompts        |
| Trend Prediction     | Social media API + trend analysis              |
| Clickbait            | Fine-tuned BERT classifier                     |

## Cost Considerations

- Use **GPT-4o-mini** or **Gemini Flash** for cost-sensitive endpoints
- Cache results for identical inputs
- Implement request batching where possible
- Consider running smaller models locally for privacy-sensitive operations
