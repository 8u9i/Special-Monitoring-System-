import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function PUT(req: NextRequest) {
  if (!(await requireAuth(req)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id, name, age, avatar, notes, joinedAt } = await req.json();
    const { rows } = await pool.query(
      "UPDATE students SET name = $1, age = $2, avatar = $3, notes = $4, joined_at = $5 WHERE id = $6 RETURNING *",
      [name, age ?? null, avatar || "avatar-leaf", notes || null, joinedAt || new Date().toISOString().split("T")[0], id]
    );
    if (rows.length === 0)
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error("PUT /api/students/[id] error:", err);
    return NextResponse.json({ error: "Failed to update student" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAuth(req)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const id = req.nextUrl.pathname.split("/").pop();
    // Cascade: also remove the student's progress rows to avoid orphans.
    await pool.query(
      `DELETE FROM student_hadiths WHERE student_id = $1;
       DELETE FROM student_surahs WHERE student_id = $1;
       DELETE FROM student_surah_pages WHERE student_id = $1;
       DELETE FROM student_english_progress WHERE student_id = $1;
       DELETE FROM students WHERE id = $1;`,
      [id]
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/students/[id] error:", err);
    return NextResponse.json({ error: "Failed to delete student" }, { status: 500 });
  }
}
