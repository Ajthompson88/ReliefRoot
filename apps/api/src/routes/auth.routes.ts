import { Router } from "express";

import { login, logout, me, register } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validateLogin, validateRegister } from "../middleware/authValidation.middleware.js";

const router = Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.get("/me", requireAuth, me);
router.post("/logout", requireAuth, logout);

export default router;
