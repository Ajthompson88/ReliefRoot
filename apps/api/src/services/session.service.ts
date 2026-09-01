import { Prisma } from "../generated/prisma/client.js";
import { SessionMethod } from "../generated/prisma/enums.js";

import prisma from "../lib/prisma.js";

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

export async function getAllSessions() {
    return prisma.session.findMany({
        orderBy: {
            startedAt: "desc",
        },
        include: sessionInclude,
    });
}

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
