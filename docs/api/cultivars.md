# Cultivar access control

Cultivars are global reference records shared by all organizations. `GET /api/v1/cultivars` and
`GET /api/v1/cultivars/:id` remain public.

`POST /api/v1/cultivars`, `PATCH /api/v1/cultivars/:id`, and `DELETE /api/v1/cultivars/:id` require
a valid session and a current database user with the existing `ADMIN` role. This role grants global
catalog write access regardless of organization. Only trusted catalog administrators should be
assigned `ADMIN`. `OWNER` and `MEMBER` cannot modify cultivars: organization ownership does not confer
ownership of the global catalog, and public registration automatically assigns `OWNER`.

The routes reuse `requireAuth` and `loadAuthenticatedUser`, then apply the cultivar service's access
policy before invoking a write controller. Missing sessions and sessions for deleted users return 401. Authenticated users without `ADMIN` return 403. Both use the existing error response format
(`success: false` and `message`) and are rejected before cultivar writes. Roles and organization IDs
supplied in request bodies do not grant access. The database role is reloaded on every write request.

No role provisioning endpoint or schema change is introduced. Existing ADMIN accounts can continue
using the write endpoints; promoting accounts is a separate administrative operation.

## Focused regression checks

From the repository root, with the existing development environment configured:

```sh
node --import tsx --test apps/api/tests/cultivar.integration.test.ts
```

These tests use the installed Node/tsx tooling, real Express routes and session middleware, and mocked
Prisma methods with in-memory records. They check public reads, anonymous and deleted-user sessions,
OWNER/MEMBER denial, forged body roles, authorized CRUD, and role revocation. Rejected writes must
leave records unchanged and never invoke a Prisma write. No development database data is modified.

RR-005 still covers the repository-wide npm test entry point and broader regression infrastructure.
These focused checks do not verify live PostgreSQL persistence, the PostgreSQL session store, or the
registration/login flow.
