import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import { createMonitor, getMonitors, getMonitorLogs, getUptimeBars, getUptimeSummary, getIncidents } from "../controllers/monitor.controller.js";

const monitorRouter = Router();

// Protected routes
monitorRouter.post("/", authMiddleware, createMonitor);
monitorRouter.get("/", authMiddleware, getMonitors);
monitorRouter.get("/:id/logs", authMiddleware, getMonitorLogs);
monitorRouter.get("/:id/uptime-bars", authMiddleware, getUptimeBars);
monitorRouter.get("/:id/uptime-summary", authMiddleware, getUptimeSummary);
monitorRouter.get("/:id/incidents", authMiddleware, getIncidents);

export default monitorRouter;