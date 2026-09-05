import { Prisma } from "../generated/prisma/client.js";
import { SessionMethod } from "../generated/prisma/enums.js";

import prisma from "../lib/prisma.js";
import { ApiError } from "../utils/apiError.js";

function isRecordNotFoundError(error: unknown) {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025";
}

type SessionMetricInput = {
    metricId: string;
    beforeValue: number;
    afterValue: number;
};

type SessionEffectInput = {
    effectId: string;
    intensity?: number | null;
};

type CreateSessionData = {
    productId: string;
    method: SessionMethod;
    startedAt: Date;
    doseAmount?: number | null;
    notes?: string | null;
    metrics?: SessionMetricInput[];
    effects?: SessionEffectInput[];
};

type UpdateSessionData = {
    productId?: string;
    method?: SessionMethod;
    startedAt?: Date;
    doseAmount?: number | null;
    notes?: string | null;
    metrics?: SessionMetricInput[];
    effects?: SessionEffectInput[];
};

const sessionInclude = {
    product: true,
    sessionMetrics: {
        include: {
            metric: true,
        },
    },
    sessionEffects: {
        include: {
            effect: true,
        },
    },
} satisfies Prisma.SessionInclude;

async function validateMetricReferences(metrics?: SessionMetricInput[]) {
    if (!metrics || metrics.length === 0) {
        return;
    }

    const metricIds = metrics.map((metric) => metric.metricId);

    const existingMetrics = await prisma.metric.findMany({
        where: {
            id: {
                in: metricIds,
            },
        },
        select: {
            id: true,
        },
    });

    if (existingMetrics.length !== metricIds.length) {
        throw new ApiError(400, "One or more metricId values are invalid.");
    }
}

async function validateEffectReferences(effects?: SessionEffectInput[]) {
    if (!effects || effects.length === 0) {
        return;
    }

    const effectIds = effects.map((effect) => effect.effectId);

    const existingEffects = await prisma.effect.findMany({
        where: {
            id: {
                in: effectIds,
            },
        },
        select: {
            id: true,
        },
    });

    if (existingEffects.length !== effectIds.length) {
        throw new ApiError(400, "One or more effectId values are invalid.");
    }
}

async function validateProductReference(productId: string, organizationId: string) {
    const product = await prisma.product.findFirst({
        where: {
            id: productId,
            organizationId,
        },
        select: {
            id: true,
        },
    });

    if (!product) {
        throw new ApiError(404, "Product not found.");
    }
}

async function validateCreateSessionReferences(data: CreateSessionData, organizationId: string) {
    await validateProductReference(data.productId, organizationId);

    await validateMetricReferences(data.metrics);
    await validateEffectReferences(data.effects);
}

async function validateUpdateSessionReferences(
    id: string,
    organizationId: string,
    data: UpdateSessionData
) {
    const existingSession = await prisma.session.findFirst({
        where: {
            id,
            organizationId,
        },
        select: {
            id: true,
            productId: true,
        },
    });

    if (!existingSession) {
        return false;
    }

    const productId = data.productId ?? existingSession.productId;

    await validateProductReference(productId, organizationId);

    await validateMetricReferences(data.metrics);
    await validateEffectReferences(data.effects);

    return true;
}

export async function getAllSessions(organizationId: string) {
    return prisma.session.findMany({
        where: {
            organizationId,
        },
        orderBy: {
            startedAt: "desc",
        },
        include: sessionInclude,
    });
}

export async function createSession(data: CreateSessionData, organizationId: string) {
    await validateCreateSessionReferences(data, organizationId);

    return prisma.session.create({
        data: {
            productId: data.productId,
            organizationId,
            method: data.method,
            startedAt: data.startedAt,
            doseAmount: data.doseAmount ?? null,
            notes: data.notes ?? null,
            sessionMetrics: {
                create:
                    data.metrics?.map((metric) => ({
                        metricId: metric.metricId,
                        beforeValue: metric.beforeValue,
                        afterValue: metric.afterValue,
                    })) ?? [],
            },
            sessionEffects: {
                create:
                    data.effects?.map((effect) => ({
                        effectId: effect.effectId,
                        intensity: effect.intensity ?? null,
                    })) ?? [],
            },
        },
        include: sessionInclude,
    });
}

export async function getSessionById(id: string, organizationId: string) {
    return prisma.session.findFirst({
        where: {
            id,
            organizationId,
        },
        include: sessionInclude,
    });
}

export async function updateSession(id: string, organizationId: string, data: UpdateSessionData) {
    const referencesAreValid = await validateUpdateSessionReferences(id, organizationId, data);

    if (!referencesAreValid) {
        return null;
    }

    try {
        return await prisma.$transaction(async (tx) => {
            await tx.session.update({
                where: {
                    id,
                },
                data: {
                    productId: data.productId,
                    method: data.method,
                    startedAt: data.startedAt,
                    doseAmount: data.doseAmount,
                    notes: data.notes,
                },
            });

            if (data.metrics !== undefined) {
                await tx.sessionMetric.deleteMany({
                    where: {
                        sessionId: id,
                    },
                });

                if (data.metrics.length > 0) {
                    await tx.sessionMetric.createMany({
                        data: data.metrics.map((metric) => ({
                            sessionId: id,
                            metricId: metric.metricId,
                            beforeValue: metric.beforeValue,
                            afterValue: metric.afterValue,
                        })),
                    });
                }
            }

            if (data.effects !== undefined) {
                await tx.sessionEffect.deleteMany({
                    where: {
                        sessionId: id,
                    },
                });

                if (data.effects.length > 0) {
                    await tx.sessionEffect.createMany({
                        data: data.effects.map((effect) => ({
                            sessionId: id,
                            effectId: effect.effectId,
                            intensity: effect.intensity ?? null,
                        })),
                    });
                }
            }

            return tx.session.findFirst({
                where: {
                    id,
                    organizationId,
                },
                include: sessionInclude,
            });
        });
    } catch (error) {
        if (isRecordNotFoundError(error)) {
            return null;
        }

        throw error;
    }
}

export async function deleteSession(id: string, organizationId: string) {
    const existingSession = await prisma.session.findFirst({
        where: {
            id,
            organizationId,
        },
        select: {
            id: true,
        },
    });

    if (!existingSession) {
        return null;
    }

    try {
        return await prisma.session.delete({
            where: {
                id: existingSession.id,
            },
        });
    } catch (error) {
        if (isRecordNotFoundError(error)) {
            return null;
        }

        throw error;
    }
}
