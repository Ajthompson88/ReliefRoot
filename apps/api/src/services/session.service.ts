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
    organizationId: string;
    method: SessionMethod;
    startedAt: Date;
    doseAmount?: number | null;
    notes?: string | null;
    metrics?: SessionMetricInput[];
    effects?: SessionEffectInput[];
};

type UpdateSessionData = {
    productId?: string;
    organizationId?: string;
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

async function validateCreateSessionReferences(data: CreateSessionData) {
    const organization = await prisma.organization.findUnique({
        where: {
            id: data.organizationId,
        },
        select: {
            id: true,
        },
    });

    if (!organization) {
        throw new ApiError(404, "Organization not found.");
    }

    const product = await prisma.product.findUnique({
        where: {
            id: data.productId,
        },
        select: {
            id: true,
            organizationId: true,
        },
    });

    if (!product) {
        throw new ApiError(404, "Product not found.");
    }

    if (product.organizationId !== data.organizationId) {
        throw new ApiError(400, "Product does not belong to the supplied organization.");
    }

    if (data.metrics && data.metrics.length > 0) {
        const metricIds = data.metrics.map((metric) => metric.metricId);

        const metrics = await prisma.metric.findMany({
            where: {
                id: {
                    in: metricIds,
                },
            },
            select: {
                id: true,
            },
        });

        if (metrics.length !== metricIds.length) {
            throw new ApiError(400, "One or more metricId values are invalid.");
        }
    }

    if (data.effects && data.effects.length > 0) {
        const effectIds = data.effects.map((effect) => effect.effectId);

        const effects = await prisma.effect.findMany({
            where: {
                id: {
                    in: effectIds,
                },
            },
            select: {
                id: true,
            },
        });

        if (effects.length !== effectIds.length) {
            throw new ApiError(400, "One or more effectId values are invalid.");
        }
    }
}

async function validateUpdateSessionReferences(id: string, data: UpdateSessionData) {
    const existingSession = await prisma.session.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            productId: true,
            organizationId: true,
        },
    });

    if (!existingSession) {
        return false;
    }

    const productId = data.productId ?? existingSession.productId;

    const organizationId = data.organizationId ?? existingSession.organizationId;

    const organization = await prisma.organization.findUnique({
        where: {
            id: organizationId,
        },
        select: {
            id: true,
        },
    });

    if (!organization) {
        throw new ApiError(404, "Organization not found.");
    }

    const product = await prisma.product.findUnique({
        where: {
            id: productId,
        },
        select: {
            id: true,
            organizationId: true,
        },
    });

    if (!product) {
        throw new ApiError(404, "Product not found.");
    }

    if (product.organizationId !== organizationId) {
        throw new ApiError(400, "Product does not belong to the supplied organization.");
    }

    if (data.metrics && data.metrics.length > 0) {
        const metricIds = data.metrics.map((metric) => metric.metricId);

        const metrics = await prisma.metric.findMany({
            where: {
                id: {
                    in: metricIds,
                },
            },
            select: {
                id: true,
            },
        });

        if (metrics.length !== metricIds.length) {
            throw new ApiError(400, "One or more metricId values are invalid.");
        }
    }

    if (data.effects && data.effects.length > 0) {
        const effectIds = data.effects.map((effect) => effect.effectId);

        const effects = await prisma.effect.findMany({
            where: {
                id: {
                    in: effectIds,
                },
            },
            select: {
                id: true,
            },
        });

        if (effects.length !== effectIds.length) {
            throw new ApiError(400, "One or more effectId values are invalid.");
        }
    }

    return true;
}

export async function getAllSessions() {
    return prisma.session.findMany({
        orderBy: {
            startedAt: "desc",
        },
        include: sessionInclude,
    });
}

export async function createSession(data: CreateSessionData) {
    await validateCreateSessionReferences(data);

    return prisma.session.create({
        data: {
            productId: data.productId,
            organizationId: data.organizationId,
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

export async function getSessionById(id: string) {
    return prisma.session.findUnique({
        where: {
            id,
        },
        include: sessionInclude,
    });
}

export async function updateSession(id: string, data: UpdateSessionData) {
    const referencesAreValid = await validateUpdateSessionReferences(id, data);

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
                    organizationId: data.organizationId,
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

            return tx.session.findUnique({
                where: {
                    id,
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

export async function deleteSession(id: string) {
    try {
        return await prisma.session.delete({
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
