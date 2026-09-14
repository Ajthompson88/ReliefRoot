import type { ErrorRequestHandler, RequestHandler } from "express";

import { AcquisitionType, ProductType } from "../generated/prisma/enums.js";
import { ApiError } from "../utils/apiError.js";

// Express parses bodies before routing. Limit client-error translation to these write routes;
// unrelated endpoints retain their existing error handling.
export function writeBodyErrors(allowCreate: boolean): ErrorRequestHandler {
    return (error, req, _res, next) => {
        const isWrite =
            (allowCreate && req.method === "POST" && req.path === "/") ||
            (req.method === "PATCH" && /^\/[^/]+\/?$/.test(req.path));
        if (
            isWrite &&
            error instanceof Error &&
            "type" in error &&
            error.type === "entity.parse.failed"
        ) {
            next(new ApiError(400, "Request body must be a valid JSON object."));
            return;
        }
        next(error);
    };
}

function requireObject(body: unknown, empty: boolean): asserts body is Record<string, unknown> {
    if (empty || body === null || typeof body !== "object" || Array.isArray(body)) {
        throw new ApiError(400, "Request body must be a JSON object.");
    }
}

function isText(value: unknown): value is string {
    // PostgreSQL text columns cannot store a zero byte.
    return typeof value === "string" && !value.includes("\0");
}

function validateName(body: Record<string, unknown>, required: boolean) {
    if (!required && body.name === undefined) return;
    if (!isText(body.name) || !body.name.trim()) {
        throw new ApiError(400, "name must be a non-empty string without null characters.");
    }
}

function nameValidator(required: boolean): RequestHandler {
    return (req, _res, next) => {
        const body: unknown = req.body;
        requireObject(body, req.get("content-length") === "0");
        validateName(body, required);
        next();
    };
}

const productTypes = new Set<string>(Object.values(ProductType));
const acquisitionTypes = new Set<string>(Object.values(AcquisitionType));
const percentageFields = ["thcPercent", "cbdPercent", "cbgPercent", "cbnPercent"] as const;

function productValidator(required: boolean): RequestHandler {
    return (req, _res, next) => {
        const body: unknown = req.body;
        requireObject(body, req.get("content-length") === "0");
        validateName(body, required);

        for (const [field, values] of [
            ["productType", productTypes],
            ["acquisitionType", acquisitionTypes],
        ] as const) {
            const value = body[field];
            if (!required && value === undefined) continue;
            if (typeof value !== "string" || !values.has(value)) {
                throw new ApiError(400, `${field} must be one of: ${[...values].join(", ")}.`);
            }
        }

        for (const field of ["brand", "batchNumber"] as const) {
            const value = body[field];
            if (value !== undefined && value !== null && !isText(value)) {
                throw new ApiError(
                    400,
                    `${field} must be a string without null characters or null.`
                );
            }
        }

        for (const field of ["packageWeight", ...percentageFields]) {
            const value = body[field];
            if (value === undefined || value === null) continue;
            if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
                throw new ApiError(400, `${field} must be a finite nonnegative number or null.`);
            }
            if (field === "packageWeight") {
                // Existing PostgreSQL Decimal(65,30) allows at most 35 integer digits.
                if (value >= 1e35) {
                    throw new ApiError(400, "packageWeight must be less than 1e35.");
                }
            } else if (value > 100) {
                throw new ApiError(400, `${field} must be between 0 and 100.`);
            }
        }

        const cultivarId = body.cultivarId;
        if (
            cultivarId !== undefined &&
            cultivarId !== null &&
            (!isText(cultivarId) || !cultivarId.trim())
        ) {
            throw new ApiError(
                400,
                "cultivarId must be a non-empty string without null characters or null."
            );
        }
        next();
    };
}

export const validateCreateProduct = productValidator(true);
export const validateUpdateProduct = productValidator(false);
export const validateCreateCultivar = nameValidator(true);
export const validateUpdateCultivar = nameValidator(false);
export const validateUpdateOrganization = nameValidator(false);
