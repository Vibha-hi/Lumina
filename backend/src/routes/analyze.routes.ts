import { Router } from "express";
import {
  analyzePost,
  analyzeGuest,
  comparePost,
  getComparisonsHistory,
  deleteComparison,
} from "../controllers/analyze.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.js";
import { analysisLimiter } from "../middleware/rateLimiter.js";
import { analyzeSchema, compareSchema } from "../utils/validators.js";

const router = Router();

// Apply analysis rate limiter
router.use(analysisLimiter);

router.post("/", requireAuth, validate(analyzeSchema), analyzePost);
router.post("/guest", validate(analyzeSchema), analyzeGuest);
router.post("/compare", requireAuth, validate(compareSchema), comparePost);
router.get("/compare", requireAuth, getComparisonsHistory);
router.delete("/compare/:id", requireAuth, deleteComparison);

export default router;
