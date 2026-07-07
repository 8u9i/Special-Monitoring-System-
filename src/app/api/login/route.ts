import { NextRequest, NextResponse } from "next/server";

const AUTH_USER = process.env.AUTH_USER || "";
const AUTH_PASS = process.env.AUTH_PASS || "";

// In-memory rate limiter: 5 attempts per minute per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip")
      || "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "محاولات كثيرة. الرجاء المحاولة لاحقاً" },
        { status: 429 }
      );
    }

    const { username, password } = await request.json();
    if (!AUTH_USER || !AUTH_PASS) {
      return NextResponse.json({ error: "Server auth not configured" }, { status: 500 });
    }
    if (username === AUTH_USER && password === AUTH_PASS) {
      const { createSession, getSessionCookie } = await import("@/lib/auth");
      const token = await createSession();
      const response = NextResponse.json({ success: true });
      response.headers.set("Set-Cookie", getSessionCookie(token));
      return response;
    }
    return NextResponse.json({ error: "بيانات الدخول غير صحيحة" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
