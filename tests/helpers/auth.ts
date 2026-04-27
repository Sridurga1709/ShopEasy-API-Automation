import { APIRequestContext } from '@playwright/test';

export const ADMIN_EMAIL = 'admin@shopeasy.com';
export const ADMIN_PASSWORD = 'password123';
export const BASE_URL = 'http://localhost:3000';

/**
 * Login with admin credentials and return the bearer token.
 */
export async function getAdminToken(request: APIRequestContext): Promise<string> {
  const response = await request.post(`${BASE_URL}/auth/login`, {
    data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
  });
  const body = await response.json();
  return body.token as string;
}

/**
 * Return authorization headers for authenticated requests.
 */
export function authHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}
