# Requirements Traceability Matrix — ShopEasy Order Management API

> Maps each API requirement (endpoint + scenario from OpenAPI spec) to its corresponding test case(s) and automation file.

---

## Legend

| Column | Description |
|--------|-------------|
| Req ID | Unique requirement identifier derived from endpoint + scenario |
| Requirement | API endpoint and expected behaviour from OpenAPI spec |
| Test Case ID | Corresponding test case |
| Spec File | Playwright spec file containing the automation |
| Status | Pass / Fail / Not Run |

---

## Auth Module

| Req ID | Requirement | Test Case ID | Spec File | Status |
|--------|-------------|--------------|-----------|--------|
| REQ-AUTH-01 | POST /auth/login — 200 with token on valid credentials | TC-AUTH-01 | auth.spec.ts | Pass |
| REQ-AUTH-02 | POST /auth/login — 401 on invalid credentials | TC-AUTH-02 | auth.spec.ts | Pass |
| REQ-AUTH-03 | POST /auth/login — 400 on missing required fields | TC-AUTH-03 | auth.spec.ts | Pass |
| REQ-AUTH-04 | POST /auth/register — 201 with userId on new user | TC-AUTH-04 | auth.spec.ts | Pass |
| REQ-AUTH-05 | POST /auth/register — 409 when email already exists | TC-AUTH-05 | auth.spec.ts | Pass |
| REQ-AUTH-06 | POST /auth/register — 400 on missing required fields | TC-AUTH-06 | auth.spec.ts | Pass |

---

## Products Module

| Req ID | Requirement | Test Case ID | Spec File | Status |
|--------|-------------|--------------|-----------|--------|
| REQ-PROD-01 | GET /products — 200 with paginated product list | TC-PROD-01 | products.spec.ts | Pass |
| REQ-PROD-02 | GET /products?category= — 200 with filtered results | TC-PROD-02 | products.spec.ts | Pass |
| REQ-PROD-03 | GET /products?page=&limit= — 200 respecting pagination | TC-PROD-03 | products.spec.ts | Pass |
| REQ-PROD-04 | GET /products/{id} — 200 with product details for valid ID | TC-PROD-04 | products.spec.ts | Pass |
| REQ-PROD-05 | GET /products/{id} — 404 for non-existent ID | TC-PROD-05 | products.spec.ts | Pass |

---

## Cart Module

| Req ID | Requirement | Test Case ID | Spec File | Status |
|--------|-------------|--------------|-----------|--------|
| REQ-CART-01 | POST /cart/items — 201 when authenticated with valid body | TC-CART-01 | cart.spec.ts | Pass |
| REQ-CART-02 | POST /cart/items — 401 when no auth token provided | TC-CART-02 | cart.spec.ts | Pass |
| REQ-CART-03 | POST /cart/items — 400 on missing required fields | TC-CART-03 | cart.spec.ts | Pass |
| REQ-CART-04 | POST /cart/items — 404 when productId does not exist | TC-CART-04 | cart.spec.ts | Pass |
| REQ-CART-05 | GET /cart — 200 with cart contents when authenticated | TC-CART-05 | cart.spec.ts | Pass |
| REQ-CART-06 | GET /cart — 401 when no auth token provided | TC-CART-06 | cart.spec.ts | Pass |
| REQ-CART-07 | DELETE /cart/items/{itemId} — 200 when item exists in cart | TC-CART-07 | cart.spec.ts | Pass |
| REQ-CART-08 | DELETE /cart/items/{itemId} — 404 when item not in cart | TC-CART-08 | cart.spec.ts | Pass |

---

## Orders Module

| Req ID | Requirement | Test Case ID | Spec File | Status |
|--------|-------------|--------------|-----------|--------|
| REQ-ORD-01 | POST /orders — 201 with orderId when cart is non-empty | TC-ORD-01 | orders.spec.ts | Pass |
| REQ-ORD-02 | POST /orders — 400 when cart is empty | TC-ORD-02 | orders.spec.ts | Pass |
| REQ-ORD-03 | POST /orders — 401 when no auth token provided | TC-ORD-03 | orders.spec.ts | Pass |
| REQ-ORD-04 | GET /orders/{orderId} — 200 with order details for own order | TC-ORD-04 | orders.spec.ts | Pass |
| REQ-ORD-05 | GET /orders/{orderId} — 404 for non-existent orderId | TC-ORD-05 | orders.spec.ts | Pass |
| REQ-ORD-06 | GET /orders/{orderId} — 401 when no auth token provided | TC-ORD-06 | orders.spec.ts | Pass |
| REQ-ORD-07 | DELETE /orders/{orderId}/cancel — 200 for pending order | TC-ORD-07 | orders.spec.ts | Pass |
| REQ-ORD-08 | DELETE /orders/{orderId}/cancel — 404 for non-existent orderId | TC-ORD-08 | orders.spec.ts | Pass |

> Note: REQ-ORD-09 (422 for cancelling shipped/delivered order) is not yet covered — a test case should be added once test data for shipped orders is available.

---

## Payments Module

| Req ID | Requirement | Test Case ID | Spec File | Status |
|--------|-------------|--------------|-----------|--------|
| REQ-PAY-01 | POST /payments — 201 with paymentId for a pending order | TC-PAY-01 | payments.spec.ts | Pass |
| REQ-PAY-02 | POST /payments — 400 on missing required fields | TC-PAY-02 | payments.spec.ts | Pass |
| REQ-PAY-03 | POST /payments — 404 when orderId does not exist | TC-PAY-03 | payments.spec.ts | Pass |
| REQ-PAY-04 | POST /payments — 409 when payment already processed | TC-PAY-04 | payments.spec.ts | Pass |
| REQ-PAY-05 | GET /payments/{paymentId} — 200 with full payment details | TC-PAY-05 | payments.spec.ts | Pass |
| REQ-PAY-06 | GET /payments/{paymentId} — 404 for non-existent paymentId | TC-PAY-06 | payments.spec.ts | Pass |

---

## Coverage Summary

| Module | Total Requirements | Covered | Not Covered | Coverage % |
|--------|--------------------|---------|-------------|------------|
| Auth | 6 | 6 | 0 | 100% |
| Products | 5 | 5 | 0 | 100% |
| Cart | 8 | 8 | 0 | 100% |
| Orders | 9 | 8 | 1 (422 cancel shipped) | 89% |
| Payments | 6 | 6 | 0 | 100% |
| **Total** | **34** | **33** | **1** | **97%** |

---

## Gap Analysis

| Gap ID | Missing Coverage | Recommended Action |
|--------|------------------|--------------------|
| GAP-01 | DELETE /orders/{orderId}/cancel — 422 for shipped/delivered order | Add TC-ORD-09 once API supports seeding shipped orders |
| GAP-02 | GET /orders/{orderId} — 403 Forbidden (accessing another user's order) | Add TC-ORD-10 using two separate user accounts |
