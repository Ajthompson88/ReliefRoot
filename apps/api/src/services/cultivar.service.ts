import prisma from "../lib/prisma.js";

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
    return prisma.cultivar.update({
        where: {
            id,
        },
        data,
    });
}
export async function deleteCultivar(id: string) {
    return prisma.cultivar.delete({
        where: {
            id,
        },
    });
}
