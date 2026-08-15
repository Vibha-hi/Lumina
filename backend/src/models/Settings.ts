import mongoose, { Schema, type Document } from "mongoose";

export interface ISettings extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  darkMode: boolean;
  defaultPlatform: string;
  notifications: boolean;
  language: string;
  updatedAt: Date;
}

const settingsSchema = new Schema<ISettings>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    darkMode: {
      type: Boolean,
      default: true,
    },
    defaultPlatform: {
      type: String,
      default: "General",
    },
    notifications: {
      type: Boolean,
      default: true,
    },
    language: {
      type: String,
      default: "en",
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

const Settings = mongoose.model<ISettings>("Settings", settingsSchema);
export default Settings;
