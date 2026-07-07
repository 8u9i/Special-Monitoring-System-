import { NextRequest, NextResponse } from "next/server";
import { validateSession } from "@/lib/auth";

// All auth check does is validate the token
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("__session")?.value || "";
    return NextResponse.json({ authenticated: await validateSession(token) });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}
