import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  if (!process.env.DATABASE_URL)
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  if (!(await requireAuth(req)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { rows: students } = await pool.query("SELECT * FROM students ORDER BY name");
    const ids = students.map((s: Record<string, unknown>) => s.id as string);

    const [hadithsRes, surahsRes, pagesRes, englishRes] = await Promise.all([
      ids.length > 0
        ? pool.query(
            "SELECT student_id, hadith_number, status FROM student_hadiths WHERE student_id = ANY($1)",
            [ids]
          )
        : Promise.resolve({ rows: [] as Record<string, unknown>[] }),
      ids.length > 0
        ? pool.query(
            "SELECT student_id, surah_number, status FROM student_surahs WHERE student_id = ANY($1)",
            [ids]
          )
        : Promise.resolve({ rows: [] as Record<string, unknown>[] }),
      ids.length > 0
        ? pool.query(
            "SELECT student_id, page_id FROM student_surah_pages WHERE student_id = ANY($1)",
            [ids]
          )
        : Promise.resolve({ rows: [] as Record<string, unknown>[] }),
      ids.length > 0
        ? pool.query(
            "SELECT student_id, unit_number, status FROM student_english_progress WHERE student_id = ANY($1)",
            [ids]
          )
        : Promise.resolve({ rows: [] as Record<string, unknown>[] }),
    ]);

    const buildMap = <T extends Record<string, unknown>>(
      rows: T[],
      key: string,
    ): Map<string, T[]> => {
      const map = new Map<string, T[]>();
      for (const r of rows) {
        const sid = r["student_id"] as string;
        const arr = map.get(sid) || [];
        arr.push(r);
        map.set(sid, arr);
      }
      return map;
    };

    const hadithMap = buildMap(hadithsRes.rows, "student_id");
    const surahMap = buildMap(surahsRes.rows, "student_id");
    const pagesMap = buildMap(pagesRes.rows, "student_id");
    const englishMap = buildMap(englishRes.rows, "student_id");

    const full = students.map((s: Record<string, unknown>) => {
      const sid = s.id as string;
      const hadithRows = hadithMap.get(sid) || [];
      const surahRows = surahMap.get(sid) || [];
      const pageRows = pagesMap.get(sid) || [];
      const englishRows = englishMap.get(sid) || [];

      return {
        id: s.id,
        name: s.name,
        age: s.age,
        avatar: s.avatar,
        notes: s.notes,
        joinedAt: s.joined_at,
        memorizedHadithNumbers: hadithRows
          .filter((r) => r["status"] === "memorized")
          .map((r) => r["hadith_number"] as number),
        reviewHadithNumbers: hadithRows
          .filter((r) => r["status"] === "review")
          .map((r) => r["hadith_number"] as number),
        memorizedSurahNumbers: surahRows
          .filter((r) => r["status"] === "memorized")
          .map((r) => r["surah_number"] as number),
        reviewSurahNumbers: surahRows
          .filter((r) => r["status"] === "review")
          .map((r) => r["surah_number"] as number),
        memorizedSurahPages: pageRows.map((r) => r["page_id"] as string),
        memorizedEnglishUnits: englishRows
          .filter((r) => r["status"] === "memorized")
          .map((r) => r["unit_number"] as number),
        reviewEnglishUnits: englishRows
          .filter((r) => r["status"] === "review")
          .map((r) => r["unit_number"] as number),
        xp: s.xp || 0,
      };
    });
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
      "INSERT INTO students (id, name, age, avatar, notes, joined_at, xp) VALUES ($1, $2, $3, $4, $5, $6, 0) RETURNING *",
      [id, name, age ?? null, avatar || "avatar-leaf", notes || null, joinedAt || new Date().toISOString().split("T")[0]]
    );
    return NextResponse.json({ ...rows[0], xp: 0 });
  } catch (err) {
    console.error("POST /api/students error:", err);
    return NextResponse.json({ error: "Failed to save student" }, { status: 500 });
  }
}
