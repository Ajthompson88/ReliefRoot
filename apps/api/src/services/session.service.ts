import { SessionMethod } from "../generated/prisma/enums.js";

import prisma from "../lib/prisma.js";

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

export async function createSession(data: CreateSessionData) {
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

        include: {
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
        },
    });
}
