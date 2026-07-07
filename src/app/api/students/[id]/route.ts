import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { validateSession } from "@/lib/auth";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!validateSession(_req.cookies.get("__session")?.value || ""))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    await pool.query("DELETE FROM students WHERE id = $1", [id]);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete student" }, { status: 500 });
  }
}
