import type { RequestHandler } from "express";

import {
    createSession,
    deleteSession,
    getAllSessions,
    getSessionById,
    updateSession,
} from "../services/session.service.js";

export const getSessions: RequestHandler = async (_req, res) => {
    const sessions = await getAllSessions();

    res.status(200).json({
        success: true,
        count: sessions.length,
        data: sessions,
    });
};

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

export const getSession: RequestHandler<{ id: string }> = async (req, res) => {
    const session = await getSessionById(req.params.id);

    if (!session) {
        res.status(404).json({
            success: false,
            message: "Session not found.",
        });

        return;
    }

    res.status(200).json({
        success: true,
        data: session,
    });
};

export const patchSession: RequestHandler<{ id: string }> = async (req, res) => {
    const session = await updateSession(req.params.id, {
        productId: req.body.productId,
        organizationId: req.body.organizationId,
        method: req.body.method,
        startedAt: req.body.startedAt !== undefined ? new Date(req.body.startedAt) : undefined,
        doseAmount: req.body.doseAmount,
        notes: req.body.notes,
        metrics: req.body.metrics,
        effects: req.body.effects,
    });

    if (!session) {
        res.status(404).json({
            success: false,
            message: "Session not found.",
        });

        return;
    }

    res.status(200).json({
        success: true,
        data: session,
    });
};

export const removeSession: RequestHandler<{ id: string }> = async (req, res) => {
    const session = await deleteSession(req.params.id);

    if (!session) {
        res.status(404).json({
            success: false,
            message: "Session not found.",
        });

        return;
    }

    res.status(200).json({
        success: true,
        data: session,
    });
};
