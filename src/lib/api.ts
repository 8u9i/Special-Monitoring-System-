const API_BASE = "/api";

/**
 * Fetch helper
 */
export async function api<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });
  if (!res.ok) {
    const text = await res.text();
    let message: string;
    try {
      const json = JSON.parse(text);
      message = json.error || text;
    } catch {
      message = text || `${method} ${path} failed (${res.status})`;
    }
    throw new Error(message);
  }
  return res.json();
}
