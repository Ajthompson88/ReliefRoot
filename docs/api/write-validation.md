# Product, cultivar, and organization write validation

Validation applies to `POST /api/v1/products`, `PATCH /api/v1/products/:id`,
`POST /api/v1/cultivars`, `PATCH /api/v1/cultivars/:id`, and
`PATCH /api/v1/organizations/:id`. There is no standalone organization creation endpoint;
registration retains its existing `organizationName` validation.

Requests must contain a JSON object. Invalid payloads return HTTP 400 with the existing
`success: false` and `message` response format. Malformed JSON and JSON primitives are translated to
400 specifically on these write paths. Other parser-error handling remains outside this change.

| Field                                                  | Rules                                                                                                                                                  |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `name`                                                 | Required on product/cultivar creation; a nonblank string when supplied on PATCH. Null is rejected. Surrounding whitespace is preserved.                |
| `productType`                                          | Required on product creation; one of `FLOWER`, `EDIBLE`, `CONCENTRATE`, `TINCTURE`, `TOPICAL`, `CAPSULE`.                                              |
| `acquisitionType`                                      | Required on product creation; `PURCHASED` or `HOMEGROWN`.                                                                                              |
| `brand`, `batchNumber`                                 | Optional strings or null; empty strings are allowed.                                                                                                   |
| `packageWeight`                                        | Optional finite JSON number, at least zero and less than `1e35`, or null. The upper limit protects the existing `Decimal(65,30)` column from overflow. |
| `thcPercent`, `cbdPercent`, `cbgPercent`, `cbnPercent` | Optional finite JSON numbers from 0 through 100 inclusive, or null. Each percentage is validated independently.                                        |
| `cultivarId`                                           | Optional nonblank string identifying an existing global cultivar, or null. Existence is checked in the product service before writing.                 |

Validated strings cannot contain null characters, which PostgreSQL text columns cannot store.
Numeric strings, booleans, arrays, and Prisma operation objects are not coerced into field values.

PATCH validates only supplied fields. Omitted fields remain unchanged; an empty object is supported.
Explicit null clears nullable product fields. Omitted or null cultivar references need no lookup.
Existing controller/service field allowlists remain in effect: extra fields are ignored and cannot
change a product's organization or ID or perform nested Prisma operations.

Authentication and cultivar ADMIN authorization run before payload validation for parsed requests.
Malformed JSON is rejected during parsing before authentication. Product updates still check
organization ownership before querying a supplied cultivar reference; missing or inaccessible
products return 404. Cultivar reads remain public and other read/delete behavior is unchanged.

## Regression checks

With the existing development environment configured, run from the repository root:

```sh
node --import tsx --test apps/api/tests/cultivar.integration.test.ts apps/api/tests/writeValidation.integration.test.ts
```

The tests exercise Express routes, session middleware, controllers, and services with in-memory
Prisma test doubles. Coverage includes invalid bodies and field types, enum values, numeric bounds,
missing cultivar references, nullable values, partial updates, authorization, and organization
isolation. Rejected writes must not invoke Prisma writes or change fixture data. Tests do not use or
modify the development database, and do not verify live PostgreSQL persistence or concurrent changes
to referenced cultivars. Existing RR-001 coverage runs unchanged.
