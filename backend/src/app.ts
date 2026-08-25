import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import { env } from "./config/env.js";
import { generalLimiter } from "./middleware/rateLimiter.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Route imports
import authRoutes from "./routes/auth.routes.js";
import analyzeRoutes from "./routes/analyze.routes.js";
import rewriteRoutes from "./routes/rewrite.routes.js";
import grammarRoutes from "./routes/grammar.routes.js";
import privacyRoutes from "./routes/privacy.routes.js";
import legalRoutes from "./routes/legal.routes.js";
import emotionsRoutes from "./routes/emotions.routes.js";
import historyRoutes from "./routes/history.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import feedbackRoutes from "./routes/feedback.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();
app.set("trust proxy", 1);

// ─── Security Middleware ───────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin or from extension
      if (!origin || origin.startsWith("chrome-extension://")) return callback(null, true);
      
      // Allow localhost in development
      if (origin.includes("localhost") || origin.includes("127.0.0.1")) return callback(null, true);
      
      const allowedOrigins = env.CORS_ORIGIN.split(",").map((o) => o.trim());
      if (allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        return callback(null, true);
      }
      
      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ─── Body Parsing ──────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─── XSS / NoSQL Injection Protection ─────────────────────────
// app.use(mongoSanitize()); // Disabled: Incompatible with Express 5. Zod validation prevents NoSQL injection.

// ─── Rate Limiting ─────────────────────────────────────────────
app.use(generalLimiter);

// ─── Health Check ──────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "LUMINA.AI Backend is running",
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// ─── API Routes ────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/analyze", analyzeRoutes);
app.use("/api/rewrite", rewriteRoutes);
app.use("/api/grammar", grammarRoutes);
app.use("/api/privacy", privacyRoutes);
app.use("/api/legal", legalRoutes);
app.use("/api/emotions", emotionsRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/admin", adminRoutes);

// ─── 404 Handler ───────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ─── Global Error Handler ──────────────────────────────────────
app.use(errorHandler);

export default app;
