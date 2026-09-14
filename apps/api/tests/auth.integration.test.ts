import assert from "node:assert/strict";
import { once } from "node:events";
import type { AddressInfo } from "node:net";
import { test } from "node:test";

import express from "express";
import session from "express-session";

import prisma from "../src/lib/prisma.js";
import { errorHandler } from "../src/middleware/error.middleware.js";
import authRouter from "../src/routes/auth.routes.js";

test("registration username normalization", async (t) => {
    type UserRow = {
        id: string;
        email: string;
        username: string | null;
        firstName: string;
        lastName: string | null;
        passwordHash: string;
        role: string;
        organizationId: string;
        createdAt: Date;
        updatedAt: Date;
    };

    const users = new Map<string, UserRow>();
    let sequence = 0;

    function stub<T>(target: object, method: string, implementation: T) {
        const original = Reflect.get(target, method);
        assert.ok(Reflect.set(target, method, implementation));

        t.after(() => {
            Reflect.set(target, method, original);
        });
    }

    stub(prisma.user, "findUnique", async ({ where }: { where: Record<string, unknown> }) => {
        if (typeof where.email === "string") {
            return [...users.values()].find((user) => user.email === where.email) ?? null;
        }

        if (typeof where.username === "string") {
            return [...users.values()].find((user) => user.username === where.username) ?? null;
        }

        return null;
    });

    stub(prisma, "$transaction", async (callback: (tx: unknown) => Promise<unknown>) => {
        const tx = {
            organization: {
                create: async ({ data }: { data: { name: string } }) => ({
                    id: `org-${++sequence}`,
                    name: data.name,
                }),
            },
            user: {
                create: async ({
                    data,
                }: {
                    data: Omit<UserRow, "id" | "createdAt" | "updatedAt">;
                }) => {
                    const now = new Date();

                    const user: UserRow = {
                        ...data,
                        id: `user-${sequence}`,
                        createdAt: now,
                        updatedAt: now,
                    };

                    users.set(user.id, user);
                    return user;
                },
            },
        };

        return callback(tx);
    });

    const app = express();
    app.use(express.json());
    app.use(
        session({
            secret: "auth-test-only-secret",
            resave: false,
            saveUninitialized: false,
        })
    );
    app.use("/api/v1/auth", authRouter);
    app.use(errorHandler);

    const server = app.listen(0, "127.0.0.1");

    t.after(
        () =>
            new Promise<void>((resolve, reject) => {
                server.close((error) => (error ? reject(error) : resolve()));
                server.closeAllConnections();
            })
    );

    await once(server, "listening");

    const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;

    async function register(body: Record<string, unknown>) {
        return fetch(`${base}/api/v1/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
    }

    function registration(overrides: Record<string, unknown> = {}) {
        return {
            email: `user-${++sequence}@example.com`,
            password: "TestPassword123!",
            firstName: "Test",
            organizationName: "Test Organization",
            ...overrides,
        };
    }

    await t.test("stores a padded username in normalized form", async () => {
        const response = await register(
            registration({
                username: "  andrew  ",
            })
        );

        assert.equal(response.status, 201);

        const storedUser = [...users.values()].find((user) => user.username === "andrew");

        assert.ok(storedUser);
        assert.equal(storedUser.username, "andrew");
    });

    await t.test("returns 409 for a padded duplicate username", async () => {
        const response = await register(
            registration({
                username: "  andrew  ",
            })
        );

        const payload = await response.json();

        assert.equal(response.status, 409);
        assert.equal(payload.success, false);
        assert.equal(payload.message, "That username is already in use.");
    });

    await t.test("preserves optional username behavior", async () => {
        const response = await register(registration());

        assert.equal(response.status, 201);

        const nullUsernameUser = [...users.values()].find((user) => user.username === null);

        assert.ok(nullUsernameUser);
        assert.equal(nullUsernameUser.username, null);
    });
});
