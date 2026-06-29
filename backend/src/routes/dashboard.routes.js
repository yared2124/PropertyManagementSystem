import express from "express";
import { authenticate } from "../middlewares/auth.js";
import dashboardController from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/overview", authenticate, dashboardController.getOverview);

export default router;
