import { test, expect } from '@playwright/test';
import { BASE_URL } from './helpers/auth';

// ─── GET /products ─────────────────────────────────────────────────────────────

test.describe('GET /products', () => {
  test('TC-PROD-01: List all products returns 200 with paginated data', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/products`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('total');
    expect(body).toHaveProperty('page');
    expect(body).toHaveProperty('limit');
    expect(body).toHaveProperty('data');
    expect(Array.isArray(body.data)).toBe(true);
  });

  test('TC-PROD-02: List products filtered by category returns matching results', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/products?category=electronics`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
    for (const product of body.data) {
      expect(product.category).toBe('electronics');
    }
  });

  test('TC-PROD-03: List products with pagination parameters returns correct page/limit', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/products?page=1&limit=2`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.page).toBe(1);
    expect(body.limit).toBe(2);
    expect(body.data.length).toBeLessThanOrEqual(2);
  });
});

// ─── GET /products/{id} ────────────────────────────────────────────────────────

test.describe('GET /products/{id}', () => {
  test('TC-PROD-04: Get product by valid ID returns 200 with product details', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/products/1`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('name');
    expect(body).toHaveProperty('price');
    expect(body).toHaveProperty('category');
    expect(body).toHaveProperty('stock');
  });

  test('TC-PROD-05: Get product by non-existent ID returns 404', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/products/999999`);

    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body).toHaveProperty('error');
  });
});
