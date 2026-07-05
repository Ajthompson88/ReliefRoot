import { Router } from "express";

const router = Router();

router.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        data: {
            status: "ok",
            service: "reliefroot-api",
        },
    });
});

export default router;
