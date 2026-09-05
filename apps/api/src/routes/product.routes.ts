import { Router } from "express";

import {
    getProduct,
    getProducts,
    patchProduct,
    postProduct,
    removeProduct,
} from "../controllers/product.controller.js";
import { requireAuth, loadAuthenticatedUser } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAuth, loadAuthenticatedUser);

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", postProduct);
router.patch("/:id", patchProduct);
router.delete("/:id", removeProduct);

export default router;
