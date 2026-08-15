import mongoose, { Schema, type Document } from "mongoose";

export interface IAnalysis extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId | null;
  platform: string;
  inputText: string;
  contentType: string;
  source: string;

  // Overall scores
  overallRisk: number;
  privacyRisk: number;
  professionalRisk: number;
  legalRisk: number;
  misunderstandingRisk: number;
  reachPotential: number;

  // Detailed scores
  grammarScore: number;
  manipulationScore: number;
  clickbaitScore: number;
  biasScore: number;
  sourceReliability: number;

  // Complex data
  emotions: Array<{ emotion: string; value: number; highlightedWords?: string[] }>;
  personas: Array<{
    name: string;
    risk: number;
    tone: string;
    comment: string;
    avatar: string;
  }>;
  riskyPhrases: Array<{
    phrase: string;
    reason: string;
    suggestion: string;
  }>;
  detectedEntities: Array<{
    type: string;
    value: string;
    riskLevel: string;
  }>;
  legalConcerns: Array<{
    type: string;
    severity: string;
    description: string;
  }>;
  grammarIssues: Array<{
    type: string;
    original: string;
    suggestion: string;
    explanation: string;
  }>;

  // Rewrites
  rewrite: string | null;
  rewriteVariants: {
    safer?: string;
    professional?: string;
    friendly?: string;
    neutral?: string;
  };

  // AI summary
  summary: string | null;
  misunderstanding_breakdown: string | null;

  // Reach details
  reachDetails: {
    viralityScore?: number;
    shareabilityScore?: number;
    estimatedAudienceSize?: string;
    controversyScore?: number;
  };

  // Token usage tracking
  tokensUsed: number;
  providerKey: string;

  createdAt: Date;
}

const analysisSchema = new Schema<IAnalysis>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
      index: true,
    },
    platform: {
      type: String,
      required: true,
      default: "General",
    },
    inputText: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      default: "general",
    },
    source: {
      type: String,
      default: "dashboard",
    },

    overallRisk: { type: Number, default: 0 },
    privacyRisk: { type: Number, default: 0 },
    professionalRisk: { type: Number, default: 0 },
    legalRisk: { type: Number, default: 0 },
    misunderstandingRisk: { type: Number, default: 0 },
    reachPotential: { type: Number, default: 0 },

    grammarScore: { type: Number, default: 0 },
    manipulationScore: { type: Number, default: 0 },
    clickbaitScore: { type: Number, default: 0 },
    biasScore: { type: Number, default: 0 },
    sourceReliability: { type: Number, default: 0 },

    emotions: { type: [Schema.Types.Mixed] as any, default: [] },
    personas: { type: [Schema.Types.Mixed] as any, default: [] },
    riskyPhrases: { type: [Schema.Types.Mixed] as any, default: [] },
    detectedEntities: { type: [Schema.Types.Mixed] as any, default: [] },
    legalConcerns: { type: [Schema.Types.Mixed] as any, default: [] },
    grammarIssues: { type: [Schema.Types.Mixed] as any, default: [] },

    rewrite: { type: String, default: null },
    rewriteVariants: {
      type: Schema.Types.Mixed,
      default: {},
    },

    summary: { type: String, default: null },
    misunderstanding_breakdown: { type: String, default: null },

    reachDetails: {
      type: Schema.Types.Mixed,
      default: {},
    },

    tokensUsed: { type: Number, default: 0 },
    providerKey: { type: String, default: "unknown" },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: any) {
        ret.id = ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

// Compound index for efficient history queries
analysisSchema.index({ userId: 1, createdAt: -1 });

const Analysis = mongoose.model<IAnalysis>("Analysis", analysisSchema);
export default Analysis;
