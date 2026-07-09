import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireAuth } from "@/lib/auth";

async function doSingle(studentId: string, pageId: string): Promise<{ success: true }> {
  await pool.query(
    "DELETE FROM student_surah_pages WHERE student_id = $1 AND page_id = $2",
    [studentId, pageId]
  );
  return { success: true };
}

async function doBatch(studentId: string, pageIds: string[]): Promise<{ success: true }> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const pageId of pageIds) {
      await client.query(
        "DELETE FROM student_surah_pages WHERE student_id = $1 AND page_id = $2",
        [studentId, pageId]
      );
    }
    await client.query("COMMIT");
    return { success: true };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ rest: string[] }> }
) {
  if (!(await requireAuth(req)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { rest } = await params;
    if (rest[0] === "batch") {
      const studentId = rest[1];
      const { pageIds } = await req.json();
      const result = await doBatch(studentId, pageIds);
      return NextResponse.json(result);
    }
    const [studentId, pageId] = rest;
    const result = await doSingle(studentId, pageId);
    return NextResponse.json(result);
  } catch (err) {
    console.error("DELETE /api/student-surah-pages error:", err);
    return NextResponse.json({ error: "Failed to delete page" }, { status: 500 });
  }
}
