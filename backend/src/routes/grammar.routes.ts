import { Router } from "express";
import { checkGrammar } from "../controllers/grammar.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.js";
import { grammarSchema } from "../utils/validators.js";

const router = Router();

router.post("/", requireAuth, validate(grammarSchema), checkGrammar);

export default router;
