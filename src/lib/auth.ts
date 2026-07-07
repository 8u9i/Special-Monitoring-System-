import type { NextRequest } from "next/server";

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

function getSecret(): string {
  return process.env.COOKIE_SECRET || "dev-secret-change-in-prod";
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

async function createSignedToken(payload: string): Promise<SessionData> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return {
    payload: btoa(payload),
    sig: bytesToHex(new Uint8Array(sig)),
  };
}

async function verifyToken({ payload, sig }: SessionData): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
  const sigBytes = hexToBytes(sig);
  return crypto.subtle.verify("HMAC", key, new Uint8Array(sigBytes), encoder.encode(atob(payload)));
}

export async function createSession(): Promise<string> {
  const token = generateToken();
  const payload = `${token}.${Date.now() + SESSION_TTL}`;
  const { payload: payloadB64, sig } = await createSignedToken(payload);
  return `${payloadB64}.${sig}`;
}

export async function validateSession(token: string): Promise<boolean> {
  try {
    const lastDot = token.lastIndexOf(".");
    if (lastDot === -1) return false;

    const payloadB64 = token.substring(0, lastDot);
    const sig = token.substring(lastDot + 1);

    // Cryptographic HMAC-SHA256 verification
    const verified = await verifyToken({ payload: payloadB64, sig });
    if (!verified) return false;

    // Check expiry embedded in the payload
    const payload = atob(payloadB64);
    const parts = payload.split(".");
    const exp = parseInt(parts[parts.length - 1], 10);
    return exp > Date.now();
  } catch {
    return false;
  }
}

/** Reusable auth guard — extracts session cookie and validates it. */
export async function requireAuth(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get("__session")?.value || "";
  return validateSession(token);
}

export function getSessionCookie(token: string): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `__session=${token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${SESSION_TTL / 1000}${secure}`;
}
