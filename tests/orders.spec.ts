import { test, expect } from '@playwright/test';
import { BASE_URL, getAdminToken, authHeaders } from './helpers/auth';

async function addItemAndPlaceOrder(request: any, token: string): Promise<string> {
  await request.post(`${BASE_URL}/cart/items`, {
    headers: authHeaders(token),
    data: { productId: 1, quantity: 1 },
  });
  const orderResp = await request.post(`${BASE_URL}/orders`, {
    headers: authHeaders(token),
  });
  const body = await orderResp.json();
  return body.orderId as string;
}

// ─── POST /orders ──────────────────────────────────────────────────────────────

test.describe('POST /orders', () => {
  test('TC-ORD-01: Place order from non-empty cart returns 201 with orderId', async ({ request }) => {
    const token = await getAdminToken(request);
    await request.post(`${BASE_URL}/cart/items`, {
      headers: authHeaders(token),
      data: { productId: 1, quantity: 1 },
    });

    const response = await request.post(`${BASE_URL}/orders`, {
      headers: authHeaders(token),
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty('orderId');
    expect(body).toHaveProperty('total');
    expect(body).toHaveProperty('status');
    expect(body).toHaveProperty('message');
  });

  test('TC-ORD-02: Place order with empty cart returns 400', async ({ request }) => {
    // Register a fresh user so the cart is definitely empty
    const uniqueEmail = `emptyuser_${Date.now()}@example.com`;
    await request.post(`${BASE_URL}/auth/register`, {
      data: { email: uniqueEmail, password: 'pass1234', name: 'Empty User' },
    });
    const loginResp = await request.post(`${BASE_URL}/auth/login`, {
      data: { email: uniqueEmail, password: 'pass1234' },
    });
    const { token } = await loginResp.json();

    const response = await request.post(`${BASE_URL}/orders`, {
      headers: authHeaders(token),
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('TC-ORD-03: Place order without auth returns 401', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/orders`);

    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });
});

// ─── GET /orders/{orderId} ─────────────────────────────────────────────────────

test.describe('GET /orders/{orderId}', () => {
  test('TC-ORD-04: Get own order details returns 200 with order schema', async ({ request }) => {
    const token = await getAdminToken(request);
    const orderId = await addItemAndPlaceOrder(request, token);

    const response = await request.get(`${BASE_URL}/orders/${orderId}`, {
      headers: authHeaders(token),
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('orderId');
    expect(body).toHaveProperty('status');
    expect(body).toHaveProperty('total');
    expect(body).toHaveProperty('items');
  });

  test('TC-ORD-05: Get order with non-existent orderId returns 404', async ({ request }) => {
    const token = await getAdminToken(request);

    const response = await request.get(`${BASE_URL}/orders/ORD-000000`, {
      headers: authHeaders(token),
    });

    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('TC-ORD-06: Get order without auth returns 401', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/orders/ORD-1001`);

    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });
});

// ─── DELETE /orders/{orderId}/cancel ──────────────────────────────────────────

test.describe('DELETE /orders/{orderId}/cancel', () => {
  test('TC-ORD-07: Cancel a pending order returns 200', async ({ request }) => {
    const token = await getAdminToken(request);
    const orderId = await addItemAndPlaceOrder(request, token);

    const response = await request.delete(`${BASE_URL}/orders/${orderId}/cancel`, {
      headers: authHeaders(token),
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('orderId');
    expect(body).toHaveProperty('status');
    expect(body.status).toBe('cancelled');
    expect(body).toHaveProperty('message');
  });

  test('TC-ORD-08: Cancel a non-existent order returns 404', async ({ request }) => {
    const token = await getAdminToken(request);

    const response = await request.delete(`${BASE_URL}/orders/ORD-000000/cancel`, {
      headers: authHeaders(token),
    });

    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });
});
