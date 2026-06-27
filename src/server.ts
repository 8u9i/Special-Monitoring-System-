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
});

// ────────────────────────────────────────────
// Security middleware
// ────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true },
}));

// Parse JSON bodies for API (limit body size)
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser(COOKIE_SECRET));

// Production safety checks
if (isProduction) {
  if (!process.env['DATABASE_URL']) {
    console.error('FATAL: DATABASE_URL is required in production');
    process.exit(1);
  }
  if (!process.env['COOKIE_SECRET']) {
    console.error('WARNING: COOKIE_SECRET not set — sessions will not survive restarts');
  }
}

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
    console.error('AUTH_USER or AUTH_PASS not configured');
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
    const [hadithRows, surahRows, pageRows, vocabRows, englishRows] = await Promise.all([
      pool.query('SELECT student_id, hadith_number, status FROM student_hadiths'),
      pool.query('SELECT student_id, surah_number, status FROM student_surahs'),
      pool.query('SELECT student_id, page_id FROM student_surah_pages'),
      pool.query('SELECT student_id, vocab_id, status FROM student_vocab'),
      pool.query('SELECT student_id, unit_id, status FROM student_english_units'),
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

    const vocabMap: Record<string, { memorized: string[]; review: string[] }> = {};
    for (const r of vocabRows.rows) {
      if (!vocabMap[r.student_id]) vocabMap[r.student_id] = { memorized: [], review: [] };
      if (r.status === 'memorized') vocabMap[r.student_id].memorized.push(r.vocab_id);
      else if (r.status === 'review') vocabMap[r.student_id].review.push(r.vocab_id);
    }

    const englishMap: Record<string, { memorized: string[]; review: string[] }> = {};
    for (const r of englishRows.rows) {
      if (!englishMap[r.student_id]) englishMap[r.student_id] = { memorized: [], review: [] };
      if (r.status === 'memorized') englishMap[r.student_id].memorized.push(r.unit_id);
      else if (r.status === 'review') englishMap[r.student_id].review.push(r.unit_id);
    }

    // Assemble full student objects
    const full = students.map((s: any) => {
      const h = hadithMap[s.id] || { memorized: [], review: [] };
      const su = surahMap[s.id] || { memorized: [], review: [] };
      const p = pageMap[s.id] || [];
      const v = vocabMap[s.id] || { memorized: [], review: [] };
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
        memorizedVocabWords: v.memorized,
        reviewVocabWords: v.review,
        memorizedEnglishUnits: e.memorized,
        reviewEnglishUnits: e.review,
        xp: s.xp,
      };
    });

    res.json(full);
  } catch (err) {
    console.error('GET /api/students error:', err);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const { id, name, age, avatar, notes, joinedAt, xp } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO students (id, name, age, avatar, notes, joined_at, xp)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO UPDATE SET name = $2, age = $3, avatar = $4, notes = $5, xp = $7
       RETURNING *`,
      [id, name, age ?? null, avatar || 'avatar-leaf', notes || null, joinedAt || new Date().toISOString().split('T')[0], xp || 0]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error('POST /api/students error:', err);
    res.status(500).json({ error: 'Failed to save student' });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM students WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/students error:', err);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

// --- Hadiths ---
app.get('/api/hadiths', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM hadiths ORDER BY number');
    res.json(rows);
  } catch (err) {
    console.error('GET /api/hadiths error:', err);
    res.status(500).json({ error: 'Failed to fetch hadiths' });
  }
});

app.post('/api/hadiths', async (req, res) => {
  try {
    const { number, title, text, reference, explanation, category, points, badge_name, badge_icon } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO hadiths (number, title, text, reference, explanation, category, points, badge_name, badge_icon)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (number) DO UPDATE SET title = $2, text = $3, reference = $4, explanation = $5, category = $6, points = $7, badge_name = $8, badge_icon = $9
       RETURNING *`,
      [number, title, text, reference || '', explanation || '', category || 'عام', points || 100, badge_name || '', badge_icon || 'stars']
    );
    res.json(rows[0]);
  } catch (err) {
    console.error('POST /api/hadiths error:', err);
    res.status(500).json({ error: 'Failed to save hadith' });
  }
});

app.delete('/api/hadiths/:number', async (req, res) => {
  try {
    await pool.query('DELETE FROM hadiths WHERE number = $1', [parseInt(req.params.number)]);
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/hadiths error:', err);
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
    console.error('GET /api/student-hadiths error:', err);
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
    res.json(rows[0]);
  } catch (err) {
    console.error('POST /api/student-hadiths error:', err);
    res.status(500).json({ error: 'Failed to update hadith status' });
  }
});

app.delete('/api/student-hadiths/:studentId/:hadithNumber', async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM student_hadiths WHERE student_id = $1 AND hadith_number = $2',
      [req.params.studentId, parseInt(req.params.hadithNumber)]
    );
    res.json({ success: true });
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
    res.json(rows[0]);
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
    res.json({ success: true });
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
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete page' });
  }
});

// --- Vocab Lists ---
app.get('/api/vocab-lists', async (_req, res) => {
  try {
    const { rows: lists } = await pool.query('SELECT * FROM vocab_lists ORDER BY name');
    for (const list of lists) {
      const { rows: words } = await pool.query('SELECT * FROM vocab_words WHERE list_id = $1 ORDER BY word_index', [list.id]);
      list.words = words;
    }
    res.json(lists);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch vocab lists' });
  }
});

app.post('/api/vocab-lists', async (req, res) => {
  try {
    const { id, name, words } = req.body;
    await pool.query('INSERT INTO vocab_lists (id, name) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET name = $2', [id, name]);
    if (words && Array.isArray(words)) {
      for (let i = 0; i < words.length; i++) {
        await pool.query(
          'INSERT INTO vocab_words (list_id, word_index, word, definition) VALUES ($1, $2, $3, $4) ON CONFLICT (list_id, word_index) DO UPDATE SET word = $3, definition = $4',
          [id, i, words[i].word, words[i].definition || '']
        );
      }
    }
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save vocab list' });
  }
});

app.delete('/api/vocab-lists/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM vocab_lists WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete vocab list' });
  }
});

// --- Student Vocab Status ---
app.post('/api/student-vocab', async (req, res) => {
  try {
    const { student_id, vocab_id, status } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO student_vocab (student_id, vocab_id, status)
       VALUES ($1, $2, $3)
       ON CONFLICT (student_id, vocab_id) DO UPDATE SET status = $3
       RETURNING *`,
      [student_id, vocab_id, status]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update vocab status' });
  }
});

// --- Student English Units ---
app.post('/api/student-english-units', async (req, res) => {
  try {
    const { student_id, unit_id, status } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO student_english_units (student_id, unit_id, status)
       VALUES ($1, $2, $3)
       ON CONFLICT (student_id, unit_id) DO UPDATE SET status = $3
       RETURNING *`,
      [student_id, unit_id, status]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update english unit status' });
  }
});

// --- Bulk save (for initial load / full sync) ---
app.post('/api/sync', async (req, res) => {
  try {
    const { students, hadiths, vocabLists } = req.body;

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
    if (vocabLists && Array.isArray(vocabLists) && vocabLists.length > 100) {
      res.status(400).json({ error: 'Too many vocab lists (max 100)' });
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
          `INSERT INTO hadiths (number, title, text, reference, explanation, category, points, badge_name, badge_icon)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           ON CONFLICT (number) DO UPDATE SET title = $2, text = $3, reference = $4, explanation = $5, category = $6`,
          [h.number, h.title, h.text, h.reference || '', h.explanation || '', h.category || 'عام', h.points || 100, h.badgeName || '', h.badgeIcon || 'stars']
        );
      }
    }

    if (vocabLists && Array.isArray(vocabLists)) {
      for (const list of vocabLists) {
        await pool.query(
          'INSERT INTO vocab_lists (id, name) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET name = $2',
          [list.id, list.name]
        );
        if (list.words && Array.isArray(list.words)) {
          for (let i = 0; i < list.words.length; i++) {
            await pool.query(
              'INSERT INTO vocab_words (list_id, word_index, word, definition) VALUES ($1, $2, $3, $4) ON CONFLICT (list_id, word_index) DO UPDATE SET word = $3, definition = $4',
              [list.id, i, list.words[i].word, list.words[i].definition || '']
            );
          }
        }
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error('POST /api/sync error:', err);
    res.status(500).json({ error: 'Sync failed' });
  }
});

// ────────────────────────────────────────────
// Global error handler
// ────────────────────────────────────────────
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const msg = isProduction ? 'Internal server error' : (err?.message || 'Unknown error');
  if (!isProduction) console.error('Unhandled error:', err);
  else console.error('Unhandled error:', err?.message || 'unknown');
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
