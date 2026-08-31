import { Prisma } from "../generated/prisma/client.js";

import prisma from "../lib/prisma.js";

function isRecordNotFoundError(error: unknown) {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025";
}

export async function getAllOrganizations() {
    return prisma.organization.findMany({
        orderBy: {
            name: "asc",
        },
    });
}

export async function createOrganization(data: { name: string }) {
    return prisma.organization.create({
        data,
    });
}

export async function getOrganizationById(id: string) {
    return prisma.organization.findUnique({
        where: {
            id,
        },
    });
}

export async function updateOrganization(
    id: string,
    data: {
        name?: string;
    }
) {
    try {
        return await prisma.organization.update({
            where: {
                id,
            },
            data,
        });
    } catch (error) {
        if (isRecordNotFoundError(error)) {
            return null;
        }

        throw error;
    }
}

export async function deleteOrganization(id: string) {
    try {
        return await prisma.organization.delete({
            where: {
                id,
            },
        });
    } catch (error) {
        if (isRecordNotFoundError(error)) {
            return null;
        }

        throw error;
    }
}
