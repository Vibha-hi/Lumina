import mongoose, { Schema, type Document } from "mongoose";

export interface IUsage extends Document {
  _id: mongoose.Types.ObjectId;
  identifier: string; // IP address for guests, userId for authenticated users
  identifierType: "ip" | "user";
  freeAnalysesUsed: number;
  totalAnalyses: number;
  lastAnalysisAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const usageSchema = new Schema<IUsage>(
  {
    identifier: {
      type: String,
      required: true,
      index: true,
    },
    identifierType: {
      type: String,
      enum: ["ip", "user"],
      default: "ip",
    },
    freeAnalysesUsed: {
      type: Number,
      default: 0,
    },
    totalAnalyses: {
      type: Number,
      default: 0,
    },
    lastAnalysisAt: {
      type: Date,
      default: null,
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

// Unique compound index: one record per identifier + type
usageSchema.index({ identifier: 1, identifierType: 1 }, { unique: true });

const Usage = mongoose.model<IUsage>("Usage", usageSchema);
export default Usage;
