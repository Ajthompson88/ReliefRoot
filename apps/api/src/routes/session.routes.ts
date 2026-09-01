import { Router } from "express";

import {
    getSession,
    getSessions,
    patchSession,
    postSession,
    removeSession,
} from "../controllers/session.controller.js";

const router = Router();

router.get("/", getSessions);
router.get("/:id", getSession);
router.post("/", postSession);
router.patch("/:id", patchSession);
router.delete("/:id", removeSession);

export default router;
