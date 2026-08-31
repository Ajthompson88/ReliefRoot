import { Prisma } from "../generated/prisma/client.js";
import { AcquisitionType, ProductType } from "../generated/prisma/enums.js";

import prisma from "../lib/prisma.js";

function isRecordNotFoundError(error: unknown) {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025";
}

type ProductData = {
    name: string;
    productType: ProductType;
    acquisitionType: AcquisitionType;
    brand?: string | null;
    batchNumber?: string | null;
    packageWeight?: number | null;
    thcPercent?: number | null;
    cbdPercent?: number | null;
    cbgPercent?: number | null;
    cbnPercent?: number | null;
    cultivarId?: string | null;
    organizationId: string;
};

export async function getAllProducts() {
    return prisma.product.findMany({
        orderBy: {
            name: "asc",
        },
    });
}

export async function createProduct(data: ProductData) {
    return prisma.product.create({
        data,
    });
}

export async function getProductById(id: string) {
    return prisma.product.findUnique({
        where: {
            id,
        },
    });
}

export async function updateProduct(id: string, data: Partial<ProductData>) {
    try {
        return await prisma.product.update({
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

export async function deleteProduct(id: string) {
    try {
        return await prisma.product.delete({
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
