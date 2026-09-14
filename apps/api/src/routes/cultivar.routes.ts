import { Router } from "express";

import {
    getCultivar,
    getCultivars,
    patchCultivar,
    postCultivar,
    removeCultivar,
} from "../controllers/cultivar.controller.js";
import { loadAuthenticatedUser, requireAuth } from "../middleware/auth.middleware.js";
import { requireCultivarWriteAccess } from "../middleware/cultivar.middleware.js";
import {
    validateCreateCultivar,
    validateUpdateCultivar,
} from "../middleware/writeValidation.middleware.js";

const router = Router();

router.get("/", getCultivars);
router.get("/:id", getCultivar);

router.use(requireAuth, loadAuthenticatedUser, requireCultivarWriteAccess);

router.post("/", validateCreateCultivar, postCultivar);
router.patch("/:id", validateUpdateCultivar, patchCultivar);
router.delete("/:id", removeCultivar);

export default router;
