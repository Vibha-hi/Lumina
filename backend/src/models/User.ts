import mongoose, { Schema, type Document } from "mongoose";
import { hashPassword } from "../utils/password.js";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  dob?: string;
  avatar_url?: string | null;
  provider: "email";
  role: "user" | "admin";
  isVerified: boolean;
  resetToken?: string;
  resetExpires?: Date;
  resetCode?: string;
  resetCodeExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 6,
      select: false, // Don't include password in queries by default
    },
    dob: {
      type: String,
      default: null,
    },
    avatar_url: {
      type: String,
      default: null,
    },
    provider: {
      type: String,
      enum: ["email"],
      default: "email",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetToken: {
      type: String,
      select: false,
    },
    resetExpires: {
      type: Date,
      select: false,
    },
    resetCode: {
      type: String,
      select: false,
    },
    resetCodeExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: any) {
        delete ret.password;
        delete ret.resetToken;
        delete ret.resetExpires;
        delete ret.resetCode;
        delete ret.resetCodeExpires;
        delete ret.__v;
        ret.id = ret._id;
        return ret;
      },
    },
  },
);

// Hash password before saving (only for email provider)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await hashPassword(this.password);
  next();
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
