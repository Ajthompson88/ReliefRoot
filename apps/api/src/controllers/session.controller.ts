import type { RequestHandler } from "express";

import { createSession } from "../services/session.service.js";

export const postSession: RequestHandler = async (req, res) => {
    const session = await createSession({
        productId: req.body.productId,
        organizationId: req.body.organizationId,
        method: req.body.method,
        startedAt: new Date(req.body.startedAt),
        doseAmount: req.body.doseAmount ?? null,
        notes: req.body.notes ?? null,
        metrics: req.body.metrics ?? [],
        effects: req.body.effects ?? [],
    });

    res.status(201).json({
        success: true,
        data: session,
    });
};
