import type { IPrivacyService, ServiceInput } from "../types/service.types.js";
import type { PrivacyResult, DetectedEntity } from "../types/analysis.types.js";

/**
 * Mock Privacy Service.
 * Detects PII patterns using regex until a real model is connected.
 */
export class PrivacyService implements IPrivacyService {
  async detect(input: ServiceInput): Promise<PrivacyResult> {
    await this.delay(100);

    const text = input.text;
    const entities: DetectedEntity[] = [];

    // Phone numbers
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    let match;
    while ((match = phoneRegex.exec(text)) !== null) {
      entities.push({
        type: "phone",
        value: match[0],
        position: { start: match.index, end: match.index + match[0].length },
        riskLevel: "high",
      });
    }

    // Email addresses
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    while ((match = emailRegex.exec(text)) !== null) {
      entities.push({
        type: "email",
        value: match[0],
        position: { start: match.index, end: match.index + match[0].length },
        riskLevel: "medium",
      });
    }

    // Social Security / Government IDs (simplified)
    const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
    while ((match = ssnRegex.exec(text)) !== null) {
      entities.push({
        type: "government_id",
        value: match[0],
        position: { start: match.index, end: match.index + match[0].length },
        riskLevel: "critical",
      });
    }

    // Credit card numbers (simplified)
    const ccRegex = /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g;
    while ((match = ccRegex.exec(text)) !== null) {
      entities.push({
        type: "bank_info",
        value: match[0],
        position: { start: match.index, end: match.index + match[0].length },
        riskLevel: "critical",
      });
    }

    // Dates of birth (simplified patterns)
    const dobRegex =
      /\b(?:born|birthday|dob|date of birth)[:\s]+\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/gi;
    while ((match = dobRegex.exec(text)) !== null) {
      entities.push({
        type: "dob",
        value: match[0],
        position: { start: match.index, end: match.index + match[0].length },
        riskLevel: "medium",
      });
    }

    // Addresses (simplified — looks for street-like patterns)
    const addressRegex =
      /\d{1,5}\s\w+\s(?:street|st|avenue|ave|road|rd|boulevard|blvd|drive|dr|lane|ln)\b/gi;
    while ((match = addressRegex.exec(text)) !== null) {
      entities.push({
        type: "address",
        value: match[0],
        position: { start: match.index, end: match.index + match[0].length },
        riskLevel: "high",
      });
    }

    // Password mentions
    const passwordRegex = /(?:password|passwd|pwd)[:\s]+\S+/gi;
    while ((match = passwordRegex.exec(text)) !== null) {
      entities.push({
        type: "password",
        value: match[0],
        position: { start: match.index, end: match.index + match[0].length },
        riskLevel: "critical",
      });
    }

    // Calculate risk score
    const riskWeights: Record<string, number> = {
      critical: 30,
      high: 20,
      medium: 10,
      low: 5,
    };
    const totalRisk = entities.reduce((sum, e) => sum + (riskWeights[e.riskLevel] || 5), 0);
    const riskScore = Math.min(100, totalRisk);

    const recommendations: string[] = [];
    if (entities.length > 0) {
      recommendations.push("Remove or redact personal information before posting.");
    }
    if (entities.some((e) => e.type === "phone")) {
      recommendations.push("Never share phone numbers publicly on social media.");
    }
    if (entities.some((e) => e.type === "bank_info" || e.type === "government_id")) {
      recommendations.push(
        "CRITICAL: Remove all financial and government ID information immediately.",
      );
    }
    if (entities.some((e) => e.type === "password")) {
      recommendations.push(
        "CRITICAL: Never share passwords in any public or semi-public context. Change this password immediately.",
      );
    }
    if (entities.length === 0) {
      recommendations.push(
        "No personal information detected. Your post appears safe from a privacy perspective.",
      );
    }

    return {
      riskScore,
      detectedEntities: entities,
      highlightedText: text,
      recommendations,
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const privacyService = new PrivacyService();
