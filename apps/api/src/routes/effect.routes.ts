import { Router } from "express";

import { getEffects } from "../controllers/effect.controller.js";

const router = Router();

router.get("/", getEffects);

export default router;
