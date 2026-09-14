import { Router } from "express";

import {
    getProduct,
    getProducts,
    patchProduct,
    postProduct,
    removeProduct,
} from "../controllers/product.controller.js";
import { requireAuth, loadAuthenticatedUser } from "../middleware/auth.middleware.js";
import {
    validateCreateProduct,
    validateUpdateProduct,
} from "../middleware/writeValidation.middleware.js";

const router = Router();

router.use(requireAuth, loadAuthenticatedUser);

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", validateCreateProduct, postProduct);
router.patch("/:id", validateUpdateProduct, patchProduct);
router.delete("/:id", removeProduct);

export default router;
