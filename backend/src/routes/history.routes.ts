import { Router } from "express";
import { listHistory, getAnalysis, deleteAnalysis } from "../controllers/history.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

// All history routes require authentication
router.use(requireAuth);

router.get("/", listHistory);
router.get("/:id", getAnalysis);
router.delete("/:id", deleteAnalysis);

export default router;
