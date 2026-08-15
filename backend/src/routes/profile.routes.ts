import { Router } from "express";
import { getProfile, updateProfile, deleteAccount } from "../controllers/profile.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.js";
import { updateProfileSchema } from "../utils/validators.js";

const router = Router();

// All profile routes require authentication
router.use(requireAuth);

router.get("/", getProfile);
router.put("/", validate(updateProfileSchema), updateProfile);
router.delete("/", deleteAccount);

export default router;
