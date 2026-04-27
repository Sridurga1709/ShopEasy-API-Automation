# Test Plan — ShopEasy Order Management API

## 1. Introduction

### 1.1 Purpose
This test plan describes what will be tested, how it will be tested, and the criteria for a successful test cycle for the ShopEasy Order Management API.

### 1.2 Project Reference
- **API:** ShopEasy Order Management API v1.0.0 (OAS 3.0)
- **Spec:** `http://localhost:8080/openapi.yaml`
- **Repo:** ShopEasy-API-Automation

---

## 2. Test Objectives

1. Confirm all 11 API endpoints function correctly per the OpenAPI specification.
2. Validate HTTP status codes, response schemas, and error messages.
3. Confirm authorization is enforced on all protected endpoints.
4. Verify the end-to-end order lifecycle works correctly.

---

## 3. Features to Be Tested

| # | Module | Endpoint | Test Type |
|---|--------|----------|-----------|
| 1 | Auth | POST /auth/login | Functional, Negative |
| 2 | Auth | POST /auth/register | Functional, Negative |
| 3 | Products | GET /products | Functional |
| 4 | Products | GET /products/{id} | Functional, Negative |
| 5 | Cart | POST /cart/items | Functional, Negative, Auth |
| 6 | Cart | GET /cart | Functional, Auth |
| 7 | Cart | DELETE /cart/items/{itemId} | Functional, Negative |
| 8 | Orders | POST /orders | Functional, Negative, Auth |
| 9 | Orders | GET /orders/{orderId} | Functional, Negative, Auth |
| 10 | Orders | DELETE /orders/{orderId}/cancel | Functional, Negative |
| 11 | Payments | POST /payments | Functional, Negative, Auth |
| 12 | Payments | GET /payments/{paymentId} | Functional, Negative |

---

## 4. Features Not to Be Tested

- UI / browser interactions
- Load and stress testing
- SQL injection / security scanning
- Third-party payment gateway integration

---

## 5. Test Approach

### 5.1 Test Levels
- **API / Integration level** — each endpoint tested independently and as part of the order lifecycle flow.

### 5.2 Test Design Techniques
- **Equivalence Partitioning** — valid vs. invalid inputs for each field.
- **Boundary Value Analysis** — minimum quantity (1), non-existent IDs (999999).
- **State Transition** — order status transitions: pending → cancelled; pending → paid.

### 5.3 Test Execution
- Automated via Playwright Test CLI: `npm test`
- Tests run sequentially (1 worker) to avoid race conditions on shared server state.

---

## 6. Test Deliverables

| Deliverable | Location |
|-------------|----------|
| Test Strategy | `qa-docs/test-strategy.md` |
| Test Plan (this document) | `qa-docs/test-plan.md` |
| Test Cases | `qa-docs/test-cases.md` |
| Traceability Matrix | `qa-docs/traceability-matrix.md` |
| Execution Report | `qa-docs/execution-report.md` |
| Automation Code | `tests/` |
| HTML Report | `playwright-report/` (generated on run) |

---

## 7. Entry Criteria

- [ ] API server is running at `http://localhost:3000`
- [ ] `npm install` completed successfully
- [ ] All spec files compile without TypeScript errors

## 8. Exit Criteria

- [ ] All 33 test cases executed
- [ ] 0 failures
- [ ] HTML report reviewed and signed off

---

## 9. Test Schedule

| Phase | Activity |
|-------|----------|
| Phase 1 | Test design & automation development |
| Phase 2 | Test execution on local environment |
| Phase 3 | Defect logging and re-testing |
| Phase 4 | Final execution report generation |

---

## 10. Roles & Responsibilities

| Role | Responsibility |
|------|---------------|
| QA Engineer | Write & maintain test cases, execute tests, log defects |
| Developer | Fix reported defects, confirm API spec |
| QA Lead | Review test plan, sign off on exit criteria |

---

## 11. Defect Management

- Defects discovered during test execution should be logged with:
  - Test case ID (e.g., TC-AUTH-01)
  - Steps to reproduce
  - Expected vs. actual result
  - HTTP request/response details
  - Severity: Critical / Major / Minor

---

## 12. Assumptions & Dependencies

- The API server data is reset to a known state before each full test run.
- The admin account (`admin@shopeasy.com`) exists and is active.
- User registration is open (no invite required) so fresh test users can be created dynamically.
