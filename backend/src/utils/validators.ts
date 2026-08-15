import { z } from "zod";

// ─── Auth Validators ───────────────────────────────────────────

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").max(128),
  dob: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    password: z.string().min(6, "Password must be at least 6 characters").max(128),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ─── Profile Validators ───────────────────────────────────────

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email("Invalid email address").optional(),
  dob: z.string().optional(),
  avatar_url: z.string().url().optional(),
});

// ─── Analysis Validators ──────────────────────────────────────

export const analyzeSchema = z.object({
  text: z.string().min(4, "Text must be at least 4 characters").max(10000),
  platform: z
    .enum(["LinkedIn", "Instagram", "X", "Reddit", "Facebook", "YouTube", "General"])
    .default("General"),
  contentType: z
    .enum([
      "article",
      "tweet",
      "instagram_caption",
      "linkedin_post",
      "facebook_post",
      "youtube_description",
      "blog",
      "news",
      "email",
      "txt",
      "pdf",
      "docx",
      "general",
    ])
    .default("general")
    .optional(),
});

export const compareSchema = z.object({
  draftA: z.string().min(4, "Draft A must be at least 4 characters").max(10000),
  draftB: z.string().min(4, "Draft B must be at least 4 characters").max(10000),
  platform: z
    .enum(["LinkedIn", "Instagram", "X", "Reddit", "Facebook", "YouTube", "General"])
    .default("General"),
});

export const rewriteSchema = z.object({
  text: z.string().min(4).max(10000),
  platform: z
    .enum(["LinkedIn", "Instagram", "X", "Reddit", "Facebook", "YouTube", "General"])
    .default("General"),
});

export const grammarSchema = z.object({
  text: z.string().min(4).max(10000),
  platform: z
    .enum(["LinkedIn", "Instagram", "X", "Reddit", "Facebook", "YouTube", "General"])
    .default("General"),
});

export const privacySchema = z.object({
  text: z.string().min(4).max(10000),
  platform: z
    .enum(["LinkedIn", "Instagram", "X", "Reddit", "Facebook", "YouTube", "General"])
    .default("General"),
});

export const legalSchema = z.object({
  text: z.string().min(4).max(10000),
  platform: z
    .enum(["LinkedIn", "Instagram", "X", "Reddit", "Facebook", "YouTube", "General"])
    .default("General"),
});

export const emotionsSchema = z.object({
  text: z.string().min(4).max(10000),
  platform: z
    .enum(["LinkedIn", "Instagram", "X", "Reddit", "Facebook", "YouTube", "General"])
    .default("General"),
});

// ─── Feedback Validators ──────────────────────────────────────

export const feedbackSchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Feedback must be at least 10 characters").max(2000),
});

// ─── Pagination Validators ────────────────────────────────────

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
