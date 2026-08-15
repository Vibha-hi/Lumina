import mongoose, { Schema, type Document } from "mongoose";

export interface IComparison extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  platform: string;
  draftA: string;
  draftB: string;
  winner: "A" | "B";
  winnerReasoning: string;
  analysisA: any; // Using the GroqAnalysisResult structure
  analysisB: any; // Using the GroqAnalysisResult structure
  createdAt: Date;
}

const comparisonSchema = new Schema<IComparison>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    platform: {
      type: String,
      required: true,
      default: "General",
    },
    draftA: {
      type: String,
      required: true,
    },
    draftB: {
      type: String,
      required: true,
    },
    winner: {
      type: String,
      enum: ["A", "B"],
      required: true,
    },
    winnerReasoning: {
      type: String,
      required: true,
    },
    analysisA: {
      type: Schema.Types.Mixed,
      required: true,
    },
    analysisB: {
      type: Schema.Types.Mixed,
      required: true,
    },
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
comparisonSchema.index({ userId: 1, createdAt: -1 });

const Comparison = mongoose.model<IComparison>("Comparison", comparisonSchema);
export default Comparison;
