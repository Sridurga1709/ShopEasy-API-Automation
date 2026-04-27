# Test Strategy — ShopEasy Order Management API

## 1. Overview

This document defines the overall testing approach for the ShopEasy Order Management API. It covers objectives, scope, testing types, tools, environment setup, and risk management.

---

## 2. Objectives

- Validate that all API endpoints behave according to the OpenAPI specification.
- Verify correct HTTP status codes, response schemas, and business logic for both happy-path and error scenarios.
- Ensure authentication and authorization are enforced on protected endpoints.
- Detect regressions early through automated regression execution in CI.

---

## 3. Scope

### In Scope
| Module | Endpoints |
|--------|-----------|
| Auth | `POST /auth/login`, `POST /auth/register` |
| Products | `GET /products`, `GET /products/{id}` |
| Cart | `POST /cart/items`, `GET /cart`, `DELETE /cart/items/{itemId}` |
| Orders | `POST /orders`, `GET /orders/{orderId}`, `DELETE /orders/{orderId}/cancel` |
| Payments | `POST /payments`, `GET /payments/{paymentId}` |

### Out of Scope
- UI / browser testing
- Performance / load testing
- Security penetration testing
- Database-level validation

---

## 4. Testing Types

| Type | Description |
|------|-------------|
| **Functional Testing** | Verify each endpoint returns the correct status code and response body for valid inputs |
| **Negative Testing** | Verify correct error codes (400, 401, 404, 409, 422) for invalid/missing inputs |
| **Authorization Testing** | Verify protected endpoints reject requests without a valid Bearer token |
| **Contract Testing** | Verify response payloads contain required fields as defined in the OpenAPI schema |
| **End-to-End Flow Testing** | Validate the full lifecycle: Login → Add to Cart → Place Order → Pay |

---

## 5. Test Approach

### Test Isolation
- Tests that mutate shared state (cart, orders, payments) register a **fresh user** per test to avoid state pollution between tests.
- Read-only tests (products) use no authentication or the shared admin token.

### Data Management
- Dynamic test data (email addresses, etc.) is generated at runtime using `Date.now()` to ensure uniqueness.
- No external fixtures or seed scripts are required — the API itself is used to set up preconditions.

### Assertion Strategy
- HTTP status code is always asserted first.
- Response body is validated for presence of required fields using Playwright's `toHaveProperty`.
- Field types and values are checked where the spec provides concrete examples (e.g., `status: 'cancelled'`).

---

## 6. Tools & Technologies

| Tool | Purpose |
|------|---------|
| [Playwright Test](https://playwright.dev/) | API test runner and assertion library |
| TypeScript 5.x | Type-safe test authoring |
| Node.js 18+ | Runtime |
| HTML Reporter | Test execution reporting |

---

## 7. Environment

| Item | Value |
|------|-------|
| API Base URL | `http://localhost:3000` |
| Swagger UI | `http://localhost:8080/` |
| API Spec | `http://localhost:8080/openapi.yaml` |
| Admin Credentials | `admin@shopeasy.com` / `password123` |

---

## 8. Entry & Exit Criteria

### Entry Criteria
- API server is running and reachable at `http://localhost:3000`.
- All test dependencies are installed (`npm install`).

### Exit Criteria
- All 33 test cases have been executed.
- Zero test failures.
- HTML report generated and reviewed.

---

## 9. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Shared admin account state pollution between tests | High | Use fresh isolated users for all state-mutating tests |
| API server not running | Blocks all tests | Include server availability check in pre-run steps |
| Flaky tests due to duplicate email conflicts | Medium | Generate unique emails with `Date.now()` suffix |
| API spec changes breaking existing tests | Medium | Re-run tests after any server update; review OpenAPI diff |
