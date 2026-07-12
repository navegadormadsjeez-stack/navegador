const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export async function fetchApi<T>(path: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
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

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  proUsers: number;
  aiRequestsToday: number;
}

export interface AiStats {
  total: number;
  last24h: number;
  byType: Array<{ type: string; _count: number }>;
}
