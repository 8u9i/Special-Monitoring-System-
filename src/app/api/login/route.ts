import { NextRequest, NextResponse } from "next/server";

const AUTH_USER = process.env.AUTH_USER || "";
const AUTH_PASS = process.env.AUTH_PASS || "";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    if (!AUTH_USER || !AUTH_PASS) {
      return NextResponse.json({ error: "Server auth not configured" }, { status: 500 });
    }
    if (username === AUTH_USER && password === AUTH_PASS) {
      const { createSession, getSessionCookie } = await import("@/lib/auth");
      const token = createSession();
      const response = NextResponse.json({ success: true });
      response.headers.set("Set-Cookie", getSessionCookie(token));
      return response;
    }
    return NextResponse.json({ error: "بيانات الدخول غير صحيحة" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
