import prisma from "../lib/prisma.js";

export async function getAllMetrics() {
    return prisma.metric.findMany({
        orderBy: {
            name: "asc",
        },
    });
}
