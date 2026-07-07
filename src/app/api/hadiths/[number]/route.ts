import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { validateSession } from "@/lib/auth";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ number: string }> }
) {
  if (!validateSession(_req.cookies.get("__session")?.value || ""))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { number } = await params;
    await pool.query("DELETE FROM hadiths WHERE number = $1", [parseInt(number)]);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete hadith" }, { status: 500 });
  }
}
