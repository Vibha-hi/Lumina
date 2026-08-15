import mongoose, { Schema, type Document } from "mongoose";

export interface IReport extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  analysisId: mongoose.Types.ObjectId;
  format: "pdf" | "json";
  url: string | null;
  data: Record<string, unknown>;
  createdAt: Date;
}

const reportSchema = new Schema<IReport>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    analysisId: {
      type: Schema.Types.ObjectId,
      ref: "Analysis",
      required: true,
    },
    format: {
      type: String,
      enum: ["pdf", "json"],
      default: "json",
    },
    url: {
      type: String,
      default: null,
    },
    data: {
      type: Schema.Types.Mixed,
      default: {},
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

reportSchema.index({ userId: 1, createdAt: -1 });

const Report = mongoose.model<IReport>("Report", reportSchema);
export default Report;
