import assert from "node:assert/strict";
import { once } from "node:events";
import type { AddressInfo } from "node:net";
import { test } from "node:test";

import express from "express";
import session from "express-session";

import { AcquisitionType, ProductType } from "../src/generated/prisma/enums.js";
import prisma from "../src/lib/prisma.js";
import { errorHandler } from "../src/middleware/error.middleware.js";
import { writeBodyErrors } from "../src/middleware/writeValidation.middleware.js";
import cultivarRouter from "../src/routes/cultivar.routes.js";
import organizationRouter from "../src/routes/organization.routes.js";
import productRouter from "../src/routes/product.routes.js";

test("product, cultivar and organization write validation", async (t) => {
    // Exercise real sessions, routes, middleware, controllers and services. Replace only Prisma;
    // the fixtures and mutations below are entirely in memory and never touch development data.
    type Row = Record<string, unknown> & { id: string };
    type Query = { where: { id: string; organizationId?: string }; data: Record<string, unknown> };
    const cultivars = new Map<string, Row>([
        ["cultivar-a", { id: "cultivar-a", name: "Original" }],
    ]);
    const products = new Map<string, Row>([
        [
            "product-a",
            {
                id: "product-a",
                organizationId: "org-a",
                name: "Original",
                productType: "FLOWER",
                acquisitionType: "PURCHASED",
                brand: "Brand",
                packageWeight: 3.5,
                thcPercent: 20,
                cultivarId: "cultivar-a",
            },
        ],
        ["product-b", { id: "product-b", organizationId: "org-b", name: "Other organization" }],
    ]);
    const organizations = new Map<string, Row>([
        ["org-a", { id: "org-a", name: "Original organization" }],
        ["org-b", { id: "org-b", name: "Other organization" }],
    ]);
    let writes = 0;
    let cultivarLookups = 0;
    let sequence = 0;
    const writePayloads: Record<string, unknown>[] = [];

    function stub<T>(target: object, method: string, implementation: T) {
        const original = Reflect.get(target, method);
        assert.ok(Reflect.set(target, method, implementation));
        t.after(() => {
            Reflect.set(target, method, original);
        });
    }
    function create(rows: Map<string, Row>, data: Record<string, unknown>) {
        writes++;
        writePayloads.push(data);
        const row = { ...data, id: `created-${++sequence}` };
        rows.set(row.id, row);
        return row;
    }
    function update(rows: Map<string, Row>, { where, data }: Query) {
        writes++;
        writePayloads.push(data);
        const row = rows.get(where.id);
        assert.ok(row, "test must update an existing fixture");
        for (const [key, value] of Object.entries(data)) {
            if (value !== undefined) row[key] = value;
        }
        return row;
    }
    function snapshot() {
        return JSON.stringify([[...cultivars], [...products], [...organizations]]);
    }

    stub(prisma.user, "findUnique", async ({ where }: Query) =>
        ["admin", "member", "owner"].includes(where.id)
            ? { id: where.id, role: where.id.toUpperCase(), organizationId: "org-a" }
            : null
    );
    stub(prisma.cultivar, "findUnique", async ({ where }: Query) => {
        cultivarLookups++;
        return cultivars.get(where.id) ?? null;
    });
    stub(prisma.cultivar, "findMany", async () => [...cultivars.values()]);
    stub(prisma.cultivar, "create", async ({ data }: Query) => create(cultivars, data));
    stub(prisma.cultivar, "update", async (query: Query) => update(cultivars, query));
    stub(prisma.product, "findFirst", async ({ where }: Query) => {
        const row = products.get(where.id);
        return row?.organizationId === where.organizationId ? row : null;
    });
    stub(prisma.product, "create", async ({ data }: Query) => create(products, data));
    stub(prisma.product, "update", async (query: Query) => update(products, query));
    stub(
        prisma.organization,
        "findUnique",
        async ({ where }: Query) => organizations.get(where.id) ?? null
    );
    stub(prisma.organization, "update", async (query: Query) => update(organizations, query));

    const app = express();
    app.use(express.json());
    app.use("/api/v1/products", writeBodyErrors(true));
    app.use("/api/v1/cultivars", writeBodyErrors(true));
    app.use("/api/v1/organizations", writeBodyErrors(false));
    app.use(
        session({
            secret: "write-validation-test-only-secret",
            resave: false,
            saveUninitialized: false,
        })
    );
    app.post("/test/session/:userId", (req, res) => {
        req.session.userId = req.params.userId;
        res.sendStatus(204);
    });
    app.use("/api/v1/products", productRouter);
    app.use("/api/v1/cultivars", cultivarRouter);
    app.use("/api/v1/organizations", organizationRouter);
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
    async function cookieFor(user: string) {
        const response = await fetch(`${base}/test/session/${user}`, { method: "POST" });
        assert.equal(response.status, 204);
        return response.headers.get("set-cookie")!.split(";")[0];
    }
    const admin = await cookieFor("admin");
    const member = await cookieFor("member");
    const owner = await cookieFor("owner");
    async function request(
        method: string,
        path: string,
        body?: unknown,
        cookie: string | undefined = admin,
        raw?: string
    ) {
        return fetch(`${base}/api/v1${path}`, {
            method,
            headers: { "Content-Type": "application/json", ...(cookie ? { cookie } : {}) },
            ...(raw !== undefined
                ? { body: raw }
                : body === undefined
                  ? {}
                  : { body: JSON.stringify(body) }),
        });
    }
    async function rejected(
        method: string,
        path: string,
        body: unknown,
        status = 400,
        cookie = admin,
        raw?: string
    ) {
        const before = snapshot();
        const writesBefore = writes;
        const response = await request(method, path, body, cookie, raw);
        const payload = await response.json();
        assert.equal(
            response.status,
            status,
            `${method} ${path}: ${JSON.stringify(body)} => ${JSON.stringify(payload)}`
        );
        assert.equal(payload.success, false);
        assert.equal(typeof payload.message, "string");
        assert.equal(writes, writesBefore);
        assert.equal(snapshot(), before);
    }
    const validProduct = {
        name: "New product",
        productType: "FLOWER",
        acquisitionType: "PURCHASED",
    };
    const endpoints = [
        ["POST", "/products"],
        ["PATCH", "/products/product-a"],
        ["POST", "/cultivars"],
        ["PATCH", "/cultivars/cultivar-a"],
        ["PATCH", "/organizations/org-a"],
    ] as const;

    await t.test("reject missing bodies, arrays and invalid names before writes", async () => {
        for (const [method, path] of endpoints) {
            for (const body of [undefined, null, false, 5, "text", [], [{ name: "Nested" }]])
                await rejected(method, path, body);
            await rejected(method, path, undefined, 400, admin, '{"name":');
            for (const name of [
                null,
                "",
                "   ",
                123,
                true,
                [],
                {},
                { set: "Injected" },
                "bad\0name",
            ]) {
                await rejected(method, path, { ...validProduct, name });
            }
        }
        await rejected("POST", "/cultivars", {});
        for (const field of ["name", "productType", "acquisitionType"]) {
            const body: Record<string, unknown> = { ...validProduct };
            delete body[field];
            await rejected("POST", "/products", body);
        }
    });

    await t.test(
        "validate product enums, optional text and cultivar ID types on create and update",
        async () => {
            for (const [method, path] of endpoints.slice(0, 2)) {
                for (const field of ["productType", "acquisitionType"]) {
                    for (const value of [
                        null,
                        "",
                        "invalid",
                        "flower",
                        1,
                        true,
                        [],
                        { set: "FLOWER" },
                    ]) {
                        await rejected(method, path, { ...validProduct, [field]: value });
                    }
                }
                for (const field of ["brand", "batchNumber"]) {
                    for (const value of [1, true, [], {}, "bad\0text"])
                        await rejected(method, path, { ...validProduct, [field]: value });
                }
                const lookupsBefore = cultivarLookups;
                for (const value of ["", "   ", 1, true, [], {}, "bad\0id"]) {
                    await rejected(method, path, { ...validProduct, cultivarId: value });
                }
                assert.equal(cultivarLookups, lookupsBefore, "invalid ID types never reach Prisma");
            }
        }
    );

    await t.test(
        "reject numeric types, negatives, percentage overflow and decimal overflow",
        async () => {
            for (const [method, path] of endpoints.slice(0, 2)) {
                for (const field of [
                    "packageWeight",
                    "thcPercent",
                    "cbdPercent",
                    "cbgPercent",
                    "cbnPercent",
                ]) {
                    for (const value of ["1", true, [], {}, { increment: 1 }, -0.01, -1]) {
                        await rejected(method, path, { ...validProduct, [field]: value });
                    }
                    // JSON permits this numeric syntax; JSON.parse produces Infinity.
                    await rejected(
                        method,
                        path,
                        undefined,
                        400,
                        admin,
                        `{"name":"Product","productType":"FLOWER","acquisitionType":"PURCHASED","${field}":1e400}`
                    );
                    if (field !== "packageWeight") {
                        for (const value of [100.01, 101, 1e35])
                            await rejected(method, path, { ...validProduct, [field]: value });
                    }
                }
                for (const value of [1e35, 1e100])
                    await rejected(method, path, { ...validProduct, packageWeight: value });
            }
        }
    );

    await t.test("reject missing cultivar references before product writes", async () => {
        for (const [method, path] of endpoints.slice(0, 2)) {
            await rejected(method, path, { ...validProduct, cultivarId: "missing-cultivar" });
        }
    });

    await t.test("accept every product enum and valid nullable/numeric boundaries", async () => {
        for (const productType of Object.values(ProductType)) {
            for (const acquisitionType of Object.values(AcquisitionType)) {
                const response = await request(
                    "POST",
                    "/products",
                    { ...validProduct, productType, acquisitionType },
                    member
                );
                assert.equal(response.status, 201);
                const { data } = await response.json();
                assert.equal(data.productType, productType);
                assert.equal(data.acquisitionType, acquisitionType);
                assert.equal(data.organizationId, "org-a");
            }
        }
        for (const value of [0, 0.01, 100, null]) {
            const fields = {
                packageWeight: value,
                thcPercent: value,
                cbdPercent: value,
                cbgPercent: value,
                cbnPercent: value,
                brand: value === null ? null : "",
                batchNumber: value === null ? null : "Batch",
                cultivarId: value === null ? null : "cultivar-a",
            };
            const created = await request("POST", "/products", { ...validProduct, ...fields });
            assert.equal(created.status, 201);
            const createdData = (await created.json()).data;
            for (const [key, expected] of Object.entries(fields))
                assert.equal(createdData[key], expected);
            const patched = await request("PATCH", `/products/${createdData.id}`, fields);
            assert.equal(patched.status, 200);
            const patchedData = (await patched.json()).data;
            for (const [key, expected] of Object.entries(fields))
                assert.equal(patchedData[key], expected);
        }
        assert.equal(
            (await request("POST", "/products", { ...validProduct, packageWeight: 1e34 })).status,
            201
        );
    });

    await t.test(
        "PATCH preserves omitted fields and permits explicit nulls and empty objects",
        async () => {
            const before = { ...products.get("product-a")! };
            const lookupsBefore = cultivarLookups;
            const response = await request(
                "PATCH",
                "/products/product-a",
                {
                    name: "Renamed",
                    organizationId: "org-b",
                    id: "forged",
                    cultivar: { connect: { id: "missing" } },
                },
                member
            );
            assert.equal(response.status, 200);
            assert.deepEqual(products.get("product-a"), { ...before, name: "Renamed" });
            assert.deepEqual(writePayloads.at(-1), { name: "Renamed" });
            assert.equal(cultivarLookups, lookupsBefore, "omitted reference is not queried");
            for (const path of [
                "/products/product-a",
                "/cultivars/cultivar-a",
                "/organizations/org-a",
            ]) {
                const unchanged = snapshot();
                assert.equal((await request("PATCH", path, {})).status, 200);
                assert.equal(snapshot(), unchanged);
            }
            const clear = { cultivarId: null, packageWeight: null, thcPercent: null, brand: null };
            assert.equal((await request("PATCH", "/products/product-a", clear)).status, 200);
            assert.deepEqual(products.get("product-a"), { ...before, name: "Renamed", ...clear });
            assert.equal(cultivarLookups, lookupsBefore);
        }
    );

    await t.test(
        "valid cultivar creation and organization/cultivar renames remain supported",
        async () => {
            const response = await request("POST", "/cultivars", { name: " New cultivar " });
            assert.equal(response.status, 201);
            assert.equal((await response.json()).data.name, " New cultivar ");
            assert.equal(
                (await request("PATCH", "/cultivars/cultivar-a", { name: "Renamed cultivar" }))
                    .status,
                200
            );
            assert.equal(cultivars.get("cultivar-a")?.name, "Renamed cultivar");
            assert.equal(
                (
                    await request(
                        "PATCH",
                        "/organizations/org-a",
                        { name: "Renamed organization", id: "org-b" },
                        member
                    )
                ).status,
                200
            );
            assert.equal(organizations.get("org-a")?.name, "Renamed organization");
            assert.equal(organizations.get("org-b")?.name, "Other organization");
        }
    );

    await t.test(
        "authentication, ADMIN authorization, isolation and public reads are preserved",
        async () => {
            for (const [method, path] of endpoints) await rejected(method, path, {}, 401, "");
            for (const cookie of [member, owner]) {
                for (const [method, path] of endpoints.slice(2, 4))
                    await rejected(method, path, {}, 403, cookie);
            }
            for (const id of ["product-b", "missing"]) {
                await rejected(
                    "PATCH",
                    `/products/${id}`,
                    { cultivarId: "missing-cultivar" },
                    404,
                    member
                );
            }
            for (const id of ["org-b", "missing"])
                await rejected("PATCH", `/organizations/${id}`, { name: "Denied" }, 404, member);
            assert.equal((await request("GET", "/cultivars", undefined, "")).status, 200);
            assert.equal(
                (await request("GET", "/cultivars/cultivar-a", undefined, "")).status,
                200
            );
            assert.equal((await request("GET", "/products/product-a", undefined, "")).status, 401);
            assert.equal((await request("GET", "/organizations/org-a", undefined, "")).status, 401);
        }
    );
});
