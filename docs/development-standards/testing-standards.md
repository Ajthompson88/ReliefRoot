# Testing Standards

## Philosophy

Every feature should be testable.

Testing increases confidence when making future changes.

---

## Testing Pyramid

Unit Tests
↓

Integration Tests
↓

End-to-End Tests

---

## Unit Tests

Purpose:

Verify individual functions and classes.

Examples:

- Utility functions
- Services
- Validation
- Calculations

---

## Integration Tests

Purpose:

Verify components working together.

Examples:

- API endpoints
- Database interactions
- Authentication
- Business logic

---

## End-to-End Tests

Purpose:

Verify complete user workflows.

Examples:

- User login
- Creating a grow
- Logging a session
- Viewing analytics

---

## Naming

Example:

session.service.test.ts

auth.integration.test.ts

login.e2e.test.ts

---

## Coverage Goals

Minimum: 80%

Critical business logic:

100%

---

## Rules

- Test expected behavior.
- Test invalid input.
- Test edge cases.
- Test failures.
- Tests should be repeatable.
- Fix broken tests immediately.

---

## Principle

A passing test suite should provide confidence that the application behaves as expected.
