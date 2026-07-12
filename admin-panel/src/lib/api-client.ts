'use client';

import { getToken } from './auth';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://navegador-production.up.railway.app/api/v1';

export async function fetchApiClient<T>(
  path: string,
  options?: RequestInit,
): Promise<T | null> {
  const token = getToken();
  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function loginAdmin(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) return null;
  return res.json() as Promise<{
    accessToken: string;
    refreshToken: string;
    user: { id: string; email: string };
  }>;
}

export { API_URL };
