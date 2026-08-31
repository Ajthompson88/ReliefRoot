import { Router } from "express";

import {
    getOrganization,
    getOrganizations,
    patchOrganization,
    postOrganization,
    removeOrganization,
} from "../controllers/organization.controller.js";

const router = Router();

router.get("/", getOrganizations);
router.get("/:id", getOrganization);
router.post("/", postOrganization);
router.patch("/:id", patchOrganization);
router.delete("/:id", removeOrganization);

export default router;
