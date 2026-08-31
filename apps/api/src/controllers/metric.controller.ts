import type { RequestHandler } from "express";

import { getAllMetrics } from "../services/metric.service.js";

export const getMetrics: RequestHandler = async (_req, res) => {
    const metrics = await getAllMetrics();

    res.status(200).json({
        success: true,
        count: metrics.length,
        data: metrics,
    });
};
