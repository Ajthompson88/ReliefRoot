import type { RequestHandler } from "express";

import { SessionMethod } from "../generated/prisma/enums.js";

const validSessionMethods = new Set(Object.values(SessionMethod));

function hasDuplicateIds(items: Array<{ metricId?: string; effectId?: string }>) {
    const ids = items
        .map((item) => item.metricId ?? item.effectId)
        .filter((id): id is string => Boolean(id));

    return new Set(ids).size !== ids.length;
}

export const validateCreateSession: RequestHandler = (req, res, next) => {
    const {
        productId,
        organizationId,
        method,
        startedAt,
        metrics = [],
        effects = [],
    } = req.body ?? {};

    if (!productId) {
        res.status(400).json({
            success: false,
            message: "productId is required.",
        });

        return;
    }

    if (!organizationId) {
        res.status(400).json({
            success: false,
            message: "organizationId is required.",
        });

        return;
    }

    if (!method || !validSessionMethods.has(method)) {
        res.status(400).json({
            success: false,
            message: "method must be a valid SessionMethod.",
        });

        return;
    }

    if (!startedAt || Number.isNaN(Date.parse(startedAt))) {
        res.status(400).json({
            success: false,
            message: "startedAt must be a valid date.",
        });

        return;
    }

    if (!Array.isArray(metrics)) {
        res.status(400).json({
            success: false,
            message: "metrics must be an array.",
        });

        return;
    }

    if (!Array.isArray(effects)) {
        res.status(400).json({
            success: false,
            message: "effects must be an array.",
        });

        return;
    }

    for (const metric of metrics) {
        if (!metric.metricId) {
            res.status(400).json({
                success: false,
                message: "Each metric must include metricId.",
            });

            return;
        }

        if (
            !Number.isInteger(metric.beforeValue) ||
            !Number.isInteger(metric.afterValue) ||
            metric.beforeValue < 0 ||
            metric.beforeValue > 10 ||
            metric.afterValue < 0 ||
            metric.afterValue > 10
        ) {
            res.status(400).json({
                success: false,
                message: "Metric beforeValue and afterValue must be integers from 0 to 10.",
            });

            return;
        }
    }

    for (const effect of effects) {
        if (!effect.effectId) {
            res.status(400).json({
                success: false,
                message: "Each effect must include effectId.",
            });

            return;
        }

        if (
            effect.intensity !== undefined &&
            effect.intensity !== null &&
            (!Number.isInteger(effect.intensity) || effect.intensity < 0 || effect.intensity > 10)
        ) {
            res.status(400).json({
                success: false,
                message: "Effect intensity must be an integer from 0 to 10.",
            });

            return;
        }
    }

    if (hasDuplicateIds(metrics)) {
        res.status(400).json({
            success: false,
            message: "Duplicate metricId values are not allowed.",
        });

        return;
    }

    if (hasDuplicateIds(effects)) {
        res.status(400).json({
            success: false,
            message: "Duplicate effectId values are not allowed.",
        });

        return;
    }

    next();
};

export const validateUpdateSession: RequestHandler = (req, res, next) => {
    const { method, startedAt, metrics, effects } = req.body ?? {};

    if (method !== undefined && !validSessionMethods.has(method)) {
        res.status(400).json({
            success: false,
            message: "method must be a valid SessionMethod.",
        });

        return;
    }

    if (startedAt !== undefined && Number.isNaN(Date.parse(startedAt))) {
        res.status(400).json({
            success: false,
            message: "startedAt must be a valid date.",
        });

        return;
    }

    if (metrics !== undefined) {
        if (!Array.isArray(metrics)) {
            res.status(400).json({
                success: false,
                message: "metrics must be an array.",
            });

            return;
        }

        for (const metric of metrics) {
            if (!metric.metricId) {
                res.status(400).json({
                    success: false,
                    message: "Each metric must include metricId.",
                });

                return;
            }

            if (
                !Number.isInteger(metric.beforeValue) ||
                !Number.isInteger(metric.afterValue) ||
                metric.beforeValue < 0 ||
                metric.beforeValue > 10 ||
                metric.afterValue < 0 ||
                metric.afterValue > 10
            ) {
                res.status(400).json({
                    success: false,
                    message: "Metric beforeValue and afterValue must be integers from 0 to 10.",
                });

                return;
            }
        }

        if (hasDuplicateIds(metrics)) {
            res.status(400).json({
                success: false,
                message: "Duplicate metricId values are not allowed.",
            });

            return;
        }
    }

    if (effects !== undefined) {
        if (!Array.isArray(effects)) {
            res.status(400).json({
                success: false,
                message: "effects must be an array.",
            });

            return;
        }

        for (const effect of effects) {
            if (!effect.effectId) {
                res.status(400).json({
                    success: false,
                    message: "Each effect must include effectId.",
                });

                return;
            }

            if (
                effect.intensity !== undefined &&
                effect.intensity !== null &&
                (!Number.isInteger(effect.intensity) ||
                    effect.intensity < 0 ||
                    effect.intensity > 10)
            ) {
                res.status(400).json({
                    success: false,
                    message: "Effect intensity must be an integer from 0 to 10.",
                });

                return;
            }
        }

        if (hasDuplicateIds(effects)) {
            res.status(400).json({
                success: false,
                message: "Duplicate effectId values are not allowed.",
            });

            return;
        }
    }

    next();
};
