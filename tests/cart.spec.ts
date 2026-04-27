import { test, expect } from '@playwright/test';
import { BASE_URL, getAdminToken, authHeaders } from './helpers/auth';

async function freshUserToken(request: any): Promise<string> {
  const email = `cartuser_${Date.now()}@example.com`;
  await request.post(`${BASE_URL}/auth/register`, {
    data: { email, password: 'pass1234', name: 'Cart User' },
  });
  const loginResp = await request.post(`${BASE_URL}/auth/login`, {
    data: { email, password: 'pass1234' },
  });
  const { token } = await loginResp.json();
  return token as string;
}

// ─── POST /cart/items ──────────────────────────────────────────────────────────

test.describe('POST /cart/items', () => {
  test('TC-CART-01: Add item to cart with valid auth returns 201', async ({ request }) => {
    const token = await getAdminToken(request);

    const response = await request.post(`${BASE_URL}/cart/items`, {
      headers: authHeaders(token),
      data: { productId: 1, quantity: 2 },
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty('message');
    expect(body).toHaveProperty('cartTotal');
  });

  test('TC-CART-02: Add item to cart without auth returns 401', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/cart/items`, {
      data: { productId: 1, quantity: 1 },
    });

    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('TC-CART-03: Add item to cart with missing fields returns 400', async ({ request }) => {
    const token = await getAdminToken(request);

    const response = await request.post(`${BASE_URL}/cart/items`, {
      headers: authHeaders(token),
      data: { productId: 1 },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('TC-CART-04: Add non-existent product to cart returns 404', async ({ request }) => {
    const token = await getAdminToken(request);

    const response = await request.post(`${BASE_URL}/cart/items`, {
      headers: authHeaders(token),
      data: { productId: 999999, quantity: 1 },
    });

    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });
});

// ─── GET /cart ─────────────────────────────────────────────────────────────────

test.describe('GET /cart', () => {
  test('TC-CART-05: View cart with valid auth returns 200 with cart contents', async ({ request }) => {
    const token = await getAdminToken(request);

    const response = await request.get(`${BASE_URL}/cart`, {
      headers: authHeaders(token),
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('items');
    expect(Array.isArray(body.items)).toBe(true);
    expect(body).toHaveProperty('subtotal');
    expect(body).toHaveProperty('itemCount');
  });

  test('TC-CART-06: View cart without auth returns 401', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/cart`);

    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });
});

// ─── DELETE /cart/items/{itemId} ───────────────────────────────────────────────

test.describe('DELETE /cart/items/{itemId}', () => {
  test('TC-CART-07: Remove existing item from cart returns 200', async ({ request }) => {
    const token = await freshUserToken(request);

    // Add item with a fresh user so cart state is guaranteed clean
    const addResp = await request.post(`${BASE_URL}/cart/items`, {
      headers: authHeaders(token),
      data: { productId: 1, quantity: 1 },
    });
    expect(addResp.status()).toBe(201);

    const response = await request.delete(`${BASE_URL}/cart/items/1`, {
      headers: authHeaders(token),
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('message');
    expect(body).toHaveProperty('cartTotal');
  });

  test('TC-CART-08: Remove item not in cart returns 404', async ({ request }) => {
    const token = await getAdminToken(request);

    const response = await request.delete(`${BASE_URL}/cart/items/999999`, {
      headers: authHeaders(token),
    });

    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });
});
