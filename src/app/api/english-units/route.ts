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
