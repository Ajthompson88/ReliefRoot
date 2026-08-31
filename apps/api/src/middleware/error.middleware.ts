import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
    void _next; // To avoid unused variable warning
    console.error(error);

    res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
};
