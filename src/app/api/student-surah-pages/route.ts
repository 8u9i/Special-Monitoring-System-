import { NextRequest, NextResponse } from "next/server";
import pool, { recalculateXP } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

async function doSingle(req: NextRequest): Promise<NextResponse> {
  const { studentId, pageId } = await req.json();
  await pool.query(
    "INSERT INTO student_surah_pages (student_id, page_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
    [studentId, pageId]
  );
  const xp = await recalculateXP(pool, studentId);
  await pool.query("UPDATE students SET xp = $1 WHERE id = $2", [xp, studentId]);
  return NextResponse.json({ success: true, xp });
}

async function doBatch(req: NextRequest): Promise<NextResponse> {
  const { studentId, pageIds } = await req.json();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const pageId of pageIds) {
      await client.query(
        "INSERT INTO student_surah_pages (student_id, page_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
        [studentId, pageId]
      );
    }
    const xp = await recalculateXP(client, studentId);
    await client.query("UPDATE students SET xp = $1 WHERE id = $2", [xp, studentId]);
    await client.query("COMMIT");
    return NextResponse.json({ success: true, xp });
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function POST(req: NextRequest) {
  if (!(await requireAuth(req)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const url = req.nextUrl.pathname;
    if (url.endsWith("/batch")) return doBatch(req);
    return doSingle(req);
  } catch (err) {
    console.error("POST /api/student-surah-pages error:", err);
    return NextResponse.json({ error: "Failed to save page" }, { status: 500 });
  }
}
