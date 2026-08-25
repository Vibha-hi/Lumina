import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("5000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),

  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters"),
  JWT_EXPIRES_IN: z.string().default("7d"),


  CORS_ORIGIN: z.string().default("http://localhost:5173"),

  FORMSPREE_ENDPOINT: z.string().default("https://formspree.io/f/your-form-id"),

  // Groq AI — used by the unified analysis service
  GROQ_API_KEY: z.string().default(""),

  // Resend email API (replaces SMTP — works on Render/Vercel)
  RESEND_API_KEY: z.string().default(""),
  RESEND_FROM: z.string().default("LUMINA.AI <onboarding@resend.dev>"),
});

function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("❌ Invalid environment variables:");
    result.error.issues.forEach((issue) => {
      console.error(`   ${issue.path.join(".")}: ${issue.message}`);
    });
    process.exit(1);
  }

  return result.data;
}

export const env = validateEnv();
