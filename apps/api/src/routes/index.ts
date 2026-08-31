import { Router } from "express";

import cultivarRouter from "./cultivar.routes.js";
import effectRouter from "./effect.routes.js";
import healthRouter from "./health.routes.js";
import metricRouter from "./metric.routes.js";
import organizationRouter from "./organization.routes.js";

const router = Router();

router.use(healthRouter);
router.use("/metrics", metricRouter);
router.use("/effects", effectRouter);
router.use("/cultivars", cultivarRouter);
router.use("/organizations", organizationRouter);

export default router;
