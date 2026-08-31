import { Router } from "express";

import {
    getCultivar,
    getCultivars,
    patchCultivar,
    postCultivar,
    removeCultivar,
} from "../controllers/cultivar.controller.js";

const router = Router();

router.get("/", getCultivars);
router.get("/:id", getCultivar);
router.post("/", postCultivar);
router.patch("/:id", patchCultivar);
router.delete("/:id", removeCultivar);

export default router;
