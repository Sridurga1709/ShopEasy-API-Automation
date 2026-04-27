# Test Execution Report — ShopEasy Order Management API

## Run Summary

| Field | Value |
|-------|-------|
| **Date** | 27 April 2026 |
| **Environment** | Local — `http://localhost:3000` |
| **Executed By** | QA Automation |
| **Tool** | Playwright Test v1.44.0 |
| **Command** | `npm test` |
| **Total Tests** | 33 |
| **Passed** | 33 |
| **Failed** | 0 |
| **Skipped** | 0 |
| **Duration** | ~1.9s |
| **Exit Code** | 0 |
| **Overall Result** | ✅ PASS |

---

## Results by Module

| Module | Spec File | Tests | Passed | Failed | Duration |
|--------|-----------|-------|--------|--------|----------|
| Auth | auth.spec.ts | 6 | 6 | 0 | ~300ms |
| Products | products.spec.ts | 5 | 5 | 0 | ~150ms |
| Cart | cart.spec.ts | 8 | 8 | 0 | ~843ms |
| Orders | orders.spec.ts | 8 | 8 | 0 | ~500ms |
| Payments | payments.spec.ts | 6 | 6 | 0 | ~886ms |
| **Total** | | **33** | **33** | **0** | **~1.9s** |

---

## Detailed Results

### Auth (6/6 Passed)

| Test Case ID | Title | Status | Notes |
|--------------|-------|--------|-------|
| TC-AUTH-01 | Login with valid credentials | ✅ Pass | |
| TC-AUTH-02 | Login with invalid password | ✅ Pass | |
| TC-AUTH-03 | Login with missing fields | ✅ Pass | |
| TC-AUTH-04 | Register a new user | ✅ Pass | Unique email generated per run |
| TC-AUTH-05 | Register with duplicate email | ✅ Pass | |
| TC-AUTH-06 | Register with missing fields | ✅ Pass | |

### Products (5/5 Passed)

| Test Case ID | Title | Status | Notes |
|--------------|-------|--------|-------|
| TC-PROD-01 | List all products | ✅ Pass | |
| TC-PROD-02 | Filter products by category | ✅ Pass | |
| TC-PROD-03 | Pagination with page & limit | ✅ Pass | |
| TC-PROD-04 | Get product by valid ID | ✅ Pass | |
| TC-PROD-05 | Get product by non-existent ID | ✅ Pass | |

### Cart (8/8 Passed)

| Test Case ID | Title | Status | Notes |
|--------------|-------|--------|-------|
| TC-CART-01 | Add item with valid auth | ✅ Pass | |
| TC-CART-02 | Add item without auth | ✅ Pass | |
| TC-CART-03 | Add item with missing fields | ✅ Pass | |
| TC-CART-04 | Add non-existent product | ✅ Pass | |
| TC-CART-05 | View cart with valid auth | ✅ Pass | |
| TC-CART-06 | View cart without auth | ✅ Pass | |
| TC-CART-07 | Remove existing item from cart | ✅ Pass | Fixed: uses fresh isolated user to avoid admin cart state pollution |
| TC-CART-08 | Remove item not in cart | ✅ Pass | |

### Orders (8/8 Passed)

| Test Case ID | Title | Status | Notes |
|--------------|-------|--------|-------|
| TC-ORD-01 | Place order from non-empty cart | ✅ Pass | |
| TC-ORD-02 | Place order with empty cart | ✅ Pass | Uses fresh user to guarantee empty cart |
| TC-ORD-03 | Place order without auth | ✅ Pass | |
| TC-ORD-04 | Get own order details | ✅ Pass | |
| TC-ORD-05 | Get order with non-existent ID | ✅ Pass | |
| TC-ORD-06 | Get order without auth | ✅ Pass | |
| TC-ORD-07 | Cancel a pending order | ✅ Pass | |
| TC-ORD-08 | Cancel a non-existent order | ✅ Pass | |

### Payments (6/6 Passed)

| Test Case ID | Title | Status | Notes |
|--------------|-------|--------|-------|
| TC-PAY-01 | Initiate payment for pending order | ✅ Pass | Fixed: uses fresh isolated user to avoid state conflict |
| TC-PAY-02 | Initiate payment with missing fields | ✅ Pass | |
| TC-PAY-03 | Initiate payment for non-existent order | ✅ Pass | |
| TC-PAY-04 | Initiate payment on already-paid order | ✅ Pass | |
| TC-PAY-05 | Get payment status for valid paymentId | ✅ Pass | |
| TC-PAY-06 | Get payment status for non-existent paymentId | ✅ Pass | |

---

## Defect Log

| Defect ID | Test Case | Description | Root Cause | Status |
|-----------|-----------|-------------|------------|--------|
| DEF-001 | TC-PAY-01 | POST /payments returned 400 instead of 201 | `orderId` was `undefined` because admin's cart was already empty — a prior orders test consumed it; shared state pollution | **Fixed** — fresh user isolation applied |
| DEF-002 | TC-CART-07 | DELETE /cart/items/1 returned 404 instead of 200 | Admin already had productId:1 in cart from TC-CART-01; re-adding was rejected, leaving cart empty | **Fixed** — fresh user isolation applied |

---

## Test Coverage

| Metric | Value |
|--------|-------|
| Endpoints covered | 11 / 11 |
| Positive scenarios | 14 |
| Negative / error scenarios | 19 |
| Auth boundary tests | 7 |
| Requirement coverage | 97% (33/34 requirements) |

---

## Known Gaps

| Gap | Detail |
|-----|--------|
| 422 — Cancel shipped/delivered order | Not testable without a way to seed a shipped order. Deferred. |
| 403 — Access another user's order | Requires two-user setup. Recommended for next iteration. |

---

## Sign-Off

| Role | Name | Date | Decision |
|------|------|------|----------|
| QA Engineer | | 27 April 2026 | ✅ Pass — all 33 tests green |
| QA Lead | | | Pending review |
