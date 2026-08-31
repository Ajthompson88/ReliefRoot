import { Router } from "express";

import healthRouter from "./health.routes.js";
import metricRouter from "./metric.routes.js";

const router = Router();

router.use(healthRouter);
router.use("/metrics", metricRouter);

export default router;
