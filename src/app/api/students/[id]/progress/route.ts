import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireAuth } from "@/lib/auth";

/** Delete ALL progress (hadith/surah/surah-page/english) for a student, keeping the student record. */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAuth(req)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    await pool.query(
      `DELETE FROM student_hadiths WHERE student_id = $1;
       DELETE FROM student_surahs WHERE student_id = $1;
       DELETE FROM student_surah_pages WHERE student_id = $1;
       DELETE FROM student_english_progress WHERE student_id = $1;`,
      [id]
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/students/[id]/progress error:", err);
    return NextResponse.json({ error: "Failed to reset student progress" }, { status: 500 });
  }
}
