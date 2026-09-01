import { Router } from "express";

import {
    getSession,
    getSessions,
    postSession,
    removeSession,
} from "../controllers/session.controller.js";

const router = Router();

router.get("/", getSessions);
router.get("/:id", getSession);
router.post("/", postSession);
router.delete("/:id", removeSession);

export default router;
