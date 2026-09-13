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

const router = Router();

router.get("/", getCultivars);
router.get("/:id", getCultivar);

router.use(requireAuth, loadAuthenticatedUser, requireCultivarWriteAccess);

router.post("/", postCultivar);
router.patch("/:id", patchCultivar);
router.delete("/:id", removeCultivar);

export default router;
