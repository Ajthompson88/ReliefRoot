import assert from "node:assert/strict";
import { once } from "node:events";
import type { AddressInfo } from "node:net";
import { test } from "node:test";

import express from "express";
import session from "express-session";

import prisma from "../src/lib/prisma.js";
import { errorHandler } from "../src/middleware/error.middleware.js";
import sessionRouter from "../src/routes/session.routes.js";

test("session write validation", async (t) => {
    type Row = Record<string, unknown> & { id: string };

    const products = new Map<string, Row>([
        [
            "product-a",
            {
                id: "product-a",
                organizationId: "org-a",
            },
        ],
        [
            "product-b",
            {
                id: "product-b",
                organizationId: "org-b",
            },
        ],
    ]);

    let writes = 0;
    let sequence = 0;

    function stub<T>(target: object, method: string, implementation: T) {
        const original = Reflect.get(target, method);

        assert.ok(Reflect.set(target, method, implementation));

        t.after(() => {
            Reflect.set(target, method, original);
        });
    }

    stub(prisma.user, "findUnique", async () => ({
        id: "member",
        role: "MEMBER",
        organizationId: "org-a",
    }));

    stub(prisma.product, "findFirst", async ({ where }: { where: Record<string, unknown> }) => {
        const product = products.get(where.id as string);

        return product?.organizationId === where.organizationId ? { id: product.id } : null;
    });

    stub(prisma.metric, "findMany", async () => []);
    stub(prisma.effect, "findMany", async () => []);

    stub(prisma.session, "create", async ({ data }: { data: Record<string, unknown> }) => {
        writes++;

        return {
            ...data,
            id: `session-${++sequence}`,
        };
    });

    stub(prisma.session, "findFirst", async ({ where }: { where: Record<string, unknown> }) => ({
        id: where.id,
        organizationId: where.organizationId,
        productId: "product-a",
        method: "SMOKE",
        startedAt: new Date("2026-09-15T12:00:00.000Z"),
        doseAmount: null,
        notes: null,
    }));

    stub(prisma.session, "update", async ({ data }: { data: Record<string, unknown> }) => {
        writes++;
        return {
            ...data,
            id: "session-1",
            organizationId: "org-a",
            productId: "product-a",
        };
    });

    stub(prisma, "$transaction", async (callback: (tx: typeof prisma) => Promise<unknown>) => {
        return callback(prisma);
    });

    const app = express();

    app.use(express.json());

    app.use(
        session({
            secret: "session-validation-test-only-secret",
            resave: false,
            saveUninitialized: false,
        })
    );

    app.post("/test/session", (req, res) => {
        req.session.userId = "member";
        res.sendStatus(204);
    });

    app.use("/api/v1/sessions", sessionRouter);
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

    const loginResponse = await fetch(`${base}/test/session`, {
        method: "POST",
    });

    assert.equal(loginResponse.status, 204);

    const cookie = loginResponse.headers.get("set-cookie")!.split(";")[0];

    const response = await fetch(`${base}/api/v1/sessions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            cookie,
        },
        body: JSON.stringify({
            productId: "product-a",
            method: "SMOKE",
            startedAt: "2026-09-15T12:00:00.000Z",
        }),
    });

    const payload = await response.json();

    assert.equal(response.status, 201);
    assert.equal(payload.success, true);
    assert.equal(payload.data.organizationId, "org-a");
    assert.equal(payload.data.productId, "product-a");

    async function request(method: string, path: string, body: unknown) {
        return fetch(`${base}/api/v1${path}`, {
            method,
            headers: {
                "Content-Type": "application/json",
                cookie,
            },
            body: JSON.stringify(body),
        });
    }

    async function expectRejected(method: string, path: string, body: unknown) {
        const writesBefore = writes;
        const response = await request(method, path, body);
        const payload = await response.json();

        assert.equal(
            response.status,
            400,
            `${method} ${path}: ${JSON.stringify(body)} => ${JSON.stringify(payload)}`
        );
        assert.equal(payload.success, false);
        assert.equal(typeof payload.message, "string");
        assert.equal(writes, writesBefore);
    }

    await t.test("reject malformed session IDs and nested entries before writes", async () => {
        const validCreate = {
            productId: "product-a",
            method: "SMOKE",
            startedAt: "2026-09-15T12:00:00.000Z",
        };

        for (const productId of [null, "", "   ", 123, true, [], {}, "bad\0id"]) {
            await expectRejected("POST", "/sessions", {
                ...validCreate,
                productId,
            });

            await expectRejected("PATCH", "/sessions/session-1", {
                productId,
            });
        }

        await expectRejected("POST", "/sessions", {
            ...validCreate,
            metrics: [null],
        });

        await expectRejected("POST", "/sessions", {
            ...validCreate,
            effects: [null],
        });

        await expectRejected("PATCH", "/sessions/session-1", {
            metrics: [null],
        });

        await expectRejected("PATCH", "/sessions/session-1", {
            effects: [null],
        });
    });

    assert.equal(writes, 1);

    const updateResponse = await fetch(`${base}/api/v1/sessions/session-1`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            cookie,
        },
        body: JSON.stringify({
            notes: "Updated without organizationId",
        }),
    });

    const updatePayload = await updateResponse.json();

    assert.equal(updateResponse.status, 200);
    assert.equal(updatePayload.success, true);
    assert.equal(updatePayload.data.organizationId, "org-a");
    assert.equal(writes, 2);
});
