import prisma from "../lib/prisma.js";

export async function getAllEffects() {
    return prisma.effect.findMany({
        orderBy: {
            displayOrder: "asc",
        },
    });
}
