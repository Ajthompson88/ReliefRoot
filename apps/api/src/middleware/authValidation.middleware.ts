import type { RequestHandler } from "express";

export const validateRegister: RequestHandler = (req, res, next) => {
    const { email, password, username, firstName, lastName, organizationName } = req.body ?? {};

    if (typeof email !== "string" || !email.trim()) {
        res.status(400).json({
            success: false,
            message: "email is required.",
        });
        return;
    }

    if (!email.includes("@")) {
        res.status(400).json({
            success: false,
            message: "email must be a valid email address.",
        });
        return;
    }

    if (typeof password !== "string" || !password) {
        res.status(400).json({
            success: false,
            message: "password is required.",
        });
        return;
    }

    if (password.length < 12) {
        res.status(400).json({
            success: false,
            message: "password must be at least 12 characters.",
        });
        return;
    }

    if (typeof firstName !== "string" || !firstName.trim()) {
        res.status(400).json({
            success: false,
            message: "firstName is required.",
        });
        return;
    }

    if (typeof organizationName !== "string" || !organizationName.trim()) {
        res.status(400).json({
            success: false,
            message: "organizationName is required.",
        });
        return;
    }

    if (
        username !== undefined &&
        username !== null &&
        (typeof username !== "string" || !username.trim())
    ) {
        res.status(400).json({
            success: false,
            message: "username must be a non-empty string.",
        });
        return;
    }

    if (lastName !== undefined && lastName !== null && typeof lastName !== "string") {
        res.status(400).json({
            success: false,
            message: "lastName must be a string.",
        });
        return;
    }

    next();
};

export const validateLogin: RequestHandler = (req, res, next) => {
    const { email, password } = req.body ?? {};

    if (typeof email !== "string" || !email.trim()) {
        res.status(400).json({
            success: false,
            message: "email is required.",
        });
        return;
    }

    if (typeof password !== "string" || !password) {
        res.status(400).json({
            success: false,
            message: "password is required.",
        });
        return;
    }

    next();
};
