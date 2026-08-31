import type { RequestHandler } from "express";

import {
    createCultivar,
    getAllCultivars,
    getCultivarById,
    updateCultivar,
    deleteCultivar,
} from "../services/cultivar.service.js";

export const getCultivars: RequestHandler = async (_req, res) => {
    const cultivars = await getAllCultivars();

    res.status(200).json({
        success: true,
        count: cultivars.length,
        data: cultivars,
    });
};

export const postCultivar: RequestHandler = async (req, res) => {
    const cultivar = await createCultivar({
        name: req.body.name,
    });

    res.status(201).json({
        success: true,
        data: cultivar,
    });
};
export const getCultivar: RequestHandler = async (req, res) => {
    const cultivar = await getCultivarById(req.params.id as string);

    if (!cultivar) {
        res.status(404).json({
            success: false,
            message: "Cultivar not found.",
        });

        return;
    }

    res.status(200).json({
        success: true,
        data: cultivar,
    });
};
export const patchCultivar: RequestHandler<{ id: string }> = async (req, res) => {
    const cultivar = await updateCultivar(req.params.id, {
        name: req.body.name,
    });

    if (!cultivar) {
        res.status(404).json({
            success: false,
            message: "Cultivar not found.",
        });

        return;
    }

    res.status(200).json({
        success: true,
        data: cultivar,
    });
};
export const removeCultivar: RequestHandler<{ id: string }> = async (req, res) => {
    const cultivar = await deleteCultivar(req.params.id);

    if (!cultivar) {
        res.status(404).json({
            success: false,
            message: "Cultivar not found.",
        });

        return;
    }

    res.status(200).json({
        success: true,
        data: cultivar,
    });
};
