import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { validateSession } from "@/lib/auth";

export async function GET() {
  if (!process.env.DATABASE_URL) return NextResponse.json([]);
  if (!validateSession("")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { rows } = await pool.query("SELECT * FROM hadiths ORDER BY number");
    return NextResponse.json(rows.map((r: Record<string, unknown>) => ({
      number: r.number, text: r.text, reference: r.reference,
      explanation: r.explanation, category: r.category, points: r.points,
    })));
  } catch { return NextResponse.json([]); }
}

export async function POST(req: NextRequest) {
  try {
    const { number, text, reference, explanation, category, points } = await req.json();
    const finalNumber = number || (await pool.query("SELECT COALESCE(MAX(number) + 1, 1) AS nxt FROM hadiths")).rows[0].nxt;
    const { rows } = await pool.query(
      "INSERT INTO hadiths (number, text, reference, explanation, category, points) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (number) DO UPDATE SET text = $2, reference = $3, explanation = $4, category = $5, points = $6 RETURNING *",
      [finalNumber, text, reference || "", explanation || "", category || "عام", points || 100]
    );
    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error("POST /api/hadiths error:", err);
    return NextResponse.json({ error: "Failed to save hadith" }, { status: 500 });
  }
}
