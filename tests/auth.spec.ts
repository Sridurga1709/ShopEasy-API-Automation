import { test, expect } from '@playwright/test';
import { ADMIN_EMAIL, ADMIN_PASSWORD, BASE_URL } from './helpers/auth';

// ─── POST /auth/login ──────────────────────────────────────────────────────────

test.describe('POST /auth/login', () => {
  test('TC-AUTH-01: Login with valid credentials returns 200 and token', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/auth/login`, {
      data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('token');
    expect(typeof body.token).toBe('string');
    expect(body.token.length).toBeGreaterThan(0);
    expect(body).toHaveProperty('userId');
  });

  test('TC-AUTH-02: Login with invalid password returns 401', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/auth/login`, {
      data: { email: ADMIN_EMAIL, password: 'wrongpassword' },
    });

    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('TC-AUTH-03: Login with missing fields returns 400', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/auth/login`, {
      data: { email: ADMIN_EMAIL },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });
});

// ─── POST /auth/register ───────────────────────────────────────────────────────

test.describe('POST /auth/register', () => {
  test('TC-AUTH-04: Register a new user returns 201 with userId', async ({ request }) => {
    const uniqueEmail = `testuser_${Date.now()}@example.com`;

    const response = await request.post(`${BASE_URL}/auth/register`, {
      data: { email: uniqueEmail, password: 'securepass123', name: 'Test User' },
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty('userId');
    expect(body).toHaveProperty('message');
  });

  test('TC-AUTH-05: Register with an already-existing email returns 409', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/auth/register`, {
      data: { email: ADMIN_EMAIL, password: 'somepassword', name: 'Duplicate User' },
    });

    expect(response.status()).toBe(409);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });

  test('TC-AUTH-06: Register with missing required fields returns 400', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/auth/register`, {
      data: { email: 'nopwd@example.com' },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });
});
