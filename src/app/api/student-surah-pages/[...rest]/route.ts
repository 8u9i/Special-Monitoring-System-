import { NextRequest, NextResponse } from "next/server";
import pool, { recalculateXP } from "@/lib/db";
import { validateSession } from "@/lib/auth";

function requireAuth(req: NextRequest): boolean {
  return validateSession(req.cookies.get("__session")?.value || "");
}

export async function POST(req: NextRequest) {
  if (!requireAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { studentId, pageId } = await req.json();
    await pool.query("INSERT INTO student_surah_pages (student_id, page_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [studentId, pageId]);
    const xp = await recalculateXP(pool, studentId);
    await pool.query("UPDATE students SET xp = $1 WHERE id = $2", [xp, studentId]);
    return NextResponse.json({ success: true, xp });
  } catch (err) {
    return NextResponse.json({ error: "Failed to save page" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ rest: string[] }> }) {
  if (!requireAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { rest } = await params;
    const [studentId, pageId] = rest;
    await pool.query("DELETE FROM student_surah_pages WHERE student_id = $1 AND page_id = $2", [studentId, pageId]);
    const xp = await recalculateXP(pool, studentId);
    await pool.query("UPDATE students SET xp = $1 WHERE id = $2", [xp, studentId]);
    return NextResponse.json({ success: true, xp });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete page" }, { status: 500 });
  }
}
