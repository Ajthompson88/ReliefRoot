import argon2 from "argon2";

import { UserRole } from "../generated/prisma/enums.js";
import prisma from "../lib/prisma.js";
import { ApiError } from "../utils/apiError.js";

type RegisterData = {
    email: string;
    password: string;
    username?: string | null;
    firstName: string;
    lastName?: string | null;
    organizationName: string;
};

export async function registerUser(data: RegisterData) {
    const normalizedEmail = data.email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
        where: {
            email: normalizedEmail,
        },
        select: {
            id: true,
        },
    });

    if (existingUser) {
        throw new ApiError(409, "A user with that email already exists.");
    }

    if (data.username) {
        const existingUsername = await prisma.user.findUnique({
            where: {
                username: data.username,
            },
            select: {
                id: true,
            },
        });

        if (existingUsername) {
            throw new ApiError(409, "That username is already in use.");
        }
    }

    const passwordHash = await argon2.hash(data.password, {
        type: argon2.argon2id,
    });

    return prisma.$transaction(async (tx) => {
        const organization = await tx.organization.create({
            data: {
                name: data.organizationName.trim(),
            },
        });

        const user = await tx.user.create({
            data: {
                email: normalizedEmail,
                username: data.username?.trim() || null,
                firstName: data.firstName.trim(),
                lastName: data.lastName?.trim() || null,
                passwordHash,
                role: UserRole.OWNER,
                organizationId: organization.id,
            },
            select: {
                id: true,
                email: true,
                username: true,
                firstName: true,
                lastName: true,
                role: true,
                organizationId: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return {
            user,
            organization,
        };
    });
}
