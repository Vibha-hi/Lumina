import mongoose, { Schema, type Document } from "mongoose";
import { hashPassword } from "../utils/password.js";

export interface IOtpSession extends Document {
  name: string;
  email: string;
  password?: string;
  dob?: string;
  verificationCode: string;
  expiresAt: Date;
}

const otpSessionSchema = new Schema<IOtpSession>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    password: { type: String },
    dob: { type: String, default: null },
    verificationCode: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

// Hash password before saving to the temporary session
otpSessionSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await hashPassword(this.password);
  next();
});

// TTL index to automatically delete expired sessions
otpSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OtpSession = mongoose.model<IOtpSession>("OtpSession", otpSessionSchema);
export default OtpSession;
