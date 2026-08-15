// ─── Analysis Types ────────────────────────────────────────────

export type ContentType =
  | "article"
  | "tweet"
  | "instagram_caption"
  | "linkedin_post"
  | "facebook_post"
  | "youtube_description"
  | "blog"
  | "news"
  | "email"
  | "txt"
  | "pdf"
  | "docx"
  | "general";

export type Platform =
  "LinkedIn" | "Instagram" | "X" | "Reddit" | "Facebook" | "YouTube" | "General";

// ─── Emotion ───────────────────────────────────────────────────

export interface EmotionScore {
  emotion: string;
  value: number;
  highlightedWords?: string[];
}

export type EmotionLabel =
  "Anger" | "Fear" | "Joy" | "Curiosity" | "Sadness" | "Disgust" | "Trust" | "Neutral";

// ─── Grammar ───────────────────────────────────────────────────

export interface GrammarIssue {
  type: "grammar" | "spelling" | "punctuation" | "tone" | "professionalism";
  original: string;
  suggestion: string;
  position: { start: number; end: number };
  explanation: string;
}

export interface GrammarResult {
  score: number;
  readabilityScore: number;
  toneLabel: string;
  professionalismScore: number;
  issues: GrammarIssue[];
}

// ─── Privacy ───────────────────────────────────────────────────

export interface DetectedEntity {
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

export interface PrivacyResult {
  riskScore: number;
  detectedEntities: DetectedEntity[];
  highlightedText: string;
  recommendations: string[];
}

// ─── Legal ─────────────────────────────────────────────────────

export interface LegalConcern {
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

export interface LegalResult {
  riskScore: number;
  concerns: LegalConcern[];
  recommendations: string[];
}

// ─── Rewrite ───────────────────────────────────────────────────

export interface RewriteVariant {
  type: "safer" | "professional" | "friendly" | "neutral";
  text: string;
  changesExplanation: string;
  riskReduction: number;
}

export interface RewriteResult {
  variants: RewriteVariant[];
  preservedIntent: boolean;
  originalRisk: number;
}

// ─── Reach ─────────────────────────────────────────────────────

export interface ReachPrediction {
  viralityScore: number;
  shareabilityScore: number;
  estimatedAudienceSize: string;
  trendInfluence: number;
  hashtagStrength: number;
  controversyScore: number;
  explanation: string;
}

// ─── Bias ──────────────────────────────────────────────────────

export interface BiasResult {
  score: number;
  biasTypes: Array<{ type: string; confidence: number; explanation: string }>;
  explanation: string;
}

// ─── Clickbait ─────────────────────────────────────────────────

export interface ClickbaitResult {
  score: number;
  techniques: string[];
  explanation: string;
}

// ─── Source Credibility ────────────────────────────────────────

export interface SourceCredibilityResult {
  score: number;
  factors: Array<{ factor: string; impact: "positive" | "negative"; explanation: string }>;
  overallAssessment: string;
}

// ─── Manipulation ──────────────────────────────────────────────

export interface ManipulationResult {
  score: number;
  techniques: Array<{ name: string; confidence: number; description: string }>;
  explanation: string;
}

// ─── Trend Analysis ────────────────────────────────────────────

export interface TrendResult {
  relevanceScore: number;
  matchedTrends: Array<{ topic: string; popularity: number; relevance: number }>;
  recommendations: string[];
}

// ─── Persona Simulation ───────────────────────────────────────

export interface PersonaSimulation {
  name: string;
  risk: number;
  tone: "success" | "warning" | "danger";
  comment: string;
  avatar: string;
}

// ─── Risky Phrase ──────────────────────────────────────────────

export interface RiskyPhrase {
  phrase: string;
  reason: string;
  suggestion: string;
}

// ─── Full Analysis (Combined) ──────────────────────────────────

export interface FullAnalysisRequest {
  text: string;
  platform: Platform;
  contentType?: ContentType;
}

export interface FullAnalysisResult {
  // Overall scores
  overallRisk: number;
  privacyRisk: number;
  professionalRisk: number;
  legalRisk: number;
  misunderstandingRisk: number;
  reachPotential: number;

  // Detailed results
  grammar: GrammarResult;
  emotions: EmotionScore[];
  privacy: PrivacyResult;
  legal: LegalResult;
  rewrite: RewriteResult;
  reach: ReachPrediction;
  bias: BiasResult;
  clickbait: ClickbaitResult;
  sourceCredibility: SourceCredibilityResult;
  manipulation: ManipulationResult;
  trends: TrendResult;

  // Persona simulations
  personas: PersonaSimulation[];
  riskyPhrases: RiskyPhrase[];

  // AI Summary
  summary: string;
}
