import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health.routes.js";
import authRouter from "./routes/auth.routes.js";
import monitorRouter from "./routes/monitor.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRouter);
app.use("/api/monitor", monitorRouter);

export default app;