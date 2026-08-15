// ─── Service Interfaces ────────────────────────────────────────
// Each service follows this contract. Implementations return mock data
// until real AI models are connected.

import type {
  EmotionScore,
  GrammarResult,
  RewriteResult,
  PrivacyResult,
  LegalResult,
  ReachPrediction,
  TrendResult,
  ClickbaitResult,
  BiasResult,
  SourceCredibilityResult,
  ManipulationResult,
  Platform,
} from "./analysis.types.js";

export interface ServiceInput {
  text: string;
  platform: Platform;
}

export interface IEmotionAnalysisService {
  analyze(input: ServiceInput): Promise<EmotionScore[]>;
}

export interface IGrammarService {
  check(input: ServiceInput): Promise<GrammarResult>;
}

export interface IRewriteService {
  rewrite(input: ServiceInput): Promise<RewriteResult>;
}

export interface IPrivacyService {
  detect(input: ServiceInput): Promise<PrivacyResult>;
}

export interface ILegalService {
  analyze(input: ServiceInput): Promise<LegalResult>;
}

export interface IReachPredictionService {
  predict(input: ServiceInput): Promise<ReachPrediction>;
}

export interface ITrendAnalysisService {
  analyze(input: ServiceInput): Promise<TrendResult>;
}

export interface IClickbaitDetectionService {
  detect(input: ServiceInput): Promise<ClickbaitResult>;
}

export interface IBiasDetectionService {
  detect(input: ServiceInput): Promise<BiasResult>;
}

export interface ISourceCredibilityService {
  evaluate(input: ServiceInput): Promise<SourceCredibilityResult>;
}

export interface IManipulationDetectionService {
  detect(input: ServiceInput): Promise<ManipulationResult>;
}
