import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  if (!process.env.DATABASE_URL) return NextResponse.json([]);
  if (!(await requireAuth(req)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { rows: students } = await pool.query("SELECT * FROM students ORDER BY name");
    const full = students.map((s: Record<string, unknown>) => ({
      id: s.id, name: s.name, age: s.age, avatar: s.avatar, notes: s.notes,
      joinedAt: s.joined_at, memorizedHadithNumbers: [], reviewHadithNumbers: [],
      memorizedSurahNumbers: [], reviewSurahNumbers: [], memorizedSurahPages: [],
      memorizedEnglishUnits: [], reviewEnglishUnits: [], xp: s.xp || 0,
    }));
    return NextResponse.json(full);
  } catch (err) {
    console.error("GET /api/students error:", err);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await requireAuth(req)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id, name, age, avatar, notes, joinedAt } = await req.json();
    const { rows } = await pool.query(
      "INSERT INTO students (id, name, age, avatar, notes, joined_at, xp) VALUES ($1, $2, $3, $4, $5, $6, 0) ON CONFLICT (id) DO UPDATE SET name = $2, age = $3, avatar = $4, notes = $5 RETURNING *",
      [id, name, age ?? null, avatar || "avatar-leaf", notes || null, joinedAt || new Date().toISOString().split("T")[0]]
    );
    return NextResponse.json({ ...rows[0], xp: 0 });
  } catch (err) {
    console.error("POST /api/students error:", err);
    return NextResponse.json({ error: "Failed to save student" }, { status: 500 });
  }
}
