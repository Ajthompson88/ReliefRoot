import type { RequestHandler } from "express";

import { getAuthenticatedUser } from "../services/auth.service.js";

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

export const loadAuthenticatedUser: RequestHandler = async (req, res, next) => {
    try {
        const user = await getAuthenticatedUser(req.session.userId!);

        res.locals.user = user;

        next();
    } catch (error) {
        next(error);
    }
};
