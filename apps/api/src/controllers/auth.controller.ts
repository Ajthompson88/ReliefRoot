import type { RequestHandler } from "express";

import { registerUser } from "../services/auth.service.js";

export const register: RequestHandler = async (req, res) => {
    const result = await registerUser({
        email: req.body.email,
        password: req.body.password,
        username: req.body.username ?? null,
        firstName: req.body.firstName,
        lastName: req.body.lastName ?? null,
        organizationName: req.body.organizationName,
    });

    req.session.userId = result.user.id;

    res.status(201).json({
        success: true,
        data: result,
    });
};
