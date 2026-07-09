import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  if (!process.env.DATABASE_URL) return NextResponse.json([]);
  if (!(await requireAuth(req)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { rows } = await pool.query("SELECT * FROM hadiths ORDER BY number");
    return NextResponse.json(rows.map((r: Record<string, unknown>) => ({
      number: r.number, text: r.text,
      explanation: r.explanation, category: r.category, points: r.points,
    })));
  } catch (err) {
    console.error("GET /api/hadiths error:", err);
    return NextResponse.json({ error: "Failed to fetch hadiths" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await requireAuth(req)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { number, text, explanation, category, points } = await req.json();
    const finalNumber = number || (await pool.query("SELECT COALESCE(MAX(number) + 1, 1) AS nxt FROM hadiths")).rows[0].nxt;
    const { rows } = await pool.query(
      "INSERT INTO hadiths (number, text, explanation, category, points) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (number) DO UPDATE SET text = $2, explanation = $3, category = $4, points = $5 RETURNING *",
      [finalNumber, text, explanation || "", category || "عام", points || 100]
    );
    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error("POST /api/hadiths error:", err);
    return NextResponse.json({ error: "Failed to save hadith" }, { status: 500 });
  }
}
