import { NextRequest, NextResponse } from "next/server";
import pool, { recalculateXP } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  if (!(await requireAuth(req)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { studentId, unitNumber, status } = await req.json();
    const { rows } = await pool.query(
      "INSERT INTO student_english_progress (student_id, unit_number, status) VALUES ($1, $2, $3) ON CONFLICT (student_id, unit_number) DO UPDATE SET status = $3 RETURNING *",
      [studentId, unitNumber, status]
    );
    const xp = await recalculateXP(pool, studentId);
    await pool.query("UPDATE students SET xp = $1 WHERE id = $2", [xp, studentId]);
    return NextResponse.json({ ...rows[0], xp });
  } catch (err) {
    console.error("POST /api/student-english-progress error:", err);
    return NextResponse.json({ error: "Failed to update english progress" }, { status: 500 });
  }
}
