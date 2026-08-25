import { Resend } from "resend";
import { env } from "../config/env.js";

// Initialize Resend client (uses HTTPS, not SMTP — works on Render, Vercel, etc.)
const getResend = () => {
  if (env.RESEND_API_KEY) {
    return new Resend(env.RESEND_API_KEY);
  }
  return null;
};

const FROM_ADDRESS = env.RESEND_FROM || "LUMINA.AI <onboarding@resend.dev>";

export const sendVerificationEmail = async (to: string, code: string) => {
  const resend = getResend();

  const emailPayload = {
    from: FROM_ADDRESS,
    to,
    subject: "Verify your LUMINA.AI account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">Welcome to LUMINA.AI</h2>
        <p style="color: #555; font-size: 16px;">Please use the following 6-digit code to verify your email address:</p>
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <strong style="font-size: 24px; letter-spacing: 5px; color: #333;">${code}</strong>
        </div>
        <p style="color: #777; font-size: 14px;">This code will expire in 15 minutes.</p>
        <p style="color: #777; font-size: 14px;">If you did not request this, please ignore this email.</p>
      </div>
    `,
  };

  if (resend) {
    try {
      const { error } = await resend.emails.send(emailPayload);
      if (error) {
        console.error("❌ Resend email error (falling back to logs):", error);
        console.log(`🔑 VERIFICATION CODE for ${to}: ${code}`);
      }
    } catch (err) {
      console.error("❌ Email send failed (falling back to logs):", err);
      console.log(`🔑 VERIFICATION CODE for ${to}: ${code}`);
    }
  } else {
    console.log(`\n=================================================`);
    console.log(`📧 MOCK EMAIL SENT TO: ${to}`);
    console.log(`🔑 VERIFICATION CODE: ${code}`);
    console.log(`=================================================\n`);
  }
};

export const sendPasswordResetEmail = async (to: string, code: string) => {
  const resend = getResend();

  const emailPayload = {
    from: FROM_ADDRESS,
    to,
    subject: "Reset your LUMINA.AI password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
        <p style="color: #555; font-size: 16px;">We received a request to reset the password for your LUMINA.AI account. Use the following 6-digit code to proceed:</p>
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <strong style="font-size: 24px; letter-spacing: 5px; color: #333;">${code}</strong>
        </div>
        <p style="color: #777; font-size: 14px;">This code will expire in 15 minutes.</p>
        <p style="color: #777; font-size: 14px;">If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
      </div>
    `,
  };

  if (resend) {
    try {
      const { error } = await resend.emails.send(emailPayload);
      if (error) {
        console.error("❌ Resend email error (falling back to logs):", error);
        console.log(`🔑 RESET CODE for ${to}: ${code}`);
      }
    } catch (err) {
      console.error("❌ Email send failed (falling back to logs):", err);
      console.log(`🔑 RESET CODE for ${to}: ${code}`);
    }
  } else {
    console.log(`\n=================================================`);
    console.log(`📧 MOCK PASSWORD RESET EMAIL SENT TO: ${to}`);
    console.log(`🔑 RESET CODE: ${code}`);
    console.log(`=================================================\n`);
  }
};
