import nodemailer from "nodemailer";
import { env } from "../config/env.js";

// Create a transporter using SMTP or a dummy transport for dev
const getTransporter = () => {
  if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT) || 587,
      secure: Number(env.SMTP_PORT) === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }
  return null;
};

export const sendVerificationEmail = async (to: string, code: string) => {
  const transporter = getTransporter();

  const mailOptions = {
    from: env.SMTP_FROM || '"LUMINA.AI" <noreply@lumina-ai.app>',
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

  if (transporter) {
    await transporter.sendMail(mailOptions);
  } else {
    // Fallback for development if SMTP is not configured
    console.log(`\n=================================================`);
    console.log(`📧 MOCK EMAIL SENT TO: ${to}`);
    console.log(`🔑 VERIFICATION CODE: ${code}`);
    console.log(`=================================================\n`);
  }
};

export const sendPasswordResetEmail = async (to: string, code: string) => {
  const transporter = getTransporter();

  const mailOptions = {
    from: env.SMTP_FROM || '"LUMINA.AI" <noreply@lumina-ai.app>',
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

  if (transporter) {
    await transporter.sendMail(mailOptions);
  } else {
    console.log(`\n=================================================`);
    console.log(`📧 MOCK PASSWORD RESET EMAIL SENT TO: ${to}`);
    console.log(`🔑 RESET CODE: ${code}`);
    console.log(`=================================================\n`);
  }
};
