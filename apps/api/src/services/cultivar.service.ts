import { Prisma } from "../generated/prisma/client.js";

import prisma from "../lib/prisma.js";

function isRecordNotFoundError(error: unknown) {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025";
}

export async function getAllCultivars() {
    return prisma.cultivar.findMany({
        orderBy: {
            name: "asc",
        },
    });
}

export async function createCultivar(data: { name: string }) {
    return prisma.cultivar.create({
        data,
    });
}

export async function getCultivarById(id: string) {
    return prisma.cultivar.findUnique({
        where: {
            id,
        },
    });
}

export async function updateCultivar(
    id: string,
    data: {
        name?: string;
    }
) {
    try {
        return await prisma.cultivar.update({
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

export async function deleteCultivar(id: string) {
    try {
        return await prisma.cultivar.delete({
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
