# Test Cases — ShopEasy Order Management API

> **Total: 33 test cases** across 5 modules.
> Format: ID | Title | Preconditions | Steps | Test Data | Expected Result

---

## Module: Auth

### TC-AUTH-01 — Login with valid credentials

| Field | Detail |
|-------|--------|
| **Endpoint** | POST /auth/login |
| **Type** | Positive / Functional |
| **Preconditions** | Admin account exists |
| **Steps** | 1. Send POST /auth/login with valid email and password |
| **Test Data** | `email: admin@shopeasy.com`, `password: password123` |
| **Expected Status** | 200 |
| **Expected Body** | `token` (non-empty string), `userId` (integer), `message` |

---

### TC-AUTH-02 — Login with invalid password

| Field | Detail |
|-------|--------|
| **Endpoint** | POST /auth/login |
| **Type** | Negative |
| **Preconditions** | Admin account exists |
| **Steps** | 1. Send POST /auth/login with correct email but wrong password |
| **Test Data** | `email: admin@shopeasy.com`, `password: wrongpassword` |
| **Expected Status** | 401 |
| **Expected Body** | `error` field present |

---

### TC-AUTH-03 — Login with missing fields

| Field | Detail |
|-------|--------|
| **Endpoint** | POST /auth/login |
| **Type** | Negative |
| **Preconditions** | None |
| **Steps** | 1. Send POST /auth/login with only email, omit password |
| **Test Data** | `email: admin@shopeasy.com` |
| **Expected Status** | 400 |
| **Expected Body** | `error` field present |

---

### TC-AUTH-04 — Register a new user

| Field | Detail |
|-------|--------|
| **Endpoint** | POST /auth/register |
| **Type** | Positive / Functional |
| **Preconditions** | Email does not already exist |
| **Steps** | 1. Generate unique email. 2. Send POST /auth/register with email, password, name |
| **Test Data** | `email: testuser_<timestamp>@example.com`, `password: securepass123`, `name: Test User` |
| **Expected Status** | 201 |
| **Expected Body** | `userId` (integer), `message` |

---

### TC-AUTH-05 — Register with duplicate email

| Field | Detail |
|-------|--------|
| **Endpoint** | POST /auth/register |
| **Type** | Negative |
| **Preconditions** | Admin account exists |
| **Steps** | 1. Send POST /auth/register using the already-registered admin email |
| **Test Data** | `email: admin@shopeasy.com`, `password: somepassword`, `name: Duplicate User` |
| **Expected Status** | 409 |
| **Expected Body** | `error` field present |

---

### TC-AUTH-06 — Register with missing required fields

| Field | Detail |
|-------|--------|
| **Endpoint** | POST /auth/register |
| **Type** | Negative |
| **Preconditions** | None |
| **Steps** | 1. Send POST /auth/register with only email, omit password and name |
| **Test Data** | `email: nopwd@example.com` |
| **Expected Status** | 400 |
| **Expected Body** | `error` field present |

---

## Module: Products

### TC-PROD-01 — List all products

| Field | Detail |
|-------|--------|
| **Endpoint** | GET /products |
| **Type** | Positive / Functional |
| **Preconditions** | None (public endpoint) |
| **Steps** | 1. Send GET /products with no query parameters |
| **Test Data** | None |
| **Expected Status** | 200 |
| **Expected Body** | `total`, `page`, `limit`, `data` (array) |

---

### TC-PROD-02 — Filter products by category

| Field | Detail |
|-------|--------|
| **Endpoint** | GET /products |
| **Type** | Positive / Functional |
| **Preconditions** | Products with category `electronics` exist |
| **Steps** | 1. Send GET /products?category=electronics |
| **Test Data** | `category=electronics` |
| **Expected Status** | 200 |
| **Expected Body** | All items in `data` array have `category: electronics` |

---

### TC-PROD-03 — List products with pagination

| Field | Detail |
|-------|--------|
| **Endpoint** | GET /products |
| **Type** | Positive / Functional |
| **Preconditions** | None |
| **Steps** | 1. Send GET /products?page=1&limit=2 |
| **Test Data** | `page=1`, `limit=2` |
| **Expected Status** | 200 |
| **Expected Body** | `page: 1`, `limit: 2`, `data.length ≤ 2` |

---

### TC-PROD-04 — Get product by valid ID

| Field | Detail |
|-------|--------|
| **Endpoint** | GET /products/{id} |
| **Type** | Positive / Functional |
| **Preconditions** | Product with ID 1 exists |
| **Steps** | 1. Send GET /products/1 |
| **Test Data** | `id: 1` |
| **Expected Status** | 200 |
| **Expected Body** | `id`, `name`, `price`, `category`, `stock` |

---

### TC-PROD-05 — Get product by non-existent ID

| Field | Detail |
|-------|--------|
| **Endpoint** | GET /products/{id} |
| **Type** | Negative |
| **Preconditions** | Product with ID 999999 does not exist |
| **Steps** | 1. Send GET /products/999999 |
| **Test Data** | `id: 999999` |
| **Expected Status** | 404 |
| **Expected Body** | `error` field present |

---

## Module: Cart

### TC-CART-01 — Add item to cart with valid auth

| Field | Detail |
|-------|--------|
| **Endpoint** | POST /cart/items |
| **Type** | Positive / Functional |
| **Preconditions** | Admin logged in; product 1 exists |
| **Steps** | 1. Login as admin. 2. Send POST /cart/items with Bearer token |
| **Test Data** | `productId: 1`, `quantity: 2` |
| **Expected Status** | 201 |
| **Expected Body** | `message`, `cartTotal` |

---

### TC-CART-02 — Add item to cart without auth

| Field | Detail |
|-------|--------|
| **Endpoint** | POST /cart/items |
| **Type** | Negative / Auth |
| **Preconditions** | None |
| **Steps** | 1. Send POST /cart/items without Authorization header |
| **Test Data** | `productId: 1`, `quantity: 1` |
| **Expected Status** | 401 |
| **Expected Body** | `error` field present |

---

### TC-CART-03 — Add item to cart with missing fields

| Field | Detail |
|-------|--------|
| **Endpoint** | POST /cart/items |
| **Type** | Negative |
| **Preconditions** | Admin logged in |
| **Steps** | 1. Login as admin. 2. Send POST /cart/items with only productId, omit quantity |
| **Test Data** | `productId: 1` |
| **Expected Status** | 400 |
| **Expected Body** | `error` field present |

---

### TC-CART-04 — Add non-existent product to cart

| Field | Detail |
|-------|--------|
| **Endpoint** | POST /cart/items |
| **Type** | Negative |
| **Preconditions** | Admin logged in; product 999999 does not exist |
| **Steps** | 1. Login as admin. 2. Send POST /cart/items with non-existent productId |
| **Test Data** | `productId: 999999`, `quantity: 1` |
| **Expected Status** | 404 |
| **Expected Body** | `error` field present |

---

### TC-CART-05 — View cart with valid auth

| Field | Detail |
|-------|--------|
| **Endpoint** | GET /cart |
| **Type** | Positive / Functional |
| **Preconditions** | Admin logged in |
| **Steps** | 1. Login as admin. 2. Send GET /cart with Bearer token |
| **Test Data** | None |
| **Expected Status** | 200 |
| **Expected Body** | `items` (array), `subtotal`, `itemCount` |

---

### TC-CART-06 — View cart without auth

| Field | Detail |
|-------|--------|
| **Endpoint** | GET /cart |
| **Type** | Negative / Auth |
| **Preconditions** | None |
| **Steps** | 1. Send GET /cart without Authorization header |
| **Test Data** | None |
| **Expected Status** | 401 |
| **Expected Body** | `error` field present |

---

### TC-CART-07 — Remove existing item from cart

| Field | Detail |
|-------|--------|
| **Endpoint** | DELETE /cart/items/{itemId} |
| **Type** | Positive / Functional |
| **Preconditions** | Fresh user registered; product 1 added to their cart |
| **Steps** | 1. Register fresh user. 2. Login. 3. POST /cart/items (productId: 1). 4. DELETE /cart/items/1 |
| **Test Data** | `itemId: 1` (productId) |
| **Expected Status** | 200 |
| **Expected Body** | `message`, `cartTotal` |

---

### TC-CART-08 — Remove item not in cart

| Field | Detail |
|-------|--------|
| **Endpoint** | DELETE /cart/items/{itemId} |
| **Type** | Negative |
| **Preconditions** | Admin logged in; itemId 999999 not in cart |
| **Steps** | 1. Login as admin. 2. DELETE /cart/items/999999 |
| **Test Data** | `itemId: 999999` |
| **Expected Status** | 404 |
| **Expected Body** | `error` field present |

---

## Module: Orders

### TC-ORD-01 — Place order from non-empty cart

| Field | Detail |
|-------|--------|
| **Endpoint** | POST /orders |
| **Type** | Positive / Functional |
| **Preconditions** | Admin logged in; at least 1 item in cart |
| **Steps** | 1. Login. 2. Add product to cart. 3. POST /orders |
| **Test Data** | None |
| **Expected Status** | 201 |
| **Expected Body** | `orderId`, `total`, `status`, `message` |

---

### TC-ORD-02 — Place order with empty cart

| Field | Detail |
|-------|--------|
| **Endpoint** | POST /orders |
| **Type** | Negative |
| **Preconditions** | Fresh user with empty cart |
| **Steps** | 1. Register fresh user. 2. Login. 3. POST /orders immediately |
| **Test Data** | None |
| **Expected Status** | 400 |
| **Expected Body** | `error` field present |

---

### TC-ORD-03 — Place order without auth

| Field | Detail |
|-------|--------|
| **Endpoint** | POST /orders |
| **Type** | Negative / Auth |
| **Preconditions** | None |
| **Steps** | 1. Send POST /orders without Authorization header |
| **Test Data** | None |
| **Expected Status** | 401 |
| **Expected Body** | `error` field present |

---

### TC-ORD-04 — Get own order details

| Field | Detail |
|-------|--------|
| **Endpoint** | GET /orders/{orderId} |
| **Type** | Positive / Functional |
| **Preconditions** | Admin has placed an order |
| **Steps** | 1. Login. 2. Add item + place order. 3. GET /orders/{orderId} |
| **Test Data** | `orderId` returned from POST /orders |
| **Expected Status** | 200 |
| **Expected Body** | `orderId`, `status`, `total`, `items` (array), `createdAt` |

---

### TC-ORD-05 — Get order with non-existent orderId

| Field | Detail |
|-------|--------|
| **Endpoint** | GET /orders/{orderId} |
| **Type** | Negative |
| **Preconditions** | Admin logged in |
| **Steps** | 1. Login. 2. GET /orders/ORD-000000 |
| **Test Data** | `orderId: ORD-000000` |
| **Expected Status** | 404 |
| **Expected Body** | `error` field present |

---

### TC-ORD-06 — Get order without auth

| Field | Detail |
|-------|--------|
| **Endpoint** | GET /orders/{orderId} |
| **Type** | Negative / Auth |
| **Preconditions** | None |
| **Steps** | 1. Send GET /orders/ORD-1001 without Authorization header |
| **Test Data** | `orderId: ORD-1001` |
| **Expected Status** | 401 |
| **Expected Body** | `error` field present |

---

### TC-ORD-07 — Cancel a pending order

| Field | Detail |
|-------|--------|
| **Endpoint** | DELETE /orders/{orderId}/cancel |
| **Type** | Positive / Functional |
| **Preconditions** | Admin has a pending order |
| **Steps** | 1. Login. 2. Add item + place order. 3. DELETE /orders/{orderId}/cancel |
| **Test Data** | `orderId` from POST /orders |
| **Expected Status** | 200 |
| **Expected Body** | `orderId`, `status: cancelled`, `message` |

---

### TC-ORD-08 — Cancel a non-existent order

| Field | Detail |
|-------|--------|
| **Endpoint** | DELETE /orders/{orderId}/cancel |
| **Type** | Negative |
| **Preconditions** | Admin logged in |
| **Steps** | 1. Login. 2. DELETE /orders/ORD-000000/cancel |
| **Test Data** | `orderId: ORD-000000` |
| **Expected Status** | 404 |
| **Expected Body** | `error` field present |

---

## Module: Payments

### TC-PAY-01 — Initiate payment for a pending order

| Field | Detail |
|-------|--------|
| **Endpoint** | POST /payments |
| **Type** | Positive / Functional |
| **Preconditions** | Fresh user has a pending (unpaid) order |
| **Steps** | 1. Register fresh user. 2. Login. 3. Add item. 4. Place order. 5. POST /payments |
| **Test Data** | `orderId` from POST /orders, `method: credit_card` |
| **Expected Status** | 201 |
| **Expected Body** | `paymentId`, `status`, `amount`, `message` |

---

### TC-PAY-02 — Initiate payment with missing fields

| Field | Detail |
|-------|--------|
| **Endpoint** | POST /payments |
| **Type** | Negative |
| **Preconditions** | Admin logged in |
| **Steps** | 1. Login as admin. 2. POST /payments with only method, omit orderId |
| **Test Data** | `method: credit_card` |
| **Expected Status** | 400 |
| **Expected Body** | `error` field present |

---

### TC-PAY-03 — Initiate payment for non-existent order

| Field | Detail |
|-------|--------|
| **Endpoint** | POST /payments |
| **Type** | Negative |
| **Preconditions** | Admin logged in |
| **Steps** | 1. Login as admin. 2. POST /payments with non-existent orderId |
| **Test Data** | `orderId: ORD-000000`, `method: upi` |
| **Expected Status** | 404 |
| **Expected Body** | `error` field present |

---

### TC-PAY-04 — Initiate payment on already-paid order

| Field | Detail |
|-------|--------|
| **Endpoint** | POST /payments |
| **Type** | Negative |
| **Preconditions** | Fresh user has already paid for their order |
| **Steps** | 1. Register fresh user. 2. Full flow to create paid order. 3. POST /payments again for same orderId |
| **Test Data** | Same `orderId`, `method: upi` |
| **Expected Status** | 409 |
| **Expected Body** | `error` field present |

---

### TC-PAY-05 — Get payment status for valid paymentId

| Field | Detail |
|-------|--------|
| **Endpoint** | GET /payments/{paymentId} |
| **Type** | Positive / Functional |
| **Preconditions** | A payment has been successfully initiated |
| **Steps** | 1. Complete full payment flow. 2. GET /payments/{paymentId} |
| **Test Data** | `paymentId` from POST /payments |
| **Expected Status** | 200 |
| **Expected Body** | `paymentId`, `orderId`, `method`, `amount`, `status`, `processedAt` |

---

### TC-PAY-06 — Get payment status for non-existent paymentId

| Field | Detail |
|-------|--------|
| **Endpoint** | GET /payments/{paymentId} |
| **Type** | Negative |
| **Preconditions** | Admin logged in |
| **Steps** | 1. Login as admin. 2. GET /payments/PAY-000000 |
| **Test Data** | `paymentId: PAY-000000` |
| **Expected Status** | 404 |
| **Expected Body** | `error` field present |
