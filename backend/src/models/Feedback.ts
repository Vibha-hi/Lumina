import mongoose, { Schema, type Document } from "mongoose";

export interface IFeedback extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  message: string;
  userId?: mongoose.Types.ObjectId | null;
  createdAt: Date;
}

const feedbackSchema = new Schema<IFeedback>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    message: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 2000,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
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

feedbackSchema.index({ createdAt: -1 });

const Feedback = mongoose.model<IFeedback>("Feedback", feedbackSchema);
export default Feedback;
