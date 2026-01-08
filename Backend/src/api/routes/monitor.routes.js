import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import { createMonitor, getMonitors } from "../controllers/monitor.controller.js";

const monitorRouter = Router();

// Protected routes
monitorRouter.post("/", authMiddleware, createMonitor);
monitorRouter.get("/", authMiddleware, getMonitors);

export default monitorRouter;