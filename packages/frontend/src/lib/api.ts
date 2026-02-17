/**
 * API client base. Uses VITE_API_BASE_URL for backend.
 */

const getBaseUrl = (): string => {
  const url = import.meta.env.VITE_API_BASE_URL;
  if (url) return url.replace(/\/$/, '');
  // Dev default when not set
  return 'http://localhost:3000';
};

export const apiBaseUrl = getBaseUrl();

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

export async function apiGet<T>(path: string): Promise<T> {
  const url = `${apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message ?? body.error ?? `HTTP ${res.status}`);
  }
  const json = (await res.json()) as ApiResponse<T>;
  if (json.success === false) {
    throw new Error(json.message ?? json.error ?? 'Request failed');
  }
  return json.data as T;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const url = `${apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });
  const json = (await res.json().catch(() => ({}))) as ApiResponse<T> & { message?: string };
  if (!res.ok) {
    throw new Error(json.message ?? json.error ?? `HTTP ${res.status}`);
  }
  if (json.success === false) {
    throw new Error(json.message ?? json.error ?? 'Request failed');
  }
  return json.data as T;
}
