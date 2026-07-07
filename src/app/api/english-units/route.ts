import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  if (!process.env.DATABASE_URL) return NextResponse.json([]);
  if (!(await requireAuth(req)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { rows } = await pool.query("SELECT unit_number, word_index, word, definition FROM english_unit_words ORDER BY unit_number, word_index");
    const unitMap: Record<number, { word: string; definition: string }[]> = {};
    for (const r of rows) {
      if (!unitMap[r.unit_number]) unitMap[r.unit_number] = [];
      unitMap[r.unit_number].push({ word: r.word, definition: r.definition });
    }
    return NextResponse.json(Object.entries(unitMap).map(([k, v]) => ({ unitNumber: Number(k), words: v })));
  } catch (err) {
    console.error("GET /api/english-units error:", err);
    return NextResponse.json({ error: "Failed to fetch english units" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await requireAuth(req)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const client = await pool.connect();
  try {
    const { unitNumber, words } = await req.json();
    if (!Array.isArray(words) || words.length === 0) {
      return NextResponse.json({ error: "Unit must contain at least one word" }, { status: 400 });
    }
    const finalUnitNumber = unitNumber || (
      await client.query("SELECT COALESCE(MAX(unit_number) + 1, 1) AS nxt FROM english_unit_words")
    ).rows[0].nxt;
    await client.query("BEGIN");
    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      await client.query(
        "INSERT INTO english_unit_words (unit_number, word_index, word, definition) VALUES ($1, $2, $3, $4)",
        [finalUnitNumber, i + 1, w.word, w.definition]
      );
    }
    await client.query("COMMIT");
    return NextResponse.json({ unitNumber: finalUnitNumber, words });
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("POST /api/english-units error:", err);
    return NextResponse.json({ error: "Failed to save english unit" }, { status: 500 });
  } finally {
    client.release();
  }
}
