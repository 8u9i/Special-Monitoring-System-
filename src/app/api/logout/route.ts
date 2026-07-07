import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  response.headers.set(
    "Set-Cookie",
    `__session=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0${secure}`
  );
  return response;
}
