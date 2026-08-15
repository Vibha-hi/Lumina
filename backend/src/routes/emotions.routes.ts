import { Router } from "express";
import { detectEmotions } from "../controllers/emotions.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.js";
import { emotionsSchema } from "../utils/validators.js";

const router = Router();

router.post("/", requireAuth, validate(emotionsSchema), detectEmotions);

export default router;
