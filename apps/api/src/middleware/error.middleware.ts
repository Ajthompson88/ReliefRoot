import type { ErrorRequestHandler } from "express";

import { ApiError } from "../utils/apiError.js";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
    void _next;

    if (error instanceof ApiError) {
        res.status(error.statusCode).json({
            success: false,
            message: error.message,
        });

        return;
    }

    console.error(error);

    res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
};
