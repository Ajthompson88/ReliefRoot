import type { RequestHandler } from "express";

import {
    getAuthenticatedOrganization,
    getOrganizationById,
    updateOrganization,
} from "../services/organization.service.js";

export const getOrganizations: RequestHandler = async (_req, res) => {
    const organizationId = res.locals.user.organizationId;

    const organization = await getAuthenticatedOrganization(organizationId);

    if (!organization) {
        res.status(404).json({
            success: false,
            message: "Organization not found.",
        });

        return;
    }

    res.status(200).json({
        success: true,
        count: 1,
        data: [organization],
    });
};

export const getOrganization: RequestHandler<{ id: string }> = async (req, res) => {
    const organizationId = res.locals.user.organizationId;

    const organization = await getOrganizationById(req.params.id, organizationId);

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
    const organizationId = res.locals.user.organizationId;

    const organization = await updateOrganization(req.params.id, organizationId, {
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
