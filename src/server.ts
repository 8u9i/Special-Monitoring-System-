import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import {join} from 'node:path';
import pg from 'pg';
import cookieParser from 'cookie-parser';
import crypto from 'node:crypto';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();

// Trust Railway proxy headers (x-forwarded-*)
app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);

const angularApp = new AngularNodeAppEngine({
  trustProxyHeaders: true,
  allowedHosts: (process.env['ALLOWED_HOSTS'] || '').split(',').filter(Boolean),
});

// ────────────────────────────────────────────
// Auth config
// ────────────────────────────────────────────
const AUTH_USER = process.env['AUTH_USER'] || '';
const AUTH_PASS = process.env['AUTH_PASS'] || '';
const COOKIE_SECRET = process.env['COOKIE_SECRET'] || crypto.randomBytes(32).toString('hex');
const COOKIE_NAME = '__session';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const isProduction = process.env['NODE_ENV'] === 'production';

// In-memory session store (token → expiry)
const sessions = new Map<string, number>();

function createSession(): string {
  const token = crypto.randomBytes(48).toString('base64url');
  sessions.set(token, Date.now() + SESSION_TTL_MS);
  return token;
}

function isValidSession(token: string | undefined): boolean {
  if (!token) return false;
  const expiry = sessions.get(token);
  if (!expiry) return false;
  if (Date.now() > expiry) {
    sessions.delete(token);
    return false;
  }
  return true;
}

// Clean expired sessions every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [token, expiry] of sessions) {
    if (now > expiry) sessions.delete(token);
  }
}, 10 * 60 * 1000);

// PostgreSQL connection pool
const pool = new pg.Pool({
  connectionString: process.env['DATABASE_URL'] || 'postgresql://postgres:***@localhost:5432/hadith_tracker',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// ────────────────────────────────────────────
// Security middleware
// ────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false,
  hsts: { maxAge: 31536000, includeSubDomains: true },
}))

// Parse JSON bodies for API (limit body size)
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser(COOKIE_SECRET));

// Production safety checks
if (isProduction) {
  if (!process.env['DATABASE_URL']) {
    console.log('FATAL: DATABASE_URL is required in production');
    process.exit(1);
  }
  if (!process.env['COOKIE_SECRET']) {
    console.log('WARNING: COOKIE_SECRET not set — sessions will not survive restarts');
  }
}

// Self-healing schema migration: drop badge columns and tables
Promise.all([
  pool.query('ALTER TABLE hadiths DROP COLUMN IF EXISTS badge_name, DROP COLUMN IF EXISTS badge_icon'),
  pool.query('DROP TABLE IF EXISTS student_badges, badge_definitions CASCADE'),
]).catch(() => {});

// Global rate limiter (100 requests per 15 min per IP)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
});
app.use('/api', globalLimiter);

// Login rate limiter (stricter: 10 attempts per 15 min)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts, please try again later' },
});

// ────────────────────────────────────────────
// Auth API
// ────────────────────────────────────────────

app.post('/api/login', loginLimiter, (req, res) => {
  const { username, password } = req.body || {};

  if (!AUTH_USER || !AUTH_PASS) {
    console.log('AUTH_USER or AUTH_PASS not configured');
    return res.status(500).json({ error: 'Server auth not configured' });
  }

  if (username === AUTH_USER && password === AUTH_PASS) {
    const token = createSession();
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: SESSION_TTL_MS,
      signed: true,
    });
    return res.json({ success: true });
  }

  // Small delay to slow brute force
  setTimeout(() => {
    res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
  }, 500);
  return;
});

app.post('/api/logout', (_req, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    signed: true,
  });
  res.json({ success: true });
});

app.get('/api/auth/check', (req, res) => {
  const token = req.signedCookies?.[COOKIE_NAME];
  res.json({ authenticated: isValidSession(token) });
});

// ────────────────────────────────────────────
// Auth middleware — protects all /api/* below
// ────────────────────────────────────────────

function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  // Skip auth endpoints (req.path is relative when mounted at /api)
  if (req.path === '/login' || req.path === '/auth/check') {
    return next();
  }
  const token = req.signedCookies?.[COOKIE_NAME];
  if (!isValidSession(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// Public healthcheck (before auth middleware)
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', requireAuth);

// ────────────────────────────────────────────
// API Routes
// ────────────────────────────────────────────

// --- Students ---
app.get('/api/students', async (_req, res) => {
  try {
    const { rows: students } = await pool.query('SELECT * FROM students ORDER BY name');

    // Fetch all junction table data in bulk
    const [hadithRows, surahRows, pageRows, englishRows] = await Promise.all([
      pool.query('SELECT student_id, hadith_number, status FROM student_hadiths'),
      pool.query('SELECT student_id, surah_number, status FROM student_surahs'),
      pool.query('SELECT student_id, page_id FROM student_surah_pages'),

      pool.query('SELECT student_id, unit_number, status FROM student_english_progress'),
    ]);

    // Index junction data by student_id
    const hadithMap: Record<string, { memorized: number[]; review: number[] }> = {};
    for (const r of hadithRows.rows) {
      if (!hadithMap[r.student_id]) hadithMap[r.student_id] = { memorized: [], review: [] };
      if (r.status === 'memorized') hadithMap[r.student_id].memorized.push(r.hadith_number);
      else if (r.status === 'review') hadithMap[r.student_id].review.push(r.hadith_number);
    }

    const surahMap: Record<string, { memorized: number[]; review: number[] }> = {};
    for (const r of surahRows.rows) {
      if (!surahMap[r.student_id]) surahMap[r.student_id] = { memorized: [], review: [] };
      if (r.status === 'memorized') surahMap[r.student_id].memorized.push(r.surah_number);
      else if (r.status === 'review') surahMap[r.student_id].review.push(r.surah_number);
    }

    const pageMap: Record<string, string[]> = {};
    for (const r of pageRows.rows) {
      if (!pageMap[r.student_id]) pageMap[r.student_id] = [];
      pageMap[r.student_id].push(r.page_id);
    }


    const englishMap: Record<string, { memorized: number[]; review: number[] }> = {};
    for (const r of englishRows.rows) {
      if (!englishMap[r.student_id]) englishMap[r.student_id] = { memorized: [], review: [] };
      if (r.status === 'memorized') englishMap[r.student_id].memorized.push(r.unit_number);
      else if (r.status === 'review') englishMap[r.student_id].review.push(r.unit_number);
    }

    // Assemble full student objects
    const full = students.map((s: any) => {
      const h = hadithMap[s.id] || { memorized: [], review: [] };
      const su = surahMap[s.id] || { memorized: [], review: [] };
      const p = pageMap[s.id] || [];
      const e = englishMap[s.id] || { memorized: [], review: [] };

      return {
        id: s.id,
        name: s.name,
        age: s.age,
        avatar: s.avatar,
        notes: s.notes,
        joinedAt: s.joined_at,
        memorizedHadithNumbers: h.memorized,
        reviewHadithNumbers: h.review,
        memorizedSurahNumbers: su.memorized,
        reviewSurahNumbers: su.review,
        memorizedSurahPages: p,
        
        memorizedEnglishUnits: e.memorized,
        reviewEnglishUnits: e.review,
        xp: h.memorized.length * 100 + su.memorized.length * 150 + p.length * 20 + e.memorized.length * 100,
      };
    });

    res.json(full);

    // Background: persist recalculated XP to DB (self-healing)
    for (const s of full) {
      pool.query('UPDATE students SET xp = $1 WHERE id = $2', [s.xp, s.id]).catch(() => {});
    }
  } catch (err) {
    console.log('GET /api/students error:', err);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const { id, name, age, avatar, notes, joinedAt } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO students (id, name, age, avatar, notes, joined_at, xp)
       VALUES ($1, $2, $3, $4, $5, $6, 0)
       ON CONFLICT (id) DO UPDATE SET name = $2, age = $3, avatar = $4, notes = $5
       RETURNING *`,
      [id, name, age ?? null, avatar || 'avatar-leaf', notes || null, joinedAt || new Date().toISOString().split('T')[0]]
    );
    const xp = await recalculateXP(id);
    await pool.query('UPDATE students SET xp = $1 WHERE id = $2', [xp, id]);
    res.json({ ...rows[0], xp });
  } catch (err) {
    console.log('POST /api/students error:', err);
    res.status(500).json({ error: 'Failed to save student' });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM students WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.log('DELETE /api/students error:', err);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

// --- Hadiths ---
app.get('/api/hadiths', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM hadiths ORDER BY number');
    const hadiths = rows.map((r: any) => ({
      number: r.number, text: r.text, reference: r.reference,
      explanation: r.explanation, category: r.category, points: r.points,
    }));
    res.json(hadiths);
  } catch (err) {
    console.log('GET /api/hadiths error:', err);
    res.status(500).json({ error: 'Failed to fetch hadiths' });
  }
});

app.post('/api/hadiths', async (req, res) => {
  try {
    const { number, text, reference, explanation, category, points } = req.body;
    const finalNumber = number || (await pool.query('SELECT COALESCE(MAX(number) + 1, 1) AS nxt FROM hadiths')).rows[0].nxt;
    const { rows } = await pool.query(
      `INSERT INTO hadiths (number, text, reference, explanation, category, points)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (number) DO UPDATE SET text = $2, reference = $3, explanation = $4, category = $5, points = $6
       RETURNING *`,
      [finalNumber, text, reference || '', explanation || '', category || 'عام', points || 100]
    );
    res.json(rows[0]);
  } catch (err) {
    console.log('POST /api/hadiths error:', err);
    res.status(500).json({ error: 'Failed to save hadith' });
  }
});

app.delete('/api/hadiths/:number', async (req, res) => {
  try {
    await pool.query('DELETE FROM hadiths WHERE number = $1', [parseInt(req.params.number)]);
    res.json({ success: true });
  } catch (err) {
    console.log('DELETE /api/hadiths error:', err);
    res.status(500).json({ error: 'Failed to delete hadith' });
  }
});

// --- Student Hadith Status ---
app.get('/api/student-hadiths/:studentId', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT hadith_number, status FROM student_hadiths WHERE student_id = $1',
      [req.params.studentId]
    );
    res.json(rows);
  } catch (err) {
    console.log('GET /api/student-hadiths error:', err);
    res.status(500).json({ error: 'Failed to fetch student hadiths' });
  }
});

app.post('/api/student-hadiths', async (req, res) => {
  try {
    const { student_id, hadith_number, status } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO student_hadiths (student_id, hadith_number, status)
       VALUES ($1, $2, $3)
       ON CONFLICT (student_id, hadith_number) DO UPDATE SET status = $3
       RETURNING *`,
      [student_id, hadith_number, status]
    );
    const xp = await recalculateXP(student_id);
    await pool.query('UPDATE students SET xp = $1 WHERE id = $2', [xp, student_id]);
    res.json({ ...rows[0], xp });
  } catch (err) {
    console.log('POST /api/student-hadiths error:', err);
    res.status(500).json({ error: 'Failed to update hadith status' });
  }
});

app.delete('/api/student-hadiths/:studentId/:hadithNumber', async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM student_hadiths WHERE student_id = $1 AND hadith_number = $2',
      [req.params.studentId, parseInt(req.params.hadithNumber)]
    );
    const xp = await recalculateXP(req.params.studentId);
    await pool.query('UPDATE students SET xp = $1 WHERE id = $2', [xp, req.params.studentId]);
    res.json({ success: true, xp });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

// --- Student Surah Status ---
app.post('/api/student-surahs', async (req, res) => {
  try {
    const { student_id, surah_number, status } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO student_surahs (student_id, surah_number, status)
       VALUES ($1, $2, $3)
       ON CONFLICT (student_id, surah_number) DO UPDATE SET status = $3
       RETURNING *`,
      [student_id, surah_number, status]
    );
    const xp = await recalculateXP(student_id);
    await pool.query('UPDATE students SET xp = $1 WHERE id = $2', [xp, student_id]);
    res.json({ ...rows[0], xp });

  } catch (err) {
    res.status(500).json({ error: 'Failed to update surah status' });
  }
});

// --- Student Surah Pages ---
app.post('/api/student-surah-pages', async (req, res) => {
  try {
    const { student_id, page_id } = req.body;
    await pool.query(
      'INSERT INTO student_surah_pages (student_id, page_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [student_id, page_id]
    );
    const xp = await recalculateXP(student_id);
    await pool.query('UPDATE students SET xp = $1 WHERE id = $2', [xp, student_id]);
    res.json({ success: true, xp });

  } catch (err) {
    res.status(500).json({ error: 'Failed to save page' });
  }
});

app.delete('/api/student-surah-pages/:studentId/:pageId', async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM student_surah_pages WHERE student_id = $1 AND page_id = $2',
      [req.params.studentId, req.params.pageId]
    );
    const xp = await recalculateXP(req.params.studentId);
    await pool.query('UPDATE students SET xp = $1 WHERE id = $2', [xp, req.params.studentId]);
    res.json({ success: true, xp });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete page' });
  }
});

// --- English Units (from english_unit_words) ---
app.get('/api/english-units', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT unit_number, word_index, word, definition FROM english_unit_words ORDER BY unit_number, word_index'
    );
    const unitMap: Record<number, { word: string; definition: string }[]> = {};
    for (const r of rows) {
      if (!unitMap[r.unit_number]) unitMap[r.unit_number] = [];
      unitMap[r.unit_number].push({ word: r.word, definition: r.definition });
    }
    const result = Object.entries(unitMap).map(([unitNumber, words]) => ({
      unitNumber: Number(unitNumber),
      words,
    }));
    res.json(result);
  } catch (err) {
    console.log('GET /api/english-units error:', err);
    res.status(500).json({ error: 'Failed to fetch english units' });
  }
});

// --- Student English Progress ---
app.post('/api/student-english-progress', async (req, res) => {
  try {
    const { student_id, unit_number, status } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO student_english_progress (student_id, unit_number, status)
       VALUES ($1, $2, $3)
       ON CONFLICT (student_id, unit_number) DO UPDATE SET status = $3
       RETURNING *`,
      [student_id, unit_number, status]
    );
    const xp = await recalculateXP(student_id);
    await pool.query('UPDATE students SET xp = $1 WHERE id = $2', [xp, student_id]);
    res.json({ ...rows[0], xp });

  } catch (err) {
    console.log('POST /api/student-english-progress error:', err);
    res.status(500).json({ error: 'Failed to update english progress' });
  }
});

app.delete('/api/student-english-progress/:studentId/:unitNumber', async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM student_english_progress WHERE student_id = $1 AND unit_number = $2',
      [req.params.studentId, parseInt(req.params.unitNumber)]
    );
    const xp = await recalculateXP(req.params.studentId);
    await pool.query('UPDATE students SET xp = $1 WHERE id = $2', [xp, req.params.studentId]);
    res.json({ success: true, xp });
  } catch (err) {
    console.log('DELETE /api/student-english-progress error:', err);
    res.status(500).json({ error: 'Failed to delete english progress' });
  }
});

// --- Bulk save (for initial load / full sync) ---
app.post('/api/sync', async (req, res) => {
  try {
    const { students, hadiths } = req.body;

    // Validate array sizes to prevent DoS
    const MAX_ARRAY = 500;
    if (students && Array.isArray(students) && students.length > MAX_ARRAY) {
      res.status(400).json({ error: 'Too many students (max ' + MAX_ARRAY + ')' });
      return;
    }
    if (hadiths && Array.isArray(hadiths) && hadiths.length > MAX_ARRAY) {
      res.status(400).json({ error: 'Too many hadiths (max ' + MAX_ARRAY + ')' });
      return;
    }

    if (students && Array.isArray(students)) {
      for (const s of students) {
        await pool.query(
          `INSERT INTO students (id, name, age, avatar, notes, joined_at, xp)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (id) DO UPDATE SET name = $2, age = $3, avatar = $4, notes = $5, xp = $7`,
          [s.id, s.name, s.age ?? null, s.avatar || 'avatar-leaf', s.notes || null, s.joinedAt || new Date().toISOString().split('T')[0], s.xp || 0]
        );
      }
    }

    if (hadiths && Array.isArray(hadiths)) {
      for (const h of hadiths) {
        await pool.query(
          `INSERT INTO hadiths (number, text, reference, explanation, category, points)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (number) DO UPDATE SET text = $2, reference = $3, explanation = $4, category = $5`,
          [h.number, h.text, h.reference || '', h.explanation || '', h.category || 'عام', h.points || 100]
        );
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.log('POST /api/sync error:', err);
    res.status(500).json({ error: 'Sync failed' });
  }
});



// ────────────────────────────────────────────
// ────────────────────────────────────────────
// XP recalculation helper (server-authoritative)
// ────────────────────────────────────────────

async function recalculateXP(studentId: string): Promise<number> {
  const [hadithRes, surahRes, pageRes, englishRes] = await Promise.all([
    pool.query("SELECT COUNT(*)::int FROM student_hadiths WHERE student_id = $1 AND status = 'memorized'", [studentId]),
    pool.query("SELECT COUNT(*)::int FROM student_surahs WHERE student_id = $1 AND status = 'memorized'", [studentId]),
    pool.query("SELECT COUNT(*)::int FROM student_surah_pages WHERE student_id = $1", [studentId]),
    pool.query("SELECT COUNT(*)::int FROM student_english_progress WHERE student_id = $1 AND status = 'memorized'", [studentId]),
  ]);
  return hadithRes.rows[0].count * 100 + surahRes.rows[0].count * 150 + pageRes.rows[0].count * 20 + englishRes.rows[0].count * 100;
}

// ────────────────────────────────────────────
// Global error handler
// ────────────────────────────────────────────
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const msg = isProduction ? 'Internal server error' : (err?.message || 'Unknown error');
  if (!isProduction) console.log('Unhandled error:', err);
  else console.log('Unhandled error:', err?.message || 'unknown');
  res.status(500).json({ error: msg });
});

// ────────────────────────────────────────────
// SSR serving
// ────────────────────────────────────────────

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }
    console.log(`Node Express server listening on http://localhost:${port}`);
    console.log(`PostgreSQL: ${process.env['DATABASE_URL'] ? 'connected' : 'no DATABASE_URL set, using default'}`);
    console.log(`Auth: ${AUTH_USER ? 'configured' : '⚠️  AUTH_USER not set — login will fail'}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
