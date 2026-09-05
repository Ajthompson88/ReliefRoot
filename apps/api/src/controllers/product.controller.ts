import type { RequestHandler } from "express";

import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    updateProduct,
} from "../services/product.service.js";

export const getProducts: RequestHandler = async (_req, res) => {
    const organizationId = res.locals.user.organizationId;

    const products = await getAllProducts(organizationId);

    res.status(200).json({
        success: true,
        count: products.length,
        data: products,
    });
};

export const postProduct: RequestHandler = async (req, res) => {
    const organizationId = res.locals.user.organizationId;

    const product = await createProduct(
        {
            name: req.body.name,
            productType: req.body.productType,
            acquisitionType: req.body.acquisitionType,
            brand: req.body.brand ?? null,
            batchNumber: req.body.batchNumber ?? null,
            packageWeight: req.body.packageWeight ?? null,
            thcPercent: req.body.thcPercent ?? null,
            cbdPercent: req.body.cbdPercent ?? null,
            cbgPercent: req.body.cbgPercent ?? null,
            cbnPercent: req.body.cbnPercent ?? null,
            cultivarId: req.body.cultivarId ?? null,
        },
        organizationId
    );

    res.status(201).json({
        success: true,
        data: product,
    });
};

export const getProduct: RequestHandler<{ id: string }> = async (req, res) => {
    const organizationId = res.locals.user.organizationId;

    const product = await getProductById(req.params.id, organizationId);

    if (!product) {
        res.status(404).json({
            success: false,
            message: "Product not found.",
        });

        return;
    }

    res.status(200).json({
        success: true,
        data: product,
    });
};

export const patchProduct: RequestHandler<{ id: string }> = async (req, res) => {
    const organizationId = res.locals.user.organizationId;

    const product = await updateProduct(req.params.id, organizationId, req.body);

    if (!product) {
        res.status(404).json({
            success: false,
            message: "Product not found.",
        });

        return;
    }

    res.status(200).json({
        success: true,
        data: product,
    });
};

export const removeProduct: RequestHandler<{ id: string }> = async (req, res) => {
    const organizationId = res.locals.user.organizationId;

    const product = await deleteProduct(req.params.id, organizationId);

    if (!product) {
        res.status(404).json({
            success: false,
            message: "Product not found.",
        });

        return;
    }

    res.status(200).json({
        success: true,
        data: product,
    });
};
