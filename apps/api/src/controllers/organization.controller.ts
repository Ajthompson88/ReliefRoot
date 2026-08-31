import type { RequestHandler } from "express";

import {
    createOrganization,
    deleteOrganization,
    getAllOrganizations,
    getOrganizationById,
    updateOrganization,
} from "../services/organization.service.js";

export const getOrganizations: RequestHandler = async (_req, res) => {
    const organizations = await getAllOrganizations();

    res.status(200).json({
        success: true,
        count: organizations.length,
        data: organizations,
    });
};

export const postOrganization: RequestHandler = async (req, res) => {
    const organization = await createOrganization({
        name: req.body.name,
    });

    res.status(201).json({
        success: true,
        data: organization,
    });
};

export const getOrganization: RequestHandler<{ id: string }> = async (req, res) => {
    const organization = await getOrganizationById(req.params.id);

    if (!organization) {
        res.status(404).json({
            success: false,
            message: "Organization not found.",
        });

        return;
    }

    res.status(200).json({
        success: true,
        data: organization,
    });
};

export const patchOrganization: RequestHandler<{ id: string }> = async (req, res) => {
    const organization = await updateOrganization(req.params.id, {
        name: req.body.name,
    });

    if (!organization) {
        res.status(404).json({
            success: false,
            message: "Organization not found.",
        });

        return;
    }

    res.status(200).json({
        success: true,
        data: organization,
    });
};

export const removeOrganization: RequestHandler<{ id: string }> = async (req, res) => {
    const organization = await deleteOrganization(req.params.id);

    if (!organization) {
        res.status(404).json({
            success: false,
            message: "Organization not found.",
        });

        return;
    }

    res.status(200).json({
        success: true,
        data: organization,
    });
};
