import { Router } from "express";
import { checkLegal } from "../controllers/legal.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.js";
import { legalSchema } from "../utils/validators.js";

const router = Router();

router.post("/", requireAuth, validate(legalSchema), checkLegal);

export default router;
