import { Router } from "express";

import {
    getOrganization,
    getOrganizations,
    patchOrganization,
} from "../controllers/organization.controller.js";
import { loadAuthenticatedUser, requireAuth } from "../middleware/auth.middleware.js";
import { validateUpdateOrganization } from "../middleware/writeValidation.middleware.js";

const router = Router();

router.use(requireAuth, loadAuthenticatedUser);

router.get("/", getOrganizations);
router.get("/:id", getOrganization);
router.patch("/:id", validateUpdateOrganization, patchOrganization);

export default router;
