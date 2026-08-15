import { Router } from "express";
import { submitFeedback } from "../controllers/feedback.controller.js";
import { optionalAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.js";
import { feedbackSchema } from "../utils/validators.js";

const router = Router();

// Feedback works for both authenticated and anonymous users
router.post("/", optionalAuth, validate(feedbackSchema), submitFeedback);

export default router;
