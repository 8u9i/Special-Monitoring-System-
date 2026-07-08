import { Pool, PoolClient } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/special_monitoring",
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export default pool;

/**
 * Recalculate XP
 */
export async function recalculateXP(client: Pool | PoolClient, studentId: string): Promise<number> {
  const [hadithRes, surahRes, pageRes, englishRes] = await Promise.all([
    client.query("SELECT COUNT(*)::int FROM student_hadiths WHERE student_id = $1 AND status = 'memorized'", [studentId]),
    client.query("SELECT COUNT(*)::int FROM student_surahs WHERE student_id = $1 AND status = 'memorized'", [studentId]),
    client.query("SELECT COUNT(*)::int FROM student_surah_pages WHERE student_id = $1", [studentId]),
    client.query("SELECT COUNT(*)::int FROM student_english_progress WHERE student_id = $1 AND status = 'memorized'", [studentId]),
  ]);
  return hadithRes.rows[0].count * 100 + surahRes.rows[0].count * 150 + pageRes.rows[0].count * 20 + englishRes.rows[0].count * 100;
}
