import type { RequestHandler } from "express";

import { getAuthenticatedUser, loginUser, registerUser } from "../services/auth.service.js";

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

export const login: RequestHandler = async (req, res, next) => {
    try {
        const user = await loginUser({
            email: req.body.email,
            password: req.body.password,
        });

        req.session.regenerate((error) => {
            if (error) {
                next(error);
                return;
            }

            req.session.userId = user.id;

            req.session.save((saveError) => {
                if (saveError) {
                    next(saveError);
                    return;
                }

                res.status(200).json({
                    success: true,
                    data: {
                        user,
                    },
                });
            });
        });
    } catch (error) {
        next(error);
    }
};

export const me: RequestHandler = async (req, res) => {
    const user = await getAuthenticatedUser(req.session.userId!);

    res.status(200).json({
        success: true,
        data: {
            user,
        },
    });
};

export const logout: RequestHandler = (req, res, next) => {
    req.session.destroy((error) => {
        if (error) {
            next(error);
            return;
        }

        res.clearCookie("connect.sid");

        res.status(200).json({
            success: true,
            message: "Logged out successfully.",
        });
    });
};
