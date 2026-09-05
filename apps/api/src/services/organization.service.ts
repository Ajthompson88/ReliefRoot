import prisma from "../lib/prisma.js";

export async function getOrganizationById(id: string, organizationId: string) {
    if (id !== organizationId) {
        return null;
    }

    return prisma.organization.findUnique({
        where: {
            id,
        },
    });
}

export async function getAuthenticatedOrganization(organizationId: string) {
    return prisma.organization.findUnique({
        where: {
            id: organizationId,
        },
    });
}

export async function updateOrganization(
    id: string,
    organizationId: string,
    data: {
        name?: string;
    }
) {
    if (id !== organizationId) {
        return null;
    }

    return prisma.organization.update({
        where: {
            id,
        },
        data,
    });
}
