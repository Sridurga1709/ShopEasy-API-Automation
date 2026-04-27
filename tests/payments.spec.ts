import { test, expect } from '@playwright/test';
import { BASE_URL, getAdminToken, authHeaders } from './helpers/auth';

async function createPaidOrder(request: any, token: string): Promise<{ orderId: string; paymentId: string }> {
  await request.post(`${BASE_URL}/cart/items`, {
    headers: authHeaders(token),
    data: { productId: 1, quantity: 1 },
  });
  const orderResp = await request.post(`${BASE_URL}/orders`, {
    headers: authHeaders(token),
  });
  const { orderId } = await orderResp.json();

  const payResp = await request.post(`${BASE_URL}/payments`, {
    headers: authHeaders(token),
    data: { orderId, method: 'credit_card' },
  });
  const payBody = await payResp.json();
  return { orderId, paymentId: payBody.paymentId as string };
}

// ─── POST /payments ────────────────────────────────────────────────────────────

async function freshUserToken(request: any): Promise<string> {
  const email = `payuser_${Date.now()}@example.com`;
  await request.post(`${BASE_URL}/auth/register`, {
    data: { email, password: 'pass1234', name: 'Pay User' },
  });
  const loginResp = await request.post(`${BASE_URL}/auth/login`, {
    data: { email, password: 'pass1234' },
  });
  const { token } = await loginResp.json();
  return token as string;
}

test.describe('POST /payments', () => {
  test('TC-PAY-01: Initiate payment for a valid pending order returns 201', async ({ request }) => {
    const token = await freshUserToken(request);

    await request.post(`${BASE_URL}/cart/items`, {
      headers: authHeaders(token),
      data: { productId: 1, quantity: 1 },
    });
    const orderResp = await request.post(`${BASE_URL}/orders`, {
      headers: authHeaders(token),
    });
    const orderBody = await orderResp.json();
    expect(orderResp.status()).toBe(201);
    const orderId = orderBody.orderId;

    const response = await request.post(`${BASE_URL}/payments`, {
      headers: authHeaders(token),
      data: { orderId, method: 'credit_card' },
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty('paymentId');
    expect(body).toHaveProperty('status');
    expect(body).toHaveProperty('amount');
    expect(body).toHaveProperty('message');
  });

  test('TC-PAY-02: Initiate payment with missing required fields returns 400', async ({ request }) => {
    const token = await getAdminToken(request);

    const response = await request.post(`${BASE_URL}/payments`, {
      headers: authHeaders(token),
      data: { method: 'credit_card' }, // missing orderId
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('TC-PAY-03: Initiate payment for non-existent order returns 404', async ({ request }) => {
    const token = await getAdminToken(request);

    const response = await request.post(`${BASE_URL}/payments`, {
      headers: authHeaders(token),
      data: { orderId: 'ORD-000000', method: 'upi' },
    });

    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('TC-PAY-04: Initiate payment on already-paid order returns 409', async ({ request }) => {
    const token = await getAdminToken(request);
    const { orderId } = await createPaidOrder(request, token);

    // Attempt to pay again
    const response = await request.post(`${BASE_URL}/payments`, {
      headers: authHeaders(token),
      data: { orderId, method: 'upi' },
    });

    expect(response.status()).toBe(409);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });
});

// ─── GET /payments/{paymentId} ─────────────────────────────────────────────────

test.describe('GET /payments/{paymentId}', () => {
  test('TC-PAY-05: Get payment status for valid paymentId returns 200', async ({ request }) => {
    const token = await getAdminToken(request);
    const { paymentId } = await createPaidOrder(request, token);

    const response = await request.get(`${BASE_URL}/payments/${paymentId}`, {
      headers: authHeaders(token),
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('paymentId');
    expect(body).toHaveProperty('orderId');
    expect(body).toHaveProperty('method');
    expect(body).toHaveProperty('amount');
    expect(body).toHaveProperty('status');
    expect(body).toHaveProperty('processedAt');
  });

  test('TC-PAY-06: Get payment status for non-existent paymentId returns 404', async ({ request }) => {
    const token = await getAdminToken(request);

    const response = await request.get(`${BASE_URL}/payments/PAY-000000`, {
      headers: authHeaders(token),
    });

    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });
});
