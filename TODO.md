# ReliefRoot Development Tracker

Actionable findings from the repository health check. Each work-item heading is the canonical source
of its permanent RR identifier and bracketed state. Heading states must agree with their sections;
do not infer state from prose or use separate Status fields. Implementation has not started for the
planned items below.

Preserve item IDs when moving items. Mark an item Completed only after its acceptance criteria are
satisfied and relevant validation passes. Retain completed items for reference.

## In Progress

None.

## Planned

### TODO RR-002 [PLANNED]: Validate product, cultivar, and organization writes

Priority: Medium

Write endpoints pass unvalidated request data to services and Prisma. Invalid types can produce HTTP
500 responses, and product weights and percentages lack range checks.

Acceptance criteria:

- [ ] Validate required fields, types, and allowed values for supported create and update operations.
- [ ] Validate product numeric ranges and referenced cultivar IDs.
- [ ] Return consistent client errors for invalid input before attempting writes.
- [ ] Verify valid writes and partial updates remain supported and relevant validation passes.

### TODO RR-003 [PLANNED]: Normalize registration usernames before duplicate checks

Priority: Medium

Registration checks the original username for duplicates but stores its trimmed value. A padded
duplicate can bypass the check and produce HTTP 500 instead of a conflict response.

Acceptance criteria:

- [ ] Use the same normalized username for duplicate checking and persistence.
- [ ] Return HTTP 409 for a duplicate username, including surrounding-whitespace variants.
- [ ] Preserve optional username behavior and verify relevant validation passes.

### TODO RR-004 [PLANNED]: Restrict development PostgreSQL network exposure

Priority: Medium

Docker Compose publishes PostgreSQL on all host interfaces using the default development password.
Restrict the development port to localhost to remove unintended network exposure.

Acceptance criteria:

- [ ] Bind the published PostgreSQL port to localhost.
- [ ] Verify local database access still works and the port is not published on all interfaces.
- [ ] Document the local-only development configuration and verify relevant configuration checks pass.

Implementation requires approval for Docker infrastructure changes under AGENTS.md.

### TODO RR-005 [PLANNED]: Add executable automated regression tests

Priority: Medium

The repository has focused cultivar access-control regression tests but no npm test script.
Authentication flows and organization isolation still lack automated regression coverage.

Acceptance criteria:

- [ ] Provide an npm test script that runs executable tests and exits unsuccessfully on failures.
- [ ] Cover authentication, organization isolation, and rejection of unauthorized cultivar writes.
- [ ] Cover invalid write payloads and username normalization behavior.
- [ ] Keep tests repeatable and isolated from existing development data.
- [ ] Verify the tests and standard project validation pass.

Prefer existing dependencies; obtain approval before adding a test dependency.

### TODO RR-006 [PLANNED]: Complete and refresh development documentation

Priority: Low

The development setup guide is empty. README and sprint documentation describe implemented features as
pending and list removed organization endpoints.

Acceptance criteria:

- [ ] Document prerequisites, environment setup, database setup, and API startup commands.
- [ ] Document validation and available test commands accurately.
- [ ] Reconcile current feature status and endpoint listings with implemented routes.
- [ ] Preserve historical sprint notes while clearly distinguishing the current state.
- [ ] Verify documented commands and paths against the repository and check changed Markdown formatting.

### TODO RR-007 [PLANNED]: Correct session payload validation

Priority: Medium

Session creation requires a request-body organizationId even though the controller derives ownership
from the authenticated user. Null metric and effect entries throw TypeError instead of returning a
client error, and an object-valued productId passes update validation. These cases were reproduced
without database writes during the health check.

Acceptance criteria:

- [ ] Remove the requirement for a request-body organizationId and preserve authenticated ownership.
- [ ] Validate supported session field types, including productId, before service or Prisma calls.
- [ ] Reject null or invalid metric/effect entries with consistent HTTP 400 responses.
- [ ] Verify valid session creation and partial updates remain supported without a body organizationId.
- [ ] Add relevant regression coverage and verify the tests and standard project validation pass.

### TODO RR-008 [PLANNED]: Preserve client responses for request-body parsing errors

Priority: Medium

The global error handler handles ApiError but converts other errors to HTTP 500, including request-body
parser errors. A synthetic parser error carrying HTTP 400 was confirmed to become HTTP 500 during the
health check.

Acceptance criteria:

- [ ] Return HTTP 400 for malformed JSON and HTTP 413 for oversized request bodies.
- [ ] Use the existing client-error response format without exposing internal error details.
- [ ] Preserve existing ApiError handling and HTTP 500 responses for unexpected server errors.
- [ ] Add regression coverage for parser errors and verify the tests and standard validation pass.

### TODO RR-009 [PLANNED]: Handle product deletion conflicts without deleting sessions

Priority: Medium

Sessions reference products through a restrictive foreign key. The product deletion service does not
translate the resulting constraint error into a client response, so deleting a referenced product is
expected to return HTTP 500. This finding is supported by the schema and service code; live database
verification was unavailable during the health check.

Acceptance criteria:

- [ ] Return HTTP 409 with a clear message when sessions prevent product deletion.
- [ ] Preserve the referenced product and its sessions when deletion is rejected.
- [ ] Preserve organization isolation, missing-product behavior, and deletion of unreferenced products.
- [ ] Add regression coverage for deletion conflicts and verify relevant database behavior when available.
- [ ] Verify the tests and standard project validation pass without weakening foreign-key constraints.

### TODO RR-010 [PLANNED]: Bring session-table ownership under managed database migrations

Priority: Medium

Ensure the PostgreSQL session table used by `connect-pg-simple` is created and managed through the
repository's migration strategy rather than runtime `createTableIfMissing`.

Acceptance criteria:

- [ ] Session-table creation is no longer performed automatically at application runtime.
- [ ] Required session-table schema is represented by an appropriate managed migration.
- [ ] Existing authentication/session behavior remains functional.
- [ ] Existing session data is not reset or deleted.
- [ ] No already-applied migration is modified.
- [ ] Relevant authentication/session regression tests pass.
- [ ] Standard validation passes.

## Blocked

None.

## Completed

### RR-001 [COMPLETED]: Protect cultivar write endpoints

Priority: High

The cultivar POST, PATCH, and DELETE routes previously lacked authentication and authorization, allowing anonymous
callers to modify global records shared across organizations.

Acceptance criteria:

- [x] Require authentication for every cultivar write endpoint.
- [x] Define and enforce who may modify global cultivars.
- [x] Verify anonymous and unauthorized writes are rejected without changing data.
- [x] Verify authorized writes still work and relevant validation passes.

Implementation notes:

- Writes reuse session authentication and load the current user before enforcing an ADMIN-only
  service policy. Cultivars are global; self-registered OWNER accounts and MEMBER accounts receive 403. Missing or deleted-user sessions receive 401. Public reads remain unchanged.
- Focused HTTP regression checks pass (7 tests), including authorized CRUD, rejected writes with no
  Prisma writes or data changes, spoofed roles, and role revocation. Run
  `node --import tsx --test apps/api/tests/cultivar.integration.test.ts`.
- Tests use real routes and in-memory sessions with mocked Prisma methods. Live database persistence,
  PostgreSQL sessions, and login/registration integration are not covered. RR-005 remains planned for
  broader regression infrastructure and the npm test entry point; it no longer starts from zero tests.
- Prisma validation, lint, formatting, build, and `git diff --check` pass. All seven focused
  regression checks pass. The pre-existing `AGENTS.md` formatting issue was resolved with
  whitespace-only changes; all RR-001 acceptance criteria are satisfied.
- Access policy and test limitations are documented in `docs/api/cultivars.md`.
