import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ unitNumber: string }> }
) {
  if (!(await requireAuth(req)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const client = await pool.connect();
  try {
    const { unitNumber } = await params;
    const unitNum = parseInt(unitNumber);
    const { words } = await req.json();
    if (!Array.isArray(words) || words.length === 0) {
      return NextResponse.json({ error: "Unit must contain at least one word" }, { status: 400 });
    }
    await client.query("BEGIN");
    await client.query("DELETE FROM english_unit_words WHERE unit_number = $1", [unitNum]);
    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      await client.query(
        "INSERT INTO english_unit_words (unit_number, word_index, word, definition) VALUES ($1, $2, $3, $4)",
        [unitNum, i + 1, w.word, w.definition]
      );
    }
    await client.query("COMMIT");
    return NextResponse.json({ unitNumber: unitNum, words });
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("PUT /api/english-units/[unitNumber] error:", err);
    return NextResponse.json({ error: "Failed to update english unit" }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ unitNumber: string }> }
) {
  if (!(await requireAuth(req)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { unitNumber } = await params;
    await pool.query("DELETE FROM english_unit_words WHERE unit_number = $1", [parseInt(unitNumber)]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/english-units/[unitNumber] error:", err);
    return NextResponse.json({ error: "Failed to delete english unit" }, { status: 500 });
  }
}
