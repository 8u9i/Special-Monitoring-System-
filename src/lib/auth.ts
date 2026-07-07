const SESSION_TTL = 7 * 24 * 60 * 60 * 1000;

function generateToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 64; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
}

interface SessionData {
  payload: string;
  sig: string;
}

async function createSignedToken(payload: string): Promise<SessionData> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(process.env.COOKIE_SECRET || "dev-secret-change-in-prod"),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return {
    payload: btoa(payload),
    sig: btoa(String.fromCharCode(...new Uint8Array(sig))),
  };
}

async function verifyToken({ payload, sig }: SessionData): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(process.env.COOKIE_SECRET || "dev-secret-change-in-prod"),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
  const sigBytes = Uint8Array.from(atob(sig), (c) => c.charCodeAt(0));
  return crypto.subtle.verify("HMAC", key, sigBytes, encoder.encode(atob(payload)));
}

export function createSession(): string {
  return [generateToken(), Date.now() + SESSION_TTL, process.env.COOKIE_SECRET ? "1" : "0"].join(".");
}

export function validateSession(token: string): boolean {
  try {
    const [t, expStr] = token.split(".");
    if (!t || !expStr) return false;
    const exp = parseInt(expStr, 10);
    return exp > Date.now();
  } catch {
    return false;
  }
}

export function getSessionCookie(token: string): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `__session=${token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${SESSION_TTL / 1000}${secure}`;
}
