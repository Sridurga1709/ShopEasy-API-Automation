# ShopEasy API Automation

Playwright + TypeScript API test suite for the [ShopEasy Order Management API](http://localhost:8080/).

## Tech Stack

| Tool | Purpose |
|------|---------|
| [Playwright Test](https://playwright.dev/) | API test runner & assertions |
| TypeScript 5.x | Type-safe test authoring |
| Node.js 18+ | Runtime |

## Project Structure

```
api-automation/
├── .gitignore
├── package.json
├── tsconfig.json
├── playwright.config.ts           # Base URL, timeout, reporter config
├── tests/
│   ├── helpers/
│   │   └── auth.ts                # Login helper & shared auth utilities
│   ├── auth.spec.ts               # 6 tests  — POST /auth/login, POST /auth/register
│   ├── products.spec.ts           # 5 tests  — GET /products, GET /products/{id}
│   ├── cart.spec.ts               # 8 tests  — POST /cart/items, GET /cart, DELETE /cart/items/{itemId}
│   ├── orders.spec.ts             # 8 tests  — POST /orders, GET /orders/{orderId}, DELETE /orders/{orderId}/cancel
│   └── payments.spec.ts           # 6 tests  — POST /payments, GET /payments/{paymentId}
└── qa-docs/
    ├── test-strategy.md           # Objectives, scope, testing types, risks
    ├── test-plan.md               # Features, approach, schedule, entry/exit criteria
    ├── test-cases.md              # All 33 test cases with steps & expected results
    ├── traceability-matrix.md     # Requirement ↔ test case mapping & coverage %
    └── execution-report.md        # Run results, defect log, sign-off
```

**Total: 33 test cases | 11 endpoints | 5 modules**

## Prerequisites

1. Node.js 18+
2. ShopEasy API server running on `http://localhost:3000`
   - Swagger UI available at `http://localhost:8080/`

## Setup

```bash
npm install
```

## Running Tests

| Command | Description |
|---------|-------------|
| `npm test` | Run all 33 tests |
| `npm run test:auth` | Auth tests only |
| `npm run test:products` | Products tests only |
| `npm run test:cart` | Cart tests only |
| `npm run test:orders` | Orders tests only |
| `npm run test:payments` | Payments tests only |
| `npm run report` | Open the last HTML report |

## API Coverage

| Module | Endpoints | Tests | Pass Rate |
|--------|-----------|-------|-----------|
| Auth | POST /auth/login, POST /auth/register | 6 | 100% |
| Products | GET /products, GET /products/{id} | 5 | 100% |
| Cart | POST /cart/items, GET /cart, DELETE /cart/items/{itemId} | 8 | 100% |
| Orders | POST /orders, GET /orders/{orderId}, DELETE /orders/{orderId}/cancel | 8 | 100% |
| Payments | POST /payments, GET /payments/{paymentId} | 6 | 100% |
| **Total** | **11 endpoints** | **33** | **100%** |

## Test Cases Summary

### Auth (6 tests)
| ID | Scenario | Expected |
|----|----------|----------|
| TC-AUTH-01 | Login with valid credentials | 200 + token |
| TC-AUTH-02 | Login with invalid password | 401 |
| TC-AUTH-03 | Login with missing fields | 400 |
| TC-AUTH-04 | Register a new user | 201 + userId |
| TC-AUTH-05 | Register with duplicate email | 409 |
| TC-AUTH-06 | Register with missing fields | 400 |

### Products (5 tests)
| ID | Scenario | Expected |
|----|----------|----------|
| TC-PROD-01 | List all products | 200 + paginated data |
| TC-PROD-02 | Filter products by category | 200 + matching results |
| TC-PROD-03 | Pagination with page & limit params | 200 + correct page/limit |
| TC-PROD-04 | Get product by valid ID | 200 + product schema |
| TC-PROD-05 | Get product by non-existent ID | 404 |

### Cart (8 tests)
| ID | Scenario | Expected |
|----|----------|----------|
| TC-CART-01 | Add item with valid auth | 201 |
| TC-CART-02 | Add item without auth | 401 |
| TC-CART-03 | Add item with missing fields | 400 |
| TC-CART-04 | Add non-existent product | 404 |
| TC-CART-05 | View cart with valid auth | 200 + cart contents |
| TC-CART-06 | View cart without auth | 401 |
| TC-CART-07 | Remove existing item from cart | 200 |
| TC-CART-08 | Remove item not in cart | 404 |

### Orders (8 tests)
| ID | Scenario | Expected |
|----|----------|----------|
| TC-ORD-01 | Place order from non-empty cart | 201 + orderId |
| TC-ORD-02 | Place order with empty cart | 400 |
| TC-ORD-03 | Place order without auth | 401 |
| TC-ORD-04 | Get own order details | 200 + order schema |
| TC-ORD-05 | Get order with non-existent ID | 404 |
| TC-ORD-06 | Get order without auth | 401 |
| TC-ORD-07 | Cancel a pending order | 200 + status: cancelled |
| TC-ORD-08 | Cancel a non-existent order | 404 |

### Payments (6 tests)
| ID | Scenario | Expected |
|----|----------|----------|
| TC-PAY-01 | Initiate payment for pending order | 201 + paymentId |
| TC-PAY-02 | Initiate payment with missing fields | 400 |
| TC-PAY-03 | Initiate payment for non-existent order | 404 |
| TC-PAY-04 | Initiate payment on already-paid order | 409 |
| TC-PAY-05 | Get payment status for valid paymentId | 200 + full schema |
| TC-PAY-06 | Get payment status for non-existent ID | 404 |

## QA Documentation

Detailed QA artefacts are in the [`qa-docs/`](qa-docs/) folder:

| Document | Description |
|----------|-------------|
| [test-strategy.md](qa-docs/test-strategy.md) | Testing objectives, scope, approach, tools, and risk management |
| [test-plan.md](qa-docs/test-plan.md) | Features to test, test design techniques, schedule, entry/exit criteria |
| [test-cases.md](qa-docs/test-cases.md) | All 33 test cases with preconditions, steps, test data, and expected results |
| [traceability-matrix.md](qa-docs/traceability-matrix.md) | Requirement ↔ test case mapping, 97% requirement coverage, gap analysis |
| [execution-report.md](qa-docs/execution-report.md) | Final run results — 33/33 passed, defect log, sign-off table |

## Notes

- Tests that mutate shared state (cart, orders, payments) register a **fresh user** per test to ensure isolation.
- The default admin credentials used for read-only tests are `admin@shopeasy.com` / `password123`.
- Generated output (`node_modules/`, `playwright-report/`, `test-results/`) is excluded via `.gitignore`.
