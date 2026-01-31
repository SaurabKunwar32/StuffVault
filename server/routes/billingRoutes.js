import express from "express";
import checkAuth from "../middlewares/auth.js";
import { updateSubscription } from "../controllers/billingController.js";

const router = express.Router();

// ===================== SUb PLANS =====================
router.post("/subscription", checkAuth, updateSubscription);

export default router;
