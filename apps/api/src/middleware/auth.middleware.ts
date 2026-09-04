import type { RequestHandler } from "express";

export const requireAuth: RequestHandler = (req, res, next) => {
    if (!req.session.userId) {
        res.status(401).json({
            success: false,
            message: "Authentication required.",
        });
        return;
    }

    next();
};
