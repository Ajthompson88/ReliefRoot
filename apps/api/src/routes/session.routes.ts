import { Router } from "express";

import {
    getSession,
    getSessions,
    patchSession,
    postSession,
    removeSession,
} from "../controllers/session.controller.js";
import { loadAuthenticatedUser, requireAuth } from "../middleware/auth.middleware.js";
import {
    validateCreateSession,
    validateUpdateSession,
} from "../middleware/sessionValidation.middleware.js";

const router = Router();

router.use(requireAuth, loadAuthenticatedUser);

router.get("/", getSessions);
router.get("/:id", getSession);
router.post("/", validateCreateSession, postSession);
router.patch("/:id", validateUpdateSession, patchSession);
router.delete("/:id", removeSession);

export default router;
