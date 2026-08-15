import { Router } from "express";
import { rewriteText } from "../controllers/rewrite.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.js";
import { rewriteSchema } from "../utils/validators.js";

const router = Router();

router.post("/", requireAuth, validate(rewriteSchema), rewriteText);

export default router;
