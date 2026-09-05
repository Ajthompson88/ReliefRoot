import { Router } from "express";

import {
    getOrganization,
    getOrganizations,
    patchOrganization,
} from "../controllers/organization.controller.js";
import { loadAuthenticatedUser, requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAuth, loadAuthenticatedUser);

router.get("/", getOrganizations);
router.get("/:id", getOrganization);
router.patch("/:id", patchOrganization);

export default router;
