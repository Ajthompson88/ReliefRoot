import assert from "node:assert/strict";
import { once } from "node:events";
import type { AddressInfo } from "node:net";
import { test } from "node:test";

import express from "express";
import session from "express-session";

import { UserRole } from "../src/generated/prisma/enums.js";
import prisma from "../src/lib/prisma.js";
import { errorHandler } from "../src/middleware/error.middleware.js";
import cultivarRouter from "../src/routes/cultivar.routes.js";

test("cultivar HTTP access control", async (t) => {
    // Only Prisma is replaced; requests exercise sessions, routes, auth, services and errors.
    // No development database connections or writes are made.
    const users = new Map([
        ["admin", { id: "admin", role: UserRole.ADMIN, organizationId: "org-a" }],
        ["owner", { id: "owner", role: UserRole.OWNER, organizationId: "org-b" }],
        ["member", { id: "member", role: UserRole.MEMBER, organizationId: "org-a" }],
    ]);
    const cultivars = new Map([["existing", { id: "existing", name: "Original" }]]);
    let writes = 0;

    // Prisma delegates are proxies, so replace and restore methods through their setters.
    function stub<T>(target: object, method: string, implementation: T) {
        const original = Reflect.get(target, method);
        assert.equal(Reflect.set(target, method, implementation), true);
        t.after(() => {
            Reflect.set(target, method, original);
        });
    }
    type Where = { where: { id: string } };
    type Data = { data: { name: string } };

    stub(prisma.user, "findUnique", async ({ where }: Where) => users.get(where.id) ?? null);
    stub(prisma.cultivar, "findMany", async () => [...cultivars.values()]);
    stub(
        prisma.cultivar,
        "findUnique",
        async ({ where }: Where) => cultivars.get(where.id) ?? null
    );
    stub(prisma.cultivar, "create", async ({ data }: Data) => {
        writes++;
        const cultivar = { id: "created", name: data.name };
        cultivars.set(cultivar.id, cultivar);
        return cultivar;
    });
    stub(prisma.cultivar, "update", async ({ where, data }: Where & Data) => {
        writes++;
        const cultivar = { id: where.id, name: data.name };
        cultivars.set(cultivar.id, cultivar);
        return cultivar;
    });
    stub(prisma.cultivar, "delete", async ({ where }: Where) => {
        writes++;
        const cultivar = cultivars.get(where.id);
        cultivars.delete(where.id);
        return cultivar;
    });

    const app = express();
    app.use(express.json());
    app.use(
        session({ secret: "cultivar-test-only-secret", resave: false, saveUninitialized: false })
    );
    // Test-only session setup substitutes for login, without creating real users.
    app.post("/test/session/:userId", (req, res) => {
        req.session.userId = req.params.userId;
        res.sendStatus(204);
    });
    app.use("/api/v1/cultivars", cultivarRouter);
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
    const baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;

    async function cookieFor(userId: string) {
        const response = await fetch(`${baseUrl}/test/session/${userId}`, { method: "POST" });
        assert.equal(response.status, 204);
        return response.headers.get("set-cookie")!.split(";")[0];
    }

    async function request(method: string, path: string, cookie?: string, body?: unknown) {
        return fetch(`${baseUrl}/api/v1/cultivars${path}`, {
            method,
            headers: { "Content-Type": "application/json", ...(cookie ? { cookie } : {}) },
            ...(body === undefined ? {} : { body: JSON.stringify(body) }),
        });
    }

    await t.test("anonymous reads remain public", async () => {
        for (const path of ["/", "/existing"]) {
            const response = await request("GET", path);
            assert.equal(response.status, 200);
            assert.equal((await response.json()).success, true);
        }
        assert.equal((await request("GET", "/missing")).status, 404);
    });

    for (const identity of [undefined, "deleted-user", "owner", "member"]) {
        await t.test(`${identity ?? "anonymous"} cannot write or spoof authorization`, async () => {
            const cookie = identity ? await cookieFor(identity) : undefined;
            const expectedStatus = !identity || identity === "deleted-user" ? 401 : 403;
            const before = [...cultivars.entries()];
            const writesBefore = writes;
            for (const [method, path] of [
                ["POST", "/"],
                ["PATCH", "/existing"],
                ["DELETE", "/existing"],
            ]) {
                for (const body of [
                    undefined,
                    {
                        name: "Unauthorized",
                        role: "ADMIN",
                        userId: "admin",
                        organizationId: "org-a",
                    },
                ]) {
                    const response = await request(method, path, cookie, body);
                    assert.equal(response.status, expectedStatus);
                    assert.equal((await response.json()).success, false);
                }
            }
            assert.equal(writes, writesBefore);
            assert.deepEqual([...cultivars.entries()], before);
        });
    }

    await t.test("an admin can create, update and delete global cultivars", async () => {
        const cookie = await cookieFor("admin");
        const created = await request("POST", "/", cookie, { name: "New cultivar" });
        assert.equal(created.status, 201);
        assert.deepEqual((await created.json()).data, { id: "created", name: "New cultivar" });
        assert.equal(cultivars.get("created")?.name, "New cultivar");

        const updated = await request("PATCH", "/created", cookie, { name: "Updated cultivar" });
        assert.equal(updated.status, 200);
        assert.equal((await updated.json()).data.name, "Updated cultivar");
        assert.equal(cultivars.get("created")?.name, "Updated cultivar");

        const removed = await request("DELETE", "/created", cookie);
        assert.equal(removed.status, 200);
        assert.equal((await removed.json()).data.id, "created");
        assert.equal(cultivars.has("created"), false);
        assert.equal(writes, 3);

        // A role change must take effect on the next request with the same session.
        users.set("admin", { id: "admin", role: UserRole.MEMBER, organizationId: "org-a" });
        for (const [method, path] of [
            ["POST", "/"],
            ["PATCH", "/existing"],
            ["DELETE", "/existing"],
        ]) {
            assert.equal((await request(method, path, cookie, { name: "Denied" })).status, 403);
        }
        assert.equal(writes, 3);
        assert.deepEqual(cultivars.get("existing"), { id: "existing", name: "Original" });
    });
});
