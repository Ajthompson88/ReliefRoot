import { AcquisitionType, ProductType } from "../generated/prisma/enums.js";

import prisma from "../lib/prisma.js";

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
};

function sanitizeProductUpdate(data: Partial<ProductData>): Partial<ProductData> {
    return {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.productType !== undefined && {
            productType: data.productType,
        }),
        ...(data.acquisitionType !== undefined && {
            acquisitionType: data.acquisitionType,
        }),
        ...(data.brand !== undefined && { brand: data.brand }),
        ...(data.batchNumber !== undefined && {
            batchNumber: data.batchNumber,
        }),
        ...(data.packageWeight !== undefined && {
            packageWeight: data.packageWeight,
        }),
        ...(data.thcPercent !== undefined && {
            thcPercent: data.thcPercent,
        }),
        ...(data.cbdPercent !== undefined && {
            cbdPercent: data.cbdPercent,
        }),
        ...(data.cbgPercent !== undefined && {
            cbgPercent: data.cbgPercent,
        }),
        ...(data.cbnPercent !== undefined && {
            cbnPercent: data.cbnPercent,
        }),
        ...(data.cultivarId !== undefined && {
            cultivarId: data.cultivarId,
        }),
    };
}

export async function getAllProducts(organizationId: string) {
    return prisma.product.findMany({
        where: {
            organizationId,
        },
        orderBy: {
            name: "asc",
        },
    });
}

export async function createProduct(data: ProductData, organizationId: string) {
    return prisma.product.create({
        data: {
            ...data,
            organizationId,
        },
    });
}

export async function getProductById(id: string, organizationId: string) {
    return prisma.product.findFirst({
        where: {
            id,
            organizationId,
        },
    });
}

export async function updateProduct(
    id: string,
    organizationId: string,
    data: Partial<ProductData>
) {
    const existingProduct = await prisma.product.findFirst({
        where: {
            id,
            organizationId,
        },
        select: {
            id: true,
        },
    });

    if (!existingProduct) {
        return null;
    }

    return prisma.product.update({
        where: {
            id: existingProduct.id,
        },
        data: sanitizeProductUpdate(data),
    });
}

export async function deleteProduct(id: string, organizationId: string) {
    const existingProduct = await prisma.product.findFirst({
        where: {
            id,
            organizationId,
        },
        select: {
            id: true,
        },
    });

    if (!existingProduct) {
        return null;
    }

    return prisma.product.delete({
        where: {
            id: existingProduct.id,
        },
    });
}
