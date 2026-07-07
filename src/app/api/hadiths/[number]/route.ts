import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ number: string }> }
) {
  if (!(await requireAuth(req)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { number } = await params;
    await pool.query("DELETE FROM hadiths WHERE number = $1", [parseInt(number)]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/hadiths/[number] error:", err);
    return NextResponse.json({ error: "Failed to delete hadith" }, { status: 500 });
  }
}
