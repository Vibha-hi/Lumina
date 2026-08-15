import { Router } from "express";
import { checkPrivacy } from "../controllers/privacy.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.js";
import { privacySchema } from "../utils/validators.js";

const router = Router();

router.post("/", requireAuth, validate(privacySchema), checkPrivacy);

export default router;
