import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAuth(req)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    await pool.query("DELETE FROM students WHERE id = $1", [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/students/[id] error:", err);
    return NextResponse.json({ error: "Failed to delete student" }, { status: 500 });
  }
}
