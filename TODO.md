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

### TODO RR-011 [PLANNED]: Review CI dependency-install security

Priority: Medium

SonarCloud reports that the CI dependency installation permits package
lifecycle scripts to execute during `npm ci`. Determine whether lifecycle
scripts are required by the current build before changing installation
behavior.

Acceptance criteria:

- [ ] Identify repository dependencies or project scripts that require lifecycle scripts during CI installation.
- [ ] Determine whether `npm ci --ignore-scripts` is compatible with the current Prisma generation and build workflow.
- [ ] Prevent unnecessary package lifecycle-script execution during CI when it can be done safely.
- [ ] Preserve successful dependency installation, Prisma generation, linting, formatting checks, and build.
- [ ] Verify the resulting CI workflow passes.
- [ ] Resolve or appropriately disposition the corresponding SonarCloud security finding.

### TODO RR-012 [PLANNED]: Reduce unnecessary Express information disclosure

Priority: Low

SonarCloud reports that the Express application exposes framework version
information through its default response headers.

Acceptance criteria:

- [ ] Disable unnecessary Express framework-identification headers.
- [ ] Verify normal API responses remain unchanged apart from the removed identification header.
- [ ] Add or update relevant regression coverage if appropriate.
- [ ] Verify standard project validation passes.
- [ ] Resolve the corresponding SonarCloud security finding.

## Blocked

None.

## Completed

### TODO RR-001 [COMPLETED]: Protect cultivar write endpoints

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

### TODO RR-002 [COMPLETED]: Validate product, cultivar, and organization writes

Priority: Medium

Write endpoints pass unvalidated request data to services and Prisma. Invalid types can produce HTTP
500 responses, and product weights and percentages lack range checks.

Acceptance criteria:

- [x] Validate required fields, types, and allowed values for supported create and update operations.
- [x] Validate product numeric ranges and referenced cultivar IDs.
- [x] Return consistent client errors for invalid input before attempting writes.
- [x] Verify valid writes and partial updates remain supported and relevant validation passes.

Implementation notes:

- Create/update middleware validates JSON-object bodies, required names, enum values, nullable product
  fields, and finite numeric ranges. Percentages accept 0 through 100; package weight accepts zero
  through values below 1e35 to fit the existing Decimal(65,30) column. Null characters are rejected.
- Product services check supplied cultivar references before writes. PATCH preserves omitted fields,
  supports empty objects, and accepts explicit null for nullable fields. Existing authentication,
  ADMIN authorization, organization isolation, field allowlists, and public reads remain in place.
- Malformed JSON and primitive bodies return 400 through parser-error handling limited to these
  create/update paths. Broader parser handling remains outside this task. Organization creation is
  through registration, which retains its existing organizationName validation.
- Added focused HTTP regression coverage in apps/api/tests/writeValidation.integration.test.ts.
  Both this suite and the unchanged RR-001 suite pass (16 reported tests total). Test type-checking,
  Prisma validation, lint, formatting, build, and git diff --check pass.
- Tests use in-memory Prisma doubles and do not verify live PostgreSQL persistence or concurrent
  cultivar deletion. Validation rules and the test command are documented in docs/api/write-validation.md.

### TODO RR-003 [COMPLETED]: Normalize registration usernames before duplicate checks

Priority: Medium

Registration checks the original username for duplicates but stores its trimmed value. A padded
duplicate can bypass the check and produce HTTP 500 instead of a conflict response.

Acceptance criteria:

- [x] Use the same normalized username for duplicate checking and persistence.
- [x] Return HTTP 409 for a duplicate username, including surrounding-whitespace variants.
- [x] Preserve optional username behavior and verify relevant validation passes.

Implementation notes:

- Registration normalizes an optional username once before duplicate lookup and persistence, ensuring
  both operations use the same trimmed value.

- Added HTTP regression coverage for trimmed username persistence, surrounding-whitespace duplicate
  detection returning 409, and registration without a username.

- Authentication regression tests use real routes, validation middleware, controllers, and services
  with in-memory Prisma doubles and do not modify development data.

- Prisma validation, lint, build, git diff --check, and the full integration suite pass (20 tests).

### TODO RR-004 [COMPLETED]: Restrict development PostgreSQL network exposure

Priority: Medium

Docker Compose publishes PostgreSQL on all host interfaces using the default development password.
Restrict the development port to localhost to remove unintended network exposure.

Acceptance criteria:

- [x] Bind the published PostgreSQL port to localhost.
- [x] Verify local database access still works and the port is not published on all interfaces.
- [x] Document the local-only development configuration and verify relevant configuration checks pass.

Implementation requires approval for Docker infrastructure changes under AGENTS.md.

Implementation notes:

- Docker Compose publishes PostgreSQL as `127.0.0.1:5433:5432`, restricting the development database port to the local host.
- `docker compose config` confirms `host_ip: 127.0.0.1`, and the running container reports `127.0.0.1:5433->5432/tcp`.
- Prisma validation passes and migrations are up to date, confirming local database access remains functional.

### TODO RR-005 [COMPLETED]: Add executable automated regression tests

Priority: Medium

The repository now exposes its existing integration regression suite through the root npm test script.
Coverage includes authentication behavior, organization isolation, cultivar access control, write validation,
and username normalization without writing to existing development data.

Acceptance criteria:

- [x] Provide an npm test script that runs executable tests and exits unsuccessfully on failures.
- [x] Cover authentication, organization isolation, and rejection of unauthorized cultivar writes.
- [x] Cover invalid write payloads and username normalization behavior.
- [x] Keep tests repeatable and isolated from existing development data.
- [x] Verify the tests and standard project validation pass.

Prefer existing dependencies; obtain approval before adding a test dependency.

### TODO RR-007 [COMPLETED]: Correct session payload validation

Priority: Medium

Session creation requires a request-body organizationId even though the controller derives ownership
from the authenticated user. Null metric and effect entries throw TypeError instead of returning a
client error, and an object-valued productId passes update validation. These cases were reproduced
without database writes during the health check.

Acceptance criteria:

- [x] Remove the requirement for a request-body organizationId and preserve authenticated ownership.
- [x] Validate supported session field types, including productId, before service or Prisma calls.
- [x] Reject null or invalid metric/effect entries with consistent HTTP 400 responses.
- [x] Verify valid session creation and partial updates remain supported without a body organizationId.
- [x] Add relevant regression coverage and verify the tests and standard project validation pass.
