import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ studentId: string; hadithNumber: string }> }
) {
  if (!(await requireAuth(req)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { studentId, hadithNumber } = await params;
    await pool.query(
      "DELETE FROM student_hadiths WHERE student_id = $1 AND hadith_number = $2",
      [studentId, parseInt(hadithNumber)]
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/student-hadiths/[studentId]/[hadithNumber] error:", err);
    return NextResponse.json({ error: "Failed to delete hadith status" }, { status: 500 });
  }
}
