import { Router } from "express";

import { postSession } from "../controllers/session.controller.js";

const router = Router();

router.post("/", postSession);

export default router;
