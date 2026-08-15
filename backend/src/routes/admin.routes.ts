import { Router } from "express";
import { listUsers, getStats, getHistory, deleteAnalysis, getUserHistory } from "../controllers/admin.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// All admin routes require admin role
router.use(requireAdmin);

router.get("/users", listUsers);
router.get("/users/:id/history", getUserHistory);
router.get("/stats", getStats);
router.get("/history", getHistory);
router.delete("/analysis/:id", deleteAnalysis);

export default router;
