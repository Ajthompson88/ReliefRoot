import type { RequestHandler } from "express";

import { getAllEffects } from "../services/effect.service.js";

export const getEffects: RequestHandler = async (_req, res) => {
    const effects = await getAllEffects();

    res.status(200).json({
        success: true,
        count: effects.length,
        data: effects,
    });
};
