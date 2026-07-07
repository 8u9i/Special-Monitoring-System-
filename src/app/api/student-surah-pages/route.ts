import { NextRequest, NextResponse } from "next/server";
import pool, { recalculateXP } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  if (!(await requireAuth(req)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { studentId, pageId } = await req.json();
    await pool.query(
      "INSERT INTO student_surah_pages (student_id, page_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [studentId, pageId]
    );
    const xp = await recalculateXP(pool, studentId);
    await pool.query("UPDATE students SET xp = $1 WHERE id = $2", [xp, studentId]);
    return NextResponse.json({ success: true, xp });
  } catch (err) {
    console.error("POST /api/student-surah-pages error:", err);
    return NextResponse.json({ error: "Failed to save page" }, { status: 500 });
  }
}
